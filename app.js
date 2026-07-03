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
        let html = `
            <div class="search-bar">
                <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                </svg>
                <input type="text" id="searchInputInner" placeholder="搜索提示词（中英文）..." class="search-input">
            </div>
        `;

        state.data.forEach(function(dim) {
            const tagsHtml = dim.items.map(function(item, idx) {
                return renderTag(dim, item, idx);
            }).join('');

            html += `
                <div class="dimension-section" data-dim-id="${dim.id}">
                    <div class="dimension-header" data-dim-id="${dim.id}">
                        <div class="dimension-header-left">
                            <span class="dimension-number">${dim.id}</span>
                            <span class="dimension-title">${dim.title}</span>
                        </div>
                        <div class="dimension-header-right">
                            <span class="dimension-count" id="count-${dim.id}">${dim.items.length}</span>
                            <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                                <polyline points="6 9 12 15 18 9"/>
                            </svg>
                        </div>
                    </div>
                    <div class="dimension-body">
                        <div class="dimension-tags" data-dim-id="${dim.id}">
                            ${tagsHtml}
                        </div>
                    </div>
                </div>
            `;
        });

        dimensionsPanel.innerHTML = html;

        // Bind tag click events
        document.querySelectorAll('.tag').forEach(function(tag) {
            tag.addEventListener('click', function() {
                const dimId = parseInt(this.dataset.dimId);
                const itemIdx = parseInt(this.dataset.itemIdx);
                toggleSelection(dimId, itemIdx, this);
            });
        });

        // Bind dimension header collapse
        document.querySelectorAll('.dimension-header').forEach(function(header) {
            header.addEventListener('click', function() {
                const section = this.closest('.dimension-section');
                section.classList.toggle('collapsed');
            });
        });

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

        return `<span class="${cls}" data-dim-id="${dim.id}" data-item-idx="${idx}" data-key="${key}">
            ${tagContent}
        </span>`;
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
    }

    function getDimItemCount(dimId) {
        const dim = state.data.find(function(d) { return d.id === dimId; });
        return dim ? dim.items.length : 0;
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
        if (!query) {
            // Show all
            document.querySelectorAll('.tag').forEach(function(tag) {
                tag.classList.remove('hidden');
            });
            document.querySelectorAll('.dimension-section').forEach(function(section) {
                section.style.display = '';
            });
            return;
        }

        // Filter tags
        document.querySelectorAll('.dimension-section').forEach(function(section) {
            let hasMatch = false;
            section.querySelectorAll('.tag').forEach(function(tag) {
                const text = tag.textContent.toLowerCase();
                if (text.indexOf(query) !== -1) {
                    tag.classList.remove('hidden');
                    hasMatch = true;
                } else {
                    tag.classList.add('hidden');
                }
            });
            section.style.display = hasMatch ? '' : 'none';
            // Expand sections with matches
            if (hasMatch) {
                section.classList.remove('collapsed');
            }
        });
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
    }

    // ===== Start =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
