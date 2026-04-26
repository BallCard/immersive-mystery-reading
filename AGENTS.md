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

## 防剧透机制

侦探工具（证据板、嫌疑人档案、人物关系图）的内容与剧情进度绑定，确保玩家不会在还未阅读相关剧情的情况下就看到剧透内容。

### 实现方式

1. **数据层**：`types.ts` 中的 `Evidence`、`Suspect`、`CharacterRelation` 接口新增 `unlockedAtSceneId` 字段
2. **解锁检查**：组件接收 `visitedSceneIds` 和 `currentSceneId` props，通过 `isEvidenceUnlocked`/`isSuspectUnlocked`/`isRelationUnlocked` 函数检查是否已解锁
3. **渐进展示**：只有当玩家访问过指定的解锁场景后，对应的内容才会显示

### 解锁规则

| 内容类型 | 解锁场景 | 说明 |
|---------|---------|------|
| 石神档案 | start | 第一幕开始就出现 |
| 靖子档案 | bentou_shop | 在弁天亭正式介绍后解锁 |
| 石神暗恋靖子（关系） | bentou_shop | 了解靖子后才知道 |
| 靖子前夫身份 | identify_body | 确认死者身份后揭示 |
| 美里档案 | investigation_progress | 审问中提到女儿后解锁 |
| 富㭴档案 | identify_body | 确认死者身份后揭示 |
| 汤川档案 | yukawa_intro | 物理学家登场后解锁 |
| 汤川石神同学关系 | yukawa_intro | 介绍汤川后解锁 |
| 草薙档案 | investigation_start | 刑警介入调查后解锁 |
| 石神处理尸体（关系） | ishigami_action | 第一幕后暗夜行动后解锁 |
| 汤川识破真相（关系） | yukawa_confront | 第三幕摊牌后解锁 |

### 相关文件

- `src/types.ts`：定义解锁字段接口
- `src/constants.ts`：定义各内容的解锁场景
- `src/components/EvidenceBoard.tsx`：证据板解锁检查
- `src/components/SuspectDossier.tsx`：嫌疑人档案解锁检查
- `src/components/RelationshipMap.tsx`：人物关系解锁检查
- `src/App.tsx`：传递解锁相关 props
