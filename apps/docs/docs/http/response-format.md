# 统一响应格式

## 当前格式

```json
{
  "code": 0,
  "message": "success",
  "data": {},
  "timestamp": "2026-05-06T00:00:00.000Z"
}
```

## 字段说明

- `code`：业务状态码。
- `message`：可读提示。
- `data`：实际响应数据。
- `timestamp`：服务端响应时间。

统一响应格式可以让前端拦截器、错误提示、类型约束更稳定。
