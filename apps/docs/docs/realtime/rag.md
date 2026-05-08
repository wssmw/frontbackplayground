# RAG 向量搜索

## 场景说明

RAG（Retrieval-Augmented Generation，检索增强生成）是一种结合向量检索和大模型生成的技术。这个项目通过 `/rag/upsert` 和 `/rag/search` 接口，帮助你理解文本向量化、语义搜索和相似度检索的核心流程。

当前实现使用**内存版向量数据库**和 **Ollama 本地 Embedding 模型**，不依赖云服务，适合学习和测试。

## 核心流程

```text
文本入库
  -> 调用 Ollama Embedding 模型生成向量
  -> 存入内存向量数据库

语义搜索
  -> 用户输入问题
  -> 问题转成向量
  -> 计算余弦相似度
  -> 返回最相似的文本
```

## 环境准备

### 1. 安装 Ollama

访问 [https://ollama.com](https://ollama.com) 下载并安装 Ollama。

### 2. 拉取 Embedding 模型

```bash
ollama pull bge-m3
```

首次拉取约 2GB，适合中文和多语言场景。

### 3. 启动 Ollama 服务

```bash
ollama serve
```

默认监听 `http://localhost:11434`。

### 4. 验证服务

```bash
curl http://localhost:11434/api/tags
```

能看到 `bge-m3` 模型说明安装成功。

## 后端接口

### 文本入库

```http
POST /api/rag/upsert
Content-Type: application/json

{
  "text": "NestJS 是一个基于 Node.js 的后端框架，支持模块化和依赖注入。",
  "metadata": {
    "category": "backend",
    "tags": ["nodejs", "framework"]
  }
}
```

**响应示例**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### 语义搜索

```http
POST /api/rag/search
Content-Type: application/json

{
  "query": "什么数据库可以做相似度检索？",
  "limit": 5
}
```

**响应示例**

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "score": 0.8234,
      "text": "Qdrant 是一个向量数据库，适合做语义搜索和相似度检索。",
      "metadata": {
        "category": "database"
      }
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "score": 0.6521,
      "text": "PostgreSQL 配合 pgvector 插件也可以做向量检索。",
      "metadata": {
        "category": "database"
      }
    }
  ]
}
```

## 核心概念

### 什么是 Embedding？

Embedding 是把文本、图片、音频等非结构化数据转换成高维向量的过程。

例如：

```text
"NestJS 是一个后端框架"
```

会被转换成：

```ts
[0.012, -0.088, 0.231, 0.445, ...]
```

这个数组可能有 768 维或 1024 维。语义相近的文本在向量空间中的距离也更近。

### 什么是向量数据库？

向量数据库专门用于存储和检索高维向量。它通过 **ANN（近似最近邻）** 算法，在大量向量中快速找到语义相近的数据。

常见向量数据库：

- **Qdrant**：开源，Docker 部署简单
- **Milvus**：适合大规模生产
- **pgvector**：PostgreSQL 插件
- **Pinecone**：云服务

当前项目使用**内存版向量数据库**，适合学习和小规模测试。

### 相似度计算

文本向量检索常用 **余弦相似度（Cosine Similarity）**：

```text
cosine_similarity = dot(a, b) / (norm(a) * norm(b))
```

取值范围 `[-1, 1]`，越接近 1 表示越相似。

项目中的实现：

```ts
private cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
```

## 技术架构

### 后端模块结构

```text
apps/backend/src/modules/rag/
  rag.module.ts              # RAG 模块定义
  rag.controller.ts          # 接口：/rag/upsert, /rag/search
  embedding.service.ts       # Ollama embedding 调用
  vector-store.service.ts    # 内存版向量数据库
  upsert-rag-text.dto.ts     # 入库 DTO
  search-rag-text.dto.ts     # 搜索 DTO
```

### EmbeddingService

负责调用 Ollama API 生成向量。

```ts
async getEmbedding(text: string): Promise<number[]> {
  const response = await fetch('http://localhost:11434/api/embeddings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'bge-m3',
      prompt: text,
    }),
  });

  const data = await response.json();
  return data.embedding;
}
```

### VectorStoreService

内存版向量数据库，核心逻辑：

**入库**

```ts
async upsertText(params: {
  id?: string;
  text: string;
  vector: number[];
  metadata?: Record<string, unknown>;
}): Promise<{ id: string }> {
  const id = params.id ?? randomUUID();
  const point = { id, text: params.text, vector: params.vector, metadata: params.metadata };
  
  const existingIndex = this.points.findIndex((p) => p.id === id);
  if (existingIndex >= 0) {
    this.points[existingIndex] = point;
  } else {
    this.points.push(point);
  }
  
  return { id };
}
```

**搜索**

```ts
async search(vector: number[], limit = 5): Promise<VectorSearchItem[]> {
  return this.points
    .map((point) => ({
      id: point.id,
      score: this.cosineSimilarity(vector, point.vector),
      text: point.text,
      metadata: point.metadata,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
```

## 前端关键点

### API 调用

```ts
export function upsertRagText(data: {
  id?: string;
  text: string;
  metadata?: Record<string, unknown>;
}) {
  return http.post<unknown, ApiResponse<{ id: string }>>('/rag/upsert', data);
}

export function searchRagText(data: { query: string; limit?: number }) {
  return http.post<unknown, ApiResponse<VectorSearchItem[]>>('/rag/search', data);
}
```

### 搜索结果渲染

根据相似度 `score` 显示不同颜色标签：

```vue
<el-tag :type="item.score > 0.7 ? 'success' : item.score > 0.5 ? 'warning' : 'info'">
  相似度: {{ (item.score * 100).toFixed(1) }}%
</el-tag>
```

## 测试流程

### 1. 入库几条测试数据

**示例 1：后端框架**

```json
{
  "text": "NestJS 是一个基于 Node.js 的后端框架，支持模块化和依赖注入。",
  "metadata": { "category": "backend" }
}
```

**示例 2：向量数据库**

```json
{
  "text": "Qdrant 是一个向量数据库，适合做语义搜索和相似度检索。",
  "metadata": { "category": "database" }
}
```

**示例 3：前端框架**

```json
{
  "text": "Vue 是一个前端框架，常用于构建用户界面。",
  "metadata": { "category": "frontend" }
}
```

### 2. 语义搜索

**问题 1**

```json
{
  "query": "什么数据库可以做相似度检索？",
  "limit": 3
}
```

理想情况下，应该优先命中 Qdrant 那条。

**问题 2**

```json
{
  "query": "后端开发用什么框架？",
  "limit": 3
}
```

应该优先命中 NestJS 那条。

### 3. 观察相似度评分

- `score > 0.7`：高度相关（绿色标签）
- `0.5 < score <= 0.7`：中度相关（橙色标签）
- `score <= 0.5`：低度相关（灰色标签）

## 关键知识点

### 语义搜索 vs 关键词搜索

| 类型 | 原理 | 示例 |
| --- | --- | --- |
| 关键词搜索 | 字符串匹配 | `WHERE title LIKE '%向量%'` |
| 语义搜索 | 向量相似度 | 问"相似度检索"能命中"向量数据库" |

语义搜索不依赖精确关键词，更适合自然语言问答。

### 内存版 vs 生产向量数据库

| 能力 | 内存版（当前） | Qdrant / Milvus |
| --- | --- | --- |
| 存向量 | ✅ | ✅ |
| 相似度搜索 | ✅ | ✅ |
| 重启后数据保留 | ❌ | ✅ |
| 大数据量索引加速 | ❌ | ✅ HNSW / IVF |
| payload filter | 可手动实现 | ✅ |
| 生产可用 | ❌ | ✅ |

内存版适合理解原理和小规模测试，生产环境需要专业向量数据库。

### Embedding 模型选择

| 模型 | 维度 | 适用场景 |
| --- | --- | --- |
| `bge-m3` | 1024 | 中文、多语言 |
| `nomic-embed-text` | 768 | 英文、轻量 |
| `text-embedding-3-small` | 1536 | OpenAI，效果好但需 API Key |

当前项目使用 `bge-m3`，适合中文知识库。

### 向量维度一致性

同一个 collection/table 的向量维度必须一致。如果换了 embedding 模型，需要：

1. 删除旧数据
2. 重新生成向量
3. 重新入库

否则会报 `Vector dimensions must match` 错误。

## 生产环境注意事项

### 1. 文档切片

真实项目不会直接把整篇文档丢进去，需要切成 chunk：

- 每个 chunk 500～1000 tokens
- chunk 之间保留 50～150 tokens overlap
- 避免语义被截断

### 2. Embedding 模型版本管理

每个向量应该记录：

```json
{
  "embeddingModel": "bge-m3",
  "embeddingVersion": "v1",
  "embeddingDimension": 1024
}
```

模型升级时需要重建索引。

### 3. 权限过滤

企业知识库需要结合 metadata filter：

```json
{
  "userId": "u001",
  "tenantId": "tenant-a",
  "departmentId": "dev"
}
```

搜索时必须过滤，避免越权检索。

### 4. 混合检索

生产中常用 **hybrid search**：

```text
向量检索 + 关键词检索 + rerank
```

例如：

- BM25 查关键词
- Vector Search 查语义
- Reranker 重新排序

### 5. 性能优化

- 批量 embedding
- 异步任务队列
- 缓存 query embedding
- 后台重建索引
- 限流和分页

## 后续扩展

- 切换到 Qdrant 真实向量数据库
- 文档上传和自动切片
- 结合大模型做 RAG 问答
- 混合检索和 rerank
- 多租户隔离
- 权限过滤
- 检索链路观测
- 用户反馈和持续优化

## 参考资料

- [Ollama 官网](https://ollama.com)
- [Qdrant 文档](https://qdrant.tech/documentation/)
- [BGE Embedding 模型](https://huggingface.co/BAAI/bge-m3)
- [什么是 RAG？](https://www.pinecone.io/learn/retrieval-augmented-generation/)
