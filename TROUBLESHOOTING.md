# 部署故障排查指南

## 问题：部署后只有原生 HTML，Vue 组件未渲染

### 快速诊断步骤

#### 1. 检查浏览器控制台

打开你的 GitHub Pages 网站，按 F12 打开开发者工具：

**检查 Console（控制台）标签：**
- 是否有红色错误信息？
- 特别注意 404 错误（文件未找到）
- 检查是否有 CORS 错误

**检查 Network（网络）标签：**
- 刷新页面，查看所有资源加载情况
- 重点关注 `.js` 和 `.css` 文件是否加载成功
- 查看 `index-D7MwsDHY.js` 的状态码是否为 200

#### 2. 验证 base 路径配置

确认 [vite.config.js](vite.config.js#L17) 中的 `base` 配置正确：

```javascript
base: '/your-repo-name/' // 必须与仓库名完全一致
```

**注意：**
- 路径必须以 `/` 开头和结尾
- 路径必须与你的 GitHub 仓库名完全一致
- 例如：仓库是 `username/interestBar-frontend`，则 base 应为 `/interestBar-frontend/`

#### 3. 检查 GitHub Actions 构建日志

1. 进入 GitHub 仓库
2. 点击 **Actions** 标签
3. 选择最新的工作流运行
4. 展开 **Build** 任务
5. 查看 **Check build output** 步骤的输出
6. 确认 `dist/index.html` 中的资源路径是否正确

#### 4. 手动测试本地构建

在项目根目录运行：

```bash
# 清理旧的构建
rm -rf dist

# 重新构建
npm run build

# 检查构建产物
cat dist/index.html

# 本地预览
npm run preview
```

访问 `http://localhost:4173/interestBar-frontend/` 查看是否正常。

### 常见问题和解决方案

#### 问题 1：资源 404 错误

**症状：** 控制台显示 `.js` 或 `.css` 文件 404

**解决方案：**
1. 检查 `vite.config.js` 中的 `base` 配置
2. 确保 base 路径与仓库名完全匹配
3. 重新构建并部署

```bash
npm run build
git add .
git commit -m "Fix base path"
git push
```

#### 问题 2：GitHub Pages 设置不正确

**症状：** 页面显示 404 或默认主题

**解决方案：**
1. 进入仓库 **Settings** > **Pages**
2. **Source** 必须选择 **GitHub Actions**（不是 Deploy from a branch）
3. 等待几分钟让设置生效

#### 问题 3：路由刷新 404

**症状：** 首页正常，刷新或直接访问子路由显示 404

**解决方案：**
这是 SPA 应用的正常现象。你可以：

1. **使用 Hash 模式**（推荐）：
   修改 [src/router/index.js](src/router/index.js#L5)：

   ```javascript
   import { createWebHashHistory } from 'vue-router'

   const router = createRouter({
     history: createWebHashHistory(), // 改为 hash 模式
     // ...
   })
   ```

2. **添加 404 重定向页面**：
   在仓库根目录添加 `404.html`，内容与 `index.html` 相同

#### 问题 4：缓存问题

**症状：** 修改代码后重新部署，但网站没有更新

**解决方案：**
1. 硬刷新浏览器：Ctrl + Shift + R (Windows) 或 Cmd + Shift + R (Mac)
2. 清除浏览器缓存
3. 使用隐私/无痕模式测试

### 验证清单

部署前检查：

- [ ] `vite.config.js` 中的 `base` 路径正确
- [ ] 本地 `npm run build` 成功
- [ ] 本地 `npm run preview` 正常显示
- [ ] GitHub Pages 设置为 GitHub Actions
- [ ] 推送代码到正确的分支（main 或 master）

部署后验证：

- [ ] GitHub Actions 工作流成功完成（绿色✓）
- [ ] 访问网站 URL 没有 404
- [ ] 浏览器控制台没有错误
- [ ] Network 标签显示所有资源加载成功
- [ ] Vue 组件正常渲染

### 获取帮助

如果以上步骤都无法解决问题：

1. 查看 GitHub Actions 构建日志
2. 检查浏览器控制台的完整错误信息
3. 在本地测试构建是否正常
4. 尝试使用 Hash 模式路由

### 调试技巧

在浏览器中查看构建后的 HTML 源代码（右键 > 查看网页源代码），确认：

```html
<script type="module" crossorigin src="/interestBar-frontend/assets/index-xxxxx.js"></script>
<link rel="stylesheet" crossorigin href="/interestBar-frontend/assets/index-xxxxx.css">
```

路径中的 `/interestBar-frontend/` 必须与你的仓库名一致。
