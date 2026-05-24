<!-- @format -->

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue';
import { wujie, AppStatus } from './wujie';
import { counterApp, todoApp, chartApp } from './micro-apps';

import wujieSource from './wujie.ts?raw';

const currentAppName = ref('');
const currentStatus = ref<AppStatus>(AppStatus.NOT_LOADED);
const activeTab = ref<'wujie' | 'iframe' | 'shadow-dom'>('wujie' as const);

const apps = [
  { name: 'counter', label: '计数器', entry: counterApp },
  { name: 'todo', label: '待办事项', entry: todoApp },
  { name: 'chart', label: '图表', entry: chartApp },
];

onMounted(() => {
  loadApp('counter');
});

onUnmounted(() => {
  apps.forEach((app) => {
    wujie.destroyApp(app.name);
  });
});

async function loadApp(appName: string) {
  if (currentAppName.value) {
    await wujie.destroyApp(currentAppName.value);
  }

  const app = apps.find((a) => a.name === appName);
  if (!app) return;

  currentAppName.value = appName;
  currentStatus.value = AppStatus.LOADING;

  await wujie.startApp({
    name: app.name,
    url: app.entry,
    el: '#wujie-container',
  });

  updateStatus();
}

function updateStatus() {
  if (currentAppName.value) {
    const app = wujie.getApp(currentAppName.value);
    if (app) {
      currentStatus.value = app.status;
    }
  }
}

const codes = {
  wujie: wujieSource,
  iframe: `// iframe 沙箱隔离
// Wujie 使用 iframe 作为 JS 沙箱

const iframe = document.createElement('iframe');
iframe.style.display = 'none';
document.body.appendChild(iframe);

// iframe 有独立的 window 对象
const iframeWindow = iframe.contentWindow;
const iframeDocument = iframe.contentDocument;

// 在 iframe 中执行子应用代码
iframeDocument.open();
iframeDocument.write(appHTML);
iframeDocument.close();

// iframe 的优势:
// 1. 天然的 JS 隔离
// 2. 浏览器原生支持
// 3. 不需要 Proxy 劫持

// iframe 的劣势:
// 1. 通信复杂 (postMessage)
// 2. 路由同步困难
// 3. 弹窗、模态框位置问题`,
  'shadow-dom': `// Shadow DOM 样式隔离
// Wujie 使用 Web Components 实现样式隔离

const shadowHost = document.createElement('div');
container.appendChild(shadowHost);

// 创建 Shadow DOM
const shadowRoot = shadowHost.attachShadow({ 
  mode: 'open' 
});

// 将 iframe 中的内容渲染到 Shadow DOM
shadowRoot.innerHTML = iframeBody.innerHTML;

// 复制样式到 Shadow DOM
const styles = iframeDocument.querySelectorAll('style');
styles.forEach(style => {
  shadowRoot.appendChild(style.cloneNode(true));
});

// Shadow DOM 的优势:
// 1. 完全的样式隔离
// 2. 不会污染全局样式
// 3. 浏览器原生支持

// Shadow DOM 的劣势:
// 1. 某些全局样式无法继承
// 2. 第三方组件库可能不兼容`,
};

const currentCode = ref(codes[activeTab.value]);

function onTabChange(tab: 'wujie' | 'iframe' | 'shadow-dom') {
  activeTab.value = tab;
  currentCode.value = codes[tab];
}
</script>

<template>
  <div class="wujie-demo">
    <div class="demo-header">
      <h1 class="demo-title">Mini Wujie 微前端演示</h1>
      <p class="demo-subtitle">基于 iframe + Web Components 的微前端方案</p>
    </div>

    <div class="demo-layout">
      <div class="code-panel">
        <div class="panel-header">
          <h3>核心实现代码</h3>
          <div class="code-tabs">
            <button
              v-for="tab in (['wujie', 'iframe', 'shadow-dom'] as const)"
              :key="tab"
              :class="['tab-btn', { active: activeTab === tab }]"
              @click="onTabChange(tab)"
            >
              {{
                tab === 'wujie'
                  ? 'Wujie'
                  : tab === 'iframe'
                    ? 'iframe 沙箱'
                    : 'Shadow DOM'
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

        <div class="tech-info">
          <div class="info-item">
            <span class="info-label">沙箱方案:</span>
            <span class="info-value">iframe (天然隔离)</span>
          </div>
          <div class="info-item">
            <span class="info-label">样式隔离:</span>
            <span class="info-value">Shadow DOM (Web Components)</span>
          </div>
          <div class="info-item">
            <span class="info-label">特点:</span>
            <span class="info-value">无需 Proxy 劫持，浏览器原生支持</span>
          </div>
        </div>

        <div class="app-controls">
          <button
            v-for="app in apps"
            :key="app.name"
            :class="['app-btn', { active: currentAppName === app.name }]"
            @click="loadApp(app.name)"
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
            <span class="status-label">隔离方式:</span>
            <span class="status-value">iframe + Shadow DOM</span>
          </div>
        </div>

        <div id="wujie-container" class="app-container"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wujie-demo {
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
  background: #8b5cf6;
  color: white;
  border-color: #8b5cf6;
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

.tech-info {
  padding: 1.5rem;
  background: #f0fdf4;
  border-bottom: 1px solid #bbf7d0;
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
  color: #15803d;
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
  border-color: #8b5cf6;
  color: #8b5cf6;
}

.app-btn.active {
  background: #8b5cf6;
  color: white;
  border-color: #8b5cf6;
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
