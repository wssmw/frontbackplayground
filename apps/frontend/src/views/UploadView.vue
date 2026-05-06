<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { UploadRequestOptions } from 'element-plus';
import { ref } from 'vue';
import { http } from '@/api/http';

const result = ref('请选择文件上传');
const loading = ref(false);

async function uploadFile(options: UploadRequestOptions) {
  loading.value = true;
  const formData = new FormData();
  formData.append('file', options.file);
  try {
    const response = await http.post('/upload/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    result.value = JSON.stringify(response, null, 2);
    ElMessage.success('上传成功');
    options.onSuccess(response);
  } catch (error) {
    const uploadError = error as Parameters<UploadRequestOptions['onError']>[0];
    ElMessage.error(uploadError.message);
    options.onError(uploadError);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-[420px_1fr]">
    <el-card shadow="never" class="rounded-3xl">
      <template #header><div class="font-bold">文件上传实验</div></template>
      <el-upload drag :http-request="uploadFile" :show-file-list="true">
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">拖拽文件到这里，或 <em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">当前示例上传到后端内存处理，不落库。</div>
        </template>
      </el-upload>
      <el-alert class="mt-4" type="info" show-icon :closable="false" title="重点观察 multipart/form-data 请求体和后端文件元信息解析。" />
    </el-card>

    <el-card shadow="never" class="rounded-3xl" v-loading="loading">
      <template #header><div class="font-bold">响应结果</div></template>
      <pre class="code-panel">{{ result }}</pre>
    </el-card>
  </div>
</template>
