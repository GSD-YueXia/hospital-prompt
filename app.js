/**
 * 医院建筑 AI 提示词生成器
 * 核心逻辑：点击维度标签 → 自动组合生成完整 AI 提示词
 * 效果图模式：扁平结构 data.js
 * 分析图模式：三级嵌套结构 analysis-data.js（模块1-8 → 类别 → 词条）
 */

(function() {
    'use strict';

    // ===== State =====
    const state = {
        selected: new Map(), // key: "moduleId::catIdx::itemIdx" (analysis) or "dimId-itemIdx" (rendering)
        lang: 'en',          // 'en' | 'cn' | 'both'
        format: 'sentence',  // 'sentence' | 'keyword'
        mode: 'rendering',   // 'rendering' | 'analysis'
        data: PROMPT_DATA    // from data.js (rendering) or ANALYSIS_PROMPT_DATA (analysis)
    };

    // ===== DOM Refs =====
    const dimensionsPanel = document.getElementById('dimensionsPanel');
    const selectedTags = document.getElementById('selectedTags');
    const promptText = document.getElementById('promptText');
    const negativePromptText = document.getElementById('negativePromptText');
    const negativePromptBox = document.getElementById('negativePromptBox');
    const previewCount = document.getElementById('previewCount');
    const searchInput = document.getElementById('searchInput');
    const toast = document.getElementById('toast');

    // ===== Init =====
    function init() {
        renderDimensions();
        bindEvents();
        updatePrompt();
    }

    // ===== Render Dimensions =====
    function renderDimensions() {
        if (state.mode === 'analysis') {
            renderAnalysisDimensions();
        } else {
            renderRenderingDimensions();
        }
    }

    // ---------------------------------------------------------------
    // 效果图模式渲染 (扁平结构)
    // ---------------------------------------------------------------
    function renderRenderingDimensions() {
        var html = buildSearchBarHtml();

        // Nav dots index bar
        html += '<div class="nav-dots-bar" id="navDotsBar">';
        state.data.forEach(function(dim) {
            var catClass = getDimCategoryClass(dim.id);
            html += '<button class="nav-dot ' + catClass + '" data-dim-id="' + dim.id + '" title="' + dim.title + '" tabindex="0" aria-label="跳转到' + dim.title + '">' + dim.id + '</button>';
        });
        html += '</div>';

        state.data.forEach(function(dim) {
            var catClass = getDimCategoryClass(dim.id);
            var hasRadioBadge = (dim.col_layout === 'render_param') ? '<span class="radio-badge">单选</span>' : '';

            var tagsHtml = dim.items.map(function(item, idx) {
                return renderRenderingTag(dim, item, idx);
            }).join('');

            html += '<div class="dimension-section ' + catClass + (dim.col_layout === 'render_param' ? ' dim-single-select' : '') + '" data-dim-id="' + dim.id + '" id="dimSection-' + dim.id + '">' +
                '<div class="dimension-header" data-dim-id="' + dim.id + '" tabindex="0" role="button" aria-expanded="true">' +
                    '<div class="dimension-header-left">' +
                        '<span class="dimension-number">' + dim.id + '</span>' +
                        '<span class="dimension-title">' + dim.title + hasRadioBadge + '</span>' +
                    '</div>' +
                    '<div class="dimension-header-right">' +
                        '<span class="dimension-count" id="count-' + dim.id + '">' + dim.items.length + '</span>' +
                        '<svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">' +
                            '<polyline points="6 9 12 15 18 9"/>' +
                        '</svg>' +
                    '</div>' +
                '</div>' +
                '<div class="dimension-body">' +
                    '<div class="dimension-tags" data-dim-id="' + dim.id + '">' +
                        tagsHtml +
                    '</div>' +
                '</div>' +
            '</div>';
        });

        html += buildBackToTopHtml();
        dimensionsPanel.innerHTML = html;
        bindTagEvents();
        bindHeaderEvents();
        bindNavDotEvents();
        bindScrollTracking();
        bindBackToTop();
    }

    // ---------------------------------------------------------------
    // 分析图模式渲染 (三级嵌套: 模块 → 类别 → 词条)
    // ---------------------------------------------------------------
    function renderAnalysisDimensions() {
        var html = buildSearchBarHtml();

        // Nav dots for modules M00-M07
        html += '<div class="nav-dots-bar" id="navDotsBar">';
        state.data.forEach(function(mod) {
            var catClass = getModuleDotClass(mod.id);
            html += '<button class="nav-dot ' + catClass + '" data-module-id="' + mod.id + '" title="' + mod.id + ' ' + mod.title + '" tabindex="0" aria-label="跳转到' + mod.id + ' ' + mod.title + '">' + mod.id + '</button>';
        });
        html += '</div>';

        // Modules
        state.data.forEach(function(mod) {
            var modCatClass = getModuleSectionClass(mod.id);

            html += '<div class="module-section ' + modCatClass + '" data-module-id="' + mod.id + '" id="moduleSection-' + mod.id + '">';

            // Module header
            html += '<div class="module-header" data-module-id="' + mod.id + '" tabindex="0" role="button" aria-expanded="true">' +
                '<div class="module-header-left">' +
                    '<span class="module-badge">' + mod.id + '</span>' +
                    '<span class="module-title">' + mod.title + '</span>' +
                    '<span class="module-desc">' + mod.desc + '</span>' +
                '</div>' +
                '<div class="module-header-right">' +
                    '<span class="module-count" id="moduleCount-' + mod.id + '">' + getModuleTotalItems(mod) + '</span>' +
                    '<svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">' +
                        '<polyline points="6 9 12 15 18 9"/>' +
                    '</svg>' +
                '</div>' +
            '</div>';

            // Module body - categories
            html += '<div class="module-body">';
            mod.categories.forEach(function(cat, catIdx) {
                html += '<div class="category-section" data-module-id="' + mod.id + '" data-cat-idx="' + catIdx + '" id="catSection-' + mod.id + '-cat' + catIdx + '">';

                // Category header
                html += '<div class="category-header" data-module-id="' + mod.id + '" data-cat-idx="' + catIdx + '" tabindex="0" role="button" aria-expanded="true">' +
                    '<div class="category-header-left">' +
                        '<span class="category-title">' + cat.title + '</span>' +
                    '</div>' +
                    '<div class="category-header-right">' +
                        '<span class="category-count" id="catCount-' + mod.id + '-cat' + catIdx + '">' + cat.items.length + '</span>' +
                        '<svg class="chevron chevron-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">' +
                            '<polyline points="6 9 12 15 18 9"/>' +
                        '</svg>' +
                    '</div>' +
                '</div>';

                // Category body - tags
                html += '<div class="category-body">' +
                    '<div class="dimension-tags" data-module-id="' + mod.id + '" data-cat-idx="' + catIdx + '">';

                cat.items.forEach(function(item, itemIdx) {
                    html += renderAnalysisTag(mod, cat, item, catIdx, itemIdx);
                });

                html += '</div></div>'; // close category-body
                html += '</div>'; // close category-section
            });

            html += '</div>'; // close module-body
            html += '</div>'; // close module-section
        });

        html += buildBackToTopHtml();
        dimensionsPanel.innerHTML = html;

        // Bind events
        bindAnalysisTagEvents();
        bindModuleHeaderEvents();
        bindCategoryHeaderEvents();
        bindAnalysisNavDotEvents();
        bindScrollTracking();
        bindBackToTop();
    }

    function buildSearchBarHtml() {
        return '<div class="search-bar">' +
            '<svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">' +
                '<circle cx="11" cy="11" r="8"/>' +
                '<path d="m21 21-4.35-4.35"/>' +
            '</svg>' +
            '<input type="text" id="searchInputInner" placeholder="搜索提示词（中英文）..." class="search-input">' +
            '<span class="search-info" id="searchInfo"></span>' +
        '</div>';
    }

    function buildBackToTopHtml() {
        return '<button class="btn-back-to-top" id="btnBackToTop" title="返回顶部" aria-label="返回顶部">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">' +
                '<polyline points="18 15 12 9 6 15"/>' +
            '</svg>' +
        '</button>';
    }

    // ===== Render Rendering Tag =====
    function renderRenderingTag(dim, item, idx) {
        var key = dim.id + '-' + idx;
        var isSelected = state.selected.has(key);
        var tagContent = buildTagContent(item);
        var cls = isSelected ? 'tag selected' : 'tag';
        return '<span class="' + cls + '" data-dim-id="' + dim.id + '" data-item-idx="' + idx + '" data-key="' + key + '" tabindex="0" role="checkbox" aria-checked="' + (isSelected ? 'true' : 'false') + '">' +
            tagContent +
        '</span>';
    }

    // ===== Render Analysis Tag =====
    function renderAnalysisTag(mod, cat, item, catIdx, itemIdx) {
        var key = mod.id + '::' + catIdx + '::' + itemIdx;
        var isSelected = state.selected.has(key);
        var tagContent = buildTagContent(item);
        var cls = isSelected ? 'tag selected' : 'tag';
        return '<span class="' + cls + '" data-module-id="' + mod.id + '" data-cat-idx="' + catIdx + '" data-item-idx="' + itemIdx + '" data-key="' + key + '" tabindex="0" role="checkbox" aria-checked="' + (isSelected ? 'true' : 'false') + '">' +
            tagContent +
        '</span>';
    }

    function buildTagContent(item) {
        var content = '<span class="tag-label">' + item.label + '</span>';
        if (item.en && state.lang !== 'cn') {
            content += '<span class="tag-en">' + item.en + '</span>';
        }
        if (item.cn && state.lang !== 'en') {
            content += '<span class="tag-en">' + item.cn + '</span>';
        }
        if (item.extra) {
            content += '<span class="tag-extra">' + item.extra + '</span>';
        }
        if (item.effect) {
            content += '<span class="tag-effect">' + item.effect + '</span>';
        }
        if (item.tool) {
            content += '<span class="tag-tool">' + item.tool + '</span>';
        }
        return content;
    }

    // ===== Event Binding =====

    function bindTagEvents() {
        document.querySelectorAll('.tag').forEach(function(tag) {
            tag.addEventListener('click', function() {
                var dimId = parseInt(this.dataset.dimId);
                var itemIdx = parseInt(this.dataset.itemIdx);
                toggleRenderingSelection(dimId, itemIdx, this);
            });
            tag.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    var dimId = parseInt(this.dataset.dimId);
                    var itemIdx = parseInt(this.dataset.itemIdx);
                    toggleRenderingSelection(dimId, itemIdx, this);
                }
            });
        });
    }

    function bindAnalysisTagEvents() {
        document.querySelectorAll('.tag').forEach(function(tag) {
            tag.addEventListener('click', function() {
                var moduleId = this.dataset.moduleId;
                var catIdx = parseInt(this.dataset.catIdx);
                var itemIdx = parseInt(this.dataset.itemIdx);
                toggleAnalysisSelection(moduleId, catIdx, itemIdx, this);
            });
            tag.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    var moduleId = this.dataset.moduleId;
                    var catIdx = parseInt(this.dataset.catIdx);
                    var itemIdx = parseInt(this.dataset.itemIdx);
                    toggleAnalysisSelection(moduleId, catIdx, itemIdx, this);
                }
            });
        });
    }

    function bindHeaderEvents() {
        document.querySelectorAll('.dimension-header').forEach(function(header) {
            header.addEventListener('click', function() {
                var section = this.closest('.dimension-section');
                section.classList.toggle('collapsed');
                var expanded = !section.classList.contains('collapsed');
                this.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            });
            header.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }

    function bindModuleHeaderEvents() {
        document.querySelectorAll('.module-header').forEach(function(header) {
            header.addEventListener('click', function() {
                var section = this.closest('.module-section');
                section.classList.toggle('collapsed');
                var expanded = !section.classList.contains('collapsed');
                this.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            });
            header.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }

    function bindCategoryHeaderEvents() {
        document.querySelectorAll('.category-header').forEach(function(header) {
            header.addEventListener('click', function() {
                var section = this.closest('.category-section');
                section.classList.toggle('collapsed');
                var expanded = !section.classList.contains('collapsed');
                this.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            });
            header.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }

    function bindNavDotEvents() {
        document.querySelectorAll('.nav-dot').forEach(function(dot) {
            dot.addEventListener('click', function() {
                var dimId = this.dataset.dimId;
                var section = document.getElementById('dimSection-' + dimId);
                if (section) {
                    section.classList.remove('collapsed');
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    function bindAnalysisNavDotEvents() {
        document.querySelectorAll('.nav-dot').forEach(function(dot) {
            dot.addEventListener('click', function() {
                var moduleId = this.dataset.moduleId;
                var section = document.getElementById('moduleSection-' + moduleId);
                if (section) {
                    section.classList.remove('collapsed');
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    function bindBackToTop() {
        var btnBackToTop = document.getElementById('btnBackToTop');
        if (btnBackToTop) {
            btnBackToTop.addEventListener('click', function() {
                dimensionsPanel.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    // ===== Toggle Selection =====

    function toggleRenderingSelection(dimId, itemIdx, tagEl) {
        var key = dimId + '-' + itemIdx;
        var dim = state.data.find(function(d) { return d.id === dimId; });
        if (!dim) return;
        var item = dim.items[itemIdx];
        if (!item) return;

        if (state.selected.has(key)) {
            state.selected.delete(key);
            tagEl.classList.remove('selected');
            tagEl.setAttribute('aria-checked', 'false');
        } else {
            // For dim 10 (render param), only one selection
            if (dimId === 10) {
                state.selected.forEach(function(val, k) {
                    if (k.startsWith('10-')) {
                        state.selected.delete(k);
                        var existingTag = document.querySelector('.tag[data-key="' + k + '"]');
                        if (existingTag) existingTag.classList.remove('selected');
                    }
                });
            }
            state.selected.set(key, { dimId: dimId, itemIdx: itemIdx, item: item, dimTitle: dim.title });
            tagEl.classList.add('selected');
            tagEl.setAttribute('aria-checked', 'true');
        }

        updateSelectedTags();
        updateDimensionCounts();
        updatePrompt();
    }

    function toggleAnalysisSelection(moduleId, catIdx, itemIdx, tagEl) {
        var key = moduleId + '::' + catIdx + '::' + itemIdx;
        var mod = findModule(moduleId);
        if (!mod) return;
        var cat = mod.categories[catIdx];
        if (!cat) return;
        var item = cat.items[itemIdx];
        if (!item) return;

        if (state.selected.has(key)) {
            state.selected.delete(key);
            tagEl.classList.remove('selected');
            tagEl.setAttribute('aria-checked', 'false');
        } else {
            state.selected.set(key, {
                moduleId: moduleId,
                catIdx: catIdx,
                itemIdx: itemIdx,
                item: item,
                role: cat.role,
                moduleTitle: mod.title,
                catTitle: cat.title
            });
            tagEl.classList.add('selected');
            tagEl.setAttribute('aria-checked', 'true');
        }

        updateSelectedTags();
        updateDimensionCounts();
        updatePrompt();
    }

    // ===== Update Selected Tags Display =====
    function updateSelectedTags() {
        if (state.selected.size === 0) {
            selectedTags.innerHTML = '<div class="empty-hint">从左侧选择提示词，将自动生成完整提示语</div>';
            return;
        }

        var html = '';
        state.selected.forEach(function(val, key) {
            var label = val.item.label;
            var badge;

            if (state.mode === 'analysis') {
                badge = '<span class="selected-tag-dim">' + val.moduleId + '</span>';
            } else {
                badge = '<span class="selected-tag-dim">D' + val.dimId + '</span>';
            }

            html += '<span class="selected-tag" data-key="' + key + '">' +
                badge + label +
                '<button class="selected-tag-remove" data-key="' + key + '" title="移除">&times;</button>' +
            '</span>';
        });
        selectedTags.innerHTML = html;

        // Bind remove buttons
        selectedTags.querySelectorAll('.selected-tag-remove').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                removeSelection(this.dataset.key);
            });
        });

        // Bind tag click → scroll
        selectedTags.querySelectorAll('.selected-tag').forEach(function(tag) {
            tag.addEventListener('click', function(e) {
                if (e.target.closest('.selected-tag-remove')) return;
                scrollToSelection(this.dataset.key);
            });
        });
    }

    // ===== Remove Selection =====
    function removeSelection(key) {
        if (!state.selected.has(key)) return;
        state.selected.delete(key);

        var tagEl = document.querySelector('.tag[data-key="' + key + '"]');
        if (tagEl) tagEl.classList.remove('selected');

        updateSelectedTags();
        updateDimensionCounts();
        updatePrompt();
    }

    // ===== Scroll to Selection =====
    function scrollToSelection(key) {
        var tagEl = document.querySelector('.tag[data-key="' + key + '"]');
        if (!tagEl) return;

        // Expand all parent containers
        var catSection = tagEl.closest('.category-section');
        if (catSection) catSection.classList.remove('collapsed');
        var modSection = tagEl.closest('.module-section');
        if (modSection) modSection.classList.remove('collapsed');

        tagEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Pulse highlight
        tagEl.classList.add('pulse-highlight');
        setTimeout(function() { tagEl.classList.remove('pulse-highlight'); }, 1500);
    }

    // ===== Update Dimension Counts =====
    function updateDimensionCounts() {
        if (state.mode === 'analysis') {
            updateAnalysisCounts();
        } else {
            updateRenderingCounts();
        }
        updateNavDotSelectionState();
    }

    function updateRenderingCounts() {
        state.data.forEach(function(dim) {
            var countEl = document.getElementById('count-' + dim.id);
            if (countEl) {
                countEl.textContent = dim.items.length;
                countEl.classList.remove('has-selection');
            }
        });

        var counts = {};
        state.selected.forEach(function(val) {
            counts[val.dimId] = (counts[val.dimId] || 0) + 1;
        });

        Object.keys(counts).forEach(function(dimId) {
            var countEl = document.getElementById('count-' + dimId);
            if (countEl) {
                var dim = state.data.find(function(d) { return d.id === parseInt(dimId); });
                var total = dim ? dim.items.length : 0;
                countEl.textContent = counts[dimId] + '/' + total;
                countEl.classList.add('has-selection');
            }
        });
    }

    function updateAnalysisCounts() {
        state.data.forEach(function(mod) {
            // Update module total count
            var modTotal = getModuleTotalItems(mod);
            var modSelected = 0;

            mod.categories.forEach(function(cat, catIdx) {
                var countEl = document.getElementById('catCount-' + mod.id + '-cat' + catIdx);
                var selectedInCat = 0;
                state.selected.forEach(function(val) {
                    if (val.moduleId === mod.id && val.catIdx === catIdx) selectedInCat++;
                });
                modSelected += selectedInCat;

                if (countEl) {
                    if (selectedInCat > 0) {
                        countEl.textContent = selectedInCat + '/' + cat.items.length;
                        countEl.classList.add('has-selection');
                    } else {
                        countEl.textContent = cat.items.length;
                        countEl.classList.remove('has-selection');
                    }
                }
            });

            // Update module count badge
            var modCountEl = document.getElementById('moduleCount-' + mod.id);
            if (modCountEl) {
                if (modSelected > 0) {
                    modCountEl.textContent = modSelected + '/' + modTotal;
                    modCountEl.classList.add('has-selection');
                } else {
                    modCountEl.textContent = modTotal;
                    modCountEl.classList.remove('has-selection');
                }
            }
        });
    }

    function getModuleTotalItems(mod) {
        var total = 0;
        mod.categories.forEach(function(cat) { total += cat.items.length; });
        return total;
    }

    // ===== Scroll Tracking =====
    var scrollTrackingTimer = null;
    var scrollTrackingBound = false;
    function bindScrollTracking() {
        if (scrollTrackingBound) return;
        scrollTrackingBound = true;
        dimensionsPanel.addEventListener('scroll', function() {
            if (scrollTrackingTimer) clearTimeout(scrollTrackingTimer);
            scrollTrackingTimer = setTimeout(updateNavDotActive, 80);
            updateBackToTopVisibility();
        });
    }

    function updateNavDotActive() {
        var scrollTop = dimensionsPanel.scrollTop;
        var panelHeight = dimensionsPanel.clientHeight;
        var currentId = null;

        if (state.mode === 'analysis') {
            // Track module sections
            document.querySelectorAll('.module-section').forEach(function(section) {
                var rect = section.getBoundingClientRect();
                var panelRect = dimensionsPanel.getBoundingClientRect();
                var relativeTop = rect.top - panelRect.top;
                if (relativeTop >= -20 && relativeTop < panelHeight * 0.4) {
                    currentId = section.dataset.moduleId;
                }
            });
        } else {
            document.querySelectorAll('.dimension-section').forEach(function(section) {
                var rect = section.getBoundingClientRect();
                var panelRect = dimensionsPanel.getBoundingClientRect();
                var relativeTop = rect.top - panelRect.top;
                if (relativeTop >= -20 && relativeTop < panelHeight * 0.4) {
                    currentId = section.dataset.dimId;
                }
            });
        }

        document.querySelectorAll('.nav-dot').forEach(function(dot) {
            dot.classList.remove('active');
            var dotId = state.mode === 'analysis' ? dot.dataset.moduleId : dot.dataset.dimId;
            if (dotId === currentId) {
                dot.classList.add('active');
            }
        });
    }

    function updateBackToTopVisibility() {
        var btn = document.getElementById('btnBackToTop');
        if (!btn) return;
        if (dimensionsPanel.scrollTop > dimensionsPanel.clientHeight * 0.4) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    }

    function updateNavDotSelectionState() {
        document.querySelectorAll('.nav-dot').forEach(function(dot) {
            dot.classList.remove('has-selection');
        });

        state.selected.forEach(function(val) {
            var dotId = state.mode === 'analysis' ? val.moduleId : val.dimId;
            var selector = state.mode === 'analysis' ? '.nav-dot[data-module-id="' + dotId + '"]' : '.nav-dot[data-dim-id="' + dotId + '"]';
            var dot = document.querySelector(selector);
            if (dot) dot.classList.add('has-selection');
        });
        updateNavDotActive();
    }

    // ===== Category Color Mapping =====
    function getDimCategoryClass(dimId) {
        if (state.mode === 'analysis') {
            // This function is only called in rendering mode now
            // Analysis mode uses getModuleSectionClass
            return '';
        }
        // Rendering mode
        if (dimId === 1 || dimId === 2) return 'dot-cat-structure dim-cat-structure';
        if (dimId === 3 || dimId === 5 || dimId === 6 || dimId === 7 || dimId === 13) return 'dot-cat-style dim-cat-style';
        if (dimId === 4) return 'dot-cat-material dim-cat-material';
        if (dimId === 8 || dimId === 9 || dimId === 12) return 'dot-cat-environment dim-cat-environment';
        if (dimId === 10) return 'dot-cat-tech dim-cat-tech';
        if (dimId === 11 || dimId === 14 || dimId === 15) return 'dot-cat-interior dim-cat-interior';
        return '';
    }

    function getModuleDotClass(moduleId) {
        var classMap = {
            '1': 'dot-cat-m00',
            '2': 'dot-cat-m01',
            '3': 'dot-cat-m02',
            '4': 'dot-cat-m03',
            '5': 'dot-cat-m04',
            '6': 'dot-cat-m05',
            '7': 'dot-cat-m06',
            '8': 'dot-cat-m07'
        };
        return classMap[moduleId] || '';
    }

    function getModuleSectionClass(moduleId) {
        var classMap = {
            '1': 'dim-cat-m00',
            '2': 'dim-cat-m01',
            '3': 'dim-cat-m02',
            '4': 'dim-cat-m03',
            '5': 'dim-cat-m04',
            '6': 'dim-cat-m05',
            '7': 'dim-cat-m06',
            '8': 'dim-cat-m07'
        };
        return classMap[moduleId] || '';
    }

    // ===== Find Module =====
    function findModule(moduleId) {
        return state.data.find(function(m) { return m.id === moduleId; });
    }

    // ===== Build Selections List for PromptEngine =====
    function buildSelectionsList() {
        var list = [];
        if (state.mode === 'analysis') {
            state.data.forEach(function(mod) {
                state.selected.forEach(function(val) {
                    if (val.moduleId !== mod.id) return;
                    list.push({ role: val.role, en: val.item.en, cn: val.item.cn });
                });
            });
        } else {
            state.data.forEach(function(dim) {
                state.selected.forEach(function(val) {
                    if (val.dimId !== dim.id) return;
                    if (dim.id === 10 && val.item.label === 'SD负面固定包') return;
                    list.push({ role: dim.role, en: val.item.en, cn: val.item.cn });
                });
            });
        }
        return list;
    }

    // ===== Generate Prompt =====
    function updatePrompt() {
        var count = state.selected.size;
        previewCount.textContent = count + ' 项已选';
        if (count > 0) {
            previewCount.classList.add('has-items');
        } else {
            previewCount.classList.remove('has-items');
        }

        if (count === 0) {
            promptText.innerHTML = '<span class="prompt-placeholder">选择提示词后，完整提示语将显示在此处...</span>';
            negativePromptBox.style.display = 'none';
            document.getElementById('btnCopyNegative').style.display = 'none';
            return;
        }

        // Build prompt
        var selections = buildSelectionsList();
        var promptStr;
        if (state.mode === 'analysis') {
            promptStr = state.format === 'keyword'
                ? PromptEngine.buildAnalysisKeyword(selections, state.lang)
                : PromptEngine.buildAnalysisSentence(selections, state.lang);
        } else {
            promptStr = state.format === 'keyword'
                ? PromptEngine.buildKeywordPhrase(selections, state.lang)
                : PromptEngine.buildSentence(selections, state.lang);
        }

        // 'both' mode - append Chinese
        if (state.lang === 'both' && state.mode === 'rendering') {
            var dimGroups = {};
            state.data.forEach(function(dim) {
                state.selected.forEach(function(val) {
                    if (val.dimId !== dim.id) return;
                    if (!dimGroups[dim.id]) dimGroups[dim.id] = [];
                    dimGroups[dim.id].push(val.item);
                });
            });
            var cnParts = [];
            state.data.forEach(function(dim) {
                if (!dimGroups[dim.id]) return;
                dimGroups[dim.id].forEach(function(item) {
                    if (dim.id === 10 && item.label === 'SD负面固定包') return;
                    if (item.cn) cnParts.push(item.cn);
                });
            });
            if (cnParts.length > 0) {
                promptStr += '\n\n中文参考：' + cnParts.join('、');
            }
        }

        promptText.textContent = promptStr;

        // Handle negative prompt (rendering mode only)
        if (state.mode === 'rendering') {
            var hasNegative = false;
            var negPrompt = '';
            state.selected.forEach(function(val) {
                if (val.item.label === 'SD负面固定包') {
                    hasNegative = true;
                    negPrompt = val.item.en;
                }
            });
            if (hasNegative) {
                negativePromptBox.style.display = 'flex';
                negativePromptText.textContent = negPrompt;
                document.getElementById('btnCopyNegative').style.display = 'flex';
            } else {
                negativePromptBox.style.display = 'none';
                document.getElementById('btnCopyNegative').style.display = 'none';
            }
        } else {
            negativePromptBox.style.display = 'none';
            document.getElementById('btnCopyNegative').style.display = 'none';
        }
    }

    // ===== Search =====
    function handleSearch(query) {
        query = query.trim().toLowerCase();
        var searchInfo = document.getElementById('searchInfo');
        if (!searchInfo) return;

        if (!query) {
            searchInfo.textContent = '';
            searchInfo.className = 'search-info';
            document.querySelectorAll('.tag').forEach(function(tag) { tag.classList.remove('hidden'); });
            if (state.mode === 'analysis') {
                document.querySelectorAll('.module-section').forEach(function(s) { s.style.display = ''; });
                document.querySelectorAll('.category-section').forEach(function(s) { s.style.display = ''; });
            } else {
                document.querySelectorAll('.dimension-section').forEach(function(s) { s.style.display = ''; });
            }
            return;
        }

        var totalMatches = 0;

        if (state.mode === 'analysis') {
            document.querySelectorAll('.module-section').forEach(function(modSection) {
                var modHasMatch = false;
                modSection.querySelectorAll('.category-section').forEach(function(catSection) {
                    var catHasMatch = false;
                    catSection.querySelectorAll('.tag').forEach(function(tag) {
                        var text = tag.textContent.toLowerCase();
                        if (text.indexOf(query) !== -1) {
                            tag.classList.remove('hidden');
                            catHasMatch = true;
                            totalMatches++;
                        } else {
                            tag.classList.add('hidden');
                        }
                    });
                    catSection.style.display = catHasMatch ? '' : 'none';
                    if (catHasMatch) {
                        catSection.classList.remove('collapsed');
                        modHasMatch = true;
                    }
                });
                modSection.style.display = modHasMatch ? '' : 'none';
                if (modHasMatch) {
                    modSection.classList.remove('collapsed');
                }
            });
        } else {
            document.querySelectorAll('.dimension-section').forEach(function(section) {
                var hasMatch = false;
                section.querySelectorAll('.tag').forEach(function(tag) {
                    var text = tag.textContent.toLowerCase();
                    if (text.indexOf(query) !== -1) {
                        tag.classList.remove('hidden');
                        hasMatch = true;
                        totalMatches++;
                    } else {
                        tag.classList.add('hidden');
                    }
                });
                section.style.display = hasMatch ? '' : 'none';
                if (hasMatch) {
                    section.classList.remove('collapsed');
                    var header = section.querySelector('.dimension-header');
                    if (header) header.setAttribute('aria-expanded', 'true');
                }
            });
        }

        if (totalMatches > 0) {
            searchInfo.textContent = totalMatches + ' 个匹配';
            searchInfo.className = 'search-info has-results';
        } else {
            searchInfo.textContent = '无匹配结果';
            searchInfo.className = 'search-info no-results';
        }
    }

    // ===== Re-render Tags (for language switch) =====
    function reRenderTags() {
        if (state.mode === 'analysis') {
            state.data.forEach(function(mod) {
                mod.categories.forEach(function(cat, catIdx) {
                    var tagsContainer = document.querySelector('.dimension-tags[data-module-id="' + mod.id + '"][data-cat-idx="' + catIdx + '"]');
                    if (!tagsContainer) return;

                    cat.items.forEach(function(item, itemIdx) {
                        var tagEl = tagsContainer.querySelector('.tag[data-item-idx="' + itemIdx + '"]');
                        if (!tagEl) return;
                        tagEl.innerHTML = buildTagContent(item);
                        var key = mod.id + '::' + catIdx + '::' + itemIdx;
                        var isSelected = state.selected.has(key);
                        tagEl.setAttribute('aria-checked', isSelected ? 'true' : 'false');
                        tagEl.setAttribute('tabindex', '0');
                    });
                });
            });
        } else {
            state.data.forEach(function(dim) {
                var tagsContainer = document.querySelector('.dimension-tags[data-dim-id="' + dim.id + '"]');
                if (!tagsContainer) return;
                dim.items.forEach(function(item, idx) {
                    var tagEl = tagsContainer.querySelector('.tag[data-item-idx="' + idx + '"]');
                    if (!tagEl) return;
                    tagEl.innerHTML = buildTagContent(item);
                    var key = dim.id + '-' + idx;
                    var isSelected = state.selected.has(key);
                    tagEl.setAttribute('aria-checked', isSelected ? 'true' : 'false');
                    tagEl.setAttribute('tabindex', '0');
                });
            });
        }
    }

    // ===== Mode Switch =====
    function switchMode(newMode) {
        state.mode = newMode;
        state.data = (newMode === 'analysis') ? ANALYSIS_PROMPT_DATA : PROMPT_DATA;
        state.selected.clear();
        scrollTrackingBound = false;
        renderDimensions();
        updateSelectedTags();
        updatePrompt();
        bindSearchEvents();
        showToast(newMode === 'analysis' ? '已切换到分析图模式' : '已切换到效果图模式');
    }

    function bindSearchEvents() {
        var searchInputInner = document.getElementById('searchInputInner');
        if (searchInputInner) {
            searchInputInner.addEventListener('input', function() {
                handleSearch(this.value);
            });
        }
    }

    // ===== Clear All =====
    function clearAll() {
        state.selected.clear();
        document.querySelectorAll('.tag.selected').forEach(function(tag) {
            tag.classList.remove('selected');
        });
        updateSelectedTags();
        updateDimensionCounts();
        updatePrompt();
        showToast('已清空所有选择');
    }

    // ===== Copy to Clipboard =====
    function copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(function() {
                showToast('已复制到剪贴板');
            }).catch(function() {
                fallbackCopy(text);
            });
        } else {
            fallbackCopy(text);
        }
    }

    function fallbackCopy(text) {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showToast('已复制到剪贴板');
        } catch (err) {
            showToast('复制失败，请手动复制');
        }
        document.body.removeChild(textarea);
    }

    // ===== Toast =====
    var toastTimer = null;
    function showToast(msg) {
        toast.textContent = msg;
        toast.classList.add('show');
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(function() {
            toast.classList.remove('show');
        }, 2000);
    }

    // ===== Bind Main Events =====
    function bindEvents() {
        // Language toggle
        document.querySelectorAll('.lang-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.lang-btn').forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');
                state.lang = this.dataset.lang;
                reRenderTags();
                updatePrompt();
            });
        });

        // Format toggle
        document.querySelectorAll('.format-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.format-btn').forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');
                state.format = this.dataset.format;
                updatePrompt();
            });
        });

        // Mode switch
        document.querySelectorAll('.mode-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var newMode = this.dataset.mode;
                if (state.mode === newMode) return;
                document.querySelectorAll('.mode-btn').forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');
                switchMode(newMode);
            });
        });

        // Clear button
        document.getElementById('btnClear').addEventListener('click', clearAll);

        // Copy button
        document.getElementById('btnCopy').addEventListener('click', function() {
            var text = promptText.textContent.trim();
            if (text && !text.startsWith('选择提示词后')) {
                copyToClipboard(text);
            } else {
                showToast('请先选择提示词');
            }
        });

        // Copy negative prompt
        document.getElementById('btnCopyNegative').addEventListener('click', function() {
            var text = negativePromptText.textContent.trim();
            if (text) copyToClipboard(text);
        });

        // Search events (initial bind)
        bindSearchEvents();

        // Image analysis
        bindImageAnalysisEvents();
    }

    // ===== Image Analysis =====
    var imageAnalysis = {
        currentImageBase64: null,
        currentResult: null,
        matchedTags: []
    };

    var HISTORY_STORAGE_KEY = 'hospital_building_image_history';
    var HISTORY_MAX_ITEMS = 10;

    function bindImageAnalysisEvents() {
        var overlay = document.getElementById('imageModalOverlay');
        var btnOpen = document.getElementById('btnImageAnalysis');
        var btnClose = document.getElementById('imageModalClose');
        var uploadZone = document.getElementById('uploadZone');
        var fileInput = document.getElementById('imageFileInput');
        var btnReupload = document.getElementById('btnReupload');
        var btnAnalyze = document.getElementById('btnAnalyze');
        var btnSaveKey = document.getElementById('btnSaveKey');
        var apiKeyInput = document.getElementById('apiKeyInput');
        var btnApplyTags = document.getElementById('btnApplyTags');
        var btnCopyImagePrompt = document.getElementById('btnCopyImagePrompt');

        // Tab switching
        var tabCurrent = document.getElementById('tabCurrent');
        var tabHistory = document.getElementById('tabHistory');
        var panelCurrent = document.getElementById('tabPanelCurrent');
        var panelHistory = document.getElementById('tabPanelHistory');

        tabCurrent.addEventListener('click', function() { switchTab('current'); });
        tabHistory.addEventListener('click', function() { switchTab('history'); renderHistory(); });

        function switchTab(tab) {
            var tabs = document.querySelectorAll('.image-modal-tab');
            var panels = document.querySelectorAll('.image-modal-tab-panel');
            tabs.forEach(function(t) { t.classList.remove('active'); });
            panels.forEach(function(p) { p.classList.remove('active'); });
            if (tab === 'current') {
                tabCurrent.classList.add('active');
                panelCurrent.classList.add('active');
            } else {
                tabHistory.classList.add('active');
                panelHistory.classList.add('active');
            }
        }

        btnOpen.addEventListener('click', function() {
            overlay.classList.add('show');
            var savedKey = localStorage.getItem('deepseek_api_key') || '';
            if (savedKey) apiKeyInput.value = savedKey;
            switchTab('current');
        });

        btnClose.addEventListener('click', function() { overlay.classList.remove('show'); });

        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) overlay.classList.remove('show');
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && overlay.classList.contains('show')) overlay.classList.remove('show');
        });

        var modalObserver = new MutationObserver(function() {
            if (overlay.classList.contains('show')) {
                setTimeout(function() {
                    var firstFocusable = overlay.querySelector('input, button, [tabindex]:not([tabindex="-1"])');
                    if (firstFocusable) firstFocusable.focus();
                }, 100);
            }
        });
        modalObserver.observe(overlay, { attributes: true, attributeFilter: ['class'] });

        uploadZone.addEventListener('click', function() { fileInput.click(); });

        var uploadTextEl = uploadZone.querySelector('.upload-text');
        uploadZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
            if (uploadTextEl) uploadTextEl.textContent = '松开以上传图片';
        });
        uploadZone.addEventListener('dragleave', function() {
            this.classList.remove('dragover');
            if (uploadTextEl) uploadTextEl.textContent = '点击或拖拽图片到此处';
        });
        uploadZone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            if (uploadTextEl) uploadTextEl.textContent = '点击或拖拽图片到此处';
            var file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) handleImageFile(file);
        });

        fileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) handleImageFile(this.files[0]);
        });

        btnReupload.addEventListener('click', function() {
            document.getElementById('imagePreview').style.display = 'none';
            document.getElementById('uploadZone').style.display = 'block';
            imageAnalysis.currentImageBase64 = null;
            btnAnalyze.disabled = true;
            fileInput.value = '';
            resetResults();
        });

        btnSaveKey.addEventListener('click', function() {
            var key = apiKeyInput.value.trim();
            if (key) {
                localStorage.setItem('deepseek_api_key', key);
                this.textContent = '已保存';
                this.classList.add('saved');
                setTimeout(function() {
                    btnSaveKey.textContent = '保存';
                    btnSaveKey.classList.remove('saved');
                }, 1500);
                checkAnalyzeReady();
            }
        });

        apiKeyInput.addEventListener('input', function() { checkAnalyzeReady(); });

        btnAnalyze.addEventListener('click', function() { analyzeImage(); });

        btnApplyTags.addEventListener('click', function() { applyMatchedTags(); });

        btnCopyImagePrompt.addEventListener('click', function() {
            if (imageAnalysis.currentResult && imageAnalysis.currentResult.full_prompt) {
                copyToClipboard(imageAnalysis.currentResult.full_prompt);
            }
        });
    }

    function checkAnalyzeReady() {
        var apiKeyInput = document.getElementById('apiKeyInput');
        var btnAnalyze = document.getElementById('btnAnalyze');
        var hasImage = !!imageAnalysis.currentImageBase64;
        var hasKey = !!apiKeyInput.value.trim();
        btnAnalyze.disabled = !(hasImage && hasKey);
    }

    function handleImageFile(file) {
        if (!file) return;
        if (file.size > 20 * 1024 * 1024) {
            showToast('图片不能超过 20MB');
            return;
        }
        showToast('正在处理图片...');

        if (typeof createImageBitmap === 'function') {
            createImageBitmap(file).then(function(bitmap) {
                try { processImageSource(bitmap, file); }
                finally { if (bitmap.close) bitmap.close(); }
            }).catch(function() { processWithFileReader(file); });
        } else {
            processWithFileReader(file);
        }

        function processImageSource(source, file) {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            if (!ctx) { showToast('浏览器不支持 Canvas'); return; }
            var maxDim = 2000;
            var w = source.width, h = source.height;
            if (w > maxDim || h > maxDim) {
                if (w > h) { h = Math.round(h * maxDim / w); w = maxDim; }
                else { w = Math.round(w * maxDim / h); h = maxDim; }
            }
            canvas.width = w; canvas.height = h;
            ctx.drawImage(source, 0, 0, w, h);
            var mimeType = file.type || 'image/jpeg';
            var dataUrl = (mimeType === 'image/png')
                ? canvas.toDataURL('image/png', 0.9)
                : canvas.toDataURL('image/jpeg', 0.85);
            if (dataUrl.length > 4 * 1024 * 1024) dataUrl = canvas.toDataURL('image/jpeg', 0.6);
            imageAnalysis.currentImageBase64 = dataUrl;
            var previewImg = document.getElementById('previewImg');
            var uploadZone = document.getElementById('uploadZone');
            var imagePreview = document.getElementById('imagePreview');
            if (previewImg) previewImg.src = dataUrl;
            if (uploadZone) uploadZone.style.display = 'none';
            if (imagePreview) imagePreview.style.display = 'block';
            checkAnalyzeReady();
        }

        function processWithFileReader(file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var img = new Image();
                img.onload = function() {
                    try { processImageSource(img, file); }
                    catch (ex) { showToast('图片处理失败: ' + (ex.message || '未知错误')); }
                };
                img.onerror = function() { showToast('图片加载失败'); };
                img.src = e.target.result;
            };
            reader.onerror = function() { showToast('文件读取失败'); };
            reader.readAsDataURL(file);
        }
    }

    function resetResults() {
        document.getElementById('analysisResults').innerHTML =
            '<div class="analysis-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="64" height="64"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg><p>上传图片并点击"开始解析"<br>AI 将自动分析建筑风格、材质、光影等维度<br>并生成可用的提示词</p></div>';
        document.getElementById('imageModalFooter').style.display = 'none';
        imageAnalysis.currentResult = null;
        imageAnalysis.matchedTags = [];
    }

    // ===== DeepSeek API Call =====
    function analyzeImage() {
        var btnAnalyze = document.getElementById('btnAnalyze');
        var apiKey = document.getElementById('apiKeyInput').value.trim();
        var imageBase64 = imageAnalysis.currentImageBase64;
        if (!apiKey || !imageBase64) return;
        localStorage.setItem('deepseek_api_key', apiKey);

        btnAnalyze.classList.add('loading');
        btnAnalyze.disabled = true;
        btnAnalyze.innerHTML = '<span class="spinner"></span><span class="btn-analyze-text"></span>';

        document.getElementById('analysisResults').innerHTML =
            '<div class="analysis-empty"><div class="spinner" style="width:32px;height:32px;border-color:rgba(37,99,235,0.2);border-top-color:var(--accent);"></div><p>AI 正在分析图片中...<br>通常需要 5-15 秒</p></div>';

        var systemPrompt = buildAnalysisPrompt();
        var rawBase64 = imageBase64;
        if (rawBase64.indexOf('base64,') !== -1) rawBase64 = rawBase64.split('base64,')[1];

        var payload = {
            model: 'deepseek-v4-pro',
            messages: [{ role: 'user', content: systemPrompt, image_data: rawBase64 }],
            deep_thought: true,
            temperature: 0.1,
            max_tokens: 4096,
            stream: false
        };

        fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(function(response) {
            if (!response.ok) {
                return response.json().then(function(err) {
                    throw new Error(err.error ? err.error.message : 'API请求失败 (HTTP ' + response.status + ')');
                });
            }
            return response.json();
        })
        .then(function(data) {
            var content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
            if (!content) throw new Error('API 返回内容为空');
            parseAnalysisResult(content);
        })
        .catch(function(err) {
            document.getElementById('analysisResults').innerHTML =
                '<div class="analysis-empty"><svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="1.5" width="48" height="48"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg><p style="color:#ef4444;">解析失败</p><p style="font-size:13px;">' + escapeHtml(err.message) + '</p></div>';
        })
        .finally(function() {
            btnAnalyze.classList.remove('loading');
            btnAnalyze.disabled = false;
            btnAnalyze.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg><span class="btn-analyze-text">开始解析</span>';
            checkAnalyzeReady();
        });
    }

    function buildAnalysisPrompt() {
        return 'Analyze this architectural image of a hospital / medical facility and extract AI image generation keywords.\n\nIdentify the most relevant English keyword(s) for each dimension:\n\n1. Building type: outpatient clinic, emergency department, inpatient tower, operating theatre, ICU, etc.\n2. Space type: entrance lobby, waiting area, corridor, patient room, nursing station, operating room, etc.\n3. Architectural style: modern minimalist, parametric, neo-brutalist, high-tech, biomorphic, sustainable, etc.\n4. Facade material: glass curtain wall, aluminum panel, terracotta, concrete, stone, wood, etc.\n5. Color scheme: pure white, warm white, wood tones, earth tones, blue, green, grey, accent, etc.\n6. Lighting: golden hour, morning light, noon, blue hour, overcast, warm interior, cool clinical, etc.\n7. Camera angle: eye-level, low-angle, birds-eye, wide-angle, telephoto, axonometric, etc.\n8. Environment: dense urban, suburban, waterfront, hillside, forest, campus, etc.\n9. Mood: warm cozy, clinical precise, serene, vibrant, solemn, futuristic, biophilic, etc.\n11. Medical furniture: hospital bed, IV pole, patient monitor, nursing desk, surgical light, wheelchair, etc.\n12. Landscape: healing garden, living wall, water feature, tree canopy, green roof, bamboo, etc.\n13. Layout/massing: podium-and-block, high-rise tower, courtyard cluster, etc.\n14. Hospital-specific details: accessible ramp, color-coded wayfinding, digital kiosk, etc.\n15. Interior lighting/finishes: indirect cove lighting, linear LED strip, perforated acoustic ceiling, etc.\n\nAlso generate a complete English prompt sentence for Midjourney / Stable Diffusion.\n\nReturn a JSON object only, no markdown, no explanation:\n{"dimensions":{"1":["keyword"],"2":["keyword"],...},"full_prompt":"complete English prompt","description":"中文描述"}';
    }

    function parseAnalysisResult(content) {
        var result;
        try {
            var jsonStr = content;
            if (jsonStr.indexOf('```') !== -1) {
                var match = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
                if (match) jsonStr = match[1].trim();
            }
            var jsonStart = jsonStr.indexOf('{');
            var jsonEnd = jsonStr.lastIndexOf('}');
            if (jsonStart !== -1 && jsonEnd !== -1) jsonStr = jsonStr.substring(jsonStart, jsonEnd + 1);
            result = JSON.parse(jsonStr);
        } catch (e) {
            result = { full_prompt: content, description: '解析结果格式异常，已显示原始文本', dimensions: {} };
        }

        imageAnalysis.currentResult = result;
        imageAnalysis.matchedTags = matchKeywordsToVocabulary(result.dimensions || {});
        saveToHistory();
        renderAnalysisResults(result);
    }

    // ===== Match AI keywords to vocabulary =====
    function matchKeywordsToVocabulary(dimensions) {
        var matches = [];

        Object.keys(dimensions).forEach(function(dimIdStr) {
            var dimIdNum = parseInt(dimIdStr);
            var keywords = dimensions[dimIdStr];
            if (!Array.isArray(keywords)) keywords = [keywords];

            // In rendering mode: match against flat PROMPT_DATA
            if (state.mode === 'rendering') {
                var dim = state.data.find(function(d) { return d.id === dimIdNum; });
                if (!dim) return;
                keywords.forEach(function(keyword) {
                    findMatchesInItems(dim.items, dimIdNum, dim.title, keyword, matches);
                });
            }
            // In analysis mode: search across all modules and categories
            else {
                state.data.forEach(function(mod) {
                    mod.categories.forEach(function(cat, catIdx) {
                        // Try to match role-based if the dimId matches existing role pattern
                        keywords.forEach(function(keyword) {
                            findMatchesWithMeta(cat.items, mod.id, catIdx, cat.role, mod.title, cat.title, keyword, matches);
                        });
                    });
                });
            }
        });

        // Deduplicate
        var deduped = {};
        matches.forEach(function(m) {
            var key = (state.mode === 'analysis')
                ? m.moduleId + '::' + m.catIdx + '::' + m.itemIdx
                : m.dimId + '-' + m.itemIdx;
            if (!deduped[key] || deduped[key].score < m.score) deduped[key] = m;
        });

        return Object.values(deduped);
    }

    function findMatchesInItems(items, dimId, dimTitle, keyword, matches) {
        var kwLower = keyword.toLowerCase();
        items.forEach(function(item, idx) {
            var matchScore = calcMatchScore(item, kwLower);
            if (matchScore > 0) {
                matches.push({ dimId: dimId, itemIdx: idx, keyword: keyword, label: item.label, en: item.en, score: matchScore, dimTitle: dimTitle });
            }
        });
    }

    function findMatchesWithMeta(items, moduleId, catIdx, role, moduleTitle, catTitle, keyword, matches) {
        var kwLower = keyword.toLowerCase();
        items.forEach(function(item, idx) {
            var matchScore = calcMatchScore(item, kwLower);
            if (matchScore > 0) {
                matches.push({
                    moduleId: moduleId, catIdx: catIdx, itemIdx: idx,
                    keyword: keyword, label: item.label, en: item.en,
                    score: matchScore, role: role,
                    moduleTitle: moduleTitle, catTitle: catTitle
                });
            }
        });
    }

    function calcMatchScore(item, kwLower) {
        var enLower = (item.en || '').toLowerCase();
        var labelLower = (item.label || '').toLowerCase();

        if (enLower === kwLower || labelLower === kwLower) return 100;
        if (enLower.indexOf(kwLower) !== -1 || kwLower.indexOf(enLower) !== -1) return 80;

        var enWords = enLower.split(/[\s\/,]+/).filter(function(w) { return w.length > 3; });
        var kwWords = kwLower.split(/[\s\/,]+/).filter(function(w) { return w.length > 3; });
        for (var i = 0; i < kwWords.length; i++) {
            for (var j = 0; j < enWords.length; j++) {
                if (enWords[j] === kwWords[i] || enWords[j].indexOf(kwWords[i]) !== -1 || kwWords[i].indexOf(enWords[j]) !== -1) {
                    return 60;
                }
            }
        }
        return 0;
    }

    // ===== Render Analysis Results =====
    function renderAnalysisResults(result) {
        var html = '<div class="analysis-content">';

        if (result.description) {
            html += '<div class="result-card"><div class="result-card-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>图片描述</div><div class="result-description">' + escapeHtml(result.description) + '</div></div>';
        }

        if (result.full_prompt) {
            html += '<div class="result-card"><div class="result-card-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>完整提示词</div><div class="result-prompt-text">' + escapeHtml(result.full_prompt) + '</div></div>';
        }

        if (result.dimensions && Object.keys(result.dimensions).length > 0 && state.mode === 'rendering') {
            html += '<div class="result-card"><div class="result-card-label">维度分析</div><div class="dimension-breakdown">';
            Object.keys(result.dimensions).forEach(function(dimIdStr) {
                var dimIdNum = parseInt(dimIdStr);
                var dim = state.data.find(function(d) { return d.id === dimIdNum; });
                if (!dim) return;
                var keywords = result.dimensions[dimIdStr];
                if (!Array.isArray(keywords)) keywords = [keywords];
                var hasMatch = imageAnalysis.matchedTags.some(function(m) { return m.dimId === dimIdNum; });
                html += '<div class="breakdown-item ' + (hasMatch ? 'has-match' : '') + '"><span class="breakdown-dim-num">' + dimIdNum + '</span><div class="breakdown-content"><div class="breakdown-dim-title">' + dim.title + '</div><div class="breakdown-keywords">';
                keywords.forEach(function(kw) {
                    var isMatched = imageAnalysis.matchedTags.some(function(m) { return m.dimId === dimIdNum && m.keyword.toLowerCase() === kw.toLowerCase(); });
                    html += '<span class="breakdown-keyword ' + (isMatched ? 'matched' : '') + '">' + escapeHtml(kw) + '</span>';
                });
                html += '</div></div></div>';
            });
            html += '</div></div>';
        }

        if (imageAnalysis.matchedTags.length > 0) {
            html += '<div class="result-card" style="background:var(--accent-bg);border-color:var(--accent-light);"><div class="result-card-label" style="color:var(--accent);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>已匹配词库 (' + imageAnalysis.matchedTags.length + ' 项)</div><div class="breakdown-keywords">';
            imageAnalysis.matchedTags.forEach(function(m) {
                var badge = state.mode === 'analysis' ? m.moduleId : 'D' + m.dimId;
                html += '<span class="breakdown-keyword matched" style="background:var(--accent);color:white;border-color:var(--accent);">' + badge + ' ' + escapeHtml(m.label) + '</span>';
            });
            html += '</div></div>';
        }

        html += '</div>';
        document.getElementById('analysisResults').innerHTML = html;
        document.getElementById('imageModalFooter').style.display = 'flex';
    }

    // ===== Apply matched tags =====
    function applyMatchedTags() {
        if (imageAnalysis.matchedTags.length === 0) { showToast('没有可应用的匹配项'); return; }
        var appliedCount = 0;

        imageAnalysis.matchedTags.forEach(function(match) {
            var key;
            if (state.mode === 'analysis') {
                key = match.moduleId + '::' + match.catIdx + '::' + match.itemIdx;
            } else {
                key = match.dimId + '-' + match.itemIdx;
            }

            if (state.mode === 'rendering' && match.dimId === 10) {
                state.selected.forEach(function(val, k) {
                    if (k.startsWith('10-')) {
                        state.selected.delete(k);
                        var existingTag = document.querySelector('.tag[data-key="' + k + '"]');
                        if (existingTag) existingTag.classList.remove('selected');
                    }
                });
            }

            if (!state.selected.has(key)) {
                if (state.mode === 'analysis') {
                    var mod = findModule(match.moduleId);
                    if (mod && mod.categories[match.catIdx] && mod.categories[match.catIdx].items[match.itemIdx]) {
                        state.selected.set(key, {
                            moduleId: match.moduleId, catIdx: match.catIdx, itemIdx: match.itemIdx,
                            item: mod.categories[match.catIdx].items[match.itemIdx],
                            role: match.role, moduleTitle: match.moduleTitle, catTitle: match.catTitle
                        });
                        var tagEl = document.querySelector('.tag[data-key="' + key + '"]');
                        if (tagEl) tagEl.classList.add('selected');
                        appliedCount++;
                    }
                } else {
                    var dim = state.data.find(function(d) { return d.id === match.dimId; });
                    if (dim && dim.items[match.itemIdx]) {
                        state.selected.set(key, { dimId: match.dimId, itemIdx: match.itemIdx, item: dim.items[match.itemIdx], dimTitle: dim.title });
                        var tagEl = document.querySelector('.tag[data-key="' + key + '"]');
                        if (tagEl) tagEl.classList.add('selected');
                        appliedCount++;
                    }
                }
            }
        });

        updateSelectedTags();
        updateDimensionCounts();
        updatePrompt();
        showToast('已应用 ' + appliedCount + ' 个匹配项到提示词选择器');
        document.getElementById('imageModalOverlay').classList.remove('show');
    }

    // ===== History Management =====
    function saveToHistory() {
        if (!imageAnalysis.currentResult || !imageAnalysis.currentImageBase64) return;
        generateThumbnail(imageAnalysis.currentImageBase64, 200, 150).then(function(thumbnail) {
            var history = loadHistory();
            var savedMatchedTags = imageAnalysis.matchedTags.map(function(m) {
                return { dimId: m.dimId, moduleId: m.moduleId, catIdx: m.catIdx, itemIdx: m.itemIdx, label: m.label, keyword: m.keyword, en: m.en, score: m.score };
            });
            var entry = {
                timestamp: new Date().toISOString(),
                thumbnail: thumbnail,
                result: {
                    description: imageAnalysis.currentResult.description || '',
                    full_prompt: imageAnalysis.currentResult.full_prompt || '',
                    dimensions: imageAnalysis.currentResult.dimensions || {}
                },
                matchedTags: savedMatchedTags
            };
            history.unshift(entry);
            if (history.length > HISTORY_MAX_ITEMS) history = history.slice(0, HISTORY_MAX_ITEMS);
            try { localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history)); updateHistoryBadge(); }
            catch (e) {
                history = history.slice(0, Math.floor(HISTORY_MAX_ITEMS / 2));
                try { localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history)); updateHistoryBadge(); }
                catch (e2) { console.error('Failed to save history:', e2); }
            }
        });
    }

    function loadHistory() {
        try { var raw = localStorage.getItem(HISTORY_STORAGE_KEY); return raw ? JSON.parse(raw) : []; }
        catch (e) { return []; }
    }

    function generateThumbnail(base64Data, maxW, maxH) {
        return new Promise(function(resolve) {
            var img = new Image();
            img.onload = function() {
                var canvas = document.createElement('canvas');
                var w = img.width, h = img.height;
                var ratio = Math.min(maxW / w, maxH / h, 1);
                canvas.width = Math.round(w * ratio);
                canvas.height = Math.round(h * ratio);
                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.6));
            };
            img.onerror = function() { resolve(''); };
            img.src = base64Data;
        });
    }

    function renderHistory() {
        var panel = document.getElementById('historyPanel');
        var history = loadHistory();
        if (history.length === 0) {
            panel.innerHTML = '<div class="analysis-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><p>暂无历史记录<br>解析图片后将自动保存到此处</p></div>';
            return;
        }
        var html = '';
        history.forEach(function(entry, index) {
            var date = new Date(entry.timestamp);
            var timeStr = formatDate(date);
            var dimCount = entry.result.dimensions ? Object.keys(entry.result.dimensions).length : 0;
            var matchedCount = entry.matchedTags ? entry.matchedTags.length : 0;
            var tagHtml = '';
            if (entry.matchedTags && entry.matchedTags.length > 0) {
                var previewTags = entry.matchedTags.slice(0, 6);
                previewTags.forEach(function(tag) { tagHtml += '<span class="history-item-tag">' + escapeHtml(tag.label) + '</span>'; });
                if (entry.matchedTags.length > 6) tagHtml += '<span class="history-item-tag">+' + (entry.matchedTags.length - 6) + '</span>';
            }
            html += '<div class="history-item" data-index="' + index + '"><div class="history-item-thumb"><img src="' + (entry.thumbnail || '') + '" alt="" onerror="this.style.display=\'none\'"></div><div class="history-item-info"><div class="history-item-meta"><span class="history-item-time">' + timeStr + '</span><span class="history-item-dims">' + dimCount + ' 个维度</span>' + (matchedCount > 0 ? '<span class="history-item-dims">' + matchedCount + ' 项匹配</span>' : '') + '</div><div class="history-item-desc">' + escapeHtml(entry.result.description || '无描述') + '</div><div class="history-item-tags">' + tagHtml + '</div></div><button class="history-item-delete" title="删除此记录"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>';
        });
        panel.innerHTML = html;

        panel.querySelectorAll('.history-item').forEach(function(item) {
            item.addEventListener('click', function(e) {
                if (e.target.closest('.history-item-delete')) return;
                viewHistoryItem(parseInt(this.dataset.index));
            });
        });
        panel.querySelectorAll('.history-item-delete').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                deleteHistoryItem(parseInt(this.closest('.history-item').dataset.index));
            });
        });
    }

    function viewHistoryItem(index) {
        var history = loadHistory();
        if (index < 0 || index >= history.length) return;
        var entry = history[index];
        imageAnalysis.currentResult = entry.result;
        imageAnalysis.matchedTags = entry.matchedTags || [];
        if (entry.thumbnail) {
            document.getElementById('previewImg').src = entry.thumbnail;
            document.getElementById('uploadZone').style.display = 'none';
            document.getElementById('imagePreview').style.display = 'block';
        }
        renderAnalysisResults(entry.result);
        imageAnalysis.currentImageBase64 = null;
        var btnAnalyze = document.getElementById('btnAnalyze');
        if (btnAnalyze) btnAnalyze.disabled = true;
        document.getElementById('imageFileInput').value = '';
        document.querySelectorAll('.image-modal-tab').forEach(function(t) { t.classList.remove('active'); });
        document.querySelectorAll('.image-modal-tab-panel').forEach(function(p) { p.classList.remove('active'); });
        document.getElementById('tabCurrent').classList.add('active');
        document.getElementById('tabPanelCurrent').classList.add('active');
    }

    function deleteHistoryItem(index) {
        var history = loadHistory();
        if (index < 0 || index >= history.length) return;
        history.splice(index, 1);
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
        updateHistoryBadge();
        renderHistory();
        showToast('已删除历史记录');
    }

    function updateHistoryBadge() {
        var badge = document.getElementById('historyCountBadge');
        var history = loadHistory();
        var count = history.length;
        if (count > 0) { badge.textContent = count; badge.style.display = 'inline-flex'; }
        else { badge.style.display = 'none'; }
    }

    function formatDate(date) {
        var now = new Date();
        var diff = now - date;
        var minutes = Math.floor(diff / 60000);
        var hours = Math.floor(diff / 3600000);
        var days = Math.floor(diff / 86400000);
        if (minutes < 1) return '刚刚';
        if (minutes < 60) return minutes + ' 分钟前';
        if (hours < 24) return hours + ' 小时前';
        if (days < 7) return days + ' 天前';
        var y = date.getFullYear();
        var m = String(date.getMonth() + 1).padStart(2, '0');
        var d = String(date.getDate()).padStart(2, '0');
        var hh = String(date.getHours()).padStart(2, '0');
        var mm = String(date.getMinutes()).padStart(2, '0');
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm;
    }

    updateHistoryBadge();

    // ===== Utility: escape HTML =====
    function escapeHtml(text) {
        if (text === null || text === undefined) return '';
        var div = document.createElement('div');
        div.textContent = String(text);
        return div.innerHTML;
    }

    // ===== Start =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
