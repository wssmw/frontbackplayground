# 项目结构

```text
FrontBackPlayground/
├── apps/
│   ├── frontend/   # Vue 3 + Element Plus + Tailwind 前端
│   ├── backend/    # NestJS 后端
│   └── docs/       # VitePress 文档
├── packages/
│   └── shared/     # 前后端共享类型
├── examples/
├── docker/
├── package.json
└── pnpm-workspace.yaml
```

## 设计原则

- 一个交互场景对应一个前端页面、一个后端模块、一篇文档。
- 优先使用统一类型，减少前后端约定漂移。
- 第一阶段先用内存数据，降低学习成本。
