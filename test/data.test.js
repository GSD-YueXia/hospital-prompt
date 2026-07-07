'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const PROMPT_DATA = require('../data.js');

// 预期每个模块的类别角色（与 prompt-engine RENDER_ROLE_ORDER 对应）
const EXPECTED_MODULE_ROLES = {
  '1': ['constraint_light', 'constraint_medium', 'constraint_high'],
  '2': ['subject'],
  '3': ['material'],
  '4': ['material'],
  '5': ['style'],
  '6': ['color'],
  '7': ['light'],
  '8': ['weather'],
  '9': ['view'],
  '10': ['context'],
  '11': ['mood'],
  '12': ['quality'],
  '13': ['landscape']
};

const ALL_ROLES = new Set(Object.values(EXPECTED_MODULE_ROLES).flat());

test('data.js 可通过 require 加载为数组，共 13 个模块', () => {
  assert.equal(Array.isArray(PROMPT_DATA), true);
  assert.equal(PROMPT_DATA.length, 13);
});

test('每个模块含 id/title/desc/categories 字段，categories 非空', () => {
  PROMPT_DATA.forEach(function (mod) {
    assert.equal(typeof mod.id, 'string');
    assert.equal(typeof mod.title, 'string');
    assert.equal(typeof mod.desc, 'string');
    assert.ok(Array.isArray(mod.categories) && mod.categories.length > 0, 'module ' + mod.id + ' should have non-empty categories');
  });
});

test('每个模块的类别角色与预期一致', () => {
  Object.keys(EXPECTED_MODULE_ROLES).forEach(function (id) {
    const mod = PROMPT_DATA.find(function (m) { return m.id === id; });
    assert.ok(mod, 'module ' + id + ' should exist');
    const roles = mod.categories.map(function (c) { return c.role; });
    assert.deepEqual(roles, EXPECTED_MODULE_ROLES[id], 'module ' + id + ' category roles mismatch');
  });
});

test('所有类别角色都在合法角色集合内', () => {
  PROMPT_DATA.forEach(function (mod) {
    mod.categories.forEach(function (cat) {
      assert.ok(ALL_ROLES.has(cat.role), 'unknown role ' + cat.role + ' in module ' + mod.id);
    });
  });
});

test('每个类别含 title/role/items，且 items 非空、字段完整', () => {
  PROMPT_DATA.forEach(function (mod) {
    mod.categories.forEach(function (cat) {
      assert.equal(typeof cat.title, 'string');
      assert.equal(typeof cat.role, 'string');
      assert.ok(Array.isArray(cat.items) && cat.items.length > 0, 'category in module ' + mod.id + ' should have non-empty items');
      cat.items.forEach(function (item) {
        assert.equal(typeof item.label, 'string');
        assert.equal(typeof item.en, 'string');
        if (item.cn !== undefined) assert.equal(typeof item.cn, 'string');
      });
    });
  });
});

test('模块1(约束类型)包含 轻度/中度/高度 三个类别', () => {
  const mod1 = PROMPT_DATA.find(function (m) { return m.id === '1'; });
  assert.equal(mod1.categories.length, 3);
  assert.deepEqual(mod1.categories.map(function (c) { return c.title; }), ['轻度', '中度', '高度']);
});

test('模块9(视角/镜头)词条带 extra(焦距) 字段', () => {
  const mod9 = PROMPT_DATA.find(function (m) { return m.id === '9'; });
  assert.ok(mod9, 'module 9 should exist');
  const withExtra = mod9.categories[0].items.filter(function (it) { return it.extra; });
  assert.ok(withExtra.length > 0, 'module 9 should have items with extra (焦距) field');
});

test('总词条数不少于 200', () => {
  let total = 0;
  PROMPT_DATA.forEach(function (mod) {
    mod.categories.forEach(function (cat) { total += cat.items.length; });
  });
  assert.ok(total >= 200, 'total items ' + total + ' should be >= 200');
});
