export const recommendedRoutes = [
  {
    id: "family",
    title: "亲子启蒙路线",
    duration: "30 分钟",
    description: "用故事和动手观察建立量子世界的第一印象。",
    stops: ["波粒之争", "薛定谔的猫", "合肥量子成果"]
  },
  {
    id: "student",
    title: "学生深度路线",
    duration: "60 分钟",
    description: "从实验现象到科学应用，理解量子技术的关键概念。",
    stops: ["波粒之争", "量子隧道", "量子通信", "合肥量子成果"]
  },
  {
    id: "photo",
    title: "科技打卡路线",
    duration: "45 分钟",
    description: "串联高识别度展项，适合快速体验与分享回顾。",
    stops: ["薛定谔的猫", "量子通信", "合肥量子成果"]
  }
];

export const zones = [
  {
    id: "creation",
    name: "创见区",
    description: "从经典物理的直觉出发，观察光、粒子和测量之间的张力。",
    theme: "量子概念启蒙",
    mapPosition: { x: 24, y: 36 },
    exhibits: ["wave-particle", "schrodinger-cat"]
  },
  {
    id: "perception",
    name: "感知区",
    description: "通过模拟实验感知微观粒子的概率、穿越与安全传输。",
    theme: "现象观察与交互",
    mapPosition: { x: 54, y: 53 },
    exhibits: ["quantum-tunnel", "quantum-communication"]
  },
  {
    id: "future",
    name: "引领区",
    description: "连接合肥量子科技成果，理解科研平台、产业和城市创新。",
    theme: "城市科创成果",
    mapPosition: { x: 78, y: 29 },
    exhibits: ["hefei-achievements"]
  }
];

export const exhibits = [
  {
    id: "wave-particle",
    name: "波粒之争",
    zone: "创见区",
    question: "光到底是波还是粒子？",
    shortIntro: "光在不同实验条件下会表现出波动或粒子特征。",
    childExplanation: "光有时像水波一样扩散，有时又像一颗颗小球打在屏幕上。",
    normalExplanation: "双缝实验说明光和微观粒子具有波粒二象性，观测方式会影响我们看到的结果。",
    deepExplanation: "量子对象不能简单归入经典波或经典粒子，它的状态由波函数描述，测量会给出概率性的结果。",
    application: "光电探测、显微成像、激光技术和量子信息实验都离不开波粒二象性的理解。",
    completed: false,
    collected: false
  },
  {
    id: "schrodinger-cat",
    name: "薛定谔的猫",
    zone: "创见区",
    question: "盒子打开前，猫是什么状态？",
    shortIntro: "这个思想实验帮助我们理解量子叠加和测量之间的关系。",
    childExplanation: "在没有打开盒子前，我们不能确定猫的状态，只能说可能性同时存在。",
    normalExplanation: "薛定谔的猫把微观叠加态放大到宏观情境，提醒人们量子测量并不等同于日常观察。",
    deepExplanation: "叠加态在测量中呈现确定结果，背后涉及量子态演化、测量问题和退相干等核心议题。",
    application: "量子比特可以利用叠加态进行信息处理，是量子计算区别于经典计算的重要基础。",
    completed: false,
    collected: false
  },
  {
    id: "quantum-tunnel",
    name: "量子隧道",
    zone: "感知区",
    question: "粒子能穿过看似不可穿越的墙吗？",
    shortIntro: "微观粒子有概率穿过经典物理中无法越过的势垒。",
    childExplanation: "小粒子有时像会穿墙一样，出现在墙的另一边。",
    normalExplanation: "量子隧穿来自粒子波函数在势垒中的延伸，即使能量不足也可能在另一侧被探测到。",
    deepExplanation: "隧穿概率与势垒高度、宽度和粒子能量有关，是微观系统概率幅穿透势垒的结果。",
    application: "扫描隧道显微镜、半导体器件、核聚变和闪存技术都与量子隧穿有关。",
    completed: false,
    collected: false
  },
  {
    id: "quantum-communication",
    name: "量子通信",
    zone: "感知区",
    question: "为什么量子通信更安全？",
    shortIntro: "量子通信利用量子态的测量扰动来帮助发现窃听行为。",
    childExplanation: "如果有人偷偷看量子信息，系统会留下痕迹。",
    normalExplanation: "量子密钥分发中，未知量子态不可被完美复制，窃听会引入可检测的误码。",
    deepExplanation: "量子通信的安全性来自量子不可克隆、测量扰动和纠缠关联等物理规律，而不是单纯依靠算法复杂度。",
    application: "政务、金融、能源等高安全通信场景可以使用量子密钥分发提升密钥安全性。",
    completed: false,
    collected: false
  },
  {
    id: "hefei-achievements",
    name: "合肥量子成果",
    zone: "引领区",
    question: "合肥为什么是量子科技高地？",
    shortIntro: "合肥在量子通信、量子计算和科研平台方面形成了鲜明优势。",
    childExplanation: "很多研究量子科技的科学家和实验装置都聚集在合肥。",
    normalExplanation: "合肥依托高校、科研机构和产业平台，持续推动量子通信、量子计算和核心器件发展。",
    deepExplanation: "合肥的量子科技生态由基础研究、大科学装置、成果转化和产业链协同构成，正在形成城市级科创名片。",
    application: "量子计算云平台、安全通信网络、精密测量和未来信息产业都与这些成果相关。",
    completed: false,
    collected: false
  }
];

export const timeline = [
  {
    id: "communication",
    title: "量子通信",
    text: "从实验验证走向示范应用，构建高安全通信网络的技术基础。"
  },
  {
    id: "micius",
    title: "墨子号",
    text: "空间量子科学实验推动星地量子通信和基础物理实验进入新阶段。"
  },
  {
    id: "computing",
    title: "量子计算",
    text: "面向特定问题展现并行探索能力，推动新型计算体系研究。"
  },
  {
    id: "institutes",
    title: "科研机构",
    text: "高校、实验室和创新平台协同，形成持续产出基础研究成果的土壤。"
  },
  {
    id: "industry",
    title: "产业发展",
    text: "核心器件、系统集成与应用场景共同推进量子科技产业化。"
  }
];
