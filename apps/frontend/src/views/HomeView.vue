<script setup lang="ts">
import { Connection, Key, UploadFilled, Search } from '@element-plus/icons-vue';

const cards = [
  {
    title: '基础 HTTP 请求',
    desc: '学习 GET、POST、Query、Body、Headers 和统一响应格式。',
    path: '/basic',
    icon: Connection,
  },
  {
    title: '登录鉴权',
    desc: '学习登录、JWT、请求头携带 Token、受保护接口访问。',
    path: '/auth',
    icon: Key,
  },
  {
    title: '文件上传下载',
    desc: '学习 FormData、上传限制、响应处理和下载 Blob。',
    path: '/upload',
    icon: UploadFilled,
  },
  {
    title: 'Sse下载',
    desc: '学习 Sse请求、md文档展示。',
    path: '/Sse',
    icon: Connection,
  },
  {
    title: 'RAG 向量搜索',
    desc: '学习文本向量化、语义搜索和相似度检索。',
    path: '/rag',
    icon: Search,
  },
];

function openDocs() {
  window.open('http://localhost:5174', '_blank');
}
</script>

<template>
  <section
    class="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand-600 to-sky-400 p-10 text-white shadow-xl"
  >
    <p class="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-sky-100">Learning Lab</p>
    <h1 class="max-w-3xl text-4xl font-black leading-tight md:text-6xl">
      前后端分离交互学习实验室
    </h1>
    <p class="mt-5 max-w-2xl text-lg leading-8 text-sky-50">
      用真实可运行的前端页面、后端接口和文档站点，系统学习不同业务场景下的前后端交互细节。
    </p>
    <div class="mt-8 flex gap-3">
      <el-button type="primary" size="large" @click="$router.push('/basic')">开始体验</el-button>
      <el-button size="large" plain @click="openDocs">打开文档</el-button>
    </div>
  </section>

  <section class="mt-8 grid gap-6 md:grid-cols-3">
    <RouterLink
      v-for="card in cards"
      :key="card.path"
      :to="card.path"
      class="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <el-icon
        class="mb-5 rounded-2xl bg-brand-50 p-3 text-5xl text-brand-600 transition group-hover:bg-brand-500 group-hover:text-white"
      >
        <component :is="card.icon" />
      </el-icon>
      <h2 class="text-xl font-bold text-slate-900">{{ card.title }}</h2>
      <p class="mt-3 leading-7 text-slate-600">{{ card.desc }}</p>
    </RouterLink>
  </section>
</template>
