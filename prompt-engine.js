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
            var viewPhrase = joinAnd(viewArr);
            parts.push(capitalize(article(viewPhrase)) + ' ' + viewPhrase + ' render of ' + subjectPhrase);
        } else {
            parts.push(capitalize(subjectPhrase));
        }

        if (groups.layout && groups.layout.length) {
            var layoutPhrase = joinAnd(lcArr(groups.layout));
            parts.push('organized as ' + article(layoutPhrase) + ' ' + layoutPhrase + ' configuration');
        }
        if (groups.material && groups.material.length) {
            parts.push('clad in ' + joinAnd(lcArr(groups.material)));
        }
        if (groups.color && groups.color.length) {
            var colorPhrase = joinAnd(lcArr(groups.color));
            parts.push('in ' + article(colorPhrase) + ' ' + colorPhrase + ' color palette');
        }
        if (groups.light && groups.light.length) {
            parts.push('illuminated by ' + joinAnd(lcArr(groups.light)));
        }
        if (groups.interior && groups.interior.length) {
            parts.push('with ' + joinAnd(lcArr(groups.interior)));
        }
        if (groups.context && groups.context.length) {
            var contextPhrase = joinAnd(lcArr(groups.context));
            parts.push('set within ' + article(contextPhrase) + ' ' + contextPhrase);
        }
        if (groups.mood && groups.mood.length) {
            var moodPhrase = joinAnd(lcArr(groups.mood));
            parts.push('evoking ' + article(moodPhrase) + ' ' + moodPhrase + ' atmosphere');
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

    // ===== Analysis Diagram Prompt Building =====

    function buildAnalysisSentence(selections, lang) {
        lang = lang === 'cn' ? 'cn' : 'en';
        var groups = groupByRole(selections, lang);
        var parts = [];

        // 1. 设计意图 (M02): Design goal + Analysis goal + Scope
        var goalArr = groups.intent_goal || [];
        var analysisArr = groups.intent_analysis || [];
        var scopeArr = groups.intent_scope || [];
        if (goalArr.length || analysisArr.length) {
            var goalPhrase = goalArr.length ? joinAnd(goalArr) : 'Design analysis';
            parts.push(capitalize(goalPhrase));
            if (analysisArr.length) {
                parts[parts.length - 1] += ' demonstrating ' + joinAnd(lcArr(analysisArr));
            }
        }

        // 2. 成果类型 (M02): Deliverable + Working mode
        var deliverableArr = groups.intent_deliverable || [];
        var modeArr = groups.intent_mode || [];
        var audienceArr = groups.intent_audience || [];
        if (deliverableArr.length) {
            var del = joinAnd(lcArr(deliverableArr));
            if (modeArr.length) {
                del = joinAnd(lcArr(modeArr)) + ' ' + del;
            }
            parts.push(capitalize(article(del)) + ' ' + del);
        }
        if (audienceArr.length) {
            parts.push('for ' + joinAnd(lcArr(audienceArr)));
        }

        // 3. 工作范围 (M02): Scope
        if (scopeArr.length && (!goalArr.length || !analysisArr.length)) {
            parts.push('Focusing on the ' + joinAnd(lcArr(scopeArr)));
        }

        // 4. 输入控制 (M01): Geometry lock, Camera lock, Semantic lock, Priority
        var geoArr = groups.control_geometry || [];
        var camArr = groups.control_camera || [];
        var semArr = groups.control_semantic || [];
        var prioArr = groups.control_priority || [];
        var levelArr = groups.control_level || [];

        if (geoArr.length) {
            parts.push('Based on ' + joinAnd(lcArr(geoArr)));
        }
        if (camArr.length) {
            parts.push('from ' + joinAnd(lcArr(camArr)) + ' view');
        }
        if (semArr.length) {
            parts.push('preserving ' + joinAnd(lcArr(semArr)));
        }
        if (levelArr.length) {
            parts.push('with ' + lcArr(levelArr)[0]);
        }

        // 5. 建筑逻辑 (M03): Spatial, Functional, Environmental, Urban, Architectural, Experience, Value
        ['logic_spatial', 'logic_functional', 'logic_environmental', 'logic_urban', 'logic_architectural', 'logic_experience', 'logic_value'].forEach(function(role) {
            if (groups[role] && groups[role].length) {
                var prefix = role.replace('logic_', '');
                parts.push('showing ' + prefix + ' through ' + joinAnd(lcArr(groups[role])));
            }
        });

        // 6. 视觉语法 (M04): Diagram type, Elements, Symbols, Relationship
        var typeArr = groups.grammar_type || [];
        var elemArr = groups.grammar_elements || [];
        var symArr = groups.grammar_symbols || [];
        var relArr = groups.grammar_relationship || [];

        if (typeArr.length) {
            parts.push(capitalize('using ' + joinAnd(lcArr(typeArr))));
        }
        if (elemArr.length) {
            parts.push('with ' + joinAnd(lcArr(elemArr)));
        }
        if (symArr.length) {
            parts.push('incorporating ' + joinAnd(lcArr(symArr)));
        }
        if (relArr.length) {
            parts.push('emphasizing ' + joinAnd(lcArr(relArr)));
        }

        // 7. 建筑表现 (M05): Rendering type, Drawing type, Detail, Finish, Expression
        var rendArr = groups.rep_rendering || [];
        var drawArr = groups.rep_drawing || [];
        var detailArr = groups.rep_detail || [];
        var finishArr = groups.rep_finish || [];
        var exprArr = groups.rep_expression || [];

        var repParts = [];
        if (rendArr.length) repParts.push(joinAnd(lcArr(rendArr)) + ' rendering');
        if (drawArr.length) repParts.push(joinAnd(lcArr(drawArr)));
        if (detailArr.length) repParts.push(lcArr(detailArr)[0] + ' detail');
        if (finishArr.length) repParts.push(lcArr(finishArr)[0] + ' finish');
        if (exprArr.length) repParts.push(lcArr(exprArr)[0] + ' expression');
        if (repParts.length) {
            parts.push(capitalize(joinAnd(repParts)) + ' style');
        }

        // 8. 视觉风格 (M06): Color, Material, Texture, Lighting, Atmosphere, Brand, Graphic
        var colorArr = groups.style_color || [];
        var matArr = groups.style_material || [];
        var texArr = groups.style_texture || [];
        var lightArr = groups.style_lighting || [];
        var atmosArr = groups.style_atmosphere || [];
        var brandArr = groups.style_brand || [];
        var graphicArr = groups.style_graphic || [];

        var styleParts = [];
        if (colorArr.length) styleParts.push(joinAnd(lcArr(colorArr)) + ' color palette');
        if (matArr.length) styleParts.push(joinAnd(lcArr(matArr)) + ' material');
        if (texArr.length) styleParts.push(lcArr(texArr)[0] + ' texture');
        if (lightArr.length) styleParts.push(joinAnd(lcArr(lightArr)) + ' lighting');
        if (atmosArr.length) styleParts.push(joinAnd(lcArr(atmosArr)) + ' atmosphere');
        if (brandArr.length) styleParts.push(joinAnd(lcArr(brandArr)) + ' style');
        if (graphicArr.length) styleParts.push(joinAnd(lcArr(graphicArr)) + ' layout');
        if (styleParts.length) {
            parts.push('Visual style: ' + joinAnd(styleParts));
        }

        // 9. 输出质量 (M07): Quality, Canvas, Composition, Editability, Consistency
        var qualArr = groups.output_quality || [];
        var canvasArr = groups.output_canvas || [];
        var compArr = groups.output_composition || [];
        var editArr = groups.output_editability || [];
        var consArr = groups.output_consistency || [];

        if (qualArr.length) {
            parts.push('Output: ' + joinAnd(lcArr(qualArr)));
        }
        if (canvasArr.length) {
            parts.push(lcArr(canvasArr)[0] + ' format');
        }
        if (compArr.length) {
            parts.push(joinAnd(lcArr(compArr)) + ' composition');
        }
        if (editArr.length) {
            parts.push('Post-edit friendly: ' + joinAnd(lcArr(editArr)));
        }
        if (consArr.length) {
            parts.push(joinAnd(lcArr(consArr)));
        }

        // 10. 参考源 (M00): Reference
        var refArr = groups.reference || [];
        if (refArr.length) {
            parts.push('Referencing ' + joinAnd(lcArr(refArr)));
        }

        // 11. 输入控制 - Editable layers
        var editLayerArr = groups.control_editable || [];
        if (editLayerArr.length) {
            parts.push('Edit layers: ' + joinAnd(lcArr(editLayerArr)));
        }

        // 12. 输入控制 - Context lock
        var ctxArr = groups.control_context || [];
        if (ctxArr.length) {
            parts.push('Context includes ' + joinAnd(lcArr(ctxArr)));
        }

        // 13. 输入控制 - Forbidden
        var forbArr = groups.control_forbidden || [];
        if (forbArr.length) {
            parts.push('Prohibited: ' + joinAnd(lcArr(forbArr)));
        }

        return parts.join('. ') + '.';
    }

    function buildAnalysisKeyword(selections, lang) {
        lang = lang === 'cn' ? 'cn' : 'en';
        var groups = groupByRole(selections, lang);
        var parts = [];

        var analysisRoleOrder = [
            'intent_goal', 'intent_analysis', 'intent_deliverable', 'intent_mode',
            'intent_scope', 'intent_audience',
            'control_geometry', 'control_camera', 'control_context',
            'control_semantic', 'control_priority', 'control_level',
            'control_editable', 'control_forbidden',
            'logic_spatial', 'logic_functional', 'logic_environmental',
            'logic_urban', 'logic_architectural', 'logic_experience', 'logic_value',
            'grammar_type', 'grammar_elements', 'grammar_symbols', 'grammar_relationship',
            'rep_rendering', 'rep_drawing', 'rep_detail', 'rep_finish', 'rep_expression',
            'style_color', 'style_material', 'style_texture',
            'style_lighting', 'style_atmosphere', 'style_brand', 'style_graphic',
            'output_quality', 'output_canvas', 'output_composition',
            'output_editability', 'output_consistency',
            'reference'
        ];

        analysisRoleOrder.forEach(function(role) {
            if (groups[role] && groups[role].length) {
                groups[role].forEach(function(text) {
                    parts.push(text);
                });
            }
        });

        return parts.join(', ');
    }

    return {
        buildSentence: buildSentence,
        buildKeywordPhrase: buildKeywordPhrase,
        isRenderFlag: isRenderFlag,
        buildAnalysisSentence: buildAnalysisSentence,
        buildAnalysisKeyword: buildAnalysisKeyword
    };
}));
