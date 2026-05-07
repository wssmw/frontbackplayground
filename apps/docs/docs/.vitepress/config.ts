import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'FrontBack Playground',
  description: '前后端交互学习文档',
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/introduction' },
      { text: 'HTTP', link: '/http/get-post' },
      { text: '鉴权', link: '/auth/login-flow' },
      { text: '上传', link: '/upload/upload-file' },
      { text: '实时通信', link: '/realtime/sse' },
    ],
    sidebar: [
      {
        text: '项目指南',
        items: [
          { text: '项目介绍', link: '/guide/introduction' },
          { text: '本地启动', link: '/guide/setup' },
          { text: '项目结构', link: '/guide/project-structure' },
        ],
      },
      {
        text: 'HTTP 交互',
        items: [
          { text: 'GET 和 POST', link: '/http/get-post' },
          { text: '参数传递', link: '/http/params' },
          { text: '统一响应格式', link: '/http/response-format' },
        ],
      },
      {
        text: '登录鉴权',
        items: [{ text: '登录流程', link: '/auth/login-flow' }],
      },
      {
        text: '文件处理',
        items: [{ text: '文件上传', link: '/upload/upload-file' }],
      },
      {
        text: '实时通信',
        items: [
          { text: 'WebSocket', link: '/realtime/websocket' },
          { text: 'Server-Sent Events', link: '/realtime/sse' },
        ],
      },
    ],
    socialLinks: [],
  },
});
