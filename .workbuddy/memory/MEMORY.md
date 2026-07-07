# 医院建筑 AI 提示词生成器 — 项目长期记忆

## 仓库结构
- 根仓库: `feature/prompt-sentence-engine` 分支 = 源码 (app.js, data.js, prompt-engine.js, analysis-data.js, index.html, style.css, test/, gen_data.py)
- `dist/` 是嵌套 git 仓库；**GitHub Pages 实际发布分支是 `gh-pages`（不是 master！）**。master 只是源码工作分支，推送 master 不会更新线上站点；`origin/gh-pages` 上有 "触发 Pages 重建" 提交可佐证发布分支为 gh-pages。
- 部署流程: 改源码 → 同步 6 文件到 dist/ (`cp app.js data.js prompt-engine.js style.css index.html analysis-data.js dist/`) → 在 dist/ 内 `git add -A && commit && git push origin master` → 再把新内容推到发布分支：`git checkout -B gh-pages origin/gh-pages && git merge --ff-only master && git push origin gh-pages && git checkout master`（gh-pages 是 master 的祖先，ff 合并安全，两分支最终指向同一 commit）→ 根仓库 `git add <源码> dist && commit && git push origin feature/prompt-sentence-engine`
- CloudStudio: 用 `workbuddy_cloudstudio_deploy` 工具直接部署 `dist/` 目录 (自动生成分享链接，实时预览)

## 数据模型
- 三级结构: module(id, title, desc, categories[]) → category(role, title, items[]) → item(label, en, cn, extra, effect)
- 选择键统一: `moduleId::catIdx::itemIdx` (效果图与分析图共用)
- 效果图 data.js 13 模块 (id "1"-"13")；分析图 analysis-data.js 8 模块 (id "1"-"8")
- role 分类 (RENDER_ROLE_ORDER): constraint_light/medium/high, subject, material, style, color, light, weather, view, context, mood, landscape, quality

## 关键文件职责
- `prompt-engine.js`: PromptEngine IIFE — buildSentence/CN, buildKeywordPhrase, buildAnalysisSentence/CN, groupByRole 等
- `app.js`: 向导渲染 (renderWizard 是唯一活路径)、选择状态 (state.selected Map)、prompt 生成 (updatePrompt)、AI 图片解析 (matchKeywordsToVocabulary/renderAnalysisResults/applyMatchedTags)
- `data.js` / `analysis-data.js`: 数据源 (data.js 由 gen_data.py 从 Excel 生成)
- `gen_data.py`: 解析 RP.xlsx → data.js 的脚本 (Excel 维度号 0-12 → 模块 id "1"-"13")

## 测试方法
- `node --test test/` (test/data.test.js, test/prompt-engine.test.js) — 当前 22/22 通过
- `node --check app.js|prompt-engine.js|data.js` 语法检查
- 环境无 jsdom → 无法 DOM 级 headless 测试，靠语法检查 + engine smoke test + grep dangling ref 验证

## 约定与坑
- index.html 用普通 `<script src>` (非 module) → 兼容 HTTP 与 file://
- wizard 步骤点/标签徽章颜色统一用 --accent (非 --cat-color) → 新增模块无需改 CSS 颜色
- 数据 id 为字符串 ("1"-"13")，匹配 AI 图片解析 JSON 维度键
- 根仓库排除二进制产物: test.jpg、结构导图V1.1.zip 等不入库
- 改文案/数据后必须同步 dist/，且**推送 `gh-pages` 分支**才会真正上线 GitHub Pages（仅推 master 无效）；保持 master 与 gh-pages 指向同一 commit
