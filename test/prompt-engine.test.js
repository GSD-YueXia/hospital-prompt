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
    { role: 'view', en: 'Low-angle / Worm\'s-eye', cn: '' },
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
    'A low-angle / worm\'s-eye render of a modern minimalist / clean lines emergency department with ambulance bay, ' +
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

test('buildSentence: view 角色为元音开头词条时冠词应为 "An"（而非硬编码 "A"）', () => {
  const selections = [
    { role: 'view', en: 'Eye-level / 1.6m height', cn: '' }
  ];
  const result = PromptEngine.buildSentence(selections, 'en');
  assert.equal(result, 'An eye-level / 1.6m height render of a hospital building.');
});

test('buildSentence: color 角色为元音开头词条时冠词应为 "an"（而非硬编码 "a"）', () => {
  const selections = [
    { role: 'subject', en: 'Emergency department', cn: '' },
    { role: 'color', en: 'Earth tone / Terracotta / Beige', cn: '' }
  ];
  const result = PromptEngine.buildSentence(selections, 'en');
  assert.equal(result, 'An emergency department, in an earth tone / terracotta / beige color palette.');
});

test('buildSentence: context 角色为元音开头词条时冠词应为 "an"（而非硬编码 "a"）', () => {
  const selections = [
    { role: 'subject', en: 'Emergency department', cn: '' },
    { role: 'context', en: 'Arid / Desert / Dusty atmosphere', cn: '' }
  ];
  const result = PromptEngine.buildSentence(selections, 'en');
  assert.equal(result, 'An emergency department, set within an arid / desert / dusty atmosphere.');
});

test('buildSentence: context 角色另一元音开头词条(Industrial...)冠词应为 "an"', () => {
  const selections = [
    { role: 'subject', en: 'Emergency department', cn: '' },
    { role: 'context', en: 'Industrial park / Science campus', cn: '' }
  ];
  const result = PromptEngine.buildSentence(selections, 'en');
  assert.equal(result, 'An emergency department, set within an industrial park / science campus.');
});

test('buildSentence: layout 角色为元音开头词条(合成用例)冠词应为 "an"（防御性修复，当前数据集无此场景）', () => {
  const selections = [
    { role: 'subject', en: 'Emergency department', cn: '' },
    { role: 'layout', en: 'Elevated podium form', cn: '' }
  ];
  const result = PromptEngine.buildSentence(selections, 'en');
  assert.equal(result, 'An emergency department, organized as an elevated podium form configuration.');
});

test('buildSentence: mood 角色为元音开头词条(合成用例)冠词应为 "an"（防御性修复，当前数据集无此场景）', () => {
  const selections = [
    { role: 'subject', en: 'Emergency department', cn: '' },
    { role: 'mood', en: 'Airy and calm ambiance', cn: '' }
  ];
  const result = PromptEngine.buildSentence(selections, 'en');
  assert.equal(result, 'An emergency department, evoking an airy and calm ambiance atmosphere.');
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
