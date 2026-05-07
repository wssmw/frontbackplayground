import { Body, Controller, MessageEvent, Post, Req, Res, Sse } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { concat, delay, Observable, of } from 'rxjs';
import type { StreamPayload } from '@fbp/shared';

type StreamRequestBody = {
  message?: string;
};

type StreamStep = {
  event: string;
  data: StreamPayload;
  delayMs: number;
};

@ApiTags('SSE')
@Controller('sse')
export class SSEController {
  @Sse('stream')
  @ApiOperation({ summary: 'SSE 流式传输' })
  sse(): Observable<MessageEvent> {
    const answerParts = ['这是第一部分回答', '这是第二部分回答', '这是最后一部分回答'];

    const messages: Observable<MessageEvent>[] = [
      of({ data: { type: 'think', content: '正在分析您的问题...' } }),
      ...answerParts.map((content) => of({ data: { type: 'text', content } }).pipe(delay(1000))),
      of({ data: { type: 'recommended', content: '您可能还对以下内容感兴趣...' } }).pipe(
        delay(500),
      ),
      of({ data: { type: 'complete' } }),
    ];

    return concat(...messages);
  }

  @Post('stream')
  @ApiOperation({ summary: 'SSE 流式传输' })
  sseByPost(@Body() body: StreamRequestBody, @Req() req: Request, @Res() res: Response) {
    const requestId = `sse_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
    const prompt = body.message?.trim() || '请介绍一下 SSE 流式响应';

    this.pipeStream(req, res, this.buildStreamSteps(prompt, requestId));
  }

  @Post('code-stream')
  @ApiOperation({ summary: 'SSE 流式传输代码与 Markdown 内容' })
  sseCodeByPost(@Body() body: StreamRequestBody, @Req() req: Request, @Res() res: Response) {
    const requestId = `sse_code_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
    const prompt = body.message?.trim() || '生成一个 Vue 组件示例';

    this.pipeStream(req, res, this.buildCodeStreamSteps(prompt, requestId));
  }

  @Post('rich-stream')
  @ApiOperation({ summary: 'SSE 流式传输丰富 Markdown 内容' })
  sseRichByPost(@Body() body: StreamRequestBody, @Req() req: Request, @Res() res: Response) {
    const requestId = `sse_rich_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
    const prompt = body.message?.trim() || '生成一份复杂 Markdown 报告';

    this.pipeStream(req, res, this.buildRichStreamSteps(prompt, requestId));
  }

  private pipeStream(req: Request, res: Response, steps: StreamStep[]) {
    const startedAt = Date.now();
    const requestId = steps[0]?.data.requestId ?? `sse_${Date.now()}`;

    res.status(200);
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();

    let closed = false;
    let timer: NodeJS.Timeout | undefined;

    const stop = () => {
      closed = true;
      if (timer) {
        clearTimeout(timer);
      }
    };

    req.on('close', stop);
    res.write(': connected\n\n');

    const writeStep = (index: number) => {
      if (closed) {
        return;
      }

      const step = steps[index];

      if (!step) {
        this.writeSseEvent(res, 'complete', {
          type: 'complete',
          requestId,
          elapsedMs: Date.now() - startedAt,
        });
        res.end();
        stop();
        return;
      }

      timer = setTimeout(() => {
        this.writeSseEvent(res, step.event, {
          ...step.data,
          elapsedMs: Date.now() - startedAt,
        });
        writeStep(index + 1);
      }, step.delayMs);
    };

    writeStep(0);
  }

  private buildStreamSteps(prompt: string, requestId: string): StreamStep[] {
    const answer = [
      `收到你的问题：“${prompt}”。`,
      '我会先分析请求意图，再模拟查询上下文，最后用分段 token 的方式返回结果。',
      '在真实业务里，这里通常会连接大模型、搜索服务、数据库或者任务队列。',
      '前端通过 ReadableStream 读取每个 SSE event，就能做到边生成边展示。',
    ];

    const tokens = answer.flatMap((sentence) => sentence.match(/.{1,8}/g) ?? [sentence]);

    return this.createCommonSteps(requestId, tokens, '连接已建立，开始处理请求。');
  }

  private buildCodeStreamSteps(prompt: string, requestId: string): StreamStep[] {
    const markdown = `我会根据“${prompt}”返回一段包含 Markdown、代码块、JSON 和 SQL 的混合内容。\n\n## 1. Vue 组件示例\n\n下面是一段 \`Vue 3 + TypeScript\` 组件代码：\n\n\`\`\`vue\n<script setup lang="ts">\nimport { computed, ref } from 'vue';\n\ntype Todo = {\n  id: number;\n  title: string;\n  done: boolean;\n};\n\nconst keyword = ref('');\nconst todos = ref<Todo[]>([\n  { id: 1, title: '接入 SSE 流式响应', done: true },\n  { id: 2, title: '处理代码块内容', done: false },\n]);\n\nconst visibleTodos = computed(() =>\n  todos.value.filter((todo) => todo.title.includes(keyword.value)),\n);\n</script>\n\n<template>\n  <input v-model="keyword" placeholder="搜索任务" />\n  <ul>\n    <li v-for="todo in visibleTodos" :key="todo.id">\n      {{ todo.done ? '完成' : '待办' }} - {{ todo.title }}\n    </li>\n  </ul>\n</template>\n\`\`\`\n\n## 2. 接口返回 JSON 示例\n\n\`\`\`json\n{\n  "code": 0,\n  "message": "success",\n  "data": {\n    "requestId": "${requestId}",\n    "stream": true\n  }\n}\n\`\`\`\n\n## 3. SQL 示例\n\n\`\`\`sql\nselect id, title, done\nfrom todos\nwhere title like concat('%', :keyword, '%')\norder by id desc;\n\`\`\`\n\n注意：SSE 的每个 \`data:\` 本质上仍然是字符串。只要后端把代码内容放到 JSON 字段里，再通过 \`JSON.stringify\` 输出，换行、反引号、尖括号都可以被安全传输。`;

    const tokens = markdown.match(/[\s\S]{1,18}/g) ?? [markdown];

    return [
      {
        event: 'connected',
        delayMs: 0,
        data: { type: 'connected', requestId, content: '代码内容流已建立，准备返回混合文本。' },
      },
      {
        event: 'thinking',
        delayMs: 300,
        data: { type: 'thinking', requestId, content: '正在生成 Markdown 与代码块...' },
      },
      ...tokens.map<StreamStep>((content, index) => ({
        event: 'delta',
        delayMs: 45 + (index % 5) * 15,
        data: { type: 'delta', requestId, index, content },
      })),
      {
        event: 'usage',
        delayMs: 200,
        data: { type: 'usage', requestId, tokens: tokens.length },
      },
    ];
  }

  private buildRichStreamSteps(prompt: string, requestId: string): StreamStep[] {
    const markdown = `# SSE 富文本报告\n\n> 请求主题：${prompt}\n> 请求编号：\`${requestId}\`\n\n这份内容用来模拟真实 AI 回复里可能出现的多种 Markdown 结构，包括表格、列表、任务项、代码块、数学表达式文本、引用、分割线和 Mermaid 图表源码。\n\n## 1. 概览表格\n\n| 模块 | 状态 | 耗时 | 说明 |\n| --- | ---: | ---: | --- |\n| 用户输入解析 | 完成 | 32ms | 提取 prompt 和上下文 |\n| 知识检索 | 完成 | 146ms | 模拟从文档库检索 3 条记录 |\n| 内容生成 | 进行中 | 812ms | 按 token 流式输出 |\n| 安全过滤 | 完成 | 21ms | 检查 HTML 与脚本注入 |\n\n## 2. 任务清单\n\n- [x] 建立 SSE 连接\n- [x] 发送 connected 事件\n- [x] 流式发送 Markdown 内容\n- [x] 返回代码块、表格和引用\n- [ ] 前端支持 Mermaid 渲染\n- [ ] 前端支持数学公式渲染\n\n## 3. 普通列表与嵌套列表\n\n1. 前端发起 POST 请求\n   - 使用 \`fetch\`\n   - 读取 \`ReadableStream\`\n   - 按 \`\\n\\n\` 拆分 SSE event\n2. 后端持续写入响应\n   - \`event: delta\`\n   - \`data: {...}\`\n3. 前端拼接 Markdown 并实时渲染\n\n## 4. 指标对比表\n\n| 方案 | 支持 GET | 支持 POST | 支持 Header | 自动重连 | 解析成本 |\n| --- | :---: | :---: | :---: | :---: | ---: |\n| EventSource | 是 | 否 | 弱 | 是 | 低 |\n| fetch + stream | 是 | 是 | 是 | 否 | 中 |\n| fetch-event-source | 是 | 是 | 是 | 是 | 低 |\n| axios 浏览器端 | 是 | 是 | 是 | 否 | 高，不推荐 |\n\n## 5. TypeScript 示例\n\n\`\`\`ts\ntype SsePayload = {\n  type: 'delta' | 'complete';\n  content?: string;\n  elapsedMs?: number;\n};\n\nfunction isComplete(payload: SsePayload) {\n  return payload.type === 'complete';\n}\n\`\`\`\n\n## 6. JSON 示例\n\n\`\`\`json\n{\n  "requestId": "${requestId}",\n  "items": [\n    { "name": "Markdown 表格", "enabled": true },\n    { "name": "代码高亮", "enabled": true },\n    { "name": "Mermaid 图表", "enabled": false }\n  ],\n  "meta": {\n    "stream": true,\n    "transport": "text/event-stream"\n  }\n}\n\`\`\`\n\n## 7. Bash 示例\n\n\`\`\`bash\ncurl -N -X POST http://localhost:3000/sse/rich-stream \\\n  -H "Content-Type: application/json" \\\n  -d '{"message":"生成富文本内容"}'\n\`\`\`\n\n## 8. SQL 示例\n\n\`\`\`sql\nselect request_id, event_type, content, created_at\nfrom sse_event_logs\nwhere request_id = :requestId\norder by created_at asc;\n\`\`\`\n\n## 9. 引用块\n\n> 流式渲染 Markdown 时，代码块可能会先显示为未闭合状态。\n> 这是正常现象，因为最后的 \`\`\` 还没有从服务端推送到浏览器。\n\n## 10. 告警说明\n\n**注意：** 当前 Markdown 渲染配置关闭了 HTML 渲染，所以类似 \`<script>alert(1)</script>\` 会被当作普通文本处理，不会执行。\n\n## 11. Mermaid 图表源码\n\n\`\`\`mermaid\nsequenceDiagram\n  participant Browser\n  participant NestJS\n  Browser->>NestJS: POST /sse/rich-stream\n  NestJS-->>Browser: event: connected\n  loop streaming\n    NestJS-->>Browser: event: delta + markdown chunk\n  end\n  NestJS-->>Browser: event: complete\n\`\`\`\n\n## 12. 类似数学公式的文本\n\n行内公式文本：\`E = mc^2\`。\n\n块级公式文本：\n\n\`\`\`text\nsum(i = 1..n) = n * (n + 1) / 2\n\`\`\`\n\n---\n\n### 总结\n\n这个接口可以用来测试前端 Markdown 渲染在复杂内容下的表现：\n\n- 表格是否样式正常\n- 代码块是否高亮\n- 长内容是否滚动\n- SSE 分段是否破坏 Markdown 结构\n- 安全过滤是否生效\n`;

    const tokens = markdown.match(/[\s\S]{1,22}/g) ?? [markdown];

    return [
      {
        event: 'connected',
        delayMs: 0,
        data: { type: 'connected', requestId, content: '富文本内容流已建立，准备返回复杂 Markdown。' },
      },
      {
        event: 'thinking',
        delayMs: 250,
        data: { type: 'thinking', requestId, content: '正在组织表格、列表、代码块和图表源码...' },
      },
      ...tokens.map<StreamStep>((content, index) => ({
        event: 'delta',
        delayMs: 35 + (index % 6) * 10,
        data: { type: 'delta', requestId, index, content },
      })),
      {
        event: 'recommended',
        delayMs: 250,
        data: {
          type: 'recommended',
          requestId,
          content: '下一步可以接入 markdown-it 插件，例如 task-lists、anchor、mermaid 或 KaTeX。',
        },
      },
      {
        event: 'usage',
        delayMs: 200,
        data: { type: 'usage', requestId, tokens: tokens.length },
      },
    ];
  }

  private createCommonSteps(
    requestId: string,
    tokens: string[],
    connectedContent: string,
  ): StreamStep[] {
    return [
      {
        event: 'connected',
        delayMs: 0,
        data: { type: 'connected', requestId, content: connectedContent },
      },
      {
        event: 'thinking',
        delayMs: 300,
        data: { type: 'thinking', requestId, content: '正在理解用户输入并构建上下文...' },
      },
      {
        event: 'thinking',
        delayMs: 700,
        data: { type: 'thinking', requestId, content: '正在模拟检索相关资料...' },
      },
      {
        event: 'reference',
        delayMs: 400,
        data: {
          type: 'reference',
          requestId,
          references: [
            { title: 'NestJS SSE', url: 'https://docs.nestjs.com/techniques/server-sent-events' },
            {
              title: 'ReadableStream',
              url: 'https://developer.mozilla.org/docs/Web/API/ReadableStream',
            },
          ],
        },
      },
      ...tokens.map<StreamStep>((content, index) => ({
        event: 'delta',
        delayMs: 120 + (index % 4) * 40,
        data: { type: 'delta', requestId, index, content },
      })),
      {
        event: 'recommended',
        delayMs: 500,
        data: {
          type: 'recommended',
          requestId,
          content: '你还可以继续测试：取消请求、错误事件、重试机制和长文本输出。',
        },
      },
      {
        event: 'usage',
        delayMs: 200,
        data: { type: 'usage', requestId, tokens: tokens.length },
      },
    ];
  }

  private writeSseEvent(res: Response, event: string, data: StreamPayload) {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }
}
