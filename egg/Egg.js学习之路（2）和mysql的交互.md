#### 1.连接mysql

安装mysql2,egg-mysql

```
npm i mysql2 egg-mysql
```

在plugin.js中打开egg-mysql插件

```
//配置mysql内容
exports.mysql = {
  enable: true, // 开启
  package: "egg-mysql", // 对应哪个包
};
```

在config.default.js配置连接mysql的参数(具体参见官方文档)，以下配置够用即可

```js
  config.mysql = {
    client: {
      // host
      host: "xxxxxxIP地址（本地127.0.0.1）",
      // 端口号
      port: "3306",
      // 用户名
      user: "root",
      // 密码
      password: "123456",
      // 数据库名
      database: "database1",
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };
```

这个时候this.app.mysql就能链接到mysql的对象了

#### 2.使用egg操作mysql的方法

create

```
// 插入
const result = await this.app.mysql.insert('posts', { title: 'Hello World' }); // 在 post 表中，插入 title 为 Hello World 的记录

=> INSERT INTO `posts`(`title`) VALUES('Hello World');
```

read

```
const post = await this.app.mysql.get('posts', { id: 12 });
=> SELECT * FROM `posts` WHERE `id` = 12 LIMIT 0, 1;

const results = await this.app.mysql.select('posts');
=> SELECT * FROM `posts`;

const results = await this.app.mysql.select('posts', { // 搜索 post 表
  where: { status: 'draft', author: ['author1', 'author2'] }, // WHERE 条件
  columns: ['author', 'title'], // 要查询的表字段
  orders: [['created_at','desc'], ['id','desc']], // 排序方式
  limit: 10, // 返回数据量
  offset: 0, // 数据偏移量
});
=> SELECT `author`, `title` FROM `posts`
  WHERE `status` = 'draft' AND `author` IN('author1','author2')
  ORDER BY `created_at` DESC, `id` DESC LIMIT 0, 10;
```

update

```
// 修改数据，将会根据主键 ID 查找，并更新
const row = {
  id: 123,
  name: 'fengmk2',
  otherField: 'other field value',    // any other fields u want to update
  modifiedAt: this.app.mysql.literals.now, // `now()` on db server
};
const result = await this.app.mysql.update('posts', row); // 更新 posts 表中的记录

=> UPDATE `posts` SET `name` = 'fengmk2', `modifiedAt` = NOW() WHERE id = 123 ;

// 判断更新成功
const updateSuccess = result.affectedRows === 1;

// 如果主键是自定义的 ID 名称，如 custom_id，则需要在 `where` 里面配置
const row = {
  name: 'fengmk2',
  otherField: 'other field value',    // any other fields u want to update
  modifiedAt: this.app.mysql.literals.now, // `now()` on db server
};

const options = {
  where: {
    custom_id: 456
  }
};
const result = await this.app.mysql.update('posts', row, options); // 更新 posts 表中的记录

=> UPDATE `posts` SET `name` = 'fengmk2', `modifiedAt` = NOW() WHERE custom_id = 456 ;
```

delete

```
const result = await this.app.mysql.delete('posts', {
  author: 'fengmk2',
});

=> DELETE FROM `posts` WHERE `author` = 'fengmk2';
```

#### 3.直接执行sql语句(容易sql注入，正规项目不建议)

```
const postId = 1;
const results = await this.app.mysql.query('update posts set hits = (hits + ?) where id = ?', [1, postId]);

=> update posts set hits = (hits + 1) where id = 1;
```

#### 4.事务处理

用于同时修改多张表，比如支付数据我可能要把购物车的商品表清除，支付数据表增加，但是支付失败后，要还原清除的购物车商品表，所以必须使用事务

手动控制

```js
const conn = await app.mysql.beginTransaction(); // 初始化事务

try {
  await conn.insert(table, row1);  // 第一步操作
  await conn.update(table, row2);  // 第二步操作
  await conn.commit(); // 提交事务
} catch (err) {
  // error, rollback
  await conn.rollback(); // 一定记得捕获异常后回滚事务！！
  throw err;
}
```

自动控制（推荐）

```js
const result = await app.mysql.beginTransactionScope(async conn => {
  // don't commit or rollback by yourself
  await conn.insert(table, row1);
  await conn.update(table, row2);
  return { success: true };
}, ctx); // ctx 是当前请求的上下文，如果是在 service 文件中，可以从 `this.ctx` 获取到
// if error throw on scope, will auto rollback
```

源码就没有演示这么多了，挺简单一步一步来