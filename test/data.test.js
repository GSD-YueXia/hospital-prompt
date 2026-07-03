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

test('维度1(建筑主体)条目数不少于24，维度9(氛围情绪)条目数不少于12', () => {
  const dim1 = PROMPT_DATA.find(function (d) { return d.id === 1; });
  const dim9 = PROMPT_DATA.find(function (d) { return d.id === 9; });
  assert.equal(dim1.items.length >= 24, true, 'dimension 1 should have at least 24 items, got ' + dim1.items.length);
  assert.equal(dim9.items.length >= 12, true, 'dimension 9 should have at least 12 items, got ' + dim9.items.length);
});
