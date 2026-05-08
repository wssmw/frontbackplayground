<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { upsertRagText, searchRagText } from '@/api/http';

const upsertLoading = ref(false);
const searchLoading = ref(false);

const upsertForm = ref({
  text: '',
  metadata: '',
});

const searchQuery = ref('');
const searchLimit = ref(5);

const upsertResult = ref('等待入库');
const searchResults = ref<Array<{
  id: string;
  score: number;
  text: string;
  metadata?: Record<string, unknown>;
}>>([]);

async function handleUpsert() {
  if (!upsertForm.value.text.trim()) {
    ElMessage.warning('请输入要入库的文本');
    return;
  }

  upsertLoading.value = true;
  try {
    let metadata: Record<string, unknown> | undefined;
    if (upsertForm.value.metadata.trim()) {
      try {
        metadata = JSON.parse(upsertForm.value.metadata);
      } catch {
        ElMessage.warning('metadata 格式不正确，已忽略');
      }
    }

    const response = await upsertRagText({
      text: upsertForm.value.text,
      metadata,
    });

    upsertResult.value = JSON.stringify(response, null, 2);
    ElMessage.success('文本入库成功');
  } catch (error) {
    ElMessage.error((error as Error).message);
  } finally {
    upsertLoading.value = false;
  }
}

async function handleSearch() {
  if (!searchQuery.value.trim()) {
    ElMessage.warning('请输入搜索问题');
    return;
  }

  searchLoading.value = true;
  try {
    const response = await searchRagText({
      query: searchQuery.value,
      limit: searchLimit.value,
    });

    searchResults.value = response.data;
    if (searchResults.value.length === 0) {
      ElMessage.info('没有找到相关内容，请先入库一些文本');
    }
  } catch (error) {
    ElMessage.error((error as Error).message);
  } finally {
    searchLoading.value = false;
  }
}

function fillExample(type: 'backend' | 'database' | 'frontend') {
  const examples = {
    backend: {
      text: 'NestJS 是一个基于 Node.js 的后端框架，支持模块化和依赖注入。',
      metadata: '{"category":"backend"}',
    },
    database: {
      text: 'Qdrant 是一个向量数据库，适合做语义搜索和相似度检索。',
      metadata: '{"category":"database"}',
    },
    frontend: {
      text: 'Vue 是一个前端框架，常用于构建用户界面。',
      metadata: '{"category":"frontend"}',
    },
  };
  upsertForm.value = examples[type];
}

function fillSearchExample(type: 'database' | 'backend' | 'ui') {
  const examples = {
    database: '什么数据库可以做相似度检索？',
    backend: '后端框架有哪些？',
    ui: '如何构建用户界面？',
  };
  searchQuery.value = examples[type];
}
</script>

<template>
  <div class="space-y-6">
    <!-- 标题区 -->
    <el-card shadow="never" class="rounded-3xl bg-gradient-to-br from-purple-50 to-blue-50">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">RAG 向量搜索实验室</h1>
        <p class="mt-2 leading-7 text-slate-600">
          体验文本向量化、语义搜索和相似度检索。先入库几条文本，再用自然语言搜索相关内容。
        </p>
      </div>
    </el-card>
    <div class="grid gap-6 lg:grid-cols-[420px_1fr] w-full">
      <!-- 文本入库区 -->
      <el-card shadow="never" class="rounded-3xl">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-bold">📝 文本入库</span>
            <div class="space-x-2">
              <el-button size="small" @click="fillExample('backend')">示例1</el-button>
              <el-button size="small" @click="fillExample('database')">示例2</el-button>
              <el-button size="small" @click="fillExample('frontend')">示例3</el-button>
            </div>
          </div>
        </template>

        <div class="space-y-4">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">文本内容</label>
            <el-input
              v-model="upsertForm.text"
              type="textarea"
              :rows="4"
              placeholder="输入要入库的文本，例如：NestJS 是一个基于 Node.js 的后端框架..."
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700"
              >Metadata（可选，JSON 格式）</label
            >
            <el-input
              v-model="upsertForm.metadata"
              placeholder='例如：{"category":"backend","tags":["nodejs","framework"]}'
            />
          </div>

          <el-button
            type="primary"
            class="w-full"
            :loading="upsertLoading"
            @click="handleUpsert"
          >
            入库到向量数据库
          </el-button>

          <div v-if="upsertResult !== '等待入库'" class="rounded-lg bg-slate-50 p-4">
            <div class="mb-2 text-sm font-medium text-slate-700">入库结果</div>
            <pre class="text-sm text-slate-600">{{ upsertResult }}</pre>
          </div>
        </div>
      </el-card>

      <!-- 语义搜索区 -->
      <el-card shadow="never" class="rounded-3xl">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-bold">🔍 语义搜索</span>
            <div class="space-x-2">
              <el-button size="small" @click="fillSearchExample('database')">示例1</el-button>
              <el-button size="small" @click="fillSearchExample('backend')">示例2</el-button>
              <el-button size="small" @click="fillSearchExample('ui')">示例3</el-button>
            </div>
          </div>
        </template>

        <div class="space-y-4">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">搜索问题</label>
            <el-input
              v-model="searchQuery"
              placeholder="输入问题，例如：什么数据库可以做相似度检索？"
            />
          </div>

          <div class="flex items-center gap-4">
            <label class="text-sm font-medium text-slate-700">返回数量</label>
            <el-input-number v-model="searchLimit" :min="1" :max="20" />
          </div>

          <el-button
            type="success"
            class="w-full"
            :loading="searchLoading"
            @click="handleSearch"
          >
            语义搜索
          </el-button>

          <!-- 搜索结果 -->
          <div v-if="searchResults.length > 0" class="space-y-3">
            <div class="text-sm font-medium text-slate-700">
              搜索结果（共 {{ searchResults.length }} 条）
            </div>
            <div
              v-for="(item, index) in searchResults"
              :key="item.id"
              class="rounded-lg border border-slate-200 bg-white p-4 transition hover:shadow-md"
            >
              <div class="mb-2 flex items-center justify-between">
                <span class="text-sm font-semibold text-slate-900">#{{ index + 1 }}</span>
                <el-tag :type="item.score > 0.7 ? 'success' : item.score > 0.5 ? 'warning' : 'info'">
                  相似度: {{ (item.score * 100).toFixed(1) }}%
                </el-tag>
              </div>
              <p class="leading-7 text-slate-700">{{ item.text }}</p>
              <div v-if="item.metadata" class="mt-2 text-xs text-slate-500">
                Metadata: {{ JSON.stringify(item.metadata) }}
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

  </div>
</template>

<style scoped>
.code-panel {
  @apply rounded-lg bg-slate-50 p-4 text-sm text-slate-700;
  font-family: 'Consolas', 'Monaco', monospace;
}
</style>
