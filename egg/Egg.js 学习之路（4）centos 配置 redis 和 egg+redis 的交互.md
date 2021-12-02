### centos安装redis

1、安装redis

`yum -y install redis`

2、启动和添加启动项

```
 systemctl start redis.service
 systemctl enable redis.service // 开机自启动
```

3、查看进程是否已经启动

 `ps -ef | grep redis`

 4、修改配置文件 

`/etc/redis.conf` 

5、注释掉这行，重启外网访问 `bind 127.0.0.1` 

6、这个时候egg连接还是有问题，因为无密码，无本地ip和外网ip映射，触发了protectmode保护模式。还要将配置文件的mode模式更改为yes 

7、重启服务 

`systemctl restart redis.service` 

8、**注意**服务器开放外网防火墙6379端口，不然会超时

9、redis支持设置密码

```
$vim /etc/redis/redis.conf
 
requirepass xxxxxxxxxx  // xxxxxxxxxx is your password
```

### Egg连接Redis

```js
npm install egg-redis --save

//plugin.js 打开插件
exports.redis = {
  enable: true,
  package: 'egg-redis',
};

//config.default.js 配置插件
  config.redis = {
    client: {
      port: 6379,          // Redis port
      host: '127.0.0.1',   // Redis host
      password: '',
      db: 0
    }
  }
```

配置多连接池

```js
config.redis = {
  clients: {
    foo: {                
      port: 6379,          // Redis port
      host: '127.0.0.1',   // Redis host
      password: 'auth',
      db: 0,
    },
    bar: {
      port: 6379,
      host: '127.0.0.1',
      password: 'auth',
      db: 1,
    },
  }
}
```



### Egg.js配合Redis的使用

简单使用

```js
// app/controller/home.js
 
module.exports = app => {
  return class HomeController extends app.Controller {
    async index() {
      const { ctx, app } = this;
      // set
      await app.redis.set('foo', 'bar');
      // get
      ctx.body = await app.redis.get('foo');
    }
  };
};
```

多redis连接池配置

```js
// app/controller/home.js
 
module.exports = app => {
  return class HomeController extends app.Controller {
    async index() {
      const { ctx, app } = this;
      // set
      await app.redis.get('instance1').set('foo', 'bar');
      // get
      ctx.body = await app.redis.get('instance1').get('foo');
    }
  };
};
```

