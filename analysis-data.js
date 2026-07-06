/**
 * 医院建筑 AI 分析图提示词数据
 * 三级层级结构：模块(1-8) → 类别 → 词条
 * 效果图模式使用 data.js，分析图模式使用此文件
 */
const ANALYSIS_PROMPT_DATA = [
  // =========================================================================
  // M00 参考源
  // =========================================================================
  {
    id: "1",
    title: "参考源",
    desc: "指定 AI 参考的建筑、事务所、风格等",
    categories: [
      {
        title: "参考源",
        role: "reference",
        items: [
          { label: "参考建筑", en: "Reference building precedent" },
          { label: "参考事务所", en: "Reference architecture firm style" },
          { label: "参考分析图", en: "Reference analysis diagram style" },
          { label: "参考配色", en: "Reference color palette" },
          { label: "参考字体", en: "Reference typography" },
          { label: "参考排版", en: "Reference layout design" },
          { label: "参考竞赛", en: "Reference competition board" },
          { label: "参考案例", en: "Reference case study" }
        ]
      }
    ]
  },

  // =========================================================================
  // M01 输入控制
  // =========================================================================
  {
    id: "2",
    title: "输入控制",
    desc: "控制 AI 对底图信息的理解程度和编辑权限",
    categories: [
      {
        title: "第一类：几何锁定（geometry lock）",
        role: "control_geometry",
        items: [
          { label: "建筑轮廓", en: "Building outline / footprint" },
          { label: "建筑体量", en: "Building massing / volume" },
          { label: "建筑比例", en: "Building proportions" },
          { label: "建筑尺寸", en: "Building dimensions" },
          { label: "建筑层数", en: "Building floor count" },
          { label: "建筑形态", en: "Building morphology / form" },
          { label: "建筑边界", en: "Building boundary / edge" },
          { label: "建筑定位", en: "Building positioning on site" },
          { label: "建筑朝向", en: "Building orientation" },
          { label: "建筑构成", en: "Building composition" },
          { label: "建筑轮廓线", en: "Building silhouette / outline" }
        ]
      },
      {
        title: "第二类：环境锁定（context lock）",
        role: "control_context",
        items: [
          { label: "道路", en: "Road network" },
          { label: "湖岸线", en: "Lake shoreline" },
          { label: "河流", en: "River / water body" },
          { label: "绿地", en: "Green space / landscape area" },
          { label: "树木", en: "Trees / vegetation" },
          { label: "山体", en: "Mountain / terrain" },
          { label: "城市肌理", en: "Urban fabric" },
          { label: "周边建筑", en: "Surrounding buildings" },
          { label: "总平关系", en: "Master plan relationship" },
          { label: "场地边界", en: "Site boundary" },
          { label: "地形", en: "Topography" },
          { label: "高程", en: "Elevation data" },
          { label: "现状环境", en: "Existing environment" },
          { label: "交通系统", en: "Transportation system" }
        ]
      },
      {
        title: "第三类：视角锁定（camera lock）",
        role: "control_camera",
        items: [
          { label: "视角", en: "Viewpoint angle" },
          { label: "鸟瞰角度", en: "Bird's eye view angle" },
          { label: "轴测角度", en: "Axonometric angle" },
          { label: "镜头位置", en: "Camera position" },
          { label: "透视关系", en: "Perspective relationship" },
          { label: "相机高度", en: "Camera height" },
          { label: "构图", en: "Composition / framing" },
          { label: "裁切范围", en: "Crop area / framing boundary" },
          { label: "画幅比例", en: "Aspect ratio" },
          { label: "视觉中心", en: "Visual focal point" }
        ]
      },
      {
        title: "第四类：允许编辑图层（editable layers）",
        role: "control_editable",
        items: [
          { label: "仅添加分析图形", en: "Only add analysis graphics" },
          { label: "仅添加色块", en: "Only add color blocks" },
          { label: "仅添加箭头", en: "Only add arrows" },
          { label: "仅添加图标", en: "Only add icons" },
          { label: "仅添加引导线", en: "Only add guide lines" },
          { label: "仅添加人物", en: "Only add human figures" },
          { label: "仅添加植物", en: "Only add vegetation" },
          { label: "仅添加分析节点", en: "Only add analysis nodes" },
          { label: "仅添加图例", en: "Only add legend" },
          { label: "仅添加编号", en: "Only add numbering" },
          { label: "仅添加文字", en: "Only add text labels" },
          { label: "仅添加信息图", en: "Only add infographics" },
          { label: "允许调整颜色", en: "Allow color adjustments" },
          { label: "允许增加透明图层", en: "Allow transparent overlay layers" },
          { label: "允许增加分析元素", en: "Allow analysis elements" }
        ]
      },
      {
        title: "第五类：语义锁定（semantic lock）",
        role: "control_semantic",
        items: [
          { label: "保持建筑设计意图", en: "Preserve architectural design intent" },
          { label: "保持建筑语言", en: "Preserve architectural language" },
          { label: "保持立面逻辑", en: "Preserve facade logic" },
          { label: "保持空间组织", en: "Preserve spatial organization" },
          { label: "保持功能布局", en: "Preserve functional layout" },
          { label: "保持设计策略", en: "Preserve design strategy" },
          { label: "保持建筑识别性", en: "Preserve building identity" },
          { label: "保持方案完整性", en: "Preserve scheme integrity" },
          { label: "保持建筑特征", en: "Preserve architectural character" },
          { label: "保持建筑风格", en: "Preserve architectural style" }
        ]
      },
      {
        title: "第六类：禁止项（forbidden）",
        role: "control_forbidden",
        items: [
          { label: "不要改变建筑", en: "Do not alter the building" },
          { label: "不要增加建筑", en: "Do not add buildings" },
          { label: "不要改变道路", en: "Do not alter roads" },
          { label: "不要改变比例", en: "Do not change proportions" },
          { label: "不要真实材质", en: "No realistic materials" },
          { label: "不要照片感", en: "No photographic look" },
          { label: "不要油画感", en: "No oil painting style" },
          { label: "不要卡通感", en: "No cartoon style" },
          { label: "不要噪点", en: "No noise / grain" },
          { label: "不要模糊", en: "No blur" },
          { label: "不要错误透视", en: "No incorrect perspective" },
          { label: "不要文字", en: "No text elements" },
          { label: "不要Logo", en: "No logos" },
          { label: "不要水印", en: "No watermarks" }
        ]
      },
      {
        title: "第七类：优先级（priority）",
        role: "control_priority",
        items: [
          { label: "建筑优先保持", en: "Building preservation first" },
          { label: "道路优先保持", en: "Road preservation first" },
          { label: "湖岸优先保持", en: "Lakeshore preservation first" },
          { label: "比例优先保持", en: "Proportion preservation first" },
          { label: "建筑细节优先保持", en: "Architectural detail preservation first" },
          { label: "所有分析均为叠加表达", en: "All analysis is overlay expression only" },
          { label: "严禁重新设计建筑", en: "Strictly prohibit redesigning the building" }
        ]
      },
      {
        title: "第八类：约束等级（constraint level）",
        role: "control_level",
        items: [
          { label: "轻度约束", en: "Light constraint — flexible interpretation" },
          { label: "中度约束", en: "Medium constraint — balanced interpretation" },
          { label: "高度约束", en: "High constraint — strict interpretation" }
        ]
      }
    ]
  },

  // =========================================================================
  // M02 设计意图
  // =========================================================================
  {
    id: "3",
    title: "设计意图",
    desc: "定义分析图的核心目的、分析目标和工作方式",
    categories: [
      {
        title: "第一类：设计目标",
        role: "intent_goal",
        items: [
          { label: "概念生成", en: "Concept generation" },
          { label: "方案优化", en: "Scheme optimization" },
          { label: "设计推演", en: "Design iteration / evolution" },
          { label: "问题分析", en: "Problem analysis" },
          { label: "设计表达", en: "Design expression / communication" },
          { label: "竞赛展示", en: "Competition presentation" },
          { label: "汇报表达", en: "Client presentation" },
          { label: "论文配图", en: "Academic paper illustration" },
          { label: "施工表达", en: "Construction documentation" },
          { label: "运营展示", en: "Operations presentation" }
        ]
      },
      {
        title: "第二类：分析目标",
        role: "intent_analysis",
        items: [
          { label: "解释设计逻辑", en: "Explain design logic" },
          { label: "说明空间关系", en: "Illustrate spatial relationships" },
          { label: "证明交通合理", en: "Demonstrate circulation rationality" },
          { label: "突出景观优势", en: "Highlight landscape advantages" },
          { label: "强调城市联系", en: "Emphasize urban connections" },
          { label: "展示功能组织", en: "Show functional organization" },
          { label: "展示设计策略", en: "Present design strategy" },
          { label: "展示生态价值", en: "Showcase ecological value" },
          { label: "展示医疗流程", en: "Present healthcare workflow" },
          { label: "展示康复理念", en: "Present healing / rehabilitation concept" }
        ]
      },
      {
        title: "第三类：成果类型",
        role: "intent_deliverable",
        items: [
          { label: "分析图", en: "Analysis diagram" },
          { label: "轴测图", en: "Axonometric drawing" },
          { label: "爆炸图", en: "Exploded diagram" },
          { label: "剖面图", en: "Section drawing" },
          { label: "效果图", en: "Rendering" },
          { label: "流程图", en: "Flow chart / process diagram" },
          { label: "概念图", en: "Concept diagram" },
          { label: "泡泡图", en: "Bubble diagram" },
          { label: "信息图", en: "Infographic" },
          { label: "鸟瞰图", en: "Aerial view" },
          { label: "节点图", en: "Detail / node diagram" },
          { label: "动画关键帧", en: "Animation keyframe" },
          { label: "竞赛展板", en: "Competition board" }
        ]
      },
      {
        title: "第四类：工作模式",
        role: "intent_mode",
        items: [
          { label: "Overlay — 叠加", en: "Overlay — add elements on top" },
          { label: "Edit — 编辑", en: "Edit — modify existing content" },
          { label: "Generate — 生成", en: "Generate — create new content" },
          { label: "Extend — 扩展", en: "Extend — expand beyond boundaries" },
          { label: "Restyle — 重绘风格", en: "Restyle — change visual style" },
          { label: "Simplify — 简化", en: "Simplify — reduce complexity" },
          { label: "Refine — 精炼", en: "Refine — polish and improve" }
        ]
      },
      {
        title: "第五类：工作范围",
        role: "intent_scope",
        items: [
          { label: "整体", en: "Overall / holistic" },
          { label: "局部", en: "Partial / localized" },
          { label: "节点", en: "Detail node" },
          { label: "建筑", en: "Building scale" },
          { label: "总平", en: "Master plan scale" },
          { label: "城市", en: "Urban scale" },
          { label: "室内", en: "Interior" },
          { label: "立面", en: "Facade / elevation" },
          { label: "剖面", en: "Section" },
          { label: "景观", en: "Landscape" },
          { label: "屋顶", en: "Roof" },
          { label: "地下", en: "Underground" },
          { label: "平台", en: "Platform / terrace" }
        ]
      },
      {
        title: "第六类：受众",
        role: "intent_audience",
        items: [
          { label: "竞赛评委", en: "Competition jury" },
          { label: "甲方汇报", en: "Client presentation" },
          { label: "医院专家", en: "Hospital experts / medical professionals" },
          { label: "政府审批", en: "Government approval / planning authority" },
          { label: "施工单位", en: "Construction team" },
          { label: "运营团队", en: "Operations team" },
          { label: "公众展示", en: "Public exhibition" },
          { label: "论文发表", en: "Academic publication" }
        ]
      }
    ]
  },

  // =========================================================================
  // M03 建筑逻辑
  // =========================================================================
  {
    id: "4",
    title: "建筑逻辑",
    desc: "空间组织、功能布局、环境策略等设计逻辑",
    categories: [
      {
        title: "第一类：空间逻辑",
        role: "logic_spatial",
        items: [
          { label: "空间组织", en: "Spatial organization" },
          { label: "空间序列", en: "Spatial sequence" },
          { label: "公共空间", en: "Public space" },
          { label: "私密空间", en: "Private space" },
          { label: "半开放空间", en: "Semi-open space" },
          { label: "空间渗透", en: "Spatial permeability" },
          { label: "空间过渡", en: "Spatial transition" },
          { label: "空间层级", en: "Spatial hierarchy" },
          { label: "空间连续性", en: "Spatial continuity" },
          { label: "空间转换", en: "Spatial transformation" },
          { label: "开放首层", en: "Open ground floor" },
          { label: "共享中庭", en: "Shared atrium" },
          { label: "立体交通", en: "Multi-level circulation" },
          { label: "多层平台", en: "Multi-level platforms" }
        ]
      },
      {
        title: "第二类：功能逻辑",
        role: "logic_functional",
        items: [
          { label: "功能布局", en: "Functional layout" },
          { label: "功能分区", en: "Functional zoning" },
          { label: "洁污分流", en: "Clean/dirty separation" },
          { label: "医患分流", en: "Staff/patient separation" },
          { label: "后勤独立", en: "Independent logistics" },
          { label: "急诊优先", en: "Emergency priority" },
          { label: "康复单元", en: "Rehabilitation unit" },
          { label: "共享功能", en: "Shared functions" },
          { label: "垂直交通", en: "Vertical circulation" },
          { label: "运营组织", en: "Operational organization" },
          { label: "流线优化", en: "Circulation optimization" },
          { label: "模块化布局", en: "Modular layout" }
        ]
      },
      {
        title: "第三类：环境逻辑",
        role: "logic_environmental",
        items: [
          { label: "自然采光", en: "Natural daylighting" },
          { label: "自然通风", en: "Natural ventilation" },
          { label: "山海融合", en: "Mountain-sea integration" },
          { label: "景观渗透", en: "Landscape penetration" },
          { label: "生态修复", en: "Ecological restoration" },
          { label: "风环境", en: "Wind environment" },
          { label: "遮阳", en: "Solar shading" },
          { label: "降噪", en: "Noise reduction" },
          { label: "绿色建筑", en: "Green building" },
          { label: "低碳", en: "Low carbon" },
          { label: "雨水管理", en: "Stormwater management" },
          { label: "海绵城市", en: "Sponge city" },
          { label: "微气候", en: "Microclimate" },
          { label: "立体绿化", en: "Vertical greening" },
          { label: "疗愈景观", en: "Healing landscape" }
        ]
      },
      {
        title: "第四类：城市逻辑",
        role: "logic_urban",
        items: [
          { label: "城市界面", en: "Urban interface" },
          { label: "街角开放", en: "Open corner" },
          { label: "城市客厅", en: "Urban living room" },
          { label: "TOD", en: "Transit-oriented development" },
          { label: "开放街区", en: "Open block" },
          { label: "公共开放空间", en: "Public open space" },
          { label: "慢行系统", en: "Slow traffic / pedestrian system" },
          { label: "城市绿轴", en: "Urban green axis" },
          { label: "滨水界面", en: "Waterfront interface" },
          { label: "城市更新", en: "Urban renewal" },
          { label: "地标", en: "Landmark" },
          { label: "城市天际线", en: "Urban skyline" },
          { label: "街道活力", en: "Street vitality" }
        ]
      },
      {
        title: "第五类：建筑形态操作",
        role: "logic_architectural",
        items: [
          { label: "退台", en: "Terracing / stepping" },
          { label: "围合", en: "Enclosure / courtyard" },
          { label: "悬挑", en: "Cantilever" },
          { label: "漂浮", en: "Floating / elevated" },
          { label: "错动", en: "Shifting / displacement" },
          { label: "穿插", en: "Interpenetration" },
          { label: "叠加", en: "Stacking / layering" },
          { label: "切割", en: "Cutting / carving" },
          { label: "旋转", en: "Rotation" },
          { label: "打开", en: "Opening up" },
          { label: "抬升", en: "Lifting" },
          { label: "下沉", en: "Sunken / recessed" },
          { label: "融合", en: "Blending / merging" },
          { label: "延展", en: "Extension / stretching" },
          { label: "嵌入", en: "Embedding" },
          { label: "生长", en: "Growth / organic form" },
          { label: "响应场地", en: "Site-responsive" },
          { label: "消解体量", en: "Volume dissolution" },
          { label: "强化界面", en: "Interface reinforcement" }
        ]
      },
      {
        title: "第六类：体验",
        role: "logic_experience",
        items: [
          { label: "疗愈体验", en: "Healing experience" },
          { label: "到达体验", en: "Arrival experience" },
          { label: "空间仪式感", en: "Spatial ceremony / ritual" },
          { label: "景观体验", en: "Landscape experience" },
          { label: "连续漫游", en: "Continuous promenade" },
          { label: "视觉引导", en: "Visual guidance" },
          { label: "无障碍体验", en: "Barrier-free / accessible experience" },
          { label: "共享交流", en: "Shared interaction / community" },
          { label: "舒适性", en: "Comfort" },
          { label: "亲自然体验", en: "Biophilic experience" },
          { label: "去医院化", en: "De-institutionalization" },
          { label: "社区融合", en: "Community integration" }
        ]
      },
      {
        title: "第七类：价值",
        role: "logic_value",
        items: [
          { label: "可持续", en: "Sustainability" },
          { label: "健康", en: "Health & wellness" },
          { label: "韧性", en: "Resilience" },
          { label: "包容", en: "Inclusivity" },
          { label: "公平", en: "Equity" },
          { label: "共享", en: "Sharing / commonality" },
          { label: "高效", en: "Efficiency" },
          { label: "智慧", en: "Smart / intelligent" },
          { label: "低碳", en: "Low carbon" },
          { label: "生态", en: "Ecology" },
          { label: "文化", en: "Culture" },
          { label: "地方性", en: "Locality / vernacular" },
          { label: "未来性", en: "Futurity" }
        ]
      }
    ]
  },

  // =========================================================================
  // M04 视觉语法
  // =========================================================================
  {
    id: "5",
    title: "视觉语法",
    desc: "分析图的图形语言、符号和关系表达方式",
    categories: [
      {
        title: "第一类：图解元素",
        role: "grammar_elements",
        items: [
          { label: "箭头", en: "Arrows" },
          { label: "引导线", en: "Guide lines" },
          { label: "节点", en: "Nodes" },
          { label: "编号", en: "Numbering" },
          { label: "图例", en: "Legend" },
          { label: "透明色块", en: "Transparent color blocks" },
          { label: "渐变", en: "Gradients" },
          { label: "分析圈", en: "Analysis circles" },
          { label: "虚线", en: "Dashed lines" },
          { label: "边框", en: "Borders / frames" },
          { label: "文字标签", en: "Text labels" },
          { label: "比例尺", en: "Scale bar" },
          { label: "指北针", en: "North arrow" }
        ]
      },
      {
        title: "第二类：图形符号",
        role: "grammar_symbols",
        items: [
          { label: "树木", en: "Trees" },
          { label: "人物", en: "Human figures" },
          { label: "汽车", en: "Cars" },
          { label: "自行车", en: "Bicycles" },
          { label: "公交", en: "Public transit" },
          { label: "鸟", en: "Birds" },
          { label: "水", en: "Water" },
          { label: "风", en: "Wind" },
          { label: "太阳", en: "Sun" },
          { label: "云", en: "Clouds" },
          { label: "医疗图标", en: "Medical icons" },
          { label: "功能图标", en: "Function icons" }
        ]
      },
      {
        title: "第三类：关系表达",
        role: "grammar_relationship",
        items: [
          { label: "连接", en: "Connection" },
          { label: "渗透", en: "Permeation" },
          { label: "流动", en: "Flow" },
          { label: "影响", en: "Influence" },
          { label: "辐射", en: "Radiation" },
          { label: "视线", en: "View corridor" },
          { label: "风向", en: "Wind direction" },
          { label: "噪声", en: "Noise pattern" },
          { label: "层级", en: "Hierarchy" },
          { label: "优先级", en: "Priority" },
          { label: "时间", en: "Time / sequence" },
          { label: "演化", en: "Evolution / phasing" }
        ]
      },
      {
        title: "第四类：图解方式",
        role: "grammar_type",
        items: [
          { label: "色块图", en: "Color block diagram" },
          { label: "线稿图", en: "Line drawing diagram" },
          { label: "渐变图", en: "Gradient diagram" },
          { label: "爆炸图", en: "Exploded diagram" },
          { label: "轴测图", en: "Axonometric diagram" },
          { label: "流程图", en: "Flow chart" },
          { label: "矩阵图", en: "Matrix diagram" },
          { label: "时间轴", en: "Timeline" },
          { label: "网络图", en: "Network diagram" },
          { label: "鱼骨图", en: "Fishbone diagram" },
          { label: "环形图", en: "Ring / radial diagram" },
          { label: "雷达图", en: "Radar chart" }
        ]
      }
    ]
  },

  // =========================================================================
  // M05 建筑表现
  // =========================================================================
  {
    id: "6",
    title: "建筑表现",
    desc: "渲染类型、图纸类型、细节等级和表达方式",
    categories: [
      {
        title: "第一类：渲染类型",
        role: "rep_rendering",
        items: [
          { label: "AO白模", en: "AO White Model" },
          { label: "粘土渲染", en: "Clay Render" },
          { label: "照片级写实", en: "Photorealistic" },
          { label: "概念渲染", en: "Concept Render" },
          { label: "插画风", en: "Illustration" },
          { label: "技术图纸", en: "Technical Drawing" },
          { label: "手绘素描", en: "Sketch" },
          { label: "水彩", en: "Watercolor" },
          { label: "水墨", en: "Ink" },
          { label: "铅笔", en: "Pencil" }
        ]
      },
      {
        title: "第二类：图纸类型",
        role: "rep_drawing",
        items: [
          { label: "透视图", en: "Perspective" },
          { label: "鸟瞰图", en: "Bird View" },
          { label: "轴测图", en: "Axonometric" },
          { label: "剖面图", en: "Section" },
          { label: "平面图", en: "Plan" },
          { label: "立面图", en: "Elevation" },
          { label: "爆炸图", en: "Exploded" },
          { label: "图解", en: "Diagram" },
          { label: "剖透图", en: "Cutaway" },
          { label: "室内", en: "Interior" }
        ]
      },
      {
        title: "第三类：细节等级",
        role: "rep_detail",
        items: [
          { label: "概念级", en: "Concept level" },
          { label: "低细节", en: "Low detail" },
          { label: "中等细节", en: "Medium detail" },
          { label: "高细节", en: "High detail" },
          { label: "竞赛级", en: "Competition detail" },
          { label: "施工图级", en: "Construction detail" }
        ]
      },
      {
        title: "第四类：完成度",
        role: "rep_finish",
        items: [
          { label: "草图", en: "Draft" },
          { label: "概念", en: "Concept" },
          { label: "汇报级", en: "Presentation" },
          { label: "出版级", en: "Publication" },
          { label: "竞赛级", en: "Competition" },
          { label: "终稿", en: "Final" }
        ]
      },
      {
        title: "第五类：表达方式",
        role: "rep_expression",
        items: [
          { label: "极简", en: "Minimal" },
          { label: "抽象", en: "Abstract" },
          { label: "图解式", en: "Diagrammatic" },
          { label: "艺术化", en: "Artistic" },
          { label: "技术性", en: "Technical" },
          { label: "叙事性", en: "Narrative" },
          { label: "编辑出版风", en: "Editorial" }
        ]
      }
    ]
  },

  // =========================================================================
  // M06 视觉风格
  // =========================================================================
  {
    id: "7",
    title: "视觉风格",
    desc: "色彩、材质、光影、氛围和品牌调性",
    categories: [
      {
        title: "第一类：色彩系统",
        role: "style_color",
        items: [
          { label: "莫兰迪", en: "Morandi color palette" },
          { label: "马卡龙", en: "Macaron color palette" },
          { label: "Pantone", en: "Pantone color system" },
          { label: "单色", en: "Monochrome" },
          { label: "双色", en: "Duotone" },
          { label: "蓝绿调", en: "Blue-Green palette" },
          { label: "暖灰调", en: "Warm Grey palette" },
          { label: "冷灰调", en: "Cold Grey palette" },
          { label: "中性调", en: "Neutral palette" },
          { label: "低饱和", en: "Low Saturation" },
          { label: "高对比", en: "High Contrast" }
        ]
      },
      {
        title: "第二类：材质感",
        role: "style_material",
        items: [
          { label: "纸质感", en: "Paper texture" },
          { label: "硫酸纸", en: "Tracing paper" },
          { label: "混凝土质感", en: "Concrete texture" },
          { label: "粘土质感", en: "Clay texture" },
          { label: "玻璃质感", en: "Glass texture" },
          { label: "泡沫板质感", en: "Foam texture" },
          { label: "卡纸质感", en: "Cardboard texture" },
          { label: "墨水感", en: "Ink texture" },
          { label: "塑料质感", en: "Plastic texture" },
          { label: "金属质感", en: "Metal texture" },
          { label: "混凝土", en: "Concrete material" },
          { label: "玻璃", en: "Glass material" },
          { label: "木材", en: "Wood material" },
          { label: "石材", en: "Stone material" },
          { label: "铝板", en: "Aluminum panel" },
          { label: "陶板", en: "Terracotta panel" },
          { label: "穿孔板", en: "Perforated panel" },
          { label: "ETFE", en: "ETFE membrane" },
          { label: "绿化表皮", en: "Green facade" },
          { label: "幕墙", en: "Curtain wall" },
          { label: "双层表皮", en: "Double skin facade" }
        ]
      },
      {
        title: "第三类：纹理",
        role: "style_texture",
        items: [
          { label: "扁平", en: "Flat" },
          { label: "光滑", en: "Smooth" },
          { label: "噪点", en: "Noise texture" },
          { label: "颗粒感", en: "Grain texture" },
          { label: "水彩纹理", en: "Watercolor texture" },
          { label: "纸纹理", en: "Paper texture" },
          { label: "干净", en: "Clean" },
          { label: "极简纹理", en: "Minimal texture" },
          { label: "柔和渐变", en: "Soft gradient" }
        ]
      },
      {
        title: "第四类：光影氛围",
        role: "style_lighting",
        items: [
          { label: "柔和阴影", en: "Soft shadow" },
          { label: "环境光遮蔽-AO", en: "Ambient occlusion" },
          { label: "漫射光", en: "Diffuse lighting" },
          { label: "影棚光", en: "Studio lighting" },
          { label: "雾感", en: "Fog / atmospheric haze" },
          { label: "黄金时刻", en: "Golden hour" },
          { label: "清晨", en: "Morning light" },
          { label: "逆光", en: "Backlight" },
          { label: "环境光", en: "Ambient light" }
        ]
      },
      {
        title: "第五类：环境氛围",
        role: "style_atmosphere",
        items: [
          { label: "宁静", en: "Calm" },
          { label: "优雅", en: "Elegant" },
          { label: "放松", en: "Relaxing" },
          { label: "疗愈", en: "Healing" },
          { label: "专业", en: "Professional" },
          { label: "未来感", en: "Futuristic" },
          { label: "科技感", en: "Technological" },
          { label: "温暖", en: "Warm" },
          { label: "安静", en: "Quiet" },
          { label: "清新", en: "Fresh" },
          { label: "极简", en: "Minimal" },
          { label: "奢华", en: "Luxurious" }
        ]
      },
      {
        title: "第六类：品牌风格 / 事务所",
        role: "style_brand",
        items: [
          { label: "BIG — 参数化未来风", en: "BIG — Parametric / Futuristic" },
          { label: "ZHA — 扎哈·哈迪德", en: "ZHA — Zaha Hadid Architects" },
          { label: "UNStudio", en: "UNStudio — parametric future" },
          { label: "MAD Architects", en: "MAD Architects — futuristic organic" },
          { label: "OMA — 现代几何", en: "OMA — Modern Geometry" },
          { label: "MVRDV — 现代几何", en: "MVRDV — Modern Geometry" },
          { label: "Snøhetta — 生态自然", en: "Snøhetta — Nature / ecological" },
          { label: "Kengo Kuma — 隈研吾 自然", en: "Kengo Kuma — Natural / organic" },
          { label: "Henning Larsen — 生态自然", en: "Henning Larsen — Nature / ecological" },
          { label: "SANAA — 极简纯净", en: "SANAA — Minimal / pure" },
          { label: "Lacaton & Vassal — 极简", en: "Lacaton & Vassal — Minimal" },
          { label: "Perkins&Will — 医疗康养", en: "Perkins&Will — Healthcare" },
          { label: "NBBJ — 医疗康养", en: "NBBJ — Healthcare" },
          { label: "CannonDesign — 医疗康养", en: "CannonDesign — Healthcare" },
          { label: "HKS — 医疗康养", en: "HKS — Healthcare" },
          { label: "SOM — 企业总部", en: "SOM — Corporate headquarters" },
          { label: "Foster + Partners — 企业总部", en: "Foster + Partners — Corporate" },
          { label: "KPF — 企业总部", en: "KPF — Corporate" },
          { label: "AS+GG — 企业总部", en: "AS+GG — Corporate" },
          { label: "AECOM — 城市景观", en: "AECOM — Urban Landscape" },
          { label: "Sasaki — 城市景观", en: "Sasaki — Urban Landscape" },
          { label: "West 8 — 城市景观", en: "West 8 — Urban Landscape" },
          { label: "Turenscape — 土人景观", en: "Turenscape — Urban Landscape" },
          { label: "ZHA — 先锋未来", en: "ZHA — Avant-garde" },
          { label: "UNStudio — 先锋未来", en: "UNStudio — Avant-garde" },
          { label: "MAD — 先锋未来", en: "MAD — Avant-garde" }
        ]
      },
      {
        title: "第七类：图形语言 / 版式",
        role: "style_graphic",
        items: [
          { label: "瑞士网格", en: "Swiss Grid" },
          { label: "信息设计", en: "Information Design" },
          { label: "极简排版", en: "Minimal layout" },
          { label: "干净排版", en: "Clean layout" },
          { label: "信息层级", en: "Clear hierarchy" },
          { label: "留白", en: "White space" },
          { label: "对齐", en: "Alignment" },
          { label: "平衡", en: "Balance" },
          { label: "专业排版", en: "Professional Layout" },
          { label: "编辑出版", en: "Editorial Design" },
          { label: "竞赛展板", en: "Competition Board layout" }
        ]
      }
    ]
  },

  // =========================================================================
  // M07 输出质量
  // =========================================================================
  {
    id: "8",
    title: "输出质量",
    desc: "画质、画布、构图和后期编辑友好性",
    categories: [
      {
        title: "第一类：画质",
        role: "output_quality",
        items: [
          { label: "超高清", en: "Ultra HD" },
          { label: "8K分辨率", en: "8K resolution" },
          { label: "矢量感", en: "Vector feeling" },
          { label: "竞赛品质", en: "Competition quality" },
          { label: "专业级", en: "Professional" },
          { label: "出版品质", en: "Publication quality" },
          { label: "清晰锐利", en: "Sharp" },
          { label: "干净无噪点", en: "Clean / noise-free" },
          { label: "高清分辨率", en: "High resolution" },
          { label: "印刷就绪", en: "Print ready" },
          { label: "边缘锐利", en: "Crisp edges" },
          { label: "抗锯齿", en: "Anti-aliased" }
        ]
      },
      {
        title: "第二类：画布",
        role: "output_canvas",
        items: [
          { label: "1:1 方形", en: "1:1 square" },
          { label: "4:3 横版", en: "4:3 landscape" },
          { label: "16:9 宽屏", en: "16:9 widescreen" },
          { label: "A3", en: "A3 format" },
          { label: "A4", en: "A4 format" },
          { label: "A1", en: "A1 format" },
          { label: "横版", en: "Landscape orientation" },
          { label: "竖版", en: "Portrait orientation" }
        ]
      },
      {
        title: "第三类：构图",
        role: "output_composition",
        items: [
          { label: "居中构图", en: "Centered composition" },
          { label: "黄金分割", en: "Golden ratio composition" },
          { label: "留白", en: "White space" },
          { label: "上下分区", en: "Top-bottom division" },
          { label: "左右分区", en: "Left-right division" },
          { label: "信息集中", en: "Information concentration" },
          { label: "视觉重心明确", en: "Clear visual focal point" },
          { label: "阅读路径清晰", en: "Clear reading path" },
          { label: "留出标题区域", en: "Title area reserved" },
          { label: "留出文字区域", en: "Text area reserved" },
          { label: "适合排版", en: "Layout-friendly" },
          { label: "边缘留白", en: "Edge margins" }
        ]
      },
      {
        title: "第四类：后期编辑友好",
        role: "output_editability",
        items: [
          { label: "背景纯净", en: "Clean background" },
          { label: "建筑主体完整", en: "Complete building subject" },
          { label: "分析元素独立", en: "Independent analysis elements" },
          { label: "文字与图形分离", en: "Text and graphics separated" },
          { label: "避免元素融合", en: "Avoid element blending" },
          { label: "视觉层级清晰", en: "Clear visual hierarchy" },
          { label: "预留后期编辑空间", en: "Post-editing space reserved" },
          { label: "便于PS后期调整", en: "Easy PS post-adjustment" }
        ]
      },
      {
        title: "第五类：视觉一致性",
        role: "output_consistency",
        items: [
          { label: "统一配色体系", en: "Unified color system" },
          { label: "统一箭头语言", en: "Unified arrow language" },
          { label: "统一图例系统", en: "Unified legend system" },
          { label: "统一图标风格", en: "Unified icon style" },
          { label: "统一信息层级", en: "Unified information hierarchy" },
          { label: "统一版式逻辑", en: "Unified layout logic" },
          { label: "保持系列分析图风格一致", en: "Maintain consistent analysis diagram style across series" },
          { label: "保持竞赛展板整体视觉一致", en: "Maintain overall competition board visual consistency" }
        ]
      }
    ]
  }
];
