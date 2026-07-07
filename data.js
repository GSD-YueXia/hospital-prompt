/**
 * 医院建筑 AI 效果图提示词数据
 * 三级层级结构：模块(1-13) → 类别 → 词条
 * 结构参考 analysis-data.js（分析图），与效果图模式共享模块→类别→词条模型
 */
const PROMPT_DATA = [
  {
    id: "1",
    title: "约束类型",
    desc: "控制 AI 对建筑几何、比例与材质的约束等级（轻度/中度/高度）",
    categories: [
      {
        title: "轻度",
        role: "constraint_light",
        items: [
          { label: "保持建筑几何完全不变", en: "Maintain the exact architectural geometry", cn: "保持建筑几何完全不变" },
          { label: "保持建筑比例完全不变", en: "Preserve the original proportions", cn: "保持建筑比例完全不变" },
          { label: "不增加建筑层数", en: "Do not add floors", cn: "不增加建筑层数" }
        ]
      },
      {
        title: "中度",
        role: "constraint_medium",
        items: [
          { label: "保持窗洞位置", en: "Preserve all window positions", cn: "保持窗洞位置" },
          { label: "保持屋顶轮廓", en: "Maintain the original roof profile", cn: "保持屋顶轮廓" },
          { label: "不删除建筑构件", en: "Do not remove architectural elements", cn: "不删除建筑构件" },
          { label: "不重新设计建筑", en: "Do not redesign the building", cn: "不重新设计建筑" }
        ]
      },
      {
        title: "高度",
        role: "constraint_high",
        items: [
          { label: "严格以输入建筑为唯一参考", en: "Use the provided model as the only reference", cn: "严格以输入建筑为唯一参考" },
          { label: "几何锁定", en: "geometry lock", cn: "几何锁定" }
        ]
      }
    ]
  },
  {
    id: "2",
    title: "建筑类型",
    desc: "指定渲染的建筑类型（医院 / 公建 / 文化 / 居住等）",
    categories: [
      {
        title: "建筑类型",
        role: "subject",
        items: [
          { label: "综合医院", en: "General Hospital", cn: "综合医院" },
          { label: "专科医院", en: "Specialty Hospital", cn: "专科医院" },
          { label: "中医医院", en: "Traditional Chinese Medicine Hospital", cn: "中医医院" },
          { label: "康复医院", en: "Rehabilitation Hospital", cn: "康复医院" },
          { label: "妇幼医院", en: "Women's and Children's Hospital", cn: "妇幼医院" },
          { label: "医学中心", en: "Medical Center", cn: "医学中心" },
          { label: "康养社区", en: "Healthcare Community", cn: "康养社区" },
          { label: "医疗园区", en: "Medical Campus", cn: "医疗园区" },
          { label: "办公楼", en: "Office Building", cn: "办公楼" },
          { label: "企业总部", en: "Headquarters", cn: "企业总部" },
          { label: "科研中心", en: "Research Center", cn: "科研中心" },
          { label: "博物馆", en: "Museum", cn: "博物馆" },
          { label: "美术馆", en: "Art Gallery", cn: "美术馆" },
          { label: "图书馆", en: "Library", cn: "图书馆" },
          { label: "文化中心", en: "Cultural Center", cn: "文化中心" },
          { label: "综合体", en: "Mixed-use Development", cn: "综合体" },
          { label: "高层住宅", en: "Residential Tower", cn: "高层住宅" },
          { label: "酒店", en: "Hotel", cn: "酒店" },
          { label: "大学校园", en: "University Campus", cn: "大学校园" },
          { label: "交通枢纽", en: "Transportation Hub", cn: "交通枢纽" }
        ]
      }
    ]
  },
  {
    id: "3",
    title: "外立面/表皮材质",
    desc: "建筑外立面与表皮的材质系统",
    categories: [
      {
        title: "外立面/表皮材质",
        role: "material",
        items: [
          { label: "双层幕墙", en: "Double-Skin Façade", cn: "双层幕墙" },
          { label: "玻璃幕墙", en: "Glass Curtain Wall", cn: "玻璃幕墙" },
          { label: "穿孔铝板", en: "Perforated Aluminum Panels", cn: "穿孔铝板" },
          { label: "金属格栅", en: "Metal Screen", cn: "金属格栅" },
          { label: "竖向遮阳", en: "Vertical Fins", cn: "竖向遮阳" },
          { label: "横向遮阳", en: "Horizontal Louvers", cn: "横向遮阳" },
          { label: "呼吸式立面", en: "Breathable Façade", cn: "呼吸式立面" },
          { label: "模块化立面", en: "Modular Façade", cn: "模块化立面" },
          { label: "参数化立面", en: "Parametric Façade", cn: "参数化立面" },
          { label: "折面立面", en: "Folded Façade", cn: "折面立面" },
          { label: "绿色立面", en: "Green Façade", cn: "绿色立面" },
          { label: "半透明幕墙", en: "Translucent Façade", cn: "半透明幕墙" },
          { label: "单元式幕墙", en: "Unitized Curtain Wall", cn: "单元式幕墙" },
          { label: "建筑遮阳系统", en: "Solar Shading System", cn: "建筑遮阳系统" }
        ]
      }
    ]
  },
  {
    id: "4",
    title: "材质材料",
    desc: "具体建筑材料与质感表现",
    categories: [
      {
        title: "材质材料",
        role: "material",
        items: [
          { label: "彩釉玻璃", en: "Fritted glass / Ceramic frit pattern", cn: "彩釉玻璃/陶瓷点釉", extra: "遮阳+隐私" },
          { label: "铝板", en: "Perforated aluminum panel", cn: "穿孔铝板", extra: "遮阳表皮" },
          { label: "陶板", en: "Terracotta rainscreen panel", cn: "陶土板幕墙", extra: "温暖质感" },
          { label: "清水混凝土", en: "Exposed architectural concrete", cn: "清水混凝土", extra: "粗野主义" },
          { label: "石材", en: "Natural stone cladding / Limestone", cn: "天然石材/石灰石", extra: "稳重感" },
          { label: "金属复合板", en: "ACM / Metal composite panel", cn: "金属复合板", extra: "现代感" },
          { label: "木饰面", en: "Timber battens / Wood louvers", cn: "木格栅/木百叶", extra: "温暖疗愈" },
          { label: "聚碳酸酯", en: "Polycarbonate translucent panel", cn: "聚碳酸酯透光板", extra: "半透明表皮" },
          { label: "光伏玻璃", en: "BIPV / Solar glass", cn: "光伏一体化玻璃", extra: "可持续" },
          { label: "耐候钢", en: "Corten steel / Weathering steel", cn: "耐候钢/锈蚀钢板", extra: "工业风" },
          { label: "GRC板", en: "Glass-fiber reinforced concrete", cn: "GRC玻璃纤维混凝土", extra: "曲面造型" },
          { label: "涂料", en: "Silicone-based exterior paint", cn: "硅基外墙涂料", extra: "经济型" },
          { label: "瓷砖", en: "Ceramic tile / Porcelain panel", cn: "陶瓷砖/瓷板", extra: "易清洁" },
          { label: "膜结构", en: "Tensile fabric / ETFE cushion", cn: "张拉膜/ETFE气枕", extra: "入口雨棚" },
          { label: "穿孔金属板", en: "Perforated Metal Panels", cn: "穿孔金属板" },
          { label: "超白玻璃", en: "Ultra-Clear Glass", cn: "超白玻璃" },
          { label: "金属饰面", en: "Metallic Finish", cn: "金属饰面" },
          { label: "拉丝不锈钢", en: "Brushed Stainless Steel", cn: "拉丝不锈钢" },
          { label: "超白Low-E玻璃", en: "Ultra-Clear Low-E Glass", cn: "超白Low-E玻璃" }
        ]
      }
    ]
  },
  {
    id: "5",
    title: "建筑风格/设计语言",
    desc: "建筑风格与设计语言",
    categories: [
      {
        title: "建筑风格/设计语言",
        role: "style",
        items: [
          { label: "现代极简", en: "Modern minimalist / Clean lines", cn: "现代极简/简洁线条" },
          { label: "参数化", en: "Parametric / Fluid organic form", cn: "参数化/流体有机形态" },
          { label: "新粗野主义", en: "Neo-brutalist / Exposed concrete", cn: "新粗野主义/清水混凝土" },
          { label: "高技派", en: "High-tech / Expressed structure", cn: "高技派/结构外露" },
          { label: "新乡土", en: "Neo-vernacular / Regional materials", cn: "新乡土/地域材料" },
          { label: "新古典", en: "Neo-classical / Symmetrical facade", cn: "新古典/对称立面" },
          { label: "解构主义", en: "Deconstructivist / Fragmented volumes", cn: "解构主义/破碎体量" },
          { label: "生态仿生", en: "Biomorphic / Nature-inspired", cn: "生态仿生/自然启发" },
          { label: "艺术装饰", en: "Art Deco / Geometric ornament", cn: "装饰艺术/几何装饰" },
          { label: "后现代", en: "Postmodern / Playful color accents", cn: "后现代/玩味色彩" },
          { label: "电影感渲染", en: "Cinematic Rendering", cn: "电影感渲染" },
          { label: "高端效果图", en: "High-end ArchViz", cn: "高端效果图" },
          { label: "概念效果图", en: "Conceptual Rendering", cn: "概念效果图" },
          { label: "建筑CG", en: "Architectural CGI", cn: "建筑CG" },
          { label: "写实CG", en: "Realistic CGI", cn: "写实CG" },
          { label: "可持续绿色", en: "Sustainable / Green roof / Living wall", cn: "可持续/绿色屋顶/绿墙" },
          { label: "疗愈建筑", en: "Healing architecture / Calming forms", cn: "疗愈建筑/安宁形态" },
          { label: "智慧医院", en: "Smart hospital / Digital facade", cn: "智慧医院/数字立面" },
          { label: "模块化", en: "Modular / Prefabricated units", cn: "模块化/预制单元" },
          { label: "庭院式", en: "Courtyard typology / Pavilion plan", cn: "庭院式/分散式布局" }
        ]
      }
    ]
  },
  {
    id: "6",
    title: "色彩方案",
    desc: "整体色彩方案与心理效应",
    categories: [
      {
        title: "色彩方案",
        role: "color",
        items: [
          { label: "全白/冷白", en: "Pure white / Cool white palette", cn: "纯白/冷白调", extra: "洁净专业" },
          { label: "暖白/米白", en: "Warm white / Off-white / Cream", cn: "暖白/米白/奶油色", extra: "温馨放松" },
          { label: "木色系", en: "Natural wood / Oak / Walnut", cn: "天然木色/橡木/胡桃", extra: "自然疗愈" },
          { label: "大地色", en: "Earth tone / Terracotta / Beige", cn: "大地色/陶土色/米黄", extra: "沉稳安心" },
          { label: "蓝色系", en: "Calming blue / Sky blue / Teal", cn: "安宁蓝/天蓝/蓝绿", extra: "镇静降压" },
          { label: "绿色系", en: "Healing green / Sage / Mint", cn: "疗愈绿/鼠尾草/薄荷", extra: "恢复生机" },
          { label: "灰色系", en: "Warm grey / Cool grey / Greige", cn: "暖灰/冷灰/灰米", extra: "中性高级" },
          { label: "点缀亮色", en: "Accent yellow / Coral / Lavender", cn: "点缀黄/珊瑚/薰衣草", extra: "儿童/导向" },
          { label: "粉彩系", en: "Pastel pink / Baby blue / Lilac", cn: "粉彩/淡粉/淡紫", extra: "儿科/产科" },
          { label: "深色对比", en: "Charcoal / Dark bronze accent", cn: "炭灰/深古铜点缀", extra: "科技感" }
        ]
      }
    ]
  },
  {
    id: "7",
    title: "光线/时间",
    desc: "光照条件与时段氛围",
    categories: [
      {
        title: "光线/时间",
        role: "light",
        items: [
          { label: "清晨日光", en: "Early morning golden glow", cn: "清晨金色光", extra: "2700K" },
          { label: "上午漫射", en: "Late morning diffused light", cn: "上午漫射光", extra: "4500K" },
          { label: "正午强光", en: "Harsh noon sunlight / High contrast", cn: "正午强光/高对比", extra: "5500K" },
          { label: "黄金时刻", en: "Golden hour / Warm sunset", cn: "黄金时刻/暖日落", extra: "3000K" },
          { label: "蓝色时刻", en: "Blue hour / Twilight", cn: "蓝色时刻/暮光", extra: "6500K" },
          { label: "阴天漫射", en: "Overcast / Softbox lighting effect", cn: "阴天/柔光箱效果", extra: "5000K" },
          { label: "室内人工暖", en: "Warm 3000K cove / Downlight", cn: "暖色3000K灯带", extra: "3000K" },
          { label: "室内人工冷", en: "Cool 4000K / Clinical task light", cn: "冷色4000K工作灯", extra: "4000K" },
          { label: "混合照明", en: "Mixed lighting / Daylight + artificial", cn: "混合照明/日光+人工", extra: "混合" },
          { label: "动态变色", en: "Circadian dynamic lighting", cn: "节律动态照明", extra: "可变" },
          { label: "天窗采光", en: "Clerestory / Skylight / Lightwell", cn: "高侧窗/天窗/光井", extra: "自然光" },
          { label: "背光剪影", en: "Backlit silhouette / Rim lighting", cn: "背光剪影/边缘光", extra: "—" },
          { label: "侧光强调", en: "Side lighting / Raking light", cn: "侧光/擦射光", extra: "—" },
          { label: "月光夜景", en: "Moonlit / Night ambiance", cn: "月光/夜景氛围", extra: "4000K" },
          { label: "水下光线", en: "Caustic light reflection / Pool reflection", cn: "水纹反射光", extra: "—" },
          { label: "柔和阴影", en: "Soft Shadows", cn: "柔和阴影" },
          { label: "建筑夜景照明", en: "Architectural Night Lighting", cn: "建筑夜景照明" },
          { label: "夜景长曝光", en: "night photography, long exposure, light trails, starry sky", cn: "夜景长曝光" },
          { label: "光影层次", en: "Layered Light and Shadow", cn: "光影层次" },
          { label: "环境照明", en: "Ambient Lighting", cn: "环境照明" },
          { label: "秋景", en: "", cn: "秋景" },
          { label: "雪景", en: "", cn: "雪景" },
          { label: "雨景", en: "", cn: "雨景" }
        ]
      }
    ]
  },
  {
    id: "8",
    title: "天气氛围",
    desc: "天气与大气环境",
    categories: [
      {
        title: "天气氛围",
        role: "weather",
        items: [
          { label: "晴朗天空", en: "Clear Sky", cn: "晴朗天空" },
          { label: "局部多云", en: "Partly Cloudy", cn: "局部多云" },
          { label: "雨后空气", en: "After Rain", cn: "雨后空气" },
          { label: "清晨薄雾", en: "Morning Mist", cn: "清晨薄雾" },
          { label: "轻雾", en: "Light Fog", cn: "轻雾" },
          { label: "湿润空气", en: "Humid Atmosphere", cn: "湿润空气" },
          { label: "通透空气", en: "Crisp Air", cn: "通透空气" },
          { label: "空气透视", en: "Atmospheric Perspective", cn: "空气透视" },
          { label: "微风树影", en: "Gentle Breeze", cn: "微风树影" },
          { label: "云层变化", en: "Dynamic Cloudscape", cn: "云层变化" },
          { label: "清新环境", en: "Fresh Environment", cn: "清新环境" },
          { label: "宁静氛围", en: "Calm Atmosphere", cn: "宁静氛围" },
          { label: "温暖环境", en: "Warm Atmosphere", cn: "温暖环境" },
          { label: "自然环境", en: "Natural Environment", cn: "自然环境" },
          { label: "柔和环境光", en: "Soft Ambient Atmosphere", cn: "柔和环境光" }
        ]
      }
    ]
  },
  {
    id: "9",
    title: "视角/镜头",
    desc: "拍摄视角与镜头语言",
    categories: [
      {
        title: "视角/镜头",
        role: "view",
        items: [
          { label: "人眼平视", en: "Eye-level / 1.6m height", cn: "人眼平视", extra: "焦距: 35mm", effect: "真实感" },
          { label: "低角度仰视", en: "Low-angle / Worm‘s-eye", cn: "低角度仰视", extra: "焦距: 16mm", effect: "崇高感" },
          { label: "高角度俯视", en: "High-angle / Bird’s-eye", cn: "高角度俯视", extra: "焦距: 50mm", effect: "整体感" },
          { label: "鸟瞰轴测", en: "Axonometric / Isometric view", cn: "鸟瞰轴测", extra: "焦距: —", effect: "图解性" },
          { label: "航拍", en: "Aerial View", cn: "航拍" },
          { label: "街道视角", en: "Street-level Perspective", cn: "街道视角" },
          { label: "剖透视", en: "Sectional perspective / Cutaway", cn: "剖透视", extra: "焦距: 24mm", effect: "空间深度" },
          { label: "广角透视", en: "Wide-angle / Strong vanishing point", cn: "广角透视", extra: "焦距: 14mm", effect: "纵深感" },
          { label: "长焦压缩", en: "Telephoto / Compressed perspective", cn: "长焦压缩", extra: "焦距: 85mm", effect: "立面感" },
          { label: "爆炸轴测", en: "Exploded axonometric", cn: "爆炸轴测", extra: "焦距: —", effect: "构造示意" },
          { label: "视点序列", en: "Sequential view / Walkthrough", cn: "视点序列", extra: "焦距: 35mm", effect: "叙事流线" },
          { label: "细节特写", en: "Close-up / Macro detail", cn: "细节特写", extra: "焦距: 105mm", effect: "材质表现" },
          { label: "三分法构图", en: "Rule of thirds composition", cn: "三分法构图", extra: "焦距: —", effect: "平衡美学" },
          { label: "引导线构图", en: "Leading lines / Vanishing point", cn: "引导线构图", extra: "焦距: —", effect: "导向聚焦" },
          { label: "框架构图", en: "Framed view / Framing with foreground", cn: "框架构图", extra: "焦距: —", effect: "层次感" },
          { label: "人物尺度", en: "With human figures for scale", cn: "人物尺度", extra: "焦距: —", effect: "比例参照" }
        ]
      }
    ]
  },
  {
    id: "10",
    title: "环境/周边",
    desc: "场地周边环境语境",
    categories: [
      {
        title: "环境/周边",
        role: "context",
        items: [
          { label: "城市密集区", en: "Dense urban context / High-rise surroundings", cn: "密集城市/周边高层" },
          { label: "郊区低密", en: "Suburban / Low-rise neighborhood", cn: "郊区/低密度社区" },
          { label: "滨水/湖畔", en: "Waterfront / Lakefront / River bank", cn: "滨水/湖畔/河岸" },
          { label: "山地/坡地", en: "Hillside / Sloping terrain / Mountain backdrop", cn: "山地/坡地/山景背景" },
          { label: "森林/绿地", en: "Woodland / Forest clearing / Park setting", cn: "林地/森林空地/公园" },
          { label: "湿地/生态", en: "Wetland / Ecological conservation area", cn: "湿地/生态保护区" },
          { label: "农田/乡村", en: "Agricultural field / Rural landscape", cn: "农田/乡村景观" },
          { label: "沙漠/干旱", en: "Arid / Desert / Dusty atmosphere", cn: "干旱/沙漠/尘雾" },
          { label: "海滨/海岸", en: "Coastal / Seafront / Ocean view", cn: "海滨/海岸/海景" },
          { label: "历史城区", en: "Historic district / Heritage context", cn: "历史城区/遗产环境" },
          { label: "工业园区", en: "Industrial park / Science campus", cn: "工业园/科技园区" },
          { label: "校园/大学", en: "University campus / Academic setting", cn: "大学校园/学术环境" },
          { label: "商业街区", en: "Commercial street / Retail podium", cn: "商业街/商业裙房" },
          { label: "交通枢纽", en: "Transport hub / Metro adjacency", cn: "交通枢纽/邻地铁" },
          { label: "医疗园区", en: "Medical campus / Health district", cn: "医疗园区/健康城" }
        ]
      }
    ]
  },
  {
    id: "11",
    title: "氛围/情绪",
    desc: "空间氛围与情绪基调",
    categories: [
      {
        title: "氛围/情绪",
        role: "mood",
        items: [
          { label: "温馨安心", en: "Warm / Cozy / Reassuring", cn: "温馨/舒适/安心", extra: "产科/儿科" },
          { label: "专业冷静", en: "Clinical / Precise / Sterile", cn: "专业/精准/洁净", extra: "手术/ICU" },
          { label: "宁静冥想", en: "Serene / Meditative / Quiet", cn: "宁静/冥想/安静", extra: "安宁/精神" },
          { label: "活力乐观", en: "Vibrant / Uplifting / Playful", cn: "活力/乐观/趣味", extra: "儿科/康复" },
          { label: "庄重肃穆", en: "Solemn / Dignified / Respectful", cn: "庄重/尊严/敬意", extra: "太平间/礼堂" },
          { label: "通透开放", en: "Open / Airy / Transparent", cn: "开放/通透/透明", extra: "门诊大厅" },
          { label: "沉稳信赖", en: "Solid / Trustworthy / Grounded", cn: "沉稳/可信/踏实", extra: "老年科/综合" },
          { label: "未来科技", en: "Futuristic / Innovative / High-tech", cn: "未来/创新/高科技", extra: "影像/手术" },
          { label: "自然疗愈", en: "Biophilic / Restorative / Organic", cn: "自然/疗愈/有机", extra: "康复/庭院" },
          { label: "简约干净", en: "Minimal / Clean / Uncluttered", cn: "简约/干净/无杂乱", extra: "所有通用" }
        ]
      }
    ]
  },
  {
    id: "12",
    title: "图像质量",
    desc: "渲染画质与质量参数",
    categories: [
      {
        title: "图像质量",
        role: "quality",
        items: [
          { label: "超高精度", en: "Ultra Detailed", cn: "超高精度" },
          { label: "高分辨率", en: "High Resolution", cn: "高分辨率" },
          { label: "超高清", en: "Ultra High Definition", cn: "超高清" },
          { label: "8K品质", en: "8K Quality", cn: "8K品质" },
          { label: "全局光照", en: "Global Illumination", cn: "全局光照" },
          { label: "环境光遮蔽", en: "Ambient Occlusion", cn: "环境光遮蔽" },
          { label: "光线追踪", en: "Ray Tracing", cn: "光线追踪" },
          { label: "柔和反射", en: "Soft Reflections", cn: "柔和反射" },
          { label: "精细阴影", en: "Crisp Shadows", cn: "精细阴影" },
          { label: "丰富细节", en: "Rich Detail", cn: "丰富细节" },
          { label: "真实材质", en: "Realistic Materials", cn: "真实材质" },
          { label: "高清纹理", en: "High-resolution Textures", cn: "高清纹理" },
          { label: "高动态范围", en: "High Dynamic Range (HDR)", cn: "高动态范围" },
          { label: "高品质建筑可视化", en: "Premium Architectural Visualization", cn: "高品质建筑可视化" }
        ]
      }
    ]
  },
  {
    id: "13",
    title: "自然元素/景观",
    desc: "自然元素与景观设计",
    categories: [
      {
        title: "自然元素/景观",
        role: "landscape",
        items: [
          { label: "疗愈花园", en: "Healing garden / Therapeutic landscape", cn: "疗愈花园/治疗性景观" },
          { label: "垂直绿墙", en: "Living wall / Green facade", cn: "垂直绿墙/绿色立面" },
          { label: "水景", en: "Reflecting pool / Water feature", cn: "镜面水池/水景" },
          { label: "树阵", en: "Tree allee / Canopy grove", cn: "树阵/树冠丛" },
          { label: "屋顶绿化", en: "Green roof / Sedum blanket", cn: "绿色屋顶/景天地毯" },
          { label: "竹园", en: "Bamboo grove / Zen garden", cn: "竹园/禅意花园" },
          { label: "花坛", en: "Flower bed / Perennial border", cn: "花坛/多年生花境" },
          { label: "步道", en: "Accessible path / Winding trail", cn: "无障碍步道/蜿蜒小径" },
          { label: "户外家具", en: "Outdoor bench / Picnic table", cn: "户外长椅/野餐桌" },
          { label: "雕塑/艺术", en: "Healing art / Sculpture installation", cn: "疗愈艺术/雕塑装置" },
          { label: "本土植物", en: "Native Planting", cn: "本土植物" },
          { label: "屋顶花园", en: "Roof Garden", cn: "屋顶花园" },
          { label: "空中花园", en: "Sky Garden", cn: "空中花园" },
          { label: "下沉庭院", en: "Sunken Courtyard", cn: "下沉庭院" },
          { label: "中央花园", en: "Central Garden", cn: "中央花园" },
          { label: "城市广场", en: "Urban Plaza", cn: "城市广场" },
          { label: "滨水景观", en: "Waterfront Landscape", cn: "滨水景观" },
          { label: "湖滨景观", en: "Lakeside Landscape", cn: "湖滨景观" },
          { label: "雨水花园", en: "Rain Garden", cn: "雨水花园" },
          { label: "生态湿地", en: "Constructed Wetland", cn: "生态湿地" },
          { label: "生态缓冲带", en: "Green Buffer", cn: "生态缓冲带" },
          { label: "景观步道", en: "Landscape Walkway", cn: "景观步道" },
          { label: "步行绿道", en: "Pedestrian Promenade", cn: "步行绿道" },
          { label: "林荫步道", en: "Tree-lined Walkway", cn: "林荫步道" },
          { label: "镜面水池", en: "Reflecting Pool", cn: "镜面水池" },
          { label: "草坪", en: "Open Lawn", cn: "草坪" },
          { label: "四季植物", en: "Seasonal Planting", cn: "四季植物" },
          { label: "生物多样性景观", en: "Biodiverse Landscape", cn: "生物多样性景观" }
        ]
      }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PROMPT_DATA;
}
