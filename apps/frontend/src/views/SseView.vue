<script setup lang="ts">
import { computed, ref } from 'vue';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import DOMPurify from 'dompurify';
import type { StreamPayload } from '@fbp/shared';
import 'highlight.js/styles/github-dark.css';

type SseEvent = {
  event?: string;
  data: StreamPayload;
};

type RequestType = 'basic' | 'code' | 'rich';

const result = ref('等待请求');
const loading = ref(false);
const activeType = ref<RequestType>('basic');

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
  highlight(code, language) {
    const highlighted =
      language && hljs.getLanguage(language)
        ? hljs.highlight(code, { language }).value
        : hljs.highlightAuto(code).value;

    return `<pre class="hljs"><code>${highlighted}</code></pre>`;
  },
});

const renderedResult = computed(() => DOMPurify.sanitize(markdown.render(result.value)));
function parseSseEvent(chunk: string): SseEvent | null {
  const event: Partial<SseEvent> = {};
  const dataLines: string[] = [];

  for (const line of chunk.split('\n')) {
    if (line.startsWith('event:')) {
      event.event = line.slice(6).trim();
      continue;
    }

    if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).trim());
    }
  }

  if (!dataLines.length) {
    return null;
  }

  return {
    event: event.event,
    data: JSON.parse(dataLines.join('\n')) as StreamPayload,
  };
}

function appendStreamPayload(payload: StreamPayload) {
  if (payload.type === 'connected') {
    result.value += `> ${payload.content}\n\n`;
    return;
  }

  if (payload.type === 'thinking') {
    result.value += `> ${payload.content}\n\n`;
    return;
  }

  if (payload.type === 'reference') {
    const references =
      payload.references?.map((item) => `- [${item.title}](${item.url})`).join('\n') ?? '';
    result.value += `### 参考资料\n\n${references}\n\n`;
    return;
  }

  if (payload.type === 'delta') {
    result.value += payload.content ?? '';
    return;
  }

  if (payload.type === 'recommended') {
    result.value += `\n\n### 推荐\n\n${payload.content}\n\n`;
    return;
  }

  if (payload.type === 'usage') {
    result.value += `\n\n---\n\n**统计**：tokens ${payload.tokens ?? 0}\n\n`;
    return;
  }

  if (payload.type === 'complete') {
    result.value += `**完成**：耗时 ${payload.elapsedMs ?? 0}ms\n`;
  }
}

async function runRequest(type: RequestType) {
  loading.value = true;
  activeType.value = type;
  result.value = '';

  const requestConfig: Record<RequestType, { url: string; message: string }> = {
    basic: { url: '/api/sse/stream', message: '基础Sse' },
    code: { url: '/api/sse/code-stream', message: '生成一个包含代码块的 SSE 示例' },
    rich: { url: '/api/sse/rich-stream', message: '生成一份复杂 Markdown 报告' },
  };
  const { url, message } = requestConfig[type];

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok || !response.body) {
      throw new Error(`SSE 请求失败：${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      const chunks = buffer.split('\n\n');
      buffer = chunks.pop() ?? '';

      for (const chunk of chunks) {
        const event = parseSseEvent(chunk);
        if (event) {
          appendStreamPayload(event.data);
        }
      }
    }
  } catch (error) {
    result.value = error instanceof Error ? error.message : 'SSE 请求失败';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-[420px_1fr]">
    <el-card shadow="never" class="rounded-3xl">
      <template #header>
        <div class="font-bold">Sse请求实验</div>
      </template>
      <div class="space-y-4">
        <p class="leading-7 text-slate-600">
          点击按钮后使用 fetch 读取 ReadableStream，逐段解析 text/event-stream 响应。
        </p>
        <el-button
          class="w-full"
          type="primary"
          :loading="loading && activeType === 'basic'"
          :disabled="loading && activeType !== 'basic'"
          @click="runRequest('basic')"
          >基础Sse</el-button
        >
        <el-button
          class="w-full !ml-0"
          type="success"
          :loading="loading && activeType === 'code'"
          :disabled="loading && activeType !== 'code'"
          @click="runRequest('code')"
          >代码内容Sse</el-button
        >
        <el-button
          class="w-full !ml-0"
          type="warning"
          :loading="loading && activeType === 'rich'"
          :disabled="loading && activeType !== 'rich'"
          @click="runRequest('rich')"
          >丰富内容Sse</el-button
        >
        <el-button
          class="w-full !ml-0"
          type="warning"
          :loading="loading && activeType === 'rich'"
          :disabled="loading && activeType !== 'rich'"
          @click="
            () => {
              console.log(result);
            }
          "
          >展示
        </el-button>
      </div>
    </el-card>

    <el-card shadow="never" class="rounded-3xl">
      <template #header>
        <div class="font-bold">响应结果</div>
      </template>
      <div class="markdown-panel" v-html="renderedResult"></div>
    </el-card>
  </div>
</template>

<style scoped>
.markdown-panel {
  min-height: 360px;
  max-height: 640px;
  overflow: auto;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  padding: 18px;
  color: #0f172a;
  white-space: normal;
  line-height: 1.75;
}

.markdown-panel :deep(.hljs) {
  background: #0f172a;
  color: #e2e8f0;
}

.markdown-panel :deep(h1),
.markdown-panel :deep(h2),
.markdown-panel :deep(h3) {
  margin: 18px 0 10px;
  color: #0f172a;
  font-weight: 700;
}

.markdown-panel :deep(h1) {
  font-size: 24px;
}

.markdown-panel :deep(h2) {
  font-size: 20px;
}

.markdown-panel :deep(h3) {
  font-size: 17px;
}

.markdown-panel :deep(p) {
  margin: 8px 0;
}

.markdown-panel :deep(a) {
  color: #2563eb;
  text-decoration: underline;
}

.markdown-panel :deep(blockquote) {
  margin: 8px 0 14px;
  border-left: 4px solid #38bdf8;
  border-radius: 0 10px 10px 0;
  background: #e0f2fe;
  padding: 8px 12px;
  color: #075985;
}

.markdown-panel :deep(ul),
.markdown-panel :deep(ol) {
  margin: 8px 0 14px 22px;
}

.markdown-panel :deep(table) {
  display: block;
  width: 100%;
  margin: 14px 0;
  overflow-x: auto;
  border-collapse: collapse;
  border-spacing: 0;
}

.markdown-panel :deep(th),
.markdown-panel :deep(td) {
  border: 1px solid #cbd5e1;
  padding: 8px 12px;
  text-align: left;
  white-space: nowrap;
}

.markdown-panel :deep(th) {
  background: #e2e8f0;
  color: #0f172a;
  font-weight: 700;
}

.markdown-panel :deep(tbody tr:nth-child(even)) {
  background: #f1f5f9;
}

.markdown-panel :deep(pre) {
  margin: 12px 0;
  overflow-x: auto;
  border-radius: 12px;
  padding: 16px;
  background: #0f172a;
  box-shadow: inset 0 0 0 1px rgb(148 163 184 / 0.18);
}

.markdown-panel :deep(pre code) {
  color: inherit;
  background: transparent;
}

.markdown-panel :deep(code) {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}

.markdown-panel :deep(:not(pre) > code) {
  border-radius: 6px;
  padding: 2px 6px;
  background: #e2e8f0;
  color: #0f172a;
}

.markdown-panel :deep(hr) {
  margin: 18px 0;
  border: 0;
  border-top: 1px solid #cbd5e1;
}
</style>
