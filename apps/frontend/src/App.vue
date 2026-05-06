<script setup lang="ts">
const navs = [
  { path: '/', label: '首页' },
  { path: '/basic', label: '基础请求' },
  { path: '/auth', label: '登录鉴权' },
  { path: '/upload', label: '文件上传' },
];
</script>

<template>
  <div class="min-h-screen bg-slate-100">
    <header class="sticky top-0 z-10 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <RouterLink to="/" class="text-lg font-bold text-brand-900">FrontBack Playground</RouterLink>
        <nav class="flex gap-2">
          <RouterLink
            v-for="nav in navs"
            :key="nav.path"
            :to="nav.path"
            class="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-brand-50 hover:text-brand-600"
            active-class="bg-brand-500 text-white hover:bg-brand-500 hover:text-white"
          >
            {{ nav.label }}
          </RouterLink>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-6 py-8">
      <RouterView />
    </main>
  </div>
</template>
