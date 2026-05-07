# Server-Sent Events

## 场景说明

Server-Sent Events，简称 SSE，适合服务端持续向浏览器推送文本事件。这个项目通过 `/sse/stream`、`/sse/code-stream` 和 `/sse/rich-stream` 模拟流式回复，帮助观察前端如何边接收边渲染内容。

当前示例使用 `fetch + ReadableStream`，因此可以发送 `POST` 请求和 JSON Body，比原生 `EventSource` 更适合需要携带复杂参数的场景。

## 后端接口

### 基础流式响应

```http
POST /api/sse/stream
Content-Type: application/json

{
  "message": "请介绍一下 SSE 流式响应"
}
```

### 代码内容流式响应

```http
POST /api/sse/code-stream
Content-Type: application/json

{
  "message": "生成一个包含代码块的 SSE 示例"
}
```

### 富文本流式响应

```http
POST /api/sse/rich-stream
Content-Type: application/json

{
  "message": "生成一份复杂 Markdown 报告"
}
```

## 响应格式

SSE 响应的 `Content-Type` 为 `text/event-stream`。每个事件由 `event:` 和 `data:` 组成，并用空行分隔。

```text
event: delta
data: {"type":"delta","requestId":"sse_xxx","index":0,"content":"收到你的问题"}

```

项目中的 `data` 会被序列化为统一的 `StreamPayload` 结构。

```ts
type StreamPayload = {
  type: 'connected' | 'thinking' | 'delta' | 'reference' | 'recommended' | 'usage' | 'complete';
  content?: string;
  requestId?: string;
  index?: number;
  elapsedMs?: number;
  tokens?: number;
  references?: Array<{ title: string; url: string }>;
};
```

## 事件类型

| 类型 | 作用 |
| --- | --- |
| `connected` | 表示连接已建立 |
| `thinking` | 表示服务端正在分析、检索或组织内容 |
| `reference` | 返回参考资料列表 |
| `delta` | 返回正文片段，前端逐段拼接 |
| `recommended` | 返回推荐内容或下一步提示 |
| `usage` | 返回 token 等统计信息 |
| `complete` | 表示流式响应结束 |

## 前端关键点

前端通过 `fetch` 发起请求，然后读取 `response.body.getReader()` 返回的 `ReadableStream`。

```ts
const response = await fetch('/api/sse/stream', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ message: '基础Sse' }),
});

const reader = response.body!.getReader();
const decoder = new TextDecoder('utf-8');
let buffer = '';
```

读取过程中需要把二进制数据转成字符串，并按照 `\n\n` 拆分完整事件。

```ts
const { done, value } = await reader.read();

buffer += decoder.decode(value, { stream: true });
const chunks = buffer.split('\n\n');
buffer = chunks.pop() ?? '';
```

## Markdown 渲染

`code-stream` 和 `rich-stream` 会返回 Markdown、代码块、表格等内容。前端将 `delta` 片段持续拼接到结果中，再通过 `markdown-it` 渲染，并使用 `DOMPurify` 做安全过滤。

```ts
const renderedResult = computed(() => DOMPurify.sanitize(markdown.render(result.value)));
```

## 关键知识点

- SSE 本质是服务端持续写入 `text/event-stream` 文本。
- 每个事件之间必须使用空行分隔。
- `fetch + ReadableStream` 支持 `POST`、自定义 Header 和 JSON Body。
- 原生 `EventSource` 默认使用 `GET`，更适合简单订阅场景。
- 流式 Markdown 在传输过程中可能短暂出现未闭合代码块，这是正常现象。
- 后端需要监听连接关闭，避免客户端断开后继续写入。

## 后续扩展

- 请求取消
- 错误事件
- 自动重试
- 心跳保活
- Markdown 插件增强
- Mermaid 和数学公式渲染
