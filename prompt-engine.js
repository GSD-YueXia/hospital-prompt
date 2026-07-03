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
