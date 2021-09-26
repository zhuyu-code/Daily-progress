## 1.Restful规范

1.1 接口规范

GET  /teams:列出所有团队

POST /teams:新建一个球队

GET /teams/ID:获取某个球队信息

PUT /teams/ID:更新某个球队信息

PATCH /teams/ID:更新某个球队部分信息

DELETE  /teams/ID:删除某个球队



1.2复杂结构

GET /teams/ID/persons 获取指定球队的全部人员



1.3 状态码规范

200  【GET】服务器正确返回数据

201 【POST/PUT/PATCH】新建，更新全部，更新部分成功

204 【DELETE】删除数据成功

401 无权限

403 校验过权限，权限被禁止

404 客户端请求无响应，服务端没有进行操作

