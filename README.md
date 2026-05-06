# FrontBackPlayground

前后端分离交互学习实验室，用于学习 HTTP 请求、参数传递、统一响应、登录鉴权、文件上传下载、错误处理、实时通信和接口文档沉淀。

## 技术栈

- 前端：Vue 3 + Vite + TypeScript + Element Plus + Tailwind CSS + Pinia + Axios
- 后端：NestJS + TypeScript
- 文档：VitePress
- 工作区：pnpm workspace

## 启动

```bash
pnpm install
pnpm dev:backend
pnpm dev:frontend
pnpm dev:docs
```

默认地址：

- 前端：http://localhost:5173
- 后端：http://localhost:3000/api
- 文档：http://localhost:5174

## 目录

```text
apps/frontend   前端交互实验台
apps/backend    后端接口服务
apps/docs       文档站点
packages/shared 前后端共享类型
```
