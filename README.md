# 项目介绍
> 无代码页面生成平台
<img width="3444" height="1744" alt="image" src="https://github.com/user-attachments/assets/d7ffeac5-ac8c-4489-9578-1bdeacce183d" />

## Feature
- 无代码页面配置，支持常用样式配置
- 支持组件化/模块化复用
- 支持多页面编辑
- 支持导出 html 页面
- 支持直接访问

<img width="3448" height="1734" alt="image" src="https://github.com/user-attachments/assets/da91bf0a-24ab-4d5c-92d0-2804507ca728" />

编辑保存可直接访问: [https://p.hzfe.org/66929co70j04](https://p.hzfe.org/66929co70j04)

# 启动项目

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

3. 启动后端

```base
cd peasy-be && npm run pm2
```
