# 登录流程

## 账号

第一版内置测试账号：

- 用户名：`admin`
- 密码：`123456`

## 流程

1. 前端提交用户名和密码到 `POST /api/auth/login`。
2. 后端校验账号密码。
3. 后端签发 JWT Token。
4. 前端把 Token 保存到 `localStorage`。
5. Axios 请求拦截器把 Token 放到 `Authorization` 请求头。
6. 请求受保护接口 `GET /api/auth/profile`。

## 请求头

```http
Authorization: Bearer <accessToken>
```

## 常见问题

- 没有 Token：后端返回 401。
- Token 错误或过期：后端返回 401。
- 前端需要在退出登录时清理本地 Token。
