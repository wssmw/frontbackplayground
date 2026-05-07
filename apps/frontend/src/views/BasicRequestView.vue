<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { getBasicEcho, getHealth, postBasicEcho } from '@/api/http';

const result = ref('等待请求');
const loading = ref(false);

async function runRequest(type: 'health' | 'get' | 'post') {
  loading.value = true;
  try {
    const response =
      type === 'health'
        ? await getHealth()
        : type === 'get'
          ? await getBasicEcho({ keyword: 'front-back', page: '1' })
          : await postBasicEcho({ title: '前后端交互', tags: ['Vue', 'NestJS'] });
    result.value = JSON.stringify(response, null, 2);
  } catch (error) {
    ElMessage.error((error as Error).message);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-[420px_1fr]">
    <el-card shadow="never" class="rounded-3xl">
      <template #header>
        <div class="font-bold">基础请求实验</div>
      </template>
      <div class="space-y-4">
        <p class="leading-7 text-slate-600">
          点击按钮观察不同请求方式下，后端如何接收参数并返回统一响应。
        </p>
        <el-button class="w-full" type="primary" :loading="loading" @click="runRequest('health')"
          >GET /health</el-button
        >
        <el-button class="w-full !ml-0" :loading="loading" @click="runRequest('get')"
          >GET /basic/echo?keyword=...</el-button
        >
        <el-button
          class="w-full !ml-0"
          type="success"
          :loading="loading"
          @click="runRequest('post')"
          >POST /basic/echo</el-button
        >
      </div>
    </el-card>

    <el-card shadow="never" class="rounded-3xl">
      <template #header>
        <div class="font-bold">响应结果</div>
      </template>
      <pre class="code-panel">{{ result }}</pre>
    </el-card>
  </div>
</template>
