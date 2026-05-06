# GET 和 POST

## 场景说明

GET 常用于查询，POST 常用于提交数据。这个项目通过 `/basic/echo` 接口回显请求内容，帮助观察前端传参和后端接收结果。

## GET 示例

```http
GET /api/basic/echo?keyword=front-back&page=1
```

## POST 示例

```http
POST /api/basic/echo
Content-Type: application/json

{
  "title": "前后端交互",
  "tags": ["Vue", "NestJS"]
}
```

## 关键知识点

- GET 参数通常放在 URL Query 中。
- POST JSON 数据放在 Request Body 中。
- Axios 默认会把对象序列化为 JSON。
