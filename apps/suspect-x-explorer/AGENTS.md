# 嫌疑人 X 探索者约定

- 本应用是三幕分支侦探体验；同仓阅读器分别维护，当前部署和完整验证见 [仓库 README](../../README.md)。
- 入口为 `src/main.tsx`、`src/App.tsx`；剧情和解锁配置在 `src/constants.ts`，类型在 `src/types.ts`。
- 仅用 pnpm；本地开发端口 3000，Coze 预览／服务脚本用 5000，不用 9000。先核对端口占用，不盲目终止他人进程。
- 预览脚本保持幂等，关键环境变量显式设置；Express 是预留依赖，不当作已运行后端。
- 证据板、嫌疑人档案与关系图须按 `unlockedAtSceneId` 和 `visitedSceneIds` 渐进解锁，未访问剧情不能提前剧透。
- 修改剧情后核对对应解锁场景、分支、时间线与返回导航；相关组件在 `src/components/`。
- 配图生成的 API 配置留环境变量，不把密钥放到浏览器或仓库；现有图像与文学素材复用须核对权利。
- 在应用目录运行 `pnpm run lint` 与 `pnpm run build`，共享行为变更从仓库根运行 `pnpm run verify`，预览剧情与工具解锁。
- Coze 的 service 限制是历史平台边界，当前独立 Vercel 部署按仓库 README 执行。
