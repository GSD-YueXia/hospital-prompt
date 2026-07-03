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
