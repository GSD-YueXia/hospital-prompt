/**
 * 医院建筑 AI 提示词生成器
 * 核心逻辑：点击维度标签 → 自动组合生成完整 AI 提示词
 */

(function() {
    'use strict';

    // ===== State =====
    const state = {
        selected: new Map(), // key: "dimId-itemIdx" => item object
        lang: 'en',          // 'en' | 'cn' | 'both'
        format: 'sentence',  // 'sentence' | 'keyword'
        data: PROMPT_DATA    // from data.js
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
        var html = '<div class="search-bar">' +
            '<svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">' +
                '<circle cx="11" cy="11" r="8"/>' +
                '<path d="m21 21-4.35-4.35"/>' +
            '</svg>' +
            '<input type="text" id="searchInputInner" placeholder="搜索提示词（中英文）..." class="search-input">' +
            '<span class="search-info" id="searchInfo"></span>' +
        '</div>';

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
                return renderTag(dim, item, idx);
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

        // Back-to-top button
        html += '<button class="btn-back-to-top" id="btnBackToTop" title="返回顶部" aria-label="返回顶部">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">' +
                '<polyline points="18 15 12 9 6 15"/>' +
            '</svg>' +
        '</button>';

        dimensionsPanel.innerHTML = html;

        // Bind tag click events
        document.querySelectorAll('.tag').forEach(function(tag) {
            tag.addEventListener('click', function() {
                const dimId = parseInt(this.dataset.dimId);
                const itemIdx = parseInt(this.dataset.itemIdx);
                toggleSelection(dimId, itemIdx, this);
            });
            // Keyboard: Enter / Space to toggle
            tag.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const dimId = parseInt(this.dataset.dimId);
                    const itemIdx = parseInt(this.dataset.itemIdx);
                    toggleSelection(dimId, itemIdx, this);
                }
            });
        });

        // Bind dimension header collapse
        document.querySelectorAll('.dimension-header').forEach(function(header) {
            header.addEventListener('click', function() {
                const section = this.closest('.dimension-section');
                section.classList.toggle('collapsed');
                var expanded = !section.classList.contains('collapsed');
                this.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            });
            // Keyboard: Enter to toggle
            header.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });

        // Nav dots click → scroll to dimension
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

        // Scroll listener: highlight current nav dot + show/hide back-to-top
        bindScrollTracking();

        // Back-to-top button
        var btnBackToTop = document.getElementById('btnBackToTop');
        if (btnBackToTop) {
            btnBackToTop.addEventListener('click', function() {
                dimensionsPanel.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Bind search
        const searchInputInner = document.getElementById('searchInputInner');
        if (searchInputInner) {
            searchInputInner.addEventListener('input', function() {
                handleSearch(this.value);
            });
        }
    }

    // ===== Render Single Tag =====
    function renderTag(dim, item, idx) {
        const key = dim.id + '-' + idx;
        const isSelected = state.selected.has(key);

        let tagContent = '';

        // Tag label (always show)
        tagContent += `<span class="tag-label">${item.label}</span>`;

        // English keyword
        if (item.en && state.lang !== 'cn') {
            tagContent += `<span class="tag-en">${item.en}</span>`;
        }

        // Chinese keyword (only show in 'cn' or 'both' mode, and only if it exists)
        if (item.cn && state.lang === 'cn') {
            tagContent += `<span class="tag-en">${item.cn}</span>`;
        } else if (item.cn && state.lang === 'both') {
            tagContent += `<span class="tag-en">${item.cn}</span>`;
        }

        // Extra info (e.g., 适用场景, 色温, 焦距)
        if (item.extra) {
            tagContent += `<span class="tag-extra">${item.extra}</span>`;
        }

        // Effect (for view angle dimension)
        if (item.effect) {
            tagContent += `<span class="tag-effect">${item.effect}</span>`;
        }

        // Tool (for render param dimension)
        if (item.tool) {
            tagContent += `<span class="tag-tool">${item.tool}</span>`;
        }

        const cls = isSelected ? 'tag selected' : 'tag';

        return '<span class="' + cls + '" data-dim-id="' + dim.id + '" data-item-idx="' + idx + '" data-key="' + key + '" tabindex="0" role="checkbox" aria-checked="' + (isSelected ? 'true' : 'false') + '">' +
            tagContent +
        '</span>';
    }

    // ===== Toggle Selection =====
    function toggleSelection(dimId, itemIdx, tagEl) {
        const key = dimId + '-' + itemIdx;
        const dim = state.data.find(function(d) { return d.id === dimId; });
        if (!dim) return;
        const item = dim.items[itemIdx];
        if (!item) return;

        if (state.selected.has(key)) {
            state.selected.delete(key);
            tagEl.classList.remove('selected');
            tagEl.setAttribute('aria-checked', 'false');
        } else {
            // For render_param dimension (dim 10), only allow one selection
            // (you usually pick one render style)
            if (dimId === 10) {
                // Remove existing selections from dim 10
                state.selected.forEach(function(val, k) {
                    if (k.startsWith('10-')) {
                        state.selected.delete(k);
                        const existingTag = document.querySelector('.tag[data-key="' + k + '"]');
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

    // ===== Update Selected Tags Display =====
    function updateSelectedTags() {
        if (state.selected.size === 0) {
            selectedTags.innerHTML = '<div class="empty-hint">从左侧选择提示词，将自动生成完整提示语</div>';
            return;
        }

        let html = '';
        state.selected.forEach(function(val, key) {
            const label = val.item.label;
            const dimNum = val.dimId;
            html += `
                <span class="selected-tag">
                    <span class="selected-tag-dim">D${dimNum}</span>
                    ${label}
                    <button class="selected-tag-remove" data-key="${key}" title="移除">&times;</button>
                </span>
            `;
        });
        selectedTags.innerHTML = html;

        // Bind remove buttons
        selectedTags.querySelectorAll('.selected-tag-remove').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const key = this.dataset.key;
                removeSelection(key);
            });
        });

        // Bind tag click → scroll to dimension + pulse highlight
        selectedTags.querySelectorAll('.selected-tag').forEach(function(tag) {
            tag.addEventListener('click', function(e) {
                if (e.target.closest('.selected-tag-remove')) return;
                var dimId = this.querySelector('.selected-tag-dim').textContent.replace('D', '');
                scrollToDimensionAndPulse(parseInt(dimId));
            });
        });
    }

    // ===== Remove Selection =====
    function removeSelection(key) {
        if (!state.selected.has(key)) return;
        state.selected.delete(key);

        const tagEl = document.querySelector('.tag[data-key="' + key + '"]');
        if (tagEl) tagEl.classList.remove('selected');

        updateSelectedTags();
        updateDimensionCounts();
        updatePrompt();
    }

    // ===== Update Dimension Counts =====
    function updateDimensionCounts() {
        // Reset all
        state.data.forEach(function(dim) {
            const countEl = document.getElementById('count-' + dim.id);
            if (countEl) {
                countEl.textContent = dim.items.length;
                countEl.classList.remove('has-selection');
            }
        });

        // Count selected per dimension
        const counts = {};
        state.selected.forEach(function(val) {
            counts[val.dimId] = (counts[val.dimId] || 0) + 1;
        });

        Object.keys(counts).forEach(function(dimId) {
            const countEl = document.getElementById('count-' + dimId);
            if (countEl) {
                countEl.textContent = counts[dimId] + '/' + getDimItemCount(parseInt(dimId));
                countEl.classList.add('has-selection');
            }
        });

        // Update nav dots selection state
        updateNavDotSelectionState();
    }

    // ===== Scroll to Dimension + Pulse =====
    function scrollToDimensionAndPulse(dimId) {
        var section = document.getElementById('dimSection-' + dimId);
        if (!section) return;

        // Ensure expanded
        section.classList.remove('collapsed');
        var header = section.querySelector('.dimension-header');
        if (header) header.setAttribute('aria-expanded', 'true');

        // Scroll
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Pulse animation
        section.classList.add('pulse-highlight');
        setTimeout(function() {
            section.classList.remove('pulse-highlight');
        }, 1500);

        // Also pulse the tags inside this dimension
        section.querySelectorAll('.tag').forEach(function(tag, i) {
            setTimeout(function() {
                tag.classList.add('pulse-highlight');
                setTimeout(function() { tag.classList.remove('pulse-highlight'); }, 1200);
            }, i * 40);
        });
    }

    function getDimItemCount(dimId) {
        const dim = state.data.find(function(d) { return d.id === dimId; });
        return dim ? dim.items.length : 0;
    }

    // ===== Category Color Mapping =====
    function getDimCategoryClass(dimId) {
        // D1建筑类型, D2空间类型 → 建筑本体 Blue
        if (dimId === 1 || dimId === 2) return 'dot-cat-structure dim-cat-structure';
        // D3风格, D5色彩, D6光线, D7视角, D13布局/体量 → 设计表现 Purple
        if (dimId === 3 || dimId === 5 || dimId === 6 || dimId === 7 || dimId === 13) return 'dot-cat-style dim-cat-style';
        // D4立面材质 → 材质质感 Amber
        if (dimId === 4) return 'dot-cat-material dim-cat-material';
        // D8环境, D9情绪, D12景观 → 场景环境 Green
        if (dimId === 8 || dimId === 9 || dimId === 12) return 'dot-cat-environment dim-cat-environment';
        // D10渲染参数 → 技术工具 Slate
        if (dimId === 10) return 'dot-cat-tech dim-cat-tech';
        // D11医疗家具, D14医院专项细节, D15内部照明/饰面 → 内部布置 Coral
        if (dimId === 11 || dimId === 14 || dimId === 15) return 'dot-cat-interior dim-cat-interior';
        return '';
    }

    // ===== Scroll Tracking =====
    var scrollTrackingTimer = null;
    function bindScrollTracking() {
        dimensionsPanel.addEventListener('scroll', function() {
            if (scrollTrackingTimer) clearTimeout(scrollTrackingTimer);
            scrollTrackingTimer = setTimeout(updateNavDotActive, 80);
            updateBackToTopVisibility();
        });
    }

    function updateNavDotActive() {
        var scrollTop = dimensionsPanel.scrollTop;
        var panelHeight = dimensionsPanel.clientHeight;
        var currentDimId = null;

        document.querySelectorAll('.dimension-section').forEach(function(section) {
            var rect = section.getBoundingClientRect();
            var panelRect = dimensionsPanel.getBoundingClientRect();
            var relativeTop = rect.top - panelRect.top;
            // Mark as current if its header is in the top 40% of the viewport
            if (relativeTop >= -20 && relativeTop < panelHeight * 0.4) {
                currentDimId = section.dataset.dimId;
            }
        });

        document.querySelectorAll('.nav-dot').forEach(function(dot) {
            dot.classList.remove('active');
            if (dot.dataset.dimId === currentDimId) {
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
            var dot = document.querySelector('.nav-dot[data-dim-id="' + val.dimId + '"]');
            if (dot) dot.classList.add('has-selection');
        });
        // Re-sync active state
        updateNavDotActive();
    }

    // ===== Build flat selections list for PromptEngine =====
    // 注意：真正的 PromptEngine（buildSentence/buildKeywordPhrase）来自 prompt-engine.js，
    // 挂载在 window.PromptEngine 上，此文件不应重复定义同名变量（会遮蔽真实引擎）。
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

    // ===== Generate Prompt =====
    function updatePrompt() {
        const count = state.selected.size;
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

        // Separate items by dimension
        const dimGroups = {};
        const renderParams = [];  // dim 10 items
        let hasNegativePrompt = false;
        let negativePrompt = '';

        // Process in dimension order
        state.data.forEach(function(dim) {
            state.selected.forEach(function(val) {
                if (val.dimId === dim.id) {
                    if (!dimGroups[dim.id]) dimGroups[dim.id] = [];
                    dimGroups[dim.id].push(val.item);
                }
            });
        });

        // Check for negative prompt (SD负面固定包)
        if (dimGroups[10]) {
            dimGroups[10].forEach(function(item) {
                if (item.label === 'SD负面固定包') {
                    hasNegativePrompt = true;
                    negativePrompt = item.en;
                }
            });
        }

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

        // Display
        promptText.textContent = promptStr;

        // Handle negative prompt
        if (hasNegativePrompt) {
            negativePromptBox.style.display = 'flex';
            negativePromptText.textContent = negativePrompt;
            document.getElementById('btnCopyNegative').style.display = 'flex';
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
            // Show all
            document.querySelectorAll('.tag').forEach(function(tag) {
                tag.classList.remove('hidden');
            });
            document.querySelectorAll('.dimension-section').forEach(function(section) {
                section.style.display = '';
            });
            return;
        }

        var totalMatches = 0;

        // Filter tags
        document.querySelectorAll('.dimension-section').forEach(function(section) {
            let hasMatch = false;
            section.querySelectorAll('.tag').forEach(function(tag) {
                const text = tag.textContent.toLowerCase();
                if (text.indexOf(query) !== -1) {
                    tag.classList.remove('hidden');
                    hasMatch = true;
                    totalMatches++;
                } else {
                    tag.classList.add('hidden');
                }
            });
            section.style.display = hasMatch ? '' : 'none';
            // Expand sections with matches
            if (hasMatch) {
                section.classList.remove('collapsed');
                var header = section.querySelector('.dimension-header');
                if (header) header.setAttribute('aria-expanded', 'true');
            }
        });

        // Update search info
        if (totalMatches > 0) {
            searchInfo.textContent = totalMatches + ' 个匹配';
            searchInfo.className = 'search-info has-results';
        } else {
            searchInfo.textContent = '无匹配结果';
            searchInfo.className = 'search-info no-results';
        }
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
        const textarea = document.createElement('textarea');
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
    let toastTimer = null;
    function showToast(msg) {
        toast.textContent = msg;
        toast.classList.add('show');
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(function() {
            toast.classList.remove('show');
        }, 2000);
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

    // ===== Re-render Tags (for language switch) =====
    function reRenderTags() {
        state.data.forEach(function(dim) {
            const tagsContainer = document.querySelector('.dimension-tags[data-dim-id="' + dim.id + '"]');
            if (!tagsContainer) return;

            dim.items.forEach(function(item, idx) {
                const tagEl = tagsContainer.querySelector('.tag[data-item-idx="' + idx + '"]');
                if (!tagEl) return;

                // Re-render tag content
                let content = '';
                content += '<span class="tag-label">' + item.label + '</span>';

                if (item.en && state.lang !== 'cn') {
                    content += '<span class="tag-en">' + item.en + '</span>';
                }
                if (item.cn && (state.lang === 'cn' || state.lang === 'both')) {
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

                tagEl.innerHTML = content;
                // Update aria-checked
                var key = dim.id + '-' + idx;
                var isSelected = state.selected.has(key);
                tagEl.setAttribute('aria-checked', isSelected ? 'true' : 'false');
                tagEl.setAttribute('tabindex', '0');
            });
        });
    }

    // ===== Bind Events =====
    function bindEvents() {
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

        // Clear button
        document.getElementById('btnClear').addEventListener('click', clearAll);

        // Copy button
        document.getElementById('btnCopy').addEventListener('click', function() {
            const text = promptText.textContent.trim();
            if (text && !text.startsWith('选择提示词后')) {
                copyToClipboard(text);
            } else {
                showToast('请先选择提示词');
            }
        });

        // Copy negative prompt
        document.getElementById('btnCopyNegative').addEventListener('click', function() {
            const text = negativePromptText.textContent.trim();
            if (text) {
                copyToClipboard(text);
            }
        });

        // ===== Image Analysis Feature =====
        bindImageAnalysisEvents();
    }

    // ===== Image Analysis =====
    var imageAnalysis = {
        currentImageBase64: null,
        currentResult: null,
        matchedTags: []
    };

    // History constants
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

        tabCurrent.addEventListener('click', function() {
            switchTab('current');
        });

        tabHistory.addEventListener('click', function() {
            switchTab('history');
            renderHistory();
        });

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

        // Open modal
        btnOpen.addEventListener('click', function() {
            overlay.classList.add('show');
            // Load saved API key
            var savedKey = localStorage.getItem('deepseek_api_key') || '';
            if (savedKey) {
                apiKeyInput.value = savedKey;
            }
            // Always start on current tab
            switchTab('current');
        });

        // Close modal
        btnClose.addEventListener('click', function() {
            overlay.classList.remove('show');
        });

        // Close on overlay click
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                overlay.classList.remove('show');
            }
        });

        // ESC to close modal
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && overlay.classList.contains('show')) {
                overlay.classList.remove('show');
            }
        });

        // Focus trap: when modal opens, focus first interactive element
        var modalObserver = new MutationObserver(function() {
            if (overlay.classList.contains('show')) {
                setTimeout(function() {
                    var firstFocusable = overlay.querySelector('input, button, [tabindex]:not([tabindex="-1"])');
                    if (firstFocusable) firstFocusable.focus();
                }, 100);
            }
        });
        modalObserver.observe(overlay, { attributes: true, attributeFilter: ['class'] });

        // Upload zone click
        uploadZone.addEventListener('click', function() {
            fileInput.click();
        });

        // Drag & drop
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
            if (file && file.type.startsWith('image/')) {
                handleImageFile(file);
            }
        });

        // File input change
        fileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                handleImageFile(this.files[0]);
            }
        });

        // Re-upload
        btnReupload.addEventListener('click', function() {
            document.getElementById('imagePreview').style.display = 'none';
            document.getElementById('uploadZone').style.display = 'block';
            imageAnalysis.currentImageBase64 = null;
            btnAnalyze.disabled = true;
            // Reset file input — required for change event to re-fire on same filename
            fileInput.value = '';
            resetResults();
        });

        // Save API key
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

        // API key input - also save on type
        apiKeyInput.addEventListener('input', function() {
            checkAnalyzeReady();
        });

        // Analyze button
        btnAnalyze.addEventListener('click', function() {
            analyzeImage();
        });

        // Apply tags to selector
        btnApplyTags.addEventListener('click', function() {
            applyMatchedTags();
        });

        // Copy image prompt
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

        // 使用 createImageBitmap 直接解码（省去 base64 中间步骤，大幅降低内存峰值）
        if (typeof createImageBitmap === 'function') {
            createImageBitmap(file).then(function(bitmap) {
                try {
                    processImageSource(bitmap, file);
                } finally {
                    if (bitmap.close) bitmap.close();
                }
            }).catch(function() {
                // 降级到 FileReader 方式
                processWithFileReader(file);
            });
        } else {
            processWithFileReader(file);
        }

        // 通用图片处理：将任意图片源（ImageBitmap / Image）绘制到 Canvas 并压缩
        function processImageSource(source, file) {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            if (!ctx) {
                showToast('浏览器不支持 Canvas');
                return;
            }
            var maxDim = 2000;
            var w = source.width, h = source.height;

            if (w > maxDim || h > maxDim) {
                if (w > h) {
                    h = Math.round(h * maxDim / w);
                    w = maxDim;
                } else {
                    w = Math.round(w * maxDim / h);
                    h = maxDim;
                }
            }

            canvas.width = w;
            canvas.height = h;
            ctx.drawImage(source, 0, 0, w, h);

            var mimeType = file.type || 'image/jpeg';
            var dataUrl;
            if (mimeType === 'image/png') {
                dataUrl = canvas.toDataURL('image/png', 0.9);
            } else {
                dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            }

            // 如果压缩后仍超过 4MB，二次压缩为低质量 JPEG
            if (dataUrl.length > 4 * 1024 * 1024) {
                dataUrl = canvas.toDataURL('image/jpeg', 0.6);
            }

            imageAnalysis.currentImageBase64 = dataUrl;

            // Show preview
            var previewImg = document.getElementById('previewImg');
            var uploadZone = document.getElementById('uploadZone');
            var imagePreview = document.getElementById('imagePreview');
            if (previewImg) previewImg.src = dataUrl;
            if (uploadZone) uploadZone.style.display = 'none';
            if (imagePreview) imagePreview.style.display = 'block';

            checkAnalyzeReady();
        }

        // 降级方案：FileReader → Image → Canvas
        function processWithFileReader(file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var img = new Image();
                img.onload = function() {
                    try {
                        processImageSource(img, file);
                    } catch (ex) {
                        showToast('图片处理失败: ' + (ex.message || '未知错误'));
                        console.error('handleImageFile error:', ex);
                    }
                };
                img.onerror = function() {
                    showToast('图片加载失败，请尝试其他图片或格式');
                    console.error('Image failed to load from data URL');
                };
                img.src = e.target.result;
            };
            reader.onerror = function() {
                showToast('文件读取失败，请重试');
                console.error('FileReader failed to read file');
            };
            reader.readAsDataURL(file);
        }
    }

    function resetResults() {
        document.getElementById('analysisResults').innerHTML = `
            <div class="analysis-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="64" height="64">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
                <p>上传图片并点击"开始解析"<br>AI 将自动分析建筑风格、材质、光影等维度<br>并生成可用的提示词</p>
            </div>
        `;
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

        // Save API key
        localStorage.setItem('deepseek_api_key', apiKey);

        // Set loading state
        btnAnalyze.classList.add('loading');
        btnAnalyze.disabled = true;
        btnAnalyze.innerHTML = '<span class="spinner"></span><span class="btn-analyze-text"></span>';

        // Show loading in results
        document.getElementById('analysisResults').innerHTML = `
            <div class="analysis-empty">
                <div class="spinner" style="width:32px;height:32px;border-color:rgba(37,99,235,0.2);border-top-color:var(--accent);"></div>
                <p>AI 正在分析图片中...<br>通常需要 5-15 秒</p>
            </div>
        `;

        // Build the system prompt
        var systemPrompt = buildAnalysisPrompt();

        // Strip data URI prefix — DeepSeek expects raw base64 only
        var rawBase64 = imageBase64;
        if (rawBase64.indexOf('base64,') !== -1) {
            rawBase64 = rawBase64.split('base64,')[1];
        }

        // DeepSeek V4 uses a DIFFERENT message format than OpenAI:
        // image_data is a sibling of content (not inside content array!)
        // Model must be deepseek-v4-pro or deepseek-v4-flash
        var payload = {
            model: 'deepseek-v4-pro',
            messages: [
                {
                    role: 'user',
                    content: systemPrompt,
                    image_data: rawBase64
                }
            ],
            deep_thought: true,
            temperature: 0.1,
            max_tokens: 4096,
            stream: false
        };

        fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + apiKey,
                'Content-Type': 'application/json'
            },
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
            if (!content) {
                throw new Error('API 返回内容为空');
            }
            parseAnalysisResult(content);
        })
        .catch(function(err) {
            document.getElementById('analysisResults').innerHTML = `
                <div class="analysis-empty">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="1.5" width="48" height="48">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                    <p style="color:#ef4444;">解析失败</p>
                    <p style="font-size:13px;">${escapeHtml(err.message)}</p>
                </div>
            `;
        })
        .finally(function() {
            btnAnalyze.classList.remove('loading');
            btnAnalyze.disabled = false;
            btnAnalyze.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg><span class="btn-analyze-text">开始解析</span>';
            checkAnalyzeReady();
        });
    }

    function buildAnalysisPrompt() {
        return 'Analyze this architectural image of a hospital / medical facility and extract AI image generation keywords.\n\n' +
            'Identify the most relevant English keyword(s) for each dimension:\n\n' +
            '1. Building type: outpatient clinic, emergency department, inpatient tower, operating theatre, ICU, etc.\n' +
            '2. Space type: entrance lobby, waiting area, corridor, patient room, nursing station, operating room, etc.\n' +
            '3. Architectural style: modern minimalist, parametric, neo-brutalist, high-tech, biomorphic, sustainable, etc.\n' +
            '4. Facade material: glass curtain wall, aluminum panel, terracotta, concrete, stone, wood, etc.\n' +
            '5. Color scheme: pure white, warm white, wood tones, earth tones, blue, green, grey, accent, etc.\n' +
            '6. Lighting: golden hour, morning light, noon, blue hour, overcast, warm interior, cool clinical, etc.\n' +
            '7. Camera angle: eye-level, low-angle, birds-eye, wide-angle, telephoto, axonometric, etc.\n' +
            '8. Environment: dense urban, suburban, waterfront, hillside, forest, campus, etc.\n' +
            '9. Mood: warm cozy, clinical precise, serene, vibrant, solemn, futuristic, biophilic, etc.\n' +
            '11. Medical furniture: hospital bed, IV pole, patient monitor, nursing desk, surgical light, wheelchair, etc.\n' +
            '12. Landscape: healing garden, living wall, water feature, tree canopy, green roof, bamboo, etc.\n' +
            '13. Layout/massing: podium-and-block, high-rise tower, courtyard cluster, finger plan, ring layout, podium-tower, vertical zoning, linear, megastructure, satellite campus, modular expandable, courtyard-embraced, symmetrical twin-wing, staggered terrace, etc.\n' +
            '14. Hospital-specific details: accessible ramp with handrails, color-coded wayfinding, digital kiosk, clean-dirty zoning signage, private waiting cubicle, negative-pressure isolation signage, staff-patient buffer zone, infection-control hand hygiene path, child-friendly details, anti-slip flooring, acoustic insulation, antimicrobial surface, emergency call button, accessible elevator, etc.\n' +
            '15. Interior lighting/finishes: indirect cove lighting, linear LED strip, tunable smart lighting, perforated acoustic ceiling, antimicrobial flooring, soft-touch wall covering, illuminated wayfinding wall, focused accent spotlight, concealed integrated luminaire, circadian biodynamic lighting, perforated suspended ceiling, anti-glare diffuser, warm reading nook, floor-level night light, sculptural lighting installation, etc.\n\n' +
            'Also generate a complete English prompt sentence for Midjourney / Stable Diffusion.\n\n' +
            'Return a JSON object only, no markdown, no explanation:\n' +
            '{"dimensions":{"1":["keyword"],"2":["keyword"],"3":["keyword"],"4":["keyword"],"5":["keyword"],"6":["keyword"],"7":["keyword"],"8":["keyword"],"9":["keyword"],"11":["keyword"],"12":["keyword"],"13":["keyword"],"14":["keyword"],"15":["keyword"]},"full_prompt":"complete English prompt","description":"中文描述"}';
    }

    function parseAnalysisResult(content) {
        var result;

        // Try to extract JSON from the response
        try {
            // Remove markdown code blocks if present
            var jsonStr = content;
            if (jsonStr.indexOf('```') !== -1) {
                var match = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
                if (match) {
                    jsonStr = match[1].trim();
                }
            }

            // Try to find JSON object
            var jsonStart = jsonStr.indexOf('{');
            var jsonEnd = jsonStr.lastIndexOf('}');
            if (jsonStart !== -1 && jsonEnd !== -1) {
                jsonStr = jsonStr.substring(jsonStart, jsonEnd + 1);
            }

            result = JSON.parse(jsonStr);
        } catch (e) {
            // If JSON parsing fails, show raw text
            result = {
                full_prompt: content,
                description: '解析结果格式异常，已显示原始文本',
                dimensions: {}
            };
        }

        imageAnalysis.currentResult = result;

        // Match keywords to existing vocabulary
        imageAnalysis.matchedTags = matchKeywordsToVocabulary(result.dimensions || {});

        // Save to history
        saveToHistory();

        // Render results
        renderAnalysisResults(result);
    }

    // ===== Match AI keywords to existing vocabulary =====
    function matchKeywordsToVocabulary(dimensions) {
        var matches = [];

        Object.keys(dimensions).forEach(function(dimId) {
            var dimIdNum = parseInt(dimId);
            var dim = state.data.find(function(d) { return d.id === dimIdNum; });
            if (!dim) return;

            var keywords = dimensions[dimId];
            if (!Array.isArray(keywords)) keywords = [keywords];

            keywords.forEach(function(keyword) {
                var kwLower = keyword.toLowerCase();

                dim.items.forEach(function(item, idx) {
                    var enLower = (item.en || '').toLowerCase();
                    var cnLower = (item.cn || '').toLowerCase();
                    var labelLower = (item.label || '').toLowerCase();

                    // Check for matches
                    var isMatch = false;
                    var matchScore = 0;

                    // Exact English match
                    if (enLower === kwLower) {
                        isMatch = true;
                        matchScore = 100;
                    }
                    // English contains keyword
                    else if (enLower.indexOf(kwLower) !== -1 || kwLower.indexOf(enLower) !== -1) {
                        isMatch = true;
                        matchScore = 80;
                    }
                    // Keyword matches a significant word in English (split by space, slash, comma)
                    else {
                        var enWords = enLower.split(/[\s\/,]+/).filter(function(w) { return w.length > 3; });
                        var kwWords = kwLower.split(/[\s\/,]+/).filter(function(w) { return w.length > 3; });
                        for (var i = 0; i < kwWords.length; i++) {
                            for (var j = 0; j < enWords.length; j++) {
                                if (enWords[j] === kwWords[i] || enWords[j].indexOf(kwWords[i]) !== -1 || kwWords[i].indexOf(enWords[j]) !== -1) {
                                    isMatch = true;
                                    matchScore = 60;
                                    break;
                                }
                            }
                            if (isMatch) break;
                        }
                    }

                    if (isMatch) {
                        matches.push({
                            dimId: dimIdNum,
                            itemIdx: idx,
                            keyword: keyword,
                            label: item.label,
                            en: item.en,
                            score: matchScore
                        });
                    }
                });
            });
        });

        // Deduplicate: for each dimension+item, keep only the highest score match
        var deduped = {};
        matches.forEach(function(m) {
            var key = m.dimId + '-' + m.itemIdx;
            if (!deduped[key] || deduped[key].score < m.score) {
                deduped[key] = m;
            }
        });

        return Object.values(deduped);
    }

    // ===== Render Analysis Results =====
    function renderAnalysisResults(result) {
        var html = '<div class="analysis-content">';

        // Description
        if (result.description) {
            html += `
                <div class="result-card">
                    <div class="result-card-label">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                            <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
                            <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
                        </svg>
                        图片描述
                    </div>
                    <div class="result-description">${escapeHtml(result.description)}</div>
                </div>
            `;
        }

        // Full prompt
        if (result.full_prompt) {
            html += `
                <div class="result-card">
                    <div class="result-card-label">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                        </svg>
                        完整提示词
                    </div>
                    <div class="result-prompt-text">${escapeHtml(result.full_prompt)}</div>
                </div>
            `;
        }

        // Dimension breakdown
        if (result.dimensions && Object.keys(result.dimensions).length > 0) {
            html += '<div class="result-card"><div class="result-card-label">维度分析</div><div class="dimension-breakdown">';

            Object.keys(result.dimensions).forEach(function(dimId) {
                var dimIdNum = parseInt(dimId);
                var dim = state.data.find(function(d) { return d.id === dimIdNum; });
                if (!dim) return;

                var keywords = result.dimensions[dimId];
                if (!Array.isArray(keywords)) keywords = [keywords];

                // Check if any keyword has a match
                var hasMatch = imageAnalysis.matchedTags.some(function(m) { return m.dimId === dimIdNum; });

                html += `
                    <div class="breakdown-item ${hasMatch ? 'has-match' : ''}">
                        <span class="breakdown-dim-num">${dimIdNum}</span>
                        <div class="breakdown-content">
                            <div class="breakdown-dim-title">${dim.title}</div>
                            <div class="breakdown-keywords">
                `;

                keywords.forEach(function(kw) {
                    // Check if this keyword is matched
                    var isMatched = imageAnalysis.matchedTags.some(function(m) {
                        return m.dimId === dimIdNum && m.keyword.toLowerCase() === kw.toLowerCase();
                    });
                    html += `<span class="breakdown-keyword ${isMatched ? 'matched' : ''}" title="${isMatched ? '已匹配词库' : 'AI生成关键词'}">${escapeHtml(kw)}</span>`;
                });

                html += '</div></div></div>';
            });

            html += '</div></div>';
        }

        // Matched tags summary
        if (imageAnalysis.matchedTags.length > 0) {
            html += `
                <div class="result-card" style="background:var(--accent-bg);border-color:var(--accent-light);">
                    <div class="result-card-label" style="color:var(--accent);">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        已匹配词库 (${imageAnalysis.matchedTags.length} 项)
                    </div>
                    <div class="breakdown-keywords">
            `;

            imageAnalysis.matchedTags.forEach(function(m) {
                html += `<span class="breakdown-keyword matched" style="background:var(--accent);color:white;border-color:var(--accent);">D${m.dimId} ${escapeHtml(m.label)}</span>`;
            });

            html += '</div></div>';
        }

        html += '</div>';

        document.getElementById('analysisResults').innerHTML = html;

        // Show footer
        document.getElementById('imageModalFooter').style.display = 'flex';
    }

    // ===== Apply matched tags to the tag selector =====
    function applyMatchedTags() {
        if (imageAnalysis.matchedTags.length === 0) {
            showToast('没有可应用的匹配项');
            return;
        }

        var appliedCount = 0;

        imageAnalysis.matchedTags.forEach(function(match) {
            var key = match.dimId + '-' + match.itemIdx;

            // For dim 10, clear previous selections first
            if (match.dimId === 10) {
                state.selected.forEach(function(val, k) {
                    if (k.startsWith('10-')) {
                        state.selected.delete(k);
                        var existingTag = document.querySelector('.tag[data-key="' + k + '"]');
                        if (existingTag) existingTag.classList.remove('selected');
                    }
                });
            }

            if (!state.selected.has(key)) {
                var dim = state.data.find(function(d) { return d.id === match.dimId; });
                if (dim && dim.items[match.itemIdx]) {
                    state.selected.set(key, {
                        dimId: match.dimId,
                        itemIdx: match.itemIdx,
                        item: dim.items[match.itemIdx],
                        dimTitle: dim.title
                    });

                    var tagEl = document.querySelector('.tag[data-key="' + key + '"]');
                    if (tagEl) tagEl.classList.add('selected');

                    appliedCount++;
                }
            }
        });

        updateSelectedTags();
        updateDimensionCounts();
        updatePrompt();

        showToast('已应用 ' + appliedCount + ' 个匹配项到提示词选择器');

        // Close modal
        document.getElementById('imageModalOverlay').classList.remove('show');
    }

    // ===== History Management =====
    function saveToHistory() {
        if (!imageAnalysis.currentResult || !imageAnalysis.currentImageBase64) return;

        // Generate thumbnail async, then save
        generateThumbnail(imageAnalysis.currentImageBase64, 200, 150).then(function(thumbnail) {
            var history = loadHistory();

            // Prepare matched tags (simplified for storage)
            var savedMatchedTags = imageAnalysis.matchedTags.map(function(m) {
                return { dimId: m.dimId, itemIdx: m.itemIdx, label: m.label, keyword: m.keyword, en: m.en, score: m.score };
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

            // Add to front of array
            history.unshift(entry);

            // Limit to max items
            if (history.length > HISTORY_MAX_ITEMS) {
                history = history.slice(0, HISTORY_MAX_ITEMS);
            }

            // Save
            try {
                localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
                updateHistoryBadge();
            } catch (e) {
                // localStorage full — shrink by half
                history = history.slice(0, Math.floor(HISTORY_MAX_ITEMS / 2));
                try {
                    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
                    updateHistoryBadge();
                } catch (e2) {
                    console.error('Failed to save history:', e2);
                }
            }
        });
    }

    function loadHistory() {
        try {
            var raw = localStorage.getItem(HISTORY_STORAGE_KEY);
            if (!raw) return [];
            return JSON.parse(raw);
        } catch (e) {
            return [];
        }
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
            img.onerror = function() {
                resolve('');
            };
            img.src = base64Data;
        });
    }

    function renderHistory() {
        var panel = document.getElementById('historyPanel');
        var history = loadHistory();

        if (history.length === 0) {
            panel.innerHTML = `
                <div class="analysis-empty">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <p>暂无历史记录<br>解析图片后将自动保存到此处</p>
                </div>
            `;
            return;
        }

        var html = '';
        history.forEach(function(entry, index) {
            var date = new Date(entry.timestamp);
            var timeStr = formatDate(date);
            var dimCount = entry.result.dimensions ? Object.keys(entry.result.dimensions).length : 0;
            var matchedCount = entry.matchedTags ? entry.matchedTags.length : 0;

            // First few matched tags for preview
            var tagHtml = '';
            if (entry.matchedTags && entry.matchedTags.length > 0) {
                var previewTags = entry.matchedTags.slice(0, 6);
                previewTags.forEach(function(tag) {
                    tagHtml += '<span class="history-item-tag">' + escapeHtml(tag.label) + '</span>';
                });
                if (entry.matchedTags.length > 6) {
                    tagHtml += '<span class="history-item-tag">+' + (entry.matchedTags.length - 6) + '</span>';
                }
            }

            html += `
                <div class="history-item" data-index="${index}" onclick="void(0)">
                    <div class="history-item-thumb">
                        <img src="${entry.thumbnail || ''}" alt="" onerror="this.style.display='none'">
                    </div>
                    <div class="history-item-info">
                        <div class="history-item-meta">
                            <span class="history-item-time">${timeStr}</span>
                            <span class="history-item-dims">${dimCount} 个维度</span>
                            ${matchedCount > 0 ? '<span class="history-item-dims">' + matchedCount + ' 项匹配</span>' : ''}
                        </div>
                        <div class="history-item-desc">${escapeHtml(entry.result.description || '无描述')}</div>
                        <div class="history-item-tags">${tagHtml}</div>
                    </div>
                    <button class="history-item-delete" title="删除此记录">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
            `;
        });

        panel.innerHTML = html;

        // Bind click events
        panel.querySelectorAll('.history-item').forEach(function(item) {
            item.addEventListener('click', function(e) {
                // Don't trigger if clicking delete button
                if (e.target.closest('.history-item-delete')) return;

                var index = parseInt(this.dataset.index);
                viewHistoryItem(index);
            });
        });

        panel.querySelectorAll('.history-item-delete').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var index = parseInt(this.closest('.history-item').dataset.index);
                deleteHistoryItem(index);
            });
        });
    }

    function viewHistoryItem(index) {
        var history = loadHistory();
        if (index < 0 || index >= history.length) return;

        var entry = history[index];
        imageAnalysis.currentResult = entry.result;
        imageAnalysis.matchedTags = entry.matchedTags || [];

        // Restore image preview (use thumbnail for display only)
        if (entry.thumbnail) {
            document.getElementById('previewImg').src = entry.thumbnail;
            document.getElementById('uploadZone').style.display = 'none';
            document.getElementById('imagePreview').style.display = 'block';
        }

        // Render results in current panel
        renderAnalysisResults(entry.result);

        // Disable analyze button explicitly — thumbnail is too small to use
        imageAnalysis.currentImageBase64 = null;
        var btnAnalyze = document.getElementById('btnAnalyze');
        if (btnAnalyze) btnAnalyze.disabled = true;
        // Reset file input so re-upload can always fire change event
        document.getElementById('imageFileInput').value = '';

        // Switch to current tab
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

        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'inline-flex';
        } else {
            badge.style.display = 'none';
        }
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

    // Initialize history badge on load
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
