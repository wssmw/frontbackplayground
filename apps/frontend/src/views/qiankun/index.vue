<!-- @format -->

<script setup lang="ts">
import { onMounted, ref, computed, onUnmounted } from 'vue';
import { qiankun, AppStatus } from './qiankun';
import { counterApp, todoApp, chartApp } from './micro-apps';

import singleSpaSource from './single-spa.ts?raw';
import qiankunSource from './qiankun.ts?raw';
import sandboxSource from './sandbox.ts?raw';
import loaderSource from './loader.ts?raw';

const currentPath = ref(window.location.hash || '#/counter');
const currentStatus = ref<AppStatus>(AppStatus.NOT_LOADED);
const sandboxInfo = ref<{ modified: PropertyKey[]; added: PropertyKey[] }>({
  modified: [],
  added: [],
});
const activeTab = ref<'single-spa' | 'qiankun' | 'sandbox' | 'loader'>('single-spa' as const);

const apps = [
  { name: 'counter', label: '计数器', path: '#/counter', entry: counterApp },
  { name: 'todo', label: '待办事项', path: '#/todo', entry: todoApp },
  { name: 'chart', label: '图表', path: '#/chart', entry: chartApp },
];

let statusInterval: number;

onMounted(() => {
  qiankun.registerMicroApps(
    apps.map((app) => ({
      name: app.name,
      entry: app.entry,
      container: '#micro-app-container',
      activeRule: app.path,
    })),
  );

  qiankun.start();

  window.addEventListener('hashchange', updateStatus);
  window.addEventListener('popstate', updateStatus);

  statusInterval = window.setInterval(updateStatus, 100);

  updateStatus();
});

onUnmounted(() => {
  window.removeEventListener('hashchange', updateStatus);
  window.removeEventListener('popstate', updateStatus);
  if (statusInterval) {
    clearInterval(statusInterval);
  }
});

function navigateTo(path: string) {
  window.location.hash = path;
  currentPath.value = path;
}

function updateStatus() {
  currentPath.value = window.location.hash || '#/counter';

  const currentAppName = apps.find((app) => currentPath.value.startsWith(app.path))?.name;

  if (currentAppName) {
    const app = qiankun.getApp(currentAppName);
    if (app) {
      currentStatus.value = app.status;
      if (app.sandbox) {
        sandboxInfo.value = app.sandbox.getModifications();
      }
    }
  }
}

const currentAppName = computed(() => {
  return apps.find((app) => currentPath.value.startsWith(app.path))?.name || '';
});

const codes = {
  'single-spa': singleSpaSource,
  qiankun: qiankunSource,
  sandbox: sandboxSource,
  loader: loaderSource,
};

const currentCode = computed(() => codes[activeTab.value]);
</script>

<template>
  <div class="qiankun-demo">
    <div class="demo-header">
      <h1 class="demo-title">Mini Qiankun 微前端演示</h1>
      <p class="demo-subtitle">基于 Single-SPA 的路由驱动微前端框架</p>
    </div>

    <div class="demo-layout">
      <div class="code-panel">
        <div class="panel-header">
          <h3>核心实现代码</h3>
          <div class="code-tabs">
            <button
              v-for="tab in ['single-spa', 'qiankun', 'sandbox', 'loader'] as const"
              :key="tab"
              :class="['tab-btn', { active: activeTab === tab }]"
              @click="activeTab = tab"
            >
              {{
                tab === 'single-spa'
                  ? 'Single-SPA'
                  : tab === 'qiankun'
                    ? 'Qiankun'
                    : tab === 'sandbox'
                      ? 'Sandbox'
                      : 'Loader'
              }}
            </button>
          </div>
        </div>
        <pre class="code-content"><code>{{ currentCode }}</code></pre>
      </div>

      <div class="demo-panel">
        <div class="panel-header">
          <h3>运行效果</h3>
        </div>

        <div class="route-info">
          <div class="info-item">
            <span class="info-label">当前路由:</span>
            <code class="info-value">{{ currentPath }}</code>
          </div>
          <div class="info-item">
            <span class="info-label">路由驱动:</span>
            <span class="info-value">Single-SPA 监听路由变化自动切换应用</span>
          </div>
        </div>

        <div class="app-controls">
          <button
            v-for="app in apps"
            :key="app.name"
            :class="['app-btn', { active: currentPath.startsWith(app.path) }]"
            @click="navigateTo(app.path)"
          >
            {{ app.label }}
          </button>
        </div>

        <div class="status-panel">
          <div class="status-item">
            <span class="status-label">当前应用:</span>
            <span class="status-value">{{ currentAppName || '无' }}</span>
          </div>
          <div class="status-item">
            <span class="status-label">生命周期:</span>
            <span class="status-value status-badge">{{ currentStatus }}</span>
          </div>
          <div class="status-item">
            <span class="status-label">沙箱状态:</span>
            <span class="status-value">
              修改 {{ sandboxInfo.modified.length }} 个, 新增 {{ sandboxInfo.added.length }} 个
            </span>
          </div>
        </div>

        <div id="micro-app-container" class="app-container"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.qiankun-demo {
  min-height: 100vh;
  background: #f8fafc;
}

.demo-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 2rem;
  text-align: center;
}

.demo-title {
  font-size: 2rem;
  font-weight: bold;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.demo-subtitle {
  color: #64748b;
  margin: 0;
}

.demo-layout {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 1.5rem;
  padding: 1.5rem;
  max-width: 1800px;
  margin: 0 auto;
}

.code-panel,
.demo-panel {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
}

.code-tabs {
  display: flex;
  gap: 0.5rem;
}

.tab-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  color: #64748b;
  transition: all 0.2s;
}

.tab-btn:hover {
  background: #f8fafc;
  color: #1e293b;
}

.tab-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.code-content {
  flex: 1;
  margin: 0;
  padding: 1.5rem;
  overflow: auto;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  background: #1e293b;
  color: #e2e8f0;
}

.route-info {
  padding: 1.5rem;
  background: #eff6ff;
  border-bottom: 1px solid #bfdbfe;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
}

.info-label {
  font-weight: 600;
  color: #1e40af;
  min-width: 80px;
}

.info-value {
  color: #1e293b;
  background: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.8125rem;
}

.app-controls {
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.app-btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: #64748b;
  transition: all 0.2s;
}

.app-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.app-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.status-panel {
  padding: 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
}

.status-label {
  font-weight: 600;
  color: #64748b;
  min-width: 80px;
}

.status-value {
  color: #1e293b;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  background: #10b981;
  color: white;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.app-container {
  flex: 1;
  overflow: auto;
  min-height: 400px;
}

@media (max-width: 1200px) {
  .demo-layout {
    grid-template-columns: 1fr;
  }

  .code-panel {
    max-height: 500px;
  }
}
</style>
