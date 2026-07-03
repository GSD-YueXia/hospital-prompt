# 提示词语句化生成引擎 + 维度扩充 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让用户在左侧点选提示词维度后，右侧能生成语法正确的英文完整句子（语句模式），同时保留优化过的关键词堆砌输出（关键词模式），并扩充维度覆盖面。

**Architecture:** 新增一个纯函数模块 `prompt-engine.js`（UMD 风格，浏览器 `<script>` 和 Node `require` 都能用），负责"选中项 → 句子/短语"的拼接逻辑，不依赖 DOM。`app.js` 只负责收集选中项（含每个维度的语法角色 `role`）并调用该模块，再把结果渲染到页面。`data.js` 每个维度对象新增 `role` 字段，并新增 3 个维度（13/14/15）。

**Tech Stack:** 原生 JS（无构建工具、无框架），Node 内置 `node:test` + `node:assert/strict` 做单元测试（Node 版本已确认 v24，支持该模块，无需额外安装依赖）。

## Global Constraints

- 不引入任何 npm 依赖、不引入构建工具（项目当前是纯静态 HTML/CSS/JS，保持这一形态）。
- `data.js` 现有 12 个维度的 `id`/`title`/`items` 字段结构和内容不能被破坏性修改，只能新增字段（`role`）和新增条目。
- `app.js` 现有函数（`renderTag`/`toggleSelection`/`handleSearch`/`copyToClipboard`/`showToast`/`clearAll`/`reRenderTags`）保持不变，不在本计划范围内。
- 新增的 `prompt-engine.js` 必须同时支持浏览器 `<script>` 标签加载（挂到 `window.PromptEngine`）和 Node `require()`（用于测试），不能用 ES Module `import/export` 语法（避免浏览器端需要 `type="module"` 改动 `index.html` 加载方式）。
- 测试使用 Node 内置 `node:test`，运行命令统一为 `node --test test/`。

---

### Task 1: 创建 `prompt-engine.js` 纯函数模块（句子引擎 + 关键词引擎）

**Files:**
- Create: `G:\SYF_Project\提示词网站\prompt-engine.js`
- Test: `G:\SYF_Project\提示词网站\test\prompt-engine.test.js`

**Interfaces:**
- Produces（后续任务会用到的确切签名）：
  - `PromptEngine.buildSentence(selections, lang)` → `string`
  - `PromptEngine.buildKeywordPhrase(selections, lang)` → `string`
  - `PromptEngine.isRenderFlag(en)` → `boolean`
  - 其中 `selections` 是数组，每项形如 `{ role: string, en: string, cn: string }`；`role` 取值之一：`'subject'`（维度1）、`'space'`（维度2）、`'style'`（维度3）、`'material'`（维度4）、`'color'`（维度5）、`'light'`（维度6）、`'view'`（维度7）、`'context'`（维度8）、`'mood'`（维度9）、`'render_param'`（维度10）、`'furniture'`（维度11）、`'landscape'`（维度12）、`'layout'`（维度13）、`'detail'`（维度14）、`'interior'`（维度15）。
  - `lang` 取值 `'en' | 'cn' | 'both'`；函数内部把 `'both'` 当作 `'en'` 处理（英文模板为主，中文参考由调用方另外拼接，与现状一致）。
  - `selections` 中不应包含"SD负面固定包"这一条（调用方需在传入前过滤掉，本模块不关心负面提示词）。

- [ ] **Step 1: 写测试文件（先写测试，再写实现）**

创建 `G:\SYF_Project\提示词网站\test\prompt-engine.test.js`：

```js
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const PromptEngine = require('../prompt-engine.js');

test('isRenderFlag: 识别 -- 开头的参数字符串', () => {
  assert.equal(PromptEngine.isRenderFlag('--ar 16:9 --style raw --s 250 --v 6.1'), true);
  assert.equal(PromptEngine.isRenderFlag('V-Ray 6, ray tracing, global illumination'), false);
  assert.equal(PromptEngine.isRenderFlag(''), false);
  assert.equal(PromptEngine.isRenderFlag(undefined), false);
});

test('buildSentence: 空选择时返回兜底句子', () => {
  const result = PromptEngine.buildSentence([], 'en');
  assert.equal(result, 'A hospital building.');
});

test('buildSentence: 只选主体（维度1）', () => {
  const selections = [
    { role: 'subject', en: 'Emergency department with ambulance bay', cn: '急诊科+救护车坡道' }
  ];
  const result = PromptEngine.buildSentence(selections, 'en');
  assert.equal(result, 'An emergency department with ambulance bay.');
});

test('buildSentence: 主体+空间组合成 "the {space} of a {subject}"', () => {
  const selections = [
    { role: 'subject', en: 'Emergency department with ambulance bay', cn: '' },
    { role: 'space', en: 'Waiting area / Patient lounge', cn: '' }
  ];
  const result = PromptEngine.buildSentence(selections, 'en');
  assert.equal(result, 'The waiting area / patient lounge of an emergency department with ambulance bay.');
});

test('buildSentence: 完整组合，含视角/风格/材质/色彩/光线/环境/氛围', () => {
  const selections = [
    { role: 'view', en: 'Low-angle / Worm‘s-eye', cn: '' },
    { role: 'style', en: 'Modern minimalist / Clean lines', cn: '' },
    { role: 'subject', en: 'Emergency department with ambulance bay', cn: '' },
    { role: 'material', en: 'Perforated aluminum panel', cn: '' },
    { role: 'color', en: 'Warm white / Off-white / Cream', cn: '' },
    { role: 'light', en: 'Golden hour / Warm sunset', cn: '' },
    { role: 'context', en: 'Dense urban context / High-rise surroundings', cn: '' },
    { role: 'mood', en: 'Clinical / Precise / Sterile', cn: '' }
  ];
  const result = PromptEngine.buildSentence(selections, 'en');
  assert.equal(
    result,
    'A low-angle / worm‘s-eye render of a modern minimalist / clean lines emergency department with ambulance bay, ' +
    'clad in perforated aluminum panel, in a warm white / off-white / cream color palette, ' +
    'illuminated by golden hour / warm sunset, set within a dense urban context / high-rise surroundings, ' +
    'evoking a clinical / precise / sterile atmosphere.'
  );
});

test('buildSentence: 同角色多选用逗号+and连接', () => {
  const selections = [
    { role: 'subject', en: 'Emergency department', cn: '' },
    { role: 'material', en: 'Perforated aluminum panel', cn: '' },
    { role: 'material', en: 'Exposed architectural concrete', cn: '' },
    { role: 'material', en: 'Natural stone cladding / Limestone', cn: '' }
  ];
  const result = PromptEngine.buildSentence(selections, 'en');
  assert.equal(
    result,
    'An emergency department, clad in perforated aluminum panel, exposed architectural concrete and natural stone cladding / limestone.'
  );
});

test('buildSentence: cn 语言模式使用中文词填模板', () => {
  const selections = [
    { role: 'subject', en: 'Emergency department', cn: '急诊科' },
    { role: 'color', en: 'Warm white', cn: '暖白' }
  ];
  const result = PromptEngine.buildSentence(selections, 'cn');
  assert.equal(result, 'A 急诊科, in a 暖白 color palette.');
});

test('buildSentence: 渲染参数(--开头)追加在句尾，不参与语法', () => {
  const selections = [
    { role: 'subject', en: 'Emergency department', cn: '' },
    { role: 'render_param', en: '--ar 16:9 --style raw --s 250 --v 6.1', cn: '' }
  ];
  const result = PromptEngine.buildSentence(selections, 'en');
  assert.equal(result, 'An emergency department. --ar 16:9 --style raw --s 250 --v 6.1');
});

test('buildSentence: 描述型渲染参数转换为 "Rendered in the style of ..."', () => {
  const selections = [
    { role: 'subject', en: 'Emergency department', cn: '' },
    { role: 'render_param', en: 'V-Ray 6, ray tracing, global illumination, IES lights, 64 samples', cn: '' }
  ];
  const result = PromptEngine.buildSentence(selections, 'en');
  assert.equal(
    result,
    'An emergency department. Rendered in the style of V-Ray 6, ray tracing, global illumination, IES lights, 64 samples.'
  );
});

test('buildSentence: 渲染参数同时包含参数型和描述型', () => {
  const selections = [
    { role: 'subject', en: 'Emergency department', cn: '' },
    { role: 'render_param', en: 'V-Ray 6, ray tracing, global illumination, IES lights, 64 samples', cn: '' },
    { role: 'render_param', en: '--ar 16:9 --style raw --s 250 --v 6.1', cn: '' }
  ];
  const result = PromptEngine.buildSentence(selections, 'en');
  assert.equal(
    result,
    'An emergency department. Rendered in the style of V-Ray 6, ray tracing, global illumination, IES lights, 64 samples. --ar 16:9 --style raw --s 250 --v 6.1'
  );
});

test('buildKeywordPhrase: 空选择返回空字符串', () => {
  assert.equal(PromptEngine.buildKeywordPhrase([], 'en'), '');
});

test('buildKeywordPhrase: 按固定角色顺序逗号连接', () => {
  const selections = [
    { role: 'mood', en: 'Clinical / Precise / Sterile', cn: '' },
    { role: 'subject', en: 'Emergency department', cn: '' },
    { role: 'view', en: 'Low-angle', cn: '' },
    { role: 'style', en: 'Modern minimalist', cn: '' },
    { role: 'render_param', en: '--ar 16:9 --v 6.1', cn: '' }
  ];
  const result = PromptEngine.buildKeywordPhrase(selections, 'en');
  assert.equal(
    result,
    'Low-angle, Modern minimalist, Emergency department, Clinical / Precise / Sterile, --ar 16:9 --v 6.1'
  );
});

test('buildKeywordPhrase: cn 语言模式使用中文词', () => {
  const selections = [
    { role: 'subject', en: 'Emergency department', cn: '急诊科' },
    { role: 'style', en: 'Modern minimalist', cn: '现代极简' }
  ];
  const result = PromptEngine.buildKeywordPhrase(selections, 'cn');
  assert.equal(result, '现代极简, 急诊科');
});
```

- [ ] **Step 2: 运行测试，确认失败（模块不存在）**

Run: `cd "G:\SYF_Project\提示词网站" && node --test test/`
Expected: FAIL，报错信息包含 `Cannot find module '../prompt-engine.js'`

- [ ] **Step 3: 实现 `prompt-engine.js`**

创建 `G:\SYF_Project\提示词网站\prompt-engine.js`：

设计要点（避免和测试期望不一致）：
- `groupByRole` 不对文本做任何大小写变换，原样保留 `pickText` 取到的文本（`item.en` 或 `item.cn`）。这样 `buildKeywordPhrase` 直接复用原始大小写（"Clinical / Precise / Sterile" 这种词条本身已经是恰当的展示格式，不需要改）。
- `buildSentence` 需要把词条嵌入句中，所以在使用前统一调用 `lcArr()` 转全小写（不是只转第一个字符——像 "Modern minimalist / Clean lines" 这种带 "/" 的多段文本，只转第一个字符会导致 "Clean" 保持大写，嵌在句子中间很别扭）。句子最终只在两个地方出现大写：句首固定的 "A "（视角模板）或对拼好的主体短语整体调用一次 `capitalize()`（只影响这个短语的第一个字符）。

```js
/**
 * PromptEngine —— 纯函数模块，不依赖 DOM。
 * 浏览器端挂到 window.PromptEngine；Node 端通过 module.exports 供测试使用。
 */
(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.PromptEngine = factory();
    }
}(typeof window !== 'undefined' ? window : this, function () {
    'use strict';

    var ROLE_ORDER = [
        'view', 'style', 'subject', 'space', 'layout',
        'material', 'color', 'light', 'interior',
        'context', 'mood', 'detail', 'furniture', 'landscape'
    ];

    function isRenderFlag(en) {
        return typeof en === 'string' && en.trim().indexOf('--') === 0;
    }

    function pickText(entry, lang) {
        if (lang === 'cn' && entry.cn) return entry.cn;
        return entry.en;
    }

    function capitalize(text) {
        if (!text) return text;
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    function article(text) {
        return /^[aeiou]/i.test(text) ? 'an' : 'a';
    }

    function joinAnd(arr) {
        if (!arr || !arr.length) return '';
        if (arr.length === 1) return arr[0];
        return arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1];
    }

    function lcArr(arr) {
        return (arr || []).map(function (s) { return s.toLowerCase(); });
    }

    function groupByRole(selections, lang) {
        var groups = {};
        (selections || []).forEach(function (sel) {
            var role = sel && sel.role;
            if (!role) return;
            if (!groups[role]) groups[role] = [];
            if (role === 'render_param') {
                groups[role].push({ en: sel.en, cn: sel.cn });
            } else {
                groups[role].push(pickText(sel, lang));
            }
        });
        return groups;
    }

    function composeSubjectPhrase(styleArr, subjectArr, spaceArr) {
        var stylePrefix = (styleArr && styleArr.length) ? joinAnd(styleArr) + ' ' : '';
        var hasSubject = subjectArr && subjectArr.length;
        var hasSpace = spaceArr && spaceArr.length;

        if (hasSubject && hasSpace) {
            var subjectPhrase = stylePrefix + joinAnd(subjectArr);
            return 'the ' + joinAnd(spaceArr) + ' of ' + article(subjectPhrase) + ' ' + subjectPhrase;
        }
        if (hasSubject) {
            var phrase = stylePrefix + joinAnd(subjectArr);
            return article(phrase) + ' ' + phrase;
        }
        if (hasSpace) {
            var spacePhrase = joinAnd(spaceArr);
            return article(spacePhrase) + ' ' + spacePhrase;
        }
        return 'a hospital building';
    }

    function buildRenderSuffix(items) {
        if (!items || !items.length) return '';
        var flags = [];
        var styles = [];
        items.forEach(function (it) {
            if (isRenderFlag(it.en)) {
                flags.push(it.en);
            } else {
                styles.push(it.en);
            }
        });
        var out = [];
        if (styles.length) {
            out.push('Rendered in the style of ' + joinAnd(styles) + '.');
        }
        if (flags.length) {
            out.push(flags.join(' '));
        }
        return out.join(' ');
    }

    function buildSentence(selections, lang) {
        lang = lang === 'cn' ? 'cn' : 'en';
        var groups = groupByRole(selections, lang);

        var subjectPhrase = composeSubjectPhrase(
            lcArr(groups.style),
            lcArr(groups.subject),
            lcArr(groups.space)
        );

        var parts = [];
        var viewArr = lcArr(groups.view);
        if (viewArr.length) {
            parts.push('A ' + joinAnd(viewArr) + ' render of ' + subjectPhrase);
        } else {
            parts.push(capitalize(subjectPhrase));
        }

        if (groups.layout && groups.layout.length) {
            parts.push('organized as a ' + joinAnd(lcArr(groups.layout)) + ' configuration');
        }
        if (groups.material && groups.material.length) {
            parts.push('clad in ' + joinAnd(lcArr(groups.material)));
        }
        if (groups.color && groups.color.length) {
            parts.push('in a ' + joinAnd(lcArr(groups.color)) + ' color palette');
        }
        if (groups.light && groups.light.length) {
            parts.push('illuminated by ' + joinAnd(lcArr(groups.light)));
        }
        if (groups.interior && groups.interior.length) {
            parts.push('with ' + joinAnd(lcArr(groups.interior)));
        }
        if (groups.context && groups.context.length) {
            parts.push('set within a ' + joinAnd(lcArr(groups.context)));
        }
        if (groups.mood && groups.mood.length) {
            parts.push('evoking a ' + joinAnd(lcArr(groups.mood)) + ' atmosphere');
        }
        if (groups.detail && groups.detail.length) {
            parts.push('with attention to ' + joinAnd(lcArr(groups.detail)));
        }
        if (groups.furniture && groups.furniture.length) {
            parts.push('furnished with ' + joinAnd(lcArr(groups.furniture)));
        }
        if (groups.landscape && groups.landscape.length) {
            parts.push('surrounded by ' + joinAnd(lcArr(groups.landscape)));
        }

        var sentence = parts.join(', ') + '.';
        var renderSuffix = buildRenderSuffix(groups.render_param);
        if (renderSuffix) {
            sentence += ' ' + renderSuffix;
        }
        return sentence;
    }

    function buildKeywordPhrase(selections, lang) {
        lang = lang === 'cn' ? 'cn' : 'en';
        var groups = groupByRole(selections, lang);
        var parts = [];
        ROLE_ORDER.forEach(function (role) {
            if (groups[role] && groups[role].length) {
                groups[role].forEach(function (text) {
                    parts.push(text);
                });
            }
        });
        (groups.render_param || []).forEach(function (it) {
            parts.push(it.en);
        });
        return parts.join(', ');
    }

    return {
        buildSentence: buildSentence,
        buildKeywordPhrase: buildKeywordPhrase,
        isRenderFlag: isRenderFlag
    };
}));
```

- [ ] **Step 4: 运行测试，确认全部通过**

Run: `cd "G:\SYF_Project\提示词网站" && node --test test/`
Expected: PASS，所有 test case 通过，0 failing

- [ ] **Step 5: 提交（若为 git 仓库；当前项目非 git 仓库，跳过 commit，仅保留文件）**

（该目录未初始化 git，本步骤跳过 `git commit`，直接进入下一任务。）

---

### Task 2: `data.js` 支持 Node 测试 + 为现有 12 个维度加 `role` 字段

**Files:**
- Modify: `G:\SYF_Project\提示词网站\data.js`
- Test: `G:\SYF_Project\提示词网站\test\data.test.js`

**Interfaces:**
- Consumes: 无（`data.js` 是数据文件，不依赖其他任务产物）。
- Produces: `PROMPT_DATA`（Node 端通过 `require('../data.js')` 拿到数组）；每个维度对象新增 `role` 字段，取值见下表，供 Task 5（app.js 集成）读取。

| 维度 id | title | role |
|---|---|---|
| 1 | 建筑主体类型 / 医疗功能模块 | `subject` |
| 2 | 空间类型（室内/室外） | `space` |
| 3 | 建筑风格 / 设计语言 | `style` |
| 4 | 外立面/表皮材质 | `material` |
| 5 | 色彩方案 | `color` |
| 6 | 光线/时间 | `light` |
| 7 | 视角/镜头 | `view` |
| 8 | 环境/周边 | `context` |
| 9 | 氛围/情绪 | `mood` |
| 10 | 常用后缀/渲染参数 | `render_param` |
| 11 | 医疗家具/设备 | `furniture` |
| 12 | 自然元素/景观 | `landscape` |

- [ ] **Step 1: 写测试文件**

创建 `G:\SYF_Project\提示词网站\test\data.test.js`：

```js
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const PROMPT_DATA = require('../data.js');

const EXPECTED_ROLES = {
  1: 'subject',
  2: 'space',
  3: 'style',
  4: 'material',
  5: 'color',
  6: 'light',
  7: 'view',
  8: 'context',
  9: 'mood',
  10: 'render_param',
  11: 'furniture',
  12: 'landscape'
};

test('data.js 可通过 require 加载为数组', () => {
  assert.equal(Array.isArray(PROMPT_DATA), true);
  assert.equal(PROMPT_DATA.length >= 12, true);
});

test('现有 12 个维度都带有正确的 role 字段', () => {
  Object.keys(EXPECTED_ROLES).forEach(function (idStr) {
    const id = Number(idStr);
    const dim = PROMPT_DATA.find(function (d) { return d.id === id; });
    assert.ok(dim, 'dimension id ' + id + ' should exist');
    assert.equal(dim.role, EXPECTED_ROLES[id], 'dimension ' + id + ' role mismatch');
  });
});

test('每个维度的 items 仍然保留 label/en 字段', () => {
  PROMPT_DATA.forEach(function (dim) {
    assert.ok(Array.isArray(dim.items) && dim.items.length > 0, 'dimension ' + dim.id + ' items should be non-empty array');
    dim.items.forEach(function (item) {
      assert.equal(typeof item.label, 'string');
      assert.equal(typeof item.en, 'string');
    });
  });
});
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `cd "G:\SYF_Project\提示词网站" && node --test test/`
Expected: FAIL，`data.test.js` 报错（`require('../data.js')` 返回 `undefined` 或 `Cannot read properties`，因为 `data.js` 目前没有 `module.exports`）

- [ ] **Step 3: 修改 `data.js`**

在 `data.js` 文件末尾（第 1053 行 `];` 之后）新增导出语句：

```js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PROMPT_DATA;
}
```

（浏览器环境下 `module` 未定义，这行不会执行，不影响现有 `<script src="data.js">` 加载方式。）

然后为 12 个维度对象分别新增 `role` 字段（紧跟在 `"col_layout"` 那一行之后）。以维度1为例，第 6 行 `"col_layout": "standard",` 后新增一行：

```js
    "col_layout": "standard",
    "role": "subject",
```

依此对 12 个维度逐一添加：
- 维度1（第6行后）：`"role": "subject",`
- 维度2（第114行后）：`"role": "space",`
- 维度3（第222行后）：`"role": "style",`
- 维度4（第305行后）：`"role": "material",`
- 维度5（第403行后）：`"role": "color",`
- 维度6（第471行后）：`"role": "light",`
- 维度7（第569行后）：`"role": "view",`
- 维度8（第682行后）：`"role": "context",`
- 维度9（第765行后）：`"role": "mood",`
- 维度10（第833行后）：`"role": "render_param",`
- 维度11（第931行后）：`"role": "furniture",`
- 维度12（第999行后）：`"role": "landscape",`

（用 Edit 工具逐个维度做替换，`old_string` 用该维度的 `"id"` + `"title"` + `"col_layout"` 三行组合以保证唯一匹配。）

- [ ] **Step 4: 运行测试，确认通过**

Run: `cd "G:\SYF_Project\提示词网站" && node --test test/`
Expected: PASS，`data.test.js` 与 `prompt-engine.test.js` 均全部通过

- [ ] **Step 5: 浏览器端回归检查**

用浏览器打开 `index.html`（或用 `file://` 路径直接打开），打开开发者工具 Console，确认没有报错，且左侧维度列表和之前一样正常渲染（本步骤只是确认新增的 `role`/`module.exports` 没有破坏现有渲染逻辑，`app.js` 尚未使用 `role`，所以界面应与改动前完全一致）。

---

### Task 3: 新增维度 13（布局/体量形式）、14（医院专项设计细节）、15（内部照明/饰面细节）

**Files:**
- Modify: `G:\SYF_Project\提示词网站\data.js`
- Test: `G:\SYF_Project\提示词网站\test\data.test.js`（在 Task 2 基础上追加测试用例）

**Interfaces:**
- Consumes: Task 2 产出的 `module.exports = PROMPT_DATA`（本任务继续在同一个文件里追加测试）。
- Produces: `PROMPT_DATA` 数组新增 3 个维度对象（id 13/14/15），供 Task 5（app.js）和最终用户使用。

- [ ] **Step 1: 在 `test/data.test.js` 末尾追加测试用例**

```js
test('新增维度13/14/15存在且role正确，每个至少15条', () => {
  const NEW_DIMS = { 13: 'layout', 14: 'detail', 15: 'interior' };
  Object.keys(NEW_DIMS).forEach(function (idStr) {
    const id = Number(idStr);
    const dim = PROMPT_DATA.find(function (d) { return d.id === id; });
    assert.ok(dim, 'dimension id ' + id + ' should exist');
    assert.equal(dim.role, NEW_DIMS[id]);
    assert.equal(dim.items.length >= 15, true, 'dimension ' + id + ' should have at least 15 items');
  });
});
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `cd "G:\SYF_Project\提示词网站" && node --test test/`
Expected: FAIL，提示维度 13/14/15 不存在

- [ ] **Step 3: 在 `data.js` 末尾（`];` 之前）插入三个新维度对象**

将文件末尾从：

```js
        "cn": "疗愈艺术/雕塑装置"
      }
    ]
  }
];
```

改为：

```js
        "cn": "疗愈艺术/雕塑装置"
      }
    ]
  },
  {
    "id": 13,
    "title": "布局/体量形式",
    "full_title": "维度13：布局/体量形式",
    "col_layout": "standard",
    "role": "layout",
    "items": [
      { "label": "方岛式布局", "en": "Podium-and-block massing / Isolated block plan", "cn": "方岛式布局/独立体量" },
      { "label": "塔楼式高层", "en": "High-rise tower typology", "cn": "塔楼式高层" },
      { "label": "分散院落式", "en": "Dispersed pavilion / Courtyard cluster plan", "cn": "分散院落式/组团布局" },
      { "label": "指状布局", "en": "Finger plan / Linear wings radiating from spine", "cn": "指状布局/条形翼楼" },
      { "label": "环形布局", "en": "Circular / Ring-shaped floor plan", "cn": "环形布局/环状平面" },
      { "label": "裙房+塔楼组合", "en": "Podium-and-tower composition", "cn": "裙房+塔楼组合" },
      { "label": "垂直分区", "en": "Vertical zoning / Low-rise outpatient base with high-rise inpatient tower", "cn": "垂直分区/低层门诊+高层住院" },
      { "label": "线性布局", "en": "Linear / Bar building layout", "cn": "线性布局/条形楼布局" },
      { "label": "集中式巨构", "en": "Centralized megastructure plan", "cn": "集中式巨构" },
      { "label": "卫星式分院区", "en": "Satellite campus / Distributed branch layout", "cn": "卫星式分院区/分布式布局" },
      { "label": "地下+地上复合", "en": "Below-grade and above-grade composite massing", "cn": "地下+地上复合体量" },
      { "label": "模块化可扩展体量", "en": "Modular expandable massing / Phased growth block", "cn": "模块化可扩展体量/分期生长" },
      { "label": "庭院环绕式", "en": "Courtyard-embraced massing / Buildings wrapping a central court", "cn": "庭院环绕式/围合中庭" },
      { "label": "双翼对称布局", "en": "Symmetrical twin-wing layout", "cn": "双翼对称布局" },
      { "label": "错层退台式", "en": "Staggered terrace / Stepped-back massing", "cn": "错层退台式/退台体量" }
    ]
  },
  {
    "id": 14,
    "title": "医院专项设计细节",
    "full_title": "维度14：医院专项设计细节",
    "col_layout": "standard",
    "role": "detail",
    "items": [
      { "label": "无障碍坡道与扶手", "en": "Accessible ramp with continuous handrails", "cn": "无障碍坡道+连续扶手" },
      { "label": "无障碍卫生间标识", "en": "Accessible restroom signage / ADA-compliant washroom", "cn": "无障碍卫生间标识" },
      { "label": "色彩编码导视系统", "en": "Color-coded wayfinding system", "cn": "色彩编码导视系统" },
      { "label": "数字化导航屏", "en": "Digital wayfinding kiosk / Interactive directory screen", "cn": "数字化导航屏/互动索引屏" },
      { "label": "洁污分区可视化标识", "en": "Clean-dirty zoning signage / Color-differentiated corridors", "cn": "洁污分区可视化标识/分色走廊" },
      { "label": "独立候诊隔间", "en": "Private waiting cubicle / Semi-enclosed bay", "cn": "独立候诊隔间/半封闭候诊区" },
      { "label": "负压病房警示标识", "en": "Negative-pressure isolation room warning sign", "cn": "负压病房警示标识" },
      { "label": "医患分流缓冲间", "en": "Staff-patient separation buffer zone / Anteroom", "cn": "医患分流缓冲间/前室" },
      { "label": "感控洗手流程动线", "en": "Infection-control hand hygiene circulation path", "cn": "感控洗手流程动线" },
      { "label": "儿童友好尺度细节", "en": "Child-friendly scaled details / Playful low-height fixtures", "cn": "儿童友好尺度细节/低高度设施" },
      { "label": "防跌倒地面警示", "en": "Anti-slip flooring with fall-prevention markings", "cn": "防跌倒地面警示/防滑地面" },
      { "label": "隔音吸声处理", "en": "Acoustic sound insulation treatment", "cn": "隔音吸声处理" },
      { "label": "防菌抗菌饰面标识", "en": "Antimicrobial surface finish signage", "cn": "防菌抗菌饰面标识" },
      { "label": "应急呼叫按钮", "en": "Emergency call button / Nurse call station", "cn": "应急呼叫按钮/护士呼叫站" },
      { "label": "无障碍电梯语音提示", "en": "Accessible elevator with voice announcement", "cn": "无障碍电梯语音提示" }
    ]
  },
  {
    "id": 15,
    "title": "内部照明/饰面细节",
    "full_title": "维度15：内部照明/饰面细节",
    "col_layout": "standard",
    "role": "interior",
    "items": [
      { "label": "间接照明灯槽", "en": "Indirect cove lighting channel", "cn": "间接照明灯槽" },
      { "label": "线性光带", "en": "Linear LED light strip", "cn": "线性光带" },
      { "label": "可调色温智能照明", "en": "Tunable color-temperature smart lighting", "cn": "可调色温智能照明" },
      { "label": "天花穿孔吸声板", "en": "Perforated acoustic ceiling panel", "cn": "天花穿孔吸声板" },
      { "label": "防菌地坪", "en": "Antimicrobial seamless flooring", "cn": "防菌地坪/无缝抗菌地面" },
      { "label": "软性墙面装饰", "en": "Soft-touch wall covering / Cushioned wall panel", "cn": "软性墙面装饰/软包墙面" },
      { "label": "发光导视墙", "en": "Illuminated wayfinding wall panel", "cn": "发光导视墙" },
      { "label": "局部聚焦射灯", "en": "Focused accent spotlight", "cn": "局部聚焦射灯" },
      { "label": "隐藏式一体化灯具", "en": "Concealed integrated luminaire", "cn": "隐藏式一体化灯具" },
      { "label": "生物动力照明系统", "en": "Circadian biodynamic lighting system", "cn": "生物动力照明系统" },
      { "label": "镂空吊顶造型", "en": "Perforated suspended ceiling feature", "cn": "镂空吊顶造型" },
      { "label": "防眩光漫反射面板", "en": "Anti-glare diffused reflective panel", "cn": "防眩光漫反射面板" },
      { "label": "暖色阅读灯角", "en": "Warm reading light nook", "cn": "暖色阅读灯角" },
      { "label": "地脚夜灯带", "en": "Floor-level night light strip", "cn": "地脚夜灯带" },
      { "label": "艺术灯具装置", "en": "Sculptural lighting installation", "cn": "艺术灯具装置" }
    ]
  }
];
```

- [ ] **Step 4: 运行测试，确认通过**

Run: `cd "G:\SYF_Project\提示词网站" && node --test test/`
Expected: PASS，全部测试通过

- [ ] **Step 5: 浏览器端回归检查**

打开 `index.html`，确认左侧列表新出现"维度13：布局/体量形式"、"维度14：医院专项设计细节"、"维度15：内部照明/饰面细节"三个可折叠区块，点击展开，条目正常显示，点选后能进入已选标签区（此时右侧生成的提示词仍是旧的逗号堆砌逻辑，因为 `app.js` 还没有改，属于预期状态）。

---

### Task 4: 加深维度1（建筑主体类型）与维度9（氛围/情绪）的词条密度

**Files:**
- Modify: `G:\SYF_Project\提示词网站\data.js`
- Test: `G:\SYF_Project\提示词网站\test\data.test.js`（追加测试用例）

**Interfaces:**
- Consumes: Task 2/3 完成后的 `data.js`。
- Produces: 维度1 items 从 20 条增至 24 条，维度9 items 从 10 条增至 12 条。

- [ ] **Step 1: 追加测试用例**

在 `test/data.test.js` 末尾追加：

```js
test('维度1(建筑主体)条目数不少于24，维度9(氛围情绪)条目数不少于12', () => {
  const dim1 = PROMPT_DATA.find(function (d) { return d.id === 1; });
  const dim9 = PROMPT_DATA.find(function (d) { return d.id === 9; });
  assert.equal(dim1.items.length >= 24, true, 'dimension 1 should have at least 24 items, got ' + dim1.items.length);
  assert.equal(dim9.items.length >= 12, true, 'dimension 9 should have at least 12 items, got ' + dim9.items.length);
});
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `cd "G:\SYF_Project\提示词网站" && node --test test/`
Expected: FAIL，条目数不足（当前分别是20和10）

- [ ] **Step 3: 修改 `data.js`，在维度1末尾追加4条**

找到维度1的最后一个条目（第102-107行，"后勤保障"），在其后（`]` 之前）插入：

原文（第103-108行）：
```js
      {
        "label": "后勤保障",
        "en": "Central plant / Utility core",
        "cn": "动力中心/设备核心筒"
      }
    ]
```

改为：
```js
      {
        "label": "后勤保障",
        "en": "Central plant / Utility core",
        "cn": "动力中心/设备核心筒"
      },
      {
        "label": "体检中心",
        "en": "Health check-up / Physical examination center",
        "cn": "体检中心"
      },
      {
        "label": "静脉配置中心",
        "en": "Pharmacy IV admixture center / PIVAS",
        "cn": "静脉药物配置中心(PIVAS)"
      },
      {
        "label": "作业治疗室",
        "en": "Occupational therapy room",
        "cn": "作业治疗室"
      },
      {
        "label": "言语治疗室",
        "en": "Speech therapy room",
        "cn": "言语治疗室"
      }
    ]
```

- [ ] **Step 4: 修改 `data.js`，在维度9末尾追加2条**

找到维度9的最后一个条目（"简约干净"，第821-826行），在其后（`]` 之前）插入：

原文：
```js
      {
        "label": "简约干净",
        "en": "Minimal / Clean / Uncluttered",
        "cn": "简约/干净/无杂乱",
        "extra": "所有通用"
      }
    ]
```

改为：
```js
      {
        "label": "简约干净",
        "en": "Minimal / Clean / Uncluttered",
        "cn": "简约/干净/无杂乱",
        "extra": "所有通用"
      },
      {
        "label": "洁净通透",
        "en": "Clean / Sterile / Airy",
        "cn": "洁净/通透/无菌感",
        "extra": "手术/ICU"
      },
      {
        "label": "安全可控",
        "en": "Secure / Controlled / Reassuring",
        "cn": "安全/可控/安心",
        "extra": "精神科/儿科"
      }
    ]
```

- [ ] **Step 5: 运行测试，确认通过**

Run: `cd "G:\SYF_Project\提示词网站" && node --test test/`
Expected: PASS，全部测试通过

- [ ] **Step 6: 浏览器端回归检查**

打开 `index.html`，展开"维度1"确认新增4条（体检中心/静脉配置中心/作业治疗室/言语治疗室），展开"维度9"确认新增2条（洁净通透/安全可控），维度计数徽标数字同步更新（例如维度1显示"24"）。

---

### Task 5: 新增"输出格式"切换 UI，并将 `app.js` 接入 `prompt-engine.js`

**Files:**
- Modify: `G:\SYF_Project\提示词网站\index.html`
- Modify: `G:\SYF_Project\提示词网站\style.css`
- Modify: `G:\SYF_Project\提示词网站\app.js`

**Interfaces:**
- Consumes:
  - `PromptEngine.buildSentence(selections, lang)` / `PromptEngine.buildKeywordPhrase(selections, lang)`（Task 1 产出）
  - `dim.role` 字段（Task 2/3 产出，值为 `subject/space/style/material/color/light/view/context/mood/render_param/furniture/landscape/layout/detail/interior`）
- Produces: `state.format`（`'sentence' | 'keyword'`），供本任务内部的 `updatePrompt()` 使用，不对外暴露给其他任务。

- [ ] **Step 1: 修改 `index.html`，在语言切换按钮旁新增格式切换按钮**

找到 `index.html` 第20-24行：

```html
                <div class="lang-toggle">
                    <button class="lang-btn active" data-lang="en">English</button>
                    <button class="lang-btn" data-lang="cn">中文</button>
                    <button class="lang-btn" data-lang="both">双语</button>
                </div>
```

改为：

```html
                <div class="lang-toggle">
                    <button class="lang-btn active" data-lang="en">English</button>
                    <button class="lang-btn" data-lang="cn">中文</button>
                    <button class="lang-btn" data-lang="both">双语</button>
                </div>
                <div class="format-toggle">
                    <button class="format-btn active" data-format="sentence">语句模式</button>
                    <button class="format-btn" data-format="keyword">关键词模式</button>
                </div>
```

- [ ] **Step 2: 修改 `index.html`，在 `</body>` 前的脚本加载顺序中插入 `prompt-engine.js`**

找到第107-108行：

```html
    <script src="data.js"></script>
    <script src="app.js"></script>
```

改为：

```html
    <script src="data.js"></script>
    <script src="prompt-engine.js"></script>
    <script src="app.js"></script>
```

- [ ] **Step 3: 修改 `style.css`，新增 `.format-toggle`/`.format-btn` 样式**

在 `style.css` 第118行（`.lang-btn.active { ... }` 规则结束的 `}` 之后）新增：

```css
/* Format Toggle (关键词模式 / 语句模式) */
.format-toggle {
    display: flex;
    background: var(--bg);
    border-radius: var(--radius-sm);
    padding: 3px;
    border: 1px solid var(--border);
}

.format-btn {
    border: none;
    background: transparent;
    padding: 6px 14px;
    font-size: 13px;
    color: var(--text-secondary);
    cursor: pointer;
    border-radius: var(--radius-xs);
    transition: var(--transition);
    font-weight: 500;
}

.format-btn:hover {
    color: var(--text-primary);
}

.format-btn.active {
    background: var(--bg-card);
    color: var(--accent);
    box-shadow: 0 1px 2px rgba(0,0,0,0.08);
    font-weight: 600;
}
```

并在第700行附近的响应式断点里（`.lang-btn { padding: 5px 10px; font-size: 12px; }` 之后）追加：

```css
    .format-btn {
        padding: 5px 10px;
        font-size: 12px;
    }
```

- [ ] **Step 4: 修改 `app.js`，`state` 新增 `format` 字段**

找到第9-14行：

```js
    const state = {
        selected: new Map(), // key: "dimId-itemIdx" => item object
        lang: 'en',          // 'en' | 'cn' | 'both'
        data: PROMPT_DATA    // from data.js
    };
```

改为：

```js
    const state = {
        selected: new Map(), // key: "dimId-itemIdx" => item object
        lang: 'en',          // 'en' | 'cn' | 'both'
        format: 'sentence',  // 'sentence' | 'keyword'
        data: PROMPT_DATA    // from data.js
    };
```

- [ ] **Step 5: 修改 `app.js`，新增 `buildSelectionsList()` 辅助函数**

在 `updatePrompt` 函数定义之前（第253行 `// ===== Generate Prompt =====` 之前）新增：

```js
    // ===== Build flat selections list for PromptEngine =====
    function buildSelectionsList() {
        var list = [];
        state.data.forEach(function(dim) {
            state.selected.forEach(function(val) {
                if (val.dimId !== dim.id) return;
                if (dim.id === 10 && val.item.label === 'SD负面固定包') return;
                list.push({ role: dim.role, en: val.item.en, cn: val.item.cn });
            });
        });
        return list;
    }

```

- [ ] **Step 6: 修改 `app.js`，重写 `updatePrompt()` 中"Build the prompt based on language"部分**

找到原第296-343行（从 `// Build the prompt based on language` 到 `}` 结束的整块）：

```js
        // Build the prompt based on language
        let parts = [];

        state.data.forEach(function(dim) {
            if (!dimGroups[dim.id]) return;

            dimGroups[dim.id].forEach(function(item) {
                if (dim.id === 10) {
                    // Render params: use the suffix directly
                    // Skip negative prompt in main prompt
                    if (item.label === 'SD负面固定包') return;
                    parts.push(item.en);
                } else {
                    // Normal items
                    if (state.lang === 'cn' && item.cn) {
                        parts.push(item.cn);
                    } else if (state.lang === 'both') {
                        // For both, use English as primary (AI works better with English)
                        parts.push(item.en);
                    } else {
                        // Default: English
                        parts.push(item.en);
                    }
                }
            });
        });

        // Join with comma
        let promptStr = parts.join(', ');

        // For 'both' mode, append Chinese translations
        if (state.lang === 'both') {
            let cnParts = [];
            state.data.forEach(function(dim) {
                if (!dimGroups[dim.id]) return;
                dimGroups[dim.id].forEach(function(item) {
                    if (dim.id === 10) {
                        if (item.label === 'SD负面固定包') return;
                        // Don't add render params to Chinese section
                    } else if (item.cn) {
                        cnParts.push(item.cn);
                    }
                });
            });
            if (cnParts.length > 0) {
                promptStr += '\n\n中文参考：' + cnParts.join('、');
            }
        }
```

改为：

```js
        // Build the prompt using PromptEngine (sentence or keyword mode)
        const selections = buildSelectionsList();
        let promptStr = state.format === 'keyword'
            ? PromptEngine.buildKeywordPhrase(selections, state.lang)
            : PromptEngine.buildSentence(selections, state.lang);

        // For 'both' mode, append Chinese translations as reference
        if (state.lang === 'both') {
            let cnParts = [];
            state.data.forEach(function(dim) {
                if (!dimGroups[dim.id]) return;
                dimGroups[dim.id].forEach(function(item) {
                    if (dim.id === 10) {
                        if (item.label === 'SD负面固定包') return;
                        // Don't add render params to Chinese section
                    } else if (item.cn) {
                        cnParts.push(item.cn);
                    }
                });
            });
            if (cnParts.length > 0) {
                promptStr += '\n\n中文参考：' + cnParts.join('、');
            }
        }
```

（`dimGroups` 变量和负面提示词检测逻辑保持不变，仍在这段代码之前定义，本步骤只替换生成 `promptStr` 的部分。）

- [ ] **Step 7: 修改 `app.js`，`bindEvents()` 里新增格式切换按钮的事件绑定**

找到第481-493行的语言切换绑定代码：

```js
        // Language toggle
        document.querySelectorAll('.lang-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.lang-btn').forEach(function(b) {
                    b.classList.remove('active');
                });
                this.classList.add('active');
                state.lang = this.dataset.lang;
                reRenderTags();
                updatePrompt();
            });
        });
```

在其后（`// Clear button` 之前）新增：

```js

        // Format toggle
        document.querySelectorAll('.format-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.format-btn').forEach(function(b) {
                    b.classList.remove('active');
                });
                this.classList.add('active');
                state.format = this.dataset.format;
                updatePrompt();
            });
        });
```

- [ ] **Step 8: 浏览器手动验证（无自动化测试覆盖 DOM 交互，本步骤为人工检查）**

用浏览器打开 `index.html`：
1. 打开开发者工具 Console，确认没有报错（尤其确认 `PromptEngine is not defined` 不出现，验证 `prompt-engine.js` 已正确加载）。
2. 默认"语句模式"下，依次点选：维度7"低角度仰视"、维度3"现代极简"、维度1"急诊中心"、维度4"铝板"、维度5"暖白/米白"、维度6"黄金时刻"、维度8"城市密集区"、维度9"专业冷静"。检查右侧输出是否为完整语法正确的英文句子（类似 "A low-angle / worm's-eye render of a modern minimalist emergency department with ambulance bay, clad in perforated aluminum panel, ..."）。
3. 切换到"关键词模式"，检查输出变为逗号分隔的短语列表，顺序为"视角→风格→主体→材质→色彩→光线→环境→氛围"。
4. 切回"语句模式"，额外点选维度10"MJ标准写实"（`--ar 16:9 ...`），检查该参数是否原样追加在句尾，不参与语法结构。再取消它，改选"V-Ray专业级"，检查是否变成"Rendered in the style of V-Ray 6, ...."追加在句尾。
5. 点选维度10"SD负面固定包"，检查负面提示词框正常出现，且主句/主短语中都不包含负面提示词内容（这部分逻辑本任务未改动，用于确认没有破坏现状）。
6. 切换语言为"中文"，检查语句模式下模板骨架仍是英文单词（如"A", "in a", "color palette"）但填入的是中文词（因为设计文档明确本次不做中文语法模板，只替换填词），确认无 JS 报错、无空白坍塌。
7. 点击"清空选择"，确认输出恢复为初始占位文案，两种格式下都能正确显示占位文案。

若发现任何一步输出不符合预期或报错，记录具体选中的维度组合和实际输出，返回本任务的对应 Step 修正代码（不要进入 Task 6）。

- [ ] **Step 9: 完成后回顾状态**

（跳过 git commit，因项目未初始化 git 仓库；确认以上步骤全部检查通过即视为本任务完成。）

---

### Task 6: 全量端到端验证清单

**Files:** 无代码改动，仅执行验证。

**Interfaces:**
- Consumes: Task 1-5 全部产出（`prompt-engine.js`、更新后的 `data.js`/`app.js`/`index.html`/`style.css`）。
- Produces: 无（验证任务）。

- [ ] **Step 1: 运行完整自动化测试套件**

Run: `cd "G:\SYF_Project\提示词网站" && node --test test/`
Expected: PASS，`prompt-engine.test.js` 和 `data.test.js` 全部通过，无 skipped/failing。

- [ ] **Step 2: 浏览器全维度覆盖检查**

打开 `index.html`，用搜索框依次搜索"体检中心""洁净通透""方岛式""无障碍坡道""间接照明"，确认 Task 3/4 新增的条目都能被搜索到并展开显示所在维度分区（验证新增维度和条目真正被 `renderDimensions`/`handleSearch` 正确渲染，而不只是存在于 `data.js` 里）。

- [ ] **Step 3: 三种语言 × 两种格式的组合矩阵检查**

选中同一组维度（建议：维度1+3+4+7+9各选一条），依次切换 `English/中文/双语` × `语句模式/关键词模式` 共6种组合，检查每种组合下：
- Console 无报错
- 输出文本非空、非"undefined"、非"[object Object]"
- 复制按钮点击后 Toast 提示"已复制到剪贴板"正常出现

- [ ] **Step 4: 清理**

确认没有遗留的调试用 `console.log`（本计划未新增任何 `console.log`，若排查过程中临时加过，在此步骤删除）。检查 `test/` 目录下只有 `prompt-engine.test.js` 和 `data.test.js` 两个文件，没有多余的临时脚本。

验证全部通过后，本次功能迭代（语句化生成引擎 + 双模式输出 + 维度13/14/15 + 维度1/9扩充）完成。
