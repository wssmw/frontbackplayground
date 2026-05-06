<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import { getProfile, login } from '@/api/http';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const form = reactive({ username: 'admin', password: '123456' });
const result = ref('用户名：admin，密码：123456');
const loading = ref(false);

async function handleLogin() {
  loading.value = true;
  try {
    const response = await login(form);
    auth.setToken(response.data.accessToken);
    auth.username = response.data.user.username;
    result.value = JSON.stringify(response, null, 2);
    ElMessage.success('登录成功，Token 已写入 localStorage');
  } catch (error) {
    ElMessage.error((error as Error).message);
  } finally {
    loading.value = false;
  }
}

async function fetchProfile() {
  loading.value = true;
  try {
    const response = await getProfile();
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
      <template #header><div class="font-bold">登录鉴权实验</div></template>
      <el-form label-position="top" :model="form">
        <el-form-item label="用户名">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" show-password />
        </el-form-item>
        <el-button type="primary" class="w-full" :loading="loading" @click="handleLogin">登录并保存 Token</el-button>
        <el-button class="mt-3 w-full" :loading="loading" @click="fetchProfile">请求受保护接口</el-button>
        <el-button class="mt-3 w-full" type="danger" plain @click="auth.logout">退出登录</el-button>
      </el-form>
    </el-card>

    <el-card shadow="never" class="rounded-3xl">
      <template #header><div class="font-bold">响应结果</div></template>
      <pre class="code-panel">{{ result }}</pre>
    </el-card>
  </div>
</template>
