# 文件上传

## 场景说明

文件上传通常使用 `multipart/form-data`。前端通过 `FormData` 组装文件，后端通过文件上传中间件解析。

## 前端关键点

```ts
const formData = new FormData();
formData.append('file', file);
await http.post('/upload/single', formData);
```

## 后端接口

```http
POST /api/upload/single
Content-Type: multipart/form-data
```

## 响应示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "originalname": "demo.png",
    "mimetype": "image/png",
    "size": 1024
  },
  "timestamp": "2026-05-06T00:00:00.000Z"
}
```

## 后续扩展

- 文件类型限制
- 文件大小限制
- 多文件上传
- 上传进度
- 大文件分片上传
