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

test('buildSentence: 空选择时返回兜底句子（en / cn）', () => {
  assert.equal(PromptEngine.buildSentence([], 'en'), 'A hospital building.');
  assert.equal(PromptEngine.buildSentence([], 'cn'), '一座医院建筑。');
});

test('buildSentence: 只选主体（subject）', () => {
  const selections = [{ role: 'subject', en: 'emergency department', cn: '急诊科' }];
  assert.equal(PromptEngine.buildSentence(selections, 'en'), 'An emergency department.');
  assert.equal(PromptEngine.buildSentence(selections, 'cn'), '急诊科。');
});

test('buildSentence: 主体 + 视角(view) 生成 "X rendering of a/an Y"', () => {
  const selections = [
    { role: 'view', en: 'Low-angle', cn: '低角度' },
    { role: 'subject', en: 'emergency department', cn: '急诊科' }
  ];
  assert.equal(PromptEngine.buildSentence(selections, 'en'), 'Low-angle rendering of an emergency department.');
  assert.equal(PromptEngine.buildSentence(selections, 'cn'), '低角度视角的急诊科渲染图。');
});

test('buildSentence: 完整组合（en）', () => {
  const selections = [
    { role: 'subject', en: 'emergency department' },
    { role: 'material', en: 'perforated aluminum panel' },
    { role: 'style', en: 'modern minimalist' },
    { role: 'color', en: 'warm white' },
    { role: 'light', en: 'golden hour' },
    { role: 'weather', en: 'clear sky' },
    { role: 'context', en: 'dense urban' },
    { role: 'mood', en: 'clinical precise' },
    { role: 'landscape', en: 'healing garden' },
    { role: 'quality', en: '8K' },
    { role: 'constraint_light', en: 'keep the exact geometry' }
  ];
  assert.equal(
    PromptEngine.buildSentence(selections, 'en'),
    'An emergency department, clad in perforated aluminum panel, in modern minimalist design language, ' +
    'in a warm white color palette, illuminated by golden hour, with clear sky atmosphere, ' +
    'set within a dense urban, evoking a clinical precise atmosphere, surrounded by healing garden, ' +
    'rendered at 8k, Constraints: keep the exact geometry.'
  );
});

test('buildSentence: 同角色多选用逗号+and连接（material）', () => {
  const selections = [
    { role: 'subject', en: 'emergency department' },
    { role: 'material', en: 'perforated aluminum panel' },
    { role: 'material', en: 'exposed architectural concrete' },
    { role: 'material', en: 'natural stone cladding' }
  ];
  assert.equal(
    PromptEngine.buildSentence(selections, 'en'),
    'An emergency department, clad in perforated aluminum panel, exposed architectural concrete and natural stone cladding.'
  );
});

test('buildSentence: cn 完整组合', () => {
  const selections = [
    { role: 'subject', en: 'emergency department', cn: '急诊科' },
    { role: 'color', en: 'warm white', cn: '暖白' },
    { role: 'light', en: 'golden hour', cn: '黄金时刻' },
    { role: 'mood', en: 'clinical precise', cn: '临床精准' }
  ];
  assert.equal(
    PromptEngine.buildSentence(selections, 'cn'),
    '急诊科，暖白色调，黄金时刻照明，营造临床精准氛围。'
  );
});

test('buildSentence: view 角色元音开头词条用 "An"（而非硬编码 "A"）', () => {
  const selections = [{ role: 'view', en: 'eye-level' }];
  assert.equal(PromptEngine.buildSentence(selections, 'en'), 'Eye-level rendering of a hospital building.');
});

test('buildSentence: color 角色元音开头词条用 "an"', () => {
  const selections = [
    { role: 'subject', en: 'emergency department' },
    { role: 'color', en: 'earth tone' }
  ];
  assert.equal(PromptEngine.buildSentence(selections, 'en'), 'An emergency department, in an earth tone color palette.');
});

test('buildSentence: context 角色元音开头词条用 "an"', () => {
  const selections = [
    { role: 'subject', en: 'emergency department' },
    { role: 'context', en: 'arid desert' }
  ];
  assert.equal(PromptEngine.buildSentence(selections, 'en'), 'An emergency department, set within an arid desert.');
});

test('buildSentence: constraints 汇总多个约束等级', () => {
  const selections = [
    { role: 'subject', en: 'hospital' },
    { role: 'constraint_light', en: 'keep proportions' },
    { role: 'constraint_high', en: 'geometry lock' }
  ];
  assert.equal(
    PromptEngine.buildSentence(selections, 'en'),
    'A hospital, Constraints: keep proportions and geometry lock.'
  );
});

test('buildKeywordPhrase: 空选择返回空字符串', () => {
  assert.equal(PromptEngine.buildKeywordPhrase([], 'en'), '');
});

test('buildKeywordPhrase: 按固定角色顺序逗号连接（en）', () => {
  const selections = [
    { role: 'mood', en: 'Clinical precise' },
    { role: 'subject', en: 'emergency department' },
    { role: 'view', en: 'Low-angle' },
    { role: 'style', en: 'Modern minimalist' },
    { role: 'quality', en: '8K' }
  ];
  assert.equal(
    PromptEngine.buildKeywordPhrase(selections, 'en'),
    'emergency department, Modern minimalist, Low-angle, Clinical precise, 8K'
  );
});

test('buildKeywordPhrase: cn 语言模式使用中文词', () => {
  const selections = [
    { role: 'subject', en: 'emergency department', cn: '急诊科' },
    { role: 'style', en: 'Modern minimalist', cn: '现代极简' }
  ];
  assert.equal(PromptEngine.buildKeywordPhrase(selections, 'cn'), '急诊科, 现代极简');
});
