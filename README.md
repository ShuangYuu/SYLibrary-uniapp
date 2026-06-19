# 数字图书元数据采集系统 - uniapp 客户端

本项目是“数字图书元数据采集系统”的 uniapp 客户端，面向读者使用，提供首页馆藏浏览、图书搜索、图书详情、读者登录、个人中心和收藏管理等功能。

## 技术栈

- uni-app
- Vue 3 `<script setup>`
- HBuilderX
- uni-ui / uni_modules
- uni.request
- 本地 Token 存储与自动刷新

## 功能模块

- 首页：轮播图、快捷入口、最近上架、热门借阅。
- 搜索：探索馆藏，按关键词查找图书。
- 图书详情：展示封面、作者、出版社、标签、简介，并支持收藏/取消收藏。
- 读者登录：手机号和密码登录，保存访问令牌与刷新令牌。
- 我的收藏：查看当前读者收藏的图书。
- 个人中心：查看读者信息，进入账户设置、收藏等页面。
- 账户设置：用户资料与头像等账户相关操作。
- 请求封装：统一后端地址、自动携带 JWT、401 时刷新 Token 并重试请求。

## 目录结构

```text
SYLibrary-uniapp/
├─ pages/
│  ├─ index/          # 首页
│  ├─ search/         # 搜索页
│  ├─ book/           # 图书详情
│  └─ user/           # 登录、个人中心、设置、收藏
├─ static/            # 图标和静态资源
├─ uni_modules/       # uni-ui 组件模块
├─ utils/
│  ├─ config.js       # API 环境和后端地址
│  ├─ request.js      # 请求封装、Token 刷新
│  └─ authMixin.js    # 鉴权相关混入
├─ App.vue
├─ main.js
├─ manifest.json
├─ pages.json
├─ uni.scss
└─ README.md
```

## 页面路由

页面配置位于 `pages.json`。

主要页面：

- `pages/index/index`：首页
- `pages/search/search`：搜索馆藏
- `pages/book/show`：书籍详情
- `pages/user/login`：读者登录
- `pages/user/user`：个人中心
- `pages/user/settings`：账户设置
- `pages/user/favorites`：我的收藏

底部 TabBar：

- 首页
- 搜索
- 收藏
- 我的

## 后端接口配置

接口环境配置位于：

```text
utils/config.js
```

当前配置：

```js
const API_ENV = 'prod';

const API_BASE_URLS = {
    dev: 'http://localhost:8080',
    prod: 'https://api.shuangyuhub.com',
};
```

开发时如需连接本地后端，可将 `API_ENV` 改为 `dev`。

## 请求与鉴权

请求封装位于：

```text
utils/request.js
```

主要行为：

- 自动拼接后端基础地址。
- 自动从本地缓存读取 `accessToken` 并写入 `Authorization: Bearer <token>`。
- 未登录访问需要鉴权的接口时跳转到登录页。
- 接口返回 `401` 时调用 `/user/refresh` 刷新 Token，并重试原请求。
- 刷新失败时清理本地 Token 并重新进入登录页。

## 依赖接口

客户端主要依赖后端接口：

- `GET /book/home`：首页图书数据
- `GET /book/page`：搜索/分页查询图书
- `POST /user/login/password`：读者登录
- `POST /user/refresh`：刷新 Token
- `GET /user/info`：当前读者信息
- `POST /user/avatar`：上传头像
- `GET /user/favorites`：我的收藏列表
- `GET /user/favorites/{bookId}`：查询收藏状态
- `POST /user/favorites/{bookId}`：添加收藏
- `DELETE /user/favorites/{bookId}`：取消收藏

## 运行方式

推荐使用 HBuilderX 打开项目目录：

```text
D:\1JAVA\HBuilderX.4.76.2025082103\HBuilderProjects\SYLibrary-uniapp
```

常用运行方式：

- 运行到浏览器：用于 H5 调试。
- 运行到手机或模拟器：用于 App 调试。
- 发行到 H5 / App：生成对应平台产物。

项目中已有 `h5-dist.zip`，应视为历史构建产物；日常开发以源码和 HBuilderX 重新构建为准。

## 开发注意事项

- 修改后端地址前先确认 `utils/config.js` 中的 `API_ENV`。
- 需要登录的接口建议统一走 `utils/request.js`，避免遗漏 Token 刷新逻辑。
- 图书详情页通过 URL 参数传递图书对象，跳转前需确保对象可序列化。
- 收藏功能依赖用户登录状态，没有 Token 时会跳转到登录页。
- 新增页面后需要同步维护 `pages.json` 和必要的 TabBar 配置。
- `uni_modules/` 中是组件依赖，通常不要手动大范围改动。

