## 项目概述
嫌疑人X探索者 (Suspect X Explorer) - 基于东野圭吾《嫌疑人X的献身》改编的交互式侦探体验。三幕共44个场景，支持分支选择、证据板、嫌疑人档案、时间线、关系图等侦探工具。

## 技术栈
- React 19 + TypeScript
- Vite 6
- Tailwind CSS 4
- Framer Motion (motion)
- Google Gemini AI (用于场景配图生成)
- Express (依赖预留，当前未使用)

## 目录结构
```
/workspace/projects/
├── index.html           # HTML 入口
├── src/                 # React 源码
│   ├── main.tsx
│   ├── App.tsx
│   └── ...
├── public/              # 静态资源
├── scripts/             # Coze 平台脚本
│   ├── build.sh         # 部署构建脚本
│   ├── run.sh           # 部署运行脚本
│   ├── coze-preview-build.sh  # 预览构建
│   └── coze-preview-run.sh     # 预览运行
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 关键入口 / 核心模块
- 入口：`src/main.tsx` + `index.html`
- 开发命令：`pnpm dev`（端口 3000）
- 构建命令：`pnpm build`（产物输出到 `dist/`）

## 运行与预览

### 本地开发
```bash
pnpm install
pnpm dev
# 浏览器打开 http://localhost:3000
```

### Coze 平台预览
```bash
# 安装依赖 + 启动预览（端口 5000）
bash scripts/coze-preview-build.sh
bash scripts/coze-preview-run.sh
```

### Coze 平台部署
```bash
# 构建前端产物
bash scripts/build.sh

# 运行服务（端口 5000）
bash scripts/run.sh
```

## 用户偏好与长期约束
- **包管理器**：仅支持 `pnpm`，禁止使用 `npm` 或 `yarn`
- **端口约束**：预览/部署服务必须使用 `5000` 端口，9000 端口为系统保留
- **前端即服务**：当前平台不支持纯静态站点部署，Vite 前端项目按 service 方式部署

## 常见问题和预防
1. **依赖安装**：每次运行前确保 `pnpm install` 已完成
2. **端口冲突**：预览/运行时先清理 5000 端口残留进程
3. **环境变量**：`.env.example` 包含 `GEMINI_API_KEY` 示例，需要在部署时配置
