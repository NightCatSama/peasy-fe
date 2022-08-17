## 克隆后端 submodule

```
git submodule update --init --recursive
```

## 启动 mysql

```
mysql.server start
```

## 修改后端 mysql 配置

```
vi ./peasy-be/.env
```

## 启动 Logto

按教程安装 Logto

下载 Postgresql

将 logto/.env 放置到 logto 目录，再 npm start 启动

访问 logto 服务的 jwk 的公钥集接口

http://localhost:3002/oidc/jwks

复制到 peasy-be/config/jwk.ts 中

### pm2 启动 Logto

pm2 start npm --name "logto" -- start