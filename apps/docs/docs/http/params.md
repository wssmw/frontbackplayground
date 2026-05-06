# 参数传递

## 常见参数位置

| 类型 | 示例 | 适用场景 |
| --- | --- | --- |
| Query | `/users?page=1` | 分页、搜索、筛选 |
| Path | `/users/1` | 资源 ID |
| Body | `{ "name": "Tom" }` | 新增、编辑、复杂表单 |
| Headers | `Authorization: Bearer token` | 鉴权、客户端信息 |

## 项目示例

- `GET /api/basic/echo`
- `GET /api/basic/echo/:id`
- `POST /api/basic/echo`
