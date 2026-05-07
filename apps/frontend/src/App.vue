<!-- @format -->

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const MAX_VISIBLE_NAVS = 6;

const navs = [
  { path: '/', label: '首页' },
  { path: '/basic', label: '基础请求' },
  { path: '/auth', label: '登录鉴权' },
  { path: '/upload', label: '文件上传' },
  { path: '/Sse', label: 'Sse' },
];

const route = useRoute();

const visibleNavs = computed(() => navs.slice(0, MAX_VISIBLE_NAVS));
const hiddenNavs = computed(() => navs.slice(MAX_VISIBLE_NAVS));
const hasHiddenNavs = computed(() => hiddenNavs.value.length > 0);
const isHiddenNavActive = computed(() => hiddenNavs.value.some((nav) => nav.path === route.path));

function openDocs() {
  window.open('http://localhost:5174', '_blank');
}
</script>

<template>
  <div class="min-h-screen bg-slate-100">
    <header class="sticky top-0 z-10 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div class="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center">
        <RouterLink to="/" class="shrink-0 text-lg font-bold text-brand-900"
          >FrontBack Playground</RouterLink
        >
        <nav class="flex min-w-0 flex-1 flex-wrap gap-2 sm:justify-end">
          <RouterLink
            v-for="(nav, index) in visibleNavs"
            :key="`${nav.path}-${index}`"
            :to="nav.path"
            class="rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap text-slate-600 transition hover:bg-brand-50 hover:text-brand-600"
            active-class="bg-brand-500 text-white hover:bg-brand-500 hover:text-white"
          >
            {{ nav.label }}
          </RouterLink>

          <el-dropdown v-if="hasHiddenNavs">
            <button
              type="button"
              class="rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition hover:bg-brand-50 hover:text-brand-600"
              :class="
                isHiddenNavActive
                  ? 'bg-brand-500 text-white hover:bg-brand-500 hover:text-white'
                  : 'text-slate-600'
              "
            >
              更多
              <span class="ml-1 text-xs">+{{ hiddenNavs.length }}</span>
            </button>

            <template #dropdown>
              <el-dropdown-menu
                class="max-h-[min(480px,calc(100vh-120px))] overflow-y-auto overscroll-contain"
              >
                <RouterLink
                  v-for="(nav, index) in hiddenNavs"
                  :key="`${nav.path}-more-${index}`"
                  :to="nav.path"
                  custom
                  v-slot="{ navigate, isActive }"
                >
                  <el-dropdown-item
                    :class="isActive ? 'is-active text-brand-600' : ''"
                    @click="navigate"
                  >
                    {{ nav.label }}
                  </el-dropdown-item>
                </RouterLink>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button class="!ml-0" type="primary" plain round @click="openDocs">打开文档</el-button>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-6 py-8">
      <RouterView />
    </main>
  </div>
</template>
