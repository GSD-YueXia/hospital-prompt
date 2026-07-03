const PROMPT_DATA = [
  {
    "id": 1,
    "title": "建筑主体类型 / 医疗功能模块",
    "full_title": "维度1：建筑主体类型 / 医疗功能模块",
    "col_layout": "standard",
    "role": "subject",
    "items": [
      {
        "label": "综合门诊",
        "en": "Outpatient clinic cluster",
        "cn": "门诊组团"
      },
      {
        "label": "急诊中心",
        "en": "Emergency department with ambulance bay",
        "cn": "急诊科+救护车坡道"
      },
      {
        "label": "住院部",
        "en": "Inpatient tower with patient rooms",
        "cn": "住院塔楼"
      },
      {
        "label": "手术中心",
        "en": "Operating theatre complex / Hybrid OR",
        "cn": "手术室群/杂交手术室"
      },
      {
        "label": "ICU重症",
        "en": "Intensive care unit with central nursing station",
        "cn": "重症监护+中央护士站"
      },
      {
        "label": "医学影像",
        "en": "Radiology / Imaging department with MRI/CT suites",
        "cn": "影像科（含MRI/CT机房）"
      },
      {
        "label": "核医学",
        "en": "Nuclear medicine / PET-CT center",
        "cn": "核医学/PET-CT中心"
      },
      {
        "label": "放疗中心",
        "en": "Radiation oncology / Linear accelerator bunker",
        "cn": "放疗科/直线加速器室"
      },
      {
        "label": "内镜中心",
        "en": "Endoscopy suite with recovery bays",
        "cn": "内镜中心+复苏区"
      },
      {
        "label": "透析中心",
        "en": "Hemodialysis unit with recliner chairs",
        "cn": "血透中心（躺椅区）"
      },
      {
        "label": "妇产科/产房",
        "en": "Obstetrics ward / LDRP delivery rooms",
        "cn": "产科/LDRP一体化产房"
      },
      {
        "label": "儿科",
        "en": "Pediatric ward with play area",
        "cn": "儿科病房+游戏区"
      },
      {
        "label": "精神科",
        "en": "Psychiatric ward with secure garden",
        "cn": "精神科+封闭花园"
      },
      {
        "label": "康复科",
        "en": "Rehabilitation gym / Physical therapy",
        "cn": "康复大厅/物理治疗"
      },
      {
        "label": "临终关怀",
        "en": "Hospice / Palliative care suite",
        "cn": "安宁疗护病房"
      },
      {
        "label": "日间手术",
        "en": "Ambulatory surgery center",
        "cn": "日间手术中心"
      },
      {
        "label": "消毒供应",
        "en": "CSSD / Sterile processing department",
        "cn": "消毒供应中心"
      },
      {
        "label": "病理科",
        "en": "Pathology / Laboratory wing",
        "cn": "病理科/检验科"
      },
      {
        "label": "血库",
        "en": "Blood bank / Transfusion medicine",
        "cn": "血库/输血科"
      },
      {
        "label": "后勤保障",
        "en": "Central plant / Utility core",
        "cn": "动力中心/设备核心筒"
      }
    ]
  },
  {
    "id": 2,
    "title": "空间类型（室内/室外）",
    "full_title": "维度2：空间类型（室内/室外）",
    "col_layout": "standard",
    "role": "space",
    "items": [
      {
        "label": "入口大厅",
        "en": "Grand entrance lobby / Atrium",
        "cn": "入口大厅/中庭"
      },
      {
        "label": "候诊区",
        "en": "Waiting area / Patient lounge",
        "cn": "候诊区/患者休息厅"
      },
      {
        "label": "医疗主街",
        "en": "Main street / Medical mall corridor",
        "cn": "医疗主街/医疗商场走廊"
      },
      {
        "label": "病房单元",
        "en": "Patient room / Inpatient bay",
        "cn": "病房单元/住院间"
      },
      {
        "label": "护士站",
        "en": "Central nursing station / Pod",
        "cn": "中央护士站/护理单元"
      },
      {
        "label": "医生办公室",
        "en": "Physician office / Consultation room",
        "cn": "医生办公室/诊室"
      },
      {
        "label": "手术室",
        "en": "Operating room / OR suite",
        "cn": "手术室/手术间"
      },
      {
        "label": "恢复室",
        "en": "PACU / Recovery room",
        "cn": "麻醉复苏室"
      },
      {
        "label": "放射检查室",
        "en": "CT/MRI scanning room",
        "cn": "CT/MRI扫描间"
      },
      {
        "label": "走廊/过道",
        "en": "Healing corridor / Connector bridge",
        "cn": "疗愈走廊/连廊"
      },
      {
        "label": "楼梯间",
        "en": "Stairwell / Fire escape",
        "cn": "楼梯间/消防通道"
      },
      {
        "label": "电梯厅",
        "en": "Elevator lobby",
        "cn": "电梯厅"
      },
      {
        "label": "庭院/花园",
        "en": "Healing garden / Courtyard",
        "cn": "疗愈花园/内庭院"
      },
      {
        "label": "屋顶花园",
        "en": "Rooftop terrace / Sky garden",
        "cn": "屋顶露台/空中花园"
      },
      {
        "label": "停车场",
        "en": "Parking deck / Drop-off canopy",
        "cn": "停车楼/落客雨棚"
      },
      {
        "label": "餐厅/咖啡",
        "en": "Cafeteria / Family dining",
        "cn": "员工餐厅/家属就餐"
      },
      {
        "label": "药房",
        "en": "Pharmacy / Dispensary",
        "cn": "药房/发药窗口"
      },
      {
        "label": "急诊入口",
        "en": "Emergency entrance / Triage area",
        "cn": "急诊入口/分诊区"
      },
      {
        "label": "直升机停机坪",
        "en": "Helipad / Rooftop landing",
        "cn": "直升机停机坪"
      },
      {
        "label": "太平间",
        "en": "Mortuary / Pathology suite",
        "cn": "太平间/病理解剖室"
      }
    ]
  },
  {
    "id": 3,
    "title": "建筑风格 / 设计语言",
    "full_title": "维度3：建筑风格 / 设计语言",
    "col_layout": "standard",
    "role": "style",
    "items": [
      {
        "label": "现代极简",
        "en": "Modern minimalist / Clean lines",
        "cn": "现代极简/简洁线条"
      },
      {
        "label": "参数化",
        "en": "Parametric / Fluid organic form",
        "cn": "参数化/流体有机形态"
      },
      {
        "label": "新粗野主义",
        "en": "Neo-brutalist / Exposed concrete",
        "cn": "新粗野主义/清水混凝土"
      },
      {
        "label": "高技派",
        "en": "High-tech / Expressed structure",
        "cn": "高技派/结构外露"
      },
      {
        "label": "新乡土",
        "en": "Neo-vernacular / Regional materials",
        "cn": "新乡土/地域材料"
      },
      {
        "label": "新古典",
        "en": "Neo-classical / Symmetrical facade",
        "cn": "新古典/对称立面"
      },
      {
        "label": "解构主义",
        "en": "Deconstructivist / Fragmented volumes",
        "cn": "解构主义/破碎体量"
      },
      {
        "label": "生态仿生",
        "en": "Biomorphic / Nature-inspired",
        "cn": "生态仿生/自然启发"
      },
      {
        "label": "艺术装饰",
        "en": "Art Deco / Geometric ornament",
        "cn": "装饰艺术/几何装饰"
      },
      {
        "label": "后现代",
        "en": "Postmodern / Playful color accents",
        "cn": "后现代/玩味色彩"
      },
      {
        "label": "可持续绿色",
        "en": "Sustainable / Green roof / Living wall",
        "cn": "可持续/绿色屋顶/绿墙"
      },
      {
        "label": "疗愈建筑",
        "en": "Healing architecture / Calming forms",
        "cn": "疗愈建筑/安宁形态"
      },
      {
        "label": "智慧医院",
        "en": "Smart hospital / Digital facade",
        "cn": "智慧医院/数字立面"
      },
      {
        "label": "模块化",
        "en": "Modular / Prefabricated units",
        "cn": "模块化/预制单元"
      },
      {
        "label": "庭院式",
        "en": "Courtyard typology / Pavilion plan",
        "cn": "庭院式/分散式布局"
      }
    ]
  },
  {
    "id": 4,
    "title": "外立面/表皮材质",
    "full_title": "维度4：外立面/表皮材质",
    "col_layout": "standard",
    "role": "material",
    "items": [
      {
        "label": "玻璃幕墙",
        "en": "Unitized glass curtain wall",
        "cn": "单元式玻璃幕墙",
        "extra": "门诊大厅"
      },
      {
        "label": "彩釉玻璃",
        "en": "Fritted glass / Ceramic frit pattern",
        "cn": "彩釉玻璃/陶瓷点釉",
        "extra": "遮阳+隐私"
      },
      {
        "label": "铝板",
        "en": "Perforated aluminum panel",
        "cn": "穿孔铝板",
        "extra": "遮阳表皮"
      },
      {
        "label": "陶板",
        "en": "Terracotta rainscreen panel",
        "cn": "陶土板幕墙",
        "extra": "温暖质感"
      },
      {
        "label": "清水混凝土",
        "en": "Exposed architectural concrete",
        "cn": "清水混凝土",
        "extra": "粗野主义"
      },
      {
        "label": "石材",
        "en": "Natural stone cladding / Limestone",
        "cn": "天然石材/石灰石",
        "extra": "稳重感"
      },
      {
        "label": "金属复合板",
        "en": "ACM / Metal composite panel",
        "cn": "金属复合板",
        "extra": "现代感"
      },
      {
        "label": "木饰面",
        "en": "Timber battens / Wood louvers",
        "cn": "木格栅/木百叶",
        "extra": "温暖疗愈"
      },
      {
        "label": "聚碳酸酯",
        "en": "Polycarbonate translucent panel",
        "cn": "聚碳酸酯透光板",
        "extra": "半透明表皮"
      },
      {
        "label": "光伏玻璃",
        "en": "BIPV / Solar glass",
        "cn": "光伏一体化玻璃",
        "extra": "可持续"
      },
      {
        "label": "耐候钢",
        "en": "Corten steel / Weathering steel",
        "cn": "耐候钢/锈蚀钢板",
        "extra": "工业风"
      },
      {
        "label": "GRC板",
        "en": "Glass-fiber reinforced concrete",
        "cn": "GRC玻璃纤维混凝土",
        "extra": "曲面造型"
      },
      {
        "label": "涂料",
        "en": "Silicone-based exterior paint",
        "cn": "硅基外墙涂料",
        "extra": "经济型"
      },
      {
        "label": "瓷砖",
        "en": "Ceramic tile / Porcelain panel",
        "cn": "陶瓷砖/瓷板",
        "extra": "易清洁"
      },
      {
        "label": "膜结构",
        "en": "Tensile fabric / ETFE cushion",
        "cn": "张拉膜/ETFE气枕",
        "extra": "入口雨棚"
      }
    ]
  },
  {
    "id": 5,
    "title": "色彩方案",
    "full_title": "维度5：色彩方案",
    "col_layout": "standard",
    "role": "color",
    "items": [
      {
        "label": "全白/冷白",
        "en": "Pure white / Cool white palette",
        "cn": "纯白/冷白调",
        "extra": "洁净专业"
      },
      {
        "label": "暖白/米白",
        "en": "Warm white / Off-white / Cream",
        "cn": "暖白/米白/奶油色",
        "extra": "温馨放松"
      },
      {
        "label": "木色系",
        "en": "Natural wood / Oak / Walnut",
        "cn": "天然木色/橡木/胡桃",
        "extra": "自然疗愈"
      },
      {
        "label": "大地色",
        "en": "Earth tone / Terracotta / Beige",
        "cn": "大地色/陶土色/米黄",
        "extra": "沉稳安心"
      },
      {
        "label": "蓝色系",
        "en": "Calming blue / Sky blue / Teal",
        "cn": "安宁蓝/天蓝/蓝绿",
        "extra": "镇静降压"
      },
      {
        "label": "绿色系",
        "en": "Healing green / Sage / Mint",
        "cn": "疗愈绿/鼠尾草/薄荷",
        "extra": "恢复生机"
      },
      {
        "label": "灰色系",
        "en": "Warm grey / Cool grey / Greige",
        "cn": "暖灰/冷灰/灰米",
        "extra": "中性高级"
      },
      {
        "label": "点缀亮色",
        "en": "Accent yellow / Coral / Lavender",
        "cn": "点缀黄/珊瑚/薰衣草",
        "extra": "儿童/导向"
      },
      {
        "label": "粉彩系",
        "en": "Pastel pink / Baby blue / Lilac",
        "cn": "粉彩/淡粉/淡紫",
        "extra": "儿科/产科"
      },
      {
        "label": "深色对比",
        "en": "Charcoal / Dark bronze accent",
        "cn": "炭灰/深古铜点缀",
        "extra": "科技感"
      }
    ]
  },
  {
    "id": 6,
    "title": "光线/时间",
    "full_title": "维度6：光线/时间",
    "col_layout": "standard",
    "role": "light",
    "items": [
      {
        "label": "清晨日光",
        "en": "Early morning golden glow",
        "cn": "清晨金色光",
        "extra": "2700K"
      },
      {
        "label": "上午漫射",
        "en": "Late morning diffused light",
        "cn": "上午漫射光",
        "extra": "4500K"
      },
      {
        "label": "正午强光",
        "en": "Harsh noon sunlight / High contrast",
        "cn": "正午强光/高对比",
        "extra": "5500K"
      },
      {
        "label": "黄金时刻",
        "en": "Golden hour / Warm sunset",
        "cn": "黄金时刻/暖日落",
        "extra": "3000K"
      },
      {
        "label": "蓝色时刻",
        "en": "Blue hour / Twilight",
        "cn": "蓝色时刻/暮光",
        "extra": "6500K"
      },
      {
        "label": "阴天漫射",
        "en": "Overcast / Softbox lighting effect",
        "cn": "阴天/柔光箱效果",
        "extra": "5000K"
      },
      {
        "label": "室内人工暖",
        "en": "Warm 3000K cove / Downlight",
        "cn": "暖色3000K灯带",
        "extra": "3000K"
      },
      {
        "label": "室内人工冷",
        "en": "Cool 4000K / Clinical task light",
        "cn": "冷色4000K工作灯",
        "extra": "4000K"
      },
      {
        "label": "混合照明",
        "en": "Mixed lighting / Daylight + artificial",
        "cn": "混合照明/日光+人工",
        "extra": "混合"
      },
      {
        "label": "动态变色",
        "en": "Circadian dynamic lighting",
        "cn": "节律动态照明",
        "extra": "可变"
      },
      {
        "label": "天窗采光",
        "en": "Clerestory / Skylight / Lightwell",
        "cn": "高侧窗/天窗/光井",
        "extra": "自然光"
      },
      {
        "label": "背光剪影",
        "en": "Backlit silhouette / Rim lighting",
        "cn": "背光剪影/边缘光",
        "extra": "—"
      },
      {
        "label": "侧光强调",
        "en": "Side lighting / Raking light",
        "cn": "侧光/擦射光",
        "extra": "—"
      },
      {
        "label": "月光夜景",
        "en": "Moonlit / Night ambiance",
        "cn": "月光/夜景氛围",
        "extra": "4000K"
      },
      {
        "label": "水下光线",
        "en": "Caustic light reflection / Pool reflection",
        "cn": "水纹反射光",
        "extra": "—"
      }
    ]
  },
  {
    "id": 7,
    "title": "视角/镜头",
    "full_title": "维度7：视角/镜头",
    "col_layout": "view_angle",
    "role": "view",
    "items": [
      {
        "label": "人眼平视",
        "en": "Eye-level / 1.6m height",
        "cn": "",
        "extra": "焦距: 35mm",
        "effect": "真实感"
      },
      {
        "label": "低角度仰视",
        "en": "Low-angle / Worm‘s-eye",
        "cn": "",
        "extra": "焦距: 16mm",
        "effect": "崇高感"
      },
      {
        "label": "高角度俯视",
        "en": "High-angle / Bird’s-eye",
        "cn": "",
        "extra": "焦距: 50mm",
        "effect": "整体感"
      },
      {
        "label": "鸟瞰轴测",
        "en": "Axonometric / Isometric view",
        "cn": "",
        "extra": "焦距: —",
        "effect": "图解性"
      },
      {
        "label": "剖透视",
        "en": "Sectional perspective / Cutaway",
        "cn": "",
        "extra": "焦距: 24mm",
        "effect": "空间深度"
      },
      {
        "label": "广角透视",
        "en": "Wide-angle / Strong vanishing point",
        "cn": "",
        "extra": "焦距: 14mm",
        "effect": "纵深感"
      },
      {
        "label": "长焦压缩",
        "en": "Telephoto / Compressed perspective",
        "cn": "",
        "extra": "焦距: 85mm",
        "effect": "立面感"
      },
      {
        "label": "鱼眼",
        "en": "Fisheye / Spherical distortion",
        "cn": "",
        "extra": "焦距: 8mm",
        "effect": "戏剧性"
      },
      {
        "label": "爆炸轴测",
        "en": "Exploded axonometric",
        "cn": "",
        "extra": "焦距: —",
        "effect": "构造示意"
      },
      {
        "label": "视点序列",
        "en": "Sequential view / Walkthrough",
        "cn": "",
        "extra": "焦距: 35mm",
        "effect": "叙事流线"
      },
      {
        "label": "细节特写",
        "en": "Close-up / Macro detail",
        "cn": "",
        "extra": "焦距: 105mm",
        "effect": "材质表现"
      },
      {
        "label": "三分法构图",
        "en": "Rule of thirds composition",
        "cn": "",
        "extra": "焦距: —",
        "effect": "平衡美学"
      },
      {
        "label": "引导线构图",
        "en": "Leading lines / Vanishing point",
        "cn": "",
        "extra": "焦距: —",
        "effect": "导向聚焦"
      },
      {
        "label": "框架构图",
        "en": "Framed view / Framing with foreground",
        "cn": "",
        "extra": "焦距: —",
        "effect": "层次感"
      },
      {
        "label": "人物尺度",
        "en": "With human figures for scale",
        "cn": "",
        "extra": "焦距: —",
        "effect": "比例参照"
      }
    ]
  },
  {
    "id": 8,
    "title": "环境/周边",
    "full_title": "维度8：环境/周边",
    "col_layout": "standard",
    "role": "context",
    "items": [
      {
        "label": "城市密集区",
        "en": "Dense urban context / High-rise surroundings",
        "cn": "密集城市/周边高层"
      },
      {
        "label": "郊区低密",
        "en": "Suburban / Low-rise neighborhood",
        "cn": "郊区/低密度社区"
      },
      {
        "label": "滨水/湖畔",
        "en": "Waterfront / Lakefront / River bank",
        "cn": "滨水/湖畔/河岸"
      },
      {
        "label": "山地/坡地",
        "en": "Hillside / Sloping terrain / Mountain backdrop",
        "cn": "山地/坡地/山景背景"
      },
      {
        "label": "森林/绿地",
        "en": "Woodland / Forest clearing / Park setting",
        "cn": "林地/森林空地/公园"
      },
      {
        "label": "湿地/生态",
        "en": "Wetland / Ecological conservation area",
        "cn": "湿地/生态保护区"
      },
      {
        "label": "农田/乡村",
        "en": "Agricultural field / Rural landscape",
        "cn": "农田/乡村景观"
      },
      {
        "label": "沙漠/干旱",
        "en": "Arid / Desert / Dusty atmosphere",
        "cn": "干旱/沙漠/尘雾"
      },
      {
        "label": "海滨/海岸",
        "en": "Coastal / Seafront / Ocean view",
        "cn": "海滨/海岸/海景"
      },
      {
        "label": "历史城区",
        "en": "Historic district / Heritage context",
        "cn": "历史城区/遗产环境"
      },
      {
        "label": "工业园区",
        "en": "Industrial park / Science campus",
        "cn": "工业园/科技园区"
      },
      {
        "label": "校园/大学",
        "en": "University campus / Academic setting",
        "cn": "大学校园/学术环境"
      },
      {
        "label": "商业街区",
        "en": "Commercial street / Retail podium",
        "cn": "商业街/商业裙房"
      },
      {
        "label": "交通枢纽",
        "en": "Transport hub / Metro adjacency",
        "cn": "交通枢纽/邻地铁"
      },
      {
        "label": "医疗园区",
        "en": "Medical campus / Health district",
        "cn": "医疗园区/健康城"
      }
    ]
  },
  {
    "id": 9,
    "title": "氛围/情绪",
    "full_title": "维度9：氛围/情绪",
    "col_layout": "standard",
    "role": "mood",
    "items": [
      {
        "label": "温馨安心",
        "en": "Warm / Cozy / Reassuring",
        "cn": "温馨/舒适/安心",
        "extra": "产科/儿科"
      },
      {
        "label": "专业冷静",
        "en": "Clinical / Precise / Sterile",
        "cn": "专业/精准/洁净",
        "extra": "手术/ICU"
      },
      {
        "label": "宁静冥想",
        "en": "Serene / Meditative / Quiet",
        "cn": "宁静/冥想/安静",
        "extra": "安宁/精神"
      },
      {
        "label": "活力乐观",
        "en": "Vibrant / Uplifting / Playful",
        "cn": "活力/乐观/趣味",
        "extra": "儿科/康复"
      },
      {
        "label": "庄重肃穆",
        "en": "Solemn / Dignified / Respectful",
        "cn": "庄重/尊严/敬意",
        "extra": "太平间/礼堂"
      },
      {
        "label": "通透开放",
        "en": "Open / Airy / Transparent",
        "cn": "开放/通透/透明",
        "extra": "门诊大厅"
      },
      {
        "label": "沉稳信赖",
        "en": "Solid / Trustworthy / Grounded",
        "cn": "沉稳/可信/踏实",
        "extra": "老年科/综合"
      },
      {
        "label": "未来科技",
        "en": "Futuristic / Innovative / High-tech",
        "cn": "未来/创新/高科技",
        "extra": "影像/手术"
      },
      {
        "label": "自然疗愈",
        "en": "Biophilic / Restorative / Organic",
        "cn": "自然/疗愈/有机",
        "extra": "康复/庭院"
      },
      {
        "label": "简约干净",
        "en": "Minimal / Clean / Uncluttered",
        "cn": "简约/干净/无杂乱",
        "extra": "所有通用"
      }
    ]
  },
  {
    "id": 10,
    "title": "常用后缀/渲染参数",
    "full_title": "维度10：常用后缀/渲染参数",
    "col_layout": "render_param",
    "role": "render_param",
    "items": [
      {
        "label": "MJ标准写实",
        "en": "--ar 16:9 --style raw --s 250 --v 6.1",
        "cn": "",
        "tool": "Midjourney"
      },
      {
        "label": "MJ概念氛围",
        "en": "--ar 3:2 --style expressive --s 400 --v 6.1",
        "cn": "",
        "tool": "Midjourney"
      },
      {
        "label": "MJ极简白模",
        "en": "--ar 16:9 --style raw --s 100 --v 6.1 --no texture,color",
        "cn": "",
        "tool": "Midjourney"
      },
      {
        "label": "SD写实",
        "en": "photorealistic, 8k, masterpiece, best quality, architectural render",
        "cn": "",
        "tool": "Stable Diffusion"
      },
      {
        "label": "SD负面固定包",
        "en": "(worst quality, low quality:1.4), blurry, distorted, cartoon, oversaturated",
        "cn": "",
        "tool": "Stable Diffusion"
      },
      {
        "label": "V-Ray专业级",
        "en": "V-Ray 6, ray tracing, global illumination, IES lights, 64 samples",
        "cn": "",
        "tool": "V-Ray"
      },
      {
        "label": "Unreal Engine 5",
        "en": "Unreal Engine 5, Lumen, Nanite, cinematic, 8k",
        "cn": "",
        "tool": "UE5"
      },
      {
        "label": "Lumion表达",
        "en": "Lumion 2024, real-time, atmospheric, depth of field, bloom",
        "cn": "",
        "tool": "Lumion"
      },
      {
        "label": "Enscape快速",
        "en": "Enscape, real-time rendering, natural lighting, 4k",
        "cn": "",
        "tool": "Enscape"
      },
      {
        "label": "写实摄影风",
        "en": "architectural photography, Canon EOS R5, 35mm, f/2.8, ISO 100",
        "cn": "",
        "tool": "通用"
      },
      {
        "label": "竞赛概念风",
        "en": "concept diagram, collage, muted tones, exploded view",
        "cn": "",
        "tool": "通用"
      },
      {
        "label": "黑白/单色",
        "en": "monochrome, black and white, dramatic shadows, high contrast",
        "cn": "",
        "tool": "通用"
      },
      {
        "label": "水彩/手绘风",
        "en": "watercolor illustration, hand-drawn sketch, soft edges",
        "cn": "",
        "tool": "通用"
      },
      {
        "label": "白模/体量",
        "en": "white model, massing study, clay render, no textures",
        "cn": "",
        "tool": "通用"
      },
      {
        "label": "夜景长曝光",
        "en": "night photography, long exposure, light trails, starry sky",
        "cn": "",
        "tool": "通用"
      }
    ]
  },
  {
    "id": 11,
    "title": "医疗家具/设备",
    "full_title": "维度11：医疗家具/设备",
    "col_layout": "standard",
    "role": "furniture",
    "items": [
      {
        "label": "病床",
        "en": "Hospital bed / Adjustable bed with rails",
        "cn": "病床/可调带护栏"
      },
      {
        "label": "输液架",
        "en": "IV pole / Drip stand",
        "cn": "输液架/点滴架"
      },
      {
        "label": "监护仪",
        "en": "Patient monitor / Vital signs display",
        "cn": "监护仪/生命体征屏"
      },
      {
        "label": "护士站台",
        "en": "Nursing desk / Workstation on wheels",
        "cn": "护士站台/移动工作站"
      },
      {
        "label": "候诊椅",
        "en": "Waiting bench / Modular seating",
        "cn": "候诊椅/模块座椅"
      },
      {
        "label": "手术灯",
        "en": "Surgical light / Operating theater lamp",
        "cn": "手术无影灯"
      },
      {
        "label": "吊塔",
        "en": "Medical pendant / Equipment boom",
        "cn": "医用吊塔/设备臂"
      },
      {
        "label": "医疗柜",
        "en": "Medical cabinet / Medication cart",
        "cn": "医疗柜/药品车"
      },
      {
        "label": "洗手台",
        "en": "Scrub sink / Hand-washing station",
        "cn": "刷手池/洗手站"
      },
      {
        "label": "隔帘",
        "en": "Privacy curtain / Cubicle track",
        "cn": "隐私隔帘/轨道帘"
      },
      {
        "label": "导视牌",
        "en": "Wayfinding sign / Digital directory",
        "cn": "导视牌/数字索引"
      },
      {
        "label": "轮椅",
        "en": "Wheelchair / Mobility aid",
        "cn": "轮椅/助行器"
      }
    ]
  },
  {
    "id": 12,
    "title": "自然元素/景观",
    "full_title": "维度12：自然元素/景观",
    "col_layout": "standard",
    "role": "landscape",
    "items": [
      {
        "label": "疗愈花园",
        "en": "Healing garden / Therapeutic landscape",
        "cn": "疗愈花园/治疗性景观"
      },
      {
        "label": "垂直绿墙",
        "en": "Living wall / Green facade",
        "cn": "垂直绿墙/绿色立面"
      },
      {
        "label": "水景",
        "en": "Reflecting pool / Water feature",
        "cn": "镜面水池/水景"
      },
      {
        "label": "树阵",
        "en": "Tree allee / Canopy grove",
        "cn": "树阵/树冠丛"
      },
      {
        "label": "屋顶绿化",
        "en": "Green roof / Sedum blanket",
        "cn": "绿色屋顶/景天地毯"
      },
      {
        "label": "竹园",
        "en": "Bamboo grove / Zen garden",
        "cn": "竹园/禅意花园"
      },
      {
        "label": "花坛",
        "en": "Flower bed / Perennial border",
        "cn": "花坛/多年生花境"
      },
      {
        "label": "步道",
        "en": "Accessible path / Winding trail",
        "cn": "无障碍步道/蜿蜒小径"
      },
      {
        "label": "户外家具",
        "en": "Outdoor bench / Picnic table",
        "cn": "户外长椅/野餐桌"
      },
      {
        "label": "雕塑/艺术",
        "en": "Healing art / Sculpture installation",
        "cn": "疗愈艺术/雕塑装置"
      }
    ]
  },
  {
    "id": 13,
    "title": "布局/体量形式",
    "full_title": "维度13：布局/体量形式",
    "col_layout": "standard",
    "role": "layout",
    "items": [
      { "label": "方岛式布局", "en": "Podium-and-block massing / Isolated block plan", "cn": "方岛式布局/独立体量" },
      { "label": "塔楼式高层", "en": "High-rise tower typology", "cn": "塔楼式高层" },
      { "label": "分散院落式", "en": "Dispersed pavilion / Courtyard cluster plan", "cn": "分散院落式/组团布局" },
      { "label": "指状布局", "en": "Finger plan / Linear wings radiating from spine", "cn": "指状布局/条形翼楼" },
      { "label": "环形布局", "en": "Circular / Ring-shaped floor plan", "cn": "环形布局/环状平面" },
      { "label": "裙房+塔楼组合", "en": "Podium-and-tower composition", "cn": "裙房+塔楼组合" },
      { "label": "垂直分区", "en": "Vertical zoning / Low-rise outpatient base with high-rise inpatient tower", "cn": "垂直分区/低层门诊+高层住院" },
      { "label": "线性布局", "en": "Linear / Bar building layout", "cn": "线性布局/条形楼布局" },
      { "label": "集中式巨构", "en": "Centralized megastructure plan", "cn": "集中式巨构" },
      { "label": "卫星式分院区", "en": "Satellite campus / Distributed branch layout", "cn": "卫星式分院区/分布式布局" },
      { "label": "地下+地上复合", "en": "Below-grade and above-grade composite massing", "cn": "地下+地上复合体量" },
      { "label": "模块化可扩展体量", "en": "Modular expandable massing / Phased growth block", "cn": "模块化可扩展体量/分期生长" },
      { "label": "庭院环绕式", "en": "Courtyard-embraced massing / Buildings wrapping a central court", "cn": "庭院环绕式/围合中庭" },
      { "label": "双翼对称布局", "en": "Symmetrical twin-wing layout", "cn": "双翼对称布局" },
      { "label": "错层退台式", "en": "Staggered terrace / Stepped-back massing", "cn": "错层退台式/退台体量" }
    ]
  },
  {
    "id": 14,
    "title": "医院专项设计细节",
    "full_title": "维度14：医院专项设计细节",
    "col_layout": "standard",
    "role": "detail",
    "items": [
      { "label": "无障碍坡道与扶手", "en": "Accessible ramp with continuous handrails", "cn": "无障碍坡道+连续扶手" },
      { "label": "无障碍卫生间标识", "en": "Accessible restroom signage / ADA-compliant washroom", "cn": "无障碍卫生间标识" },
      { "label": "色彩编码导视系统", "en": "Color-coded wayfinding system", "cn": "色彩编码导视系统" },
      { "label": "数字化导航屏", "en": "Digital wayfinding kiosk / Interactive directory screen", "cn": "数字化导航屏/互动索引屏" },
      { "label": "洁污分区可视化标识", "en": "Clean-dirty zoning signage / Color-differentiated corridors", "cn": "洁污分区可视化标识/分色走廊" },
      { "label": "独立候诊隔间", "en": "Private waiting cubicle / Semi-enclosed bay", "cn": "独立候诊隔间/半封闭候诊区" },
      { "label": "负压病房警示标识", "en": "Negative-pressure isolation room warning sign", "cn": "负压病房警示标识" },
      { "label": "医患分流缓冲间", "en": "Staff-patient separation buffer zone / Anteroom", "cn": "医患分流缓冲间/前室" },
      { "label": "感控洗手流程动线", "en": "Infection-control hand hygiene circulation path", "cn": "感控洗手流程动线" },
      { "label": "儿童友好尺度细节", "en": "Child-friendly scaled details / Playful low-height fixtures", "cn": "儿童友好尺度细节/低高度设施" },
      { "label": "防跌倒地面警示", "en": "Anti-slip flooring with fall-prevention markings", "cn": "防跌倒地面警示/防滑地面" },
      { "label": "隔音吸声处理", "en": "Acoustic sound insulation treatment", "cn": "隔音吸声处理" },
      { "label": "防菌抗菌饰面标识", "en": "Antimicrobial surface finish signage", "cn": "防菌抗菌饰面标识" },
      { "label": "应急呼叫按钮", "en": "Emergency call button / Nurse call station", "cn": "应急呼叫按钮/护士呼叫站" },
      { "label": "无障碍电梯语音提示", "en": "Accessible elevator with voice announcement", "cn": "无障碍电梯语音提示" }
    ]
  },
  {
    "id": 15,
    "title": "内部照明/饰面细节",
    "full_title": "维度15：内部照明/饰面细节",
    "col_layout": "standard",
    "role": "interior",
    "items": [
      { "label": "间接照明灯槽", "en": "Indirect cove lighting channel", "cn": "间接照明灯槽" },
      { "label": "线性光带", "en": "Linear LED light strip", "cn": "线性光带" },
      { "label": "可调色温智能照明", "en": "Tunable color-temperature smart lighting", "cn": "可调色温智能照明" },
      { "label": "天花穿孔吸声板", "en": "Perforated acoustic ceiling panel", "cn": "天花穿孔吸声板" },
      { "label": "防菌地坪", "en": "Antimicrobial seamless flooring", "cn": "防菌地坪/无缝抗菌地面" },
      { "label": "软性墙面装饰", "en": "Soft-touch wall covering / Cushioned wall panel", "cn": "软性墙面装饰/软包墙面" },
      { "label": "发光导视墙", "en": "Illuminated wayfinding wall panel", "cn": "发光导视墙" },
      { "label": "局部聚焦射灯", "en": "Focused accent spotlight", "cn": "局部聚焦射灯" },
      { "label": "隐藏式一体化灯具", "en": "Concealed integrated luminaire", "cn": "隐藏式一体化灯具" },
      { "label": "生物动力照明系统", "en": "Circadian biodynamic lighting system", "cn": "生物动力照明系统" },
      { "label": "镂空吊顶造型", "en": "Perforated suspended ceiling feature", "cn": "镂空吊顶造型" },
      { "label": "防眩光漫反射面板", "en": "Anti-glare diffused reflective panel", "cn": "防眩光漫反射面板" },
      { "label": "暖色阅读灯角", "en": "Warm reading light nook", "cn": "暖色阅读灯角" },
      { "label": "地脚夜灯带", "en": "Floor-level night light strip", "cn": "地脚夜灯带" },
      { "label": "艺术灯具装置", "en": "Sculptural lighting installation", "cn": "艺术灯具装置" }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PROMPT_DATA;
}