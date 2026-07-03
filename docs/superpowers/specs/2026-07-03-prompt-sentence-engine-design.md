# 医院建筑 AI 提示词生成器 —— 语句化生成 + 维度扩充 设计文档

## 背景

当前网站（`index.html` / `app.js` / `data.js`）已实现"点选维度标签 → 拼接提示词"的基本流程，共 12 个维度、约 170 条词条，数据与原始 `医院建筑AI提示词.xlsx` 一一对应（已核实无遗漏）。

存在的问题：
1. `updatePrompt()` 仅将选中项的 `item.en` 按维度顺序用逗号拼接，输出是关键词堆砌，不是语法正确的完整句子。
2. 部分维度词条数偏少、专业度不足，缺少医院设计特有的场景词（无障碍、导视、洁污分区等）、布局体量维度、内部人工照明/饰面细节维度。
3. 用户会同时使用 Midjourney/Stable Diffusion（偏好关键词堆砌+参数）和即梦/GPT-4o出图/Sora 等语言模型类工具（偏好自然语言长句），需要网站能输出两种风格。

## 目标

1. 新增"语句生成引擎"：将选中的维度词条按语法角色拼接成一句语法正确的英文句子。
2. 保留并优化"关键词模式"：面向 MJ/SD，逗号分隔短语，顺序按主体→风格→材质→氛围→参数重新整理。
3. 新增输出格式切换开关（关键词模式 / 语句模式），与现有语言切换（English/中文/双语）并列，互相独立生效。
4. 扩充维度：新增维度13（布局/体量形式）、维度14（医院专项设计细节）、维度15（内部照明/饰面细节）。
5. 加深现有维度中条目偏少/专业度不足的部分（如维度1建筑主体、维度9氛围情绪）。

不做的事：不接入外部 AI API 做实时润色（用户已同意本地模板拼接方案），不改动现有维度的 ID/顺序/字段结构（只新增字段和新增维度，向后兼容）。

## 数据结构变更

每个维度对象新增一个 `role` 字段（维度级别），标识该维度在句子模板中的语法角色。每个维度内的条目结构不变（`label`/`en`/`cn`/`extra`/`effect`/`tool` 保留），不需要给每条单独加角色——角色由所属维度决定。

```js
{
  "id": 1,
  "title": "建筑主体类型 / 医疗功能模块",
  "role": "subject",   // 新增字段
  "items": [ ... ]      // 结构不变
}
```

角色枚举与对应维度：

| role | 维度 | 句子模板片段 |
|------|------|------|
| `view` | 7 视角/镜头 | 句首："A {view} render of" |
| `style` | 3 建筑风格 | 主体前置形容词："a {style} {subject}" |
| `subject` | 1 建筑主体类型 | 句子核心名词 |
| `layout` | 13 布局/体量（新） | "organized as a {layout} configuration" |
| `material` | 4 外立面材质 | "clad in {material}" |
| `color` | 5 色彩方案 | "in a {color} color palette" |
| `light` | 6 光线/时间 | "illuminated by {light}" |
| `interior` | 15 内部照明/饰面（新） | "with {interior}" |
| `context` | 8 环境/周边 | "set within a {context}" |
| `mood` | 9 氛围/情绪 | "evoking a {mood} atmosphere" |
| `detail` | 14 医院专项细节（新） | "with attention to {detail}" |
| `furniture` | 11 医疗家具/设备 | "furnished with {furniture}" |
| `landscape` | 12 自然元素/景观 | "surrounded by {landscape}" |
| `render_param` | 10 渲染参数 | 见下方特殊处理 |

维度2（空间类型）沿用 `subject` 角色的补充位——若同时选中维度1和维度2，维度2内容作为空间限定并列在主体后（"in the {space} of a {subject}"）。

## 句子生成引擎（语句模式）

新增函数 `buildSentence(dimGroups)`，位于 `app.js`。

算法：
1. 按角色分组已选条目（一个角色可能对应多个选中项，用 " and " 连接同角色内的多个词组）。
2. 按固定顺序（view → style+subject(+space) → layout → material → color → light → interior → context → mood → detail → furniture → landscape）依次拼接对应模板片段，跳过未选中的角色。
3. 若一个角色都没选，句子核心退化为 "An architectural render of a hospital"（避免空句子）。
4. 首字母大写，句尾补句号。
5. 渲染参数（`render_param`角色，维度10）单独处理，见下节，不参与主句拼接，而是作为句子后缀追加。

示例（选中：视角=低角度，风格=现代极简，主体=急诊中心，材质=铝板，色彩=暖白，光线=黄昏，环境=城市密集区，氛围=专业冷静）：

> A low-angle render of a modern minimalist emergency department with ambulance bay, clad in perforated aluminum panel, in a warm white / off-white / cream color palette, illuminated by golden hour / warm sunset, set within a dense urban context / high-rise surroundings, evoking a clinical / precise / sterile atmosphere.

## 关键词模式（优化）

新增函数 `buildKeywordPhrase(dimGroups)`，替代原 `updatePrompt` 里内联的拼接逻辑。逻辑与语句模式类似地按角色分组，但输出时不套模板，只按固定角色顺序（与上方顺序一致）依次把 `item.en` 用逗号连接。相比现状的改进点仅是**顺序固定为"主体→风格→材质→氛围→参数"这一权重顺序**，而不是按维度 ID 原始顺序输出（原始顺序里视角、光线等会插在中间打断阅读逻辑）。

## 渲染参数维度（维度10）的双模式兼容

维度10条目分两类，通过 `tool` 字段已有的区分和 `en` 内容格式判断：
- **参数型**（`en` 以 `--` 开头，如 MJ 系列）：语句模式下原样追加在句尾，用空格分隔，不参与语法拼接。
- **描述型**（`en` 是完整短语，如 V-Ray/UE5/Lumion/摄影风格/水彩风等）：语句模式下转换为从句 "rendered in the style of {en}" 追加在句尾。
- **负面提示词**（SD负面固定包）：两种模式下都保持现状——单独显示在负面提示词框，不进入主句/主短语。

判断规则写成一个小工具函数 `isRenderFlag(en)`：返回 `en.trim().startsWith('--')`。

## UI 变更

在 `index.html` 顶部 `header-controls` 内，"语言切换"（`lang-toggle`）旁新增"输出格式切换"（`format-toggle`），两个按钮："关键词模式" / "语句模式"，默认选中"语句模式"（更贴合用户当前诉求）。

`style.css` 复用 `.lang-toggle`/`.lang-btn` 的样式类（新增 `.format-toggle`/`.format-btn`，样式与 `.lang-toggle` 一致，避免重复定义）。

`app.js` 中 `state` 新增字段 `format: 'sentence'`（`'sentence' | 'keyword'`），`updatePrompt()` 根据 `state.format` 调用 `buildSentence` 或 `buildKeywordPhrase`，其余逻辑（负面提示词处理、双语中文参考追加等）保持不变，套在两种模式的输出结果外层。

语言切换（en/cn/both）与格式切换正交：
- `cn`/`both` 模式下，语句模式使用 `item.cn` 而不是 `item.en` 填入模板（模板本身的连接词如 "clad in"/"illuminated by" 目前只做英文版本，中文句子生成留待后续迭代，本次仅保证不报错——`both`模式下主句仍用英文模板+英文词，中文作为参考追加，沿用现状逻辑）。
- `cn` 模式下的关键词模式，直接使用中文短语按角色顺序逗号连接。

## 新增维度内容

### 维度13：布局/体量形式（role: layout）
方岛式布局、塔楼式高层、分散院落式、指状布局（finger plan）、环形布局、裙房+塔楼组合、垂直分区（低层门诊+高层住院）、线性布局、集中式巨构、卫星式分院区、地下+地上复合、模块化可扩展体量、庭院环绕式、双翼对称布局、错层退台式，共 15 条。

### 维度14：医院专项设计细节（role: detail）
无障碍坡道与扶手、无障碍卫生间标识、色彩编码导视系统、数字化导航屏、洁污分区可视化标识、独立候诊隔间、负压病房警示标识、医患分流缓冲间、感控洗手流程动线、儿童友好尺度细节、防跌倒地面警示、隔音吸声处理、防菌抗菌饰面标识、应急呼叫按钮、无障碍电梯语音提示，共 15 条。

### 维度15：内部照明/饰面细节（role: interior）
间接照明灯槽、线性光带、可调色温智能照明、天花穿孔吸声板、防菌地坪、软性墙面装饰、发光导视墙、局部聚焦射灯、隐藏式一体化灯具、生物动力照明系统、镂空吊顶造型、防眩光漫反射面板、暖色阅读灯角、地脚夜灯带、艺术灯具装置，共 15 条。

每条含 `label`/`en`/`cn`，格式与现有维度一致。

## 现有维度加深

- 维度1（建筑主体类型）：补充体检中心、静脉配置中心、康复医学科细分（作业治疗室/言语治疗室）等 3-5 条。
- 维度9（氛围/情绪）：目前仅10条，补充"洁净通透""安全可控"等 2-3 条，覆盖更多科室场景。

具体新增条目在实施时按现有字段格式（`label`/`en`/`cn`/`extra`）编写，不在设计文档中逐条列出。

## 测试计划

1. 手动在浏览器打开 `index.html`：
   - 逐个勾选各维度代表性条目，检查语句模式输出语法是否正确、无重复连接词、无遗漏角色。
   - 切换关键词模式，检查输出顺序是否为"主体→风格→材质→氛围→参数"。
   - 切换语言（en/cn/both）与格式模式的组合，确认无报错、内容符合预期。
   - 选中MJ参数型渲染参数，检查语句模式下是否正确追加在句尾而不进入主句语法。
   - 选中V-Ray等描述型渲染参数，检查是否转换为"rendered in the style of..."从句。
   - 选中SD负面固定包，检查负面提示词框显示与两种模式下主句不包含负面内容。
   - 打开浏览器控制台，确认无 JS 报错。
2. 未使用自动化测试框架（纯前端 vanilla JS 项目，无构建/测试工具链），本次也不引入，测试以手动验证为准。

## 风险与影响范围

- `data.js` 新增字段和维度：向后兼容，不影响现有维度渲染逻辑（`role` 字段仅在句子引擎中使用，未使用则退化为无角色跳过）。
- `app.js` 中 `updatePrompt` 需要拆分重构：影响范围集中在该文件内，`renderTag`/`toggleSelection`/`handleSearch`等其他函数不受影响。
- `index.html`/`style.css` 新增按钮组：与现有语言切换视觉风格保持一致，不影响布局结构。
