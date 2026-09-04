"use strict";

// ============================================================
// Innovation Challenge — Game Data
// نادي الابتكار - لعبة التحديات
// ============================================================

const GAME_DATA = {

  // === Landing Page ===
  landing: {
    title: "هل أنت رائد أعمال المستقبل؟",
    subtitle: "اختبر قراراتك في عالم ريادة الأعمال الحقيقي",
    entrepreneurs: [
      { name: "إيلون ماسك", company: "Tesla / SpaceX", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/440px-Elon_Musk_Royal_Society_%28crop2%29.jpg" },
      { name: "ستيف جوبز", company: "Apple", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Steve_Jobs_Headshot_2010-Cropped.jpg/440px-Steve_Jobs_Headshot_2010-Cropped.jpg" },
      { name: "جيف بيزوس", company: "Amazon", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Jeff_Bezos_visits_LAAFD_Sep_2019_%28cropped%29.jpg/440px-Jeff_Bezos_visits_LAAFD_Sep_2019_%28cropped%29.jpg" },
      { name: "سام وينشتاين", company: "WeWork", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Sam_Alwan_at_UMass Lowell.jpg/440px-Sam_Alwan_at_UMass_Lowell.jpg" }
    ]
  },

  // === About Section ===
  about: {
    title: "نادي الابتكار",
    subtitle: "Innovation Club",
    description: "نادي الابتكار هو مساحة جامعية للتفكير الإبداعي وريادة الأعمال. نُلهم الطلاب لتحويل الأفكار إلى مشاريع حقيقية من خلال فعاليات تفاعلية وتحديات مبتكرة.",
    achievements: [
      { icon: "🏆", value: "+50", label: "فعالية منجزة" },
      { icon: "👥", value: "+500", label: "مشارك" },
      { icon: "🚀", value: "+20", label: "مشروع انطلق" },
      { icon: "🎓", value: "+100", label: "عضو نشط" }
    ],
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://example.com/register"
  },

  // === Challenge Menu ===
  challenges: [
    {
      id: "challenge1",
      number: 1,
      title: "المشكلة + الجمهور",
      description: "اختر مشكلة حقيقية وصمم حلًا ابتكاريًا لجمهور محدد",
      icon: "🎯",
      color: "#E8B547",
      difficulty: "متوسط",
      time: "15 دقيقة"
    },
    {
      id: "challenge2",
      number: 2,
      title: "قرارات تحت الضغط",
      description: "أنت مؤسس شركة — 60 ثانية لكل قرار حرج",
      icon: "⚡",
      color: "#E86A6A",
      difficulty: "صعب",
      time: "5 دقائق"
    },
    {
      id: "challenge3",
      number: 3,
      title: "محل في شارع ميت",
      description: "أنقذ متجرًا فاشلًا بأي طريقة — لكن بقيود صارمة",
      icon: "🏪",
      color: "#5BC78F",
      difficulty: "صعب جدًا",
      time: "10 دقائق"
    },
    {
      id: "challenge4",
      number: 4,
      title: "أقنعني",
      description: "نفس المنتج، لكن أربعة عملاء مختلفين — كل واحد يحتاج منطق مختلف",
      icon: "💬",
      color: "#4A9FE8",
      difficulty: "متوسط",
      time: "8 دقائق"
    }
  ],

  // === Challenge 1: Problem + Audience ===
  challenge1: {
    title: "المشكلة + الجمهور",
    subtitle: "اختر بطاقتك وابدأ الابتكار",
    instruction: "اختر رقم البطاقتين — المشكلة والجمهور — ثم صمم حلًا ابتكاريًا في الوقت المحدد",
    timeLimit: 900, // 15 minutes in seconds

    problems: [
      { id: 1, title: "تلوث المحيطات", description: "14 مليون طن بلاستيك تصل للمحيطات سنويًا", icon: "🌊", difficulty: 1 },
      { id: 2, title: "ارتفاع تكاليف التعليم", description: "التعليم الجامعي أصبح غير متوفر للكثيرين", icon: "📚", difficulty: 1 },
      { id: 3, title: "الأكل في المطاعم", description: "30% من الطعام في المطاعم يُهدر يوميًا", icon: "🍽️", difficulty: 1 },
      { id: 4, title: "الصحة النفسية", description: "1 من كل 5 أشخاص يعاني من قلق أو اكتئاب", icon: "🧠", difficulty: 2 },
      { id: 5, title: "الازدحام في المدن", description: "ساعات الذروة تستهلك ساعات من حياتنا", icon: "🚗", difficulty: 2 },
      { id: 6, title: "الفائض الغذائي", description: "ملايين الأطنان من الطعام تُهدر بينما يجوع آخرون", icon: "🍎", difficulty: 2 },
      { id: 7, title: "تلوث الهواء", description: "7 مليون وفاة سنويًا بسبب تلوث الهواء", icon: "💨", difficulty: 3 },
      { id: 8, title: "انعدام الأمان السيبراني", description: "الهجمات الإلكترونية تزداد 300% سنويًا", icon: "🔒", difficulty: 3 },
      { id: 9, title: "أزمة السكن", description: "الإيجارات استهلكت 50% من رواتب الشباب", icon: "🏠", difficulty: 3 }
    ],

    audiences: [
      { id: 1, title: "كبار السن", description: "أكثر من 60 سنة — يعانون من العزلة والتقنيات الحديثة", icon: "👴", needs: "البساطة، الأمان، القرب" },
      { id: 2, title: "الطلاب", description: "18-24 سنة — ميزانية محدودة، وقت محدود", icon: "🎓", needs: "التكلفة المنخفضة، السرعة، المرونة" },
      { id: 3, title: "الناشئون", description: "أصحاب المشاريع الصغيرة — يبحثون عن نمو", icon: "🌱", needs: "النمو، التوسيع، الوصول" },
      { id: 4, title: "الأمهات", description: "سيدات يقمن بتربية أطفال — وقت محدود جدًا", icon: "👩‍👧‍👦", needs: "التوفير في الوقت، الراحة، الأمان" },
      { id: 5, title: "الموظفون عن بُعد", description: "يعملون من البيت — يعانون من العزلة وقلة الإنتاجية", icon: "💻", needs: "الإنتاجية، التواصل، التوازن" },
      { id: 6, title: "الرياضيون", description: "الرياضيون المحترفون — يواجهون تحديات فريدة", icon: "⚽", needs: "الأداء، التعافي، التغذية" }
    ],

    evaluationCriteria: [
      { name: "أصالة الفكرة", weight: 25, description: "هل الحل غير تقليدي ومبتكر؟" },
      { name: "قابلية التنفيذ", weight: 25, description: "هل يمكن تنفيذه فعليًا؟" },
      { name: "فهم العميل", weight: 25, description: "هل تفهم مشاكل الجمهور الحقيقي؟" },
      { name: "العرض والتقديم", weight: 25, description: "هل عرضت الفكرة بوضوح وإقناع؟" }
    ]
  },

  // === Challenge 2: 60-Second Decisions ===
  challenge2: {
    title: "قرارات تحت الضغط",
    subtitle: "أنت مؤسس شركة — كل ثانية تهم",
    instruction: "لكل موقف 60 ثانية فقط لاتخاذ قرارك — لا وقت للتفكير الزائد",

    scenarios: [
      {
        id: 1,
        title: "المنتج فاشل",
        situation: "اكتشفت أن منتجك به عيب جوهري. الإطلاق بعد يوم واحد فقط.",
        timeLimit: 60,
        options: [
          { text: "تأجل الإطلاق", trait: "strategic", points: 3 },
          { text: "أطلق مع تحذير", trait: "innovator", points: 4 },
          { text: "غيّر المنتج بالكامل", trait: "risk_taker", points: 2 },
          { text: "اسأل العملاء", trait: "builder", points: 3 }
        ],
        followUp: "الإدارة قالت: التأجيل يعني خسارة 500,000 ريال"
      },
      {
        id: 2,
        title: "شريكك يريد الانسحاب",
        situation: "شريكك المؤسس — اللي معك من البداية — قال إنه يريد المغادرة اليوم.",
        timeLimit: 60,
        options: [
          { text: "حاول إقناعه بالبقاء", trait: "builder", points: 3 },
          { text: "اقبل قراره وتحرك", trait: "strategic", points: 4 },
          { text: "اعرض عليه شروطًا جديدة", trait: "innovator", points: 3 },
          { text: "اطلب مساعدة قانونية", trait: "risk_taker", points: 2 }
        ],
        followUp: "الشريك سينضم لمنافسك"
      },
      {
        id: 3,
        title: "الموظف الأساسي استقال",
        situation: "أفضل مطور لديك — اللي يحمل 80% من الكود — استقال فجأة.",
        timeLimit: 60,
        options: [
          { text: "اعرض عليه راتب أعلى", trait: "risk_taker", points: 2 },
          { text: "ابحث عن بديل سريعًا", trait: "strategic", points: 3 },
          { text: "أعد هيكلة الفريق", trait: "innovator", points: 4 },
          { text: "اطلب منه تدريب بدل", trait: "builder", points: 3 }
        ],
        followUp: "الكود يحتاج 3 أشهر لإعادة بنائه"
      },
      {
        id: 4,
        title: "مقطع ينتقد منتجك",
        situation: "فيديو انتقادي لمنتجك وصل 100,000 مشاهدة في ساعتين. التعليقات سلبية.",
        timeLimit: 60,
        options: [
          { text: "أعد رد علني", trait: "builder", points: 3 },
          { text: "أias حساب الشخص", trait: "risk_taker", points: 1 },
          { text: "أias رد ودي خاص", trait: "strategic", points: 4 },
          { text: "أias فيديو توضيحي", trait: "innovator", points: 4 }
        ],
        followUp: "الصحفيون ينتظرون ردك"
      },
      {
        id: 5,
        title: "فرصة ذهبية مفاجئة",
        situation: "شركة كبرى تريد شراء شركتك — المبلغ: 10 ملايين ريال.",
        timeLimit: 60,
        options: [
          { text: "أوافق فورًا", trait: "risk_taker", points: 2 },
          { text: "أرفض وأكمل", trait: "innovator", points: 3 },
          { text: "أتفاوض على سعر أعلى", trait: "strategic", points: 4 },
          { text: "أسأل فريقك", trait: "builder", points: 3 }
        ],
        followUp: "العرض ينتهي خلال 24 ساعة"
      }
    ],

    personalityResults: {
      builder: {
        type: "الباني",
        description: "أنت تبني العلاقات والسمعة. تؤمن بأن النجاح يبدأ من الناس.",
        color: "#5BC78F",
        icon: "🏗️",
        match: "جاك ما (Alibaba)"
      },
      innovator: {
        type: "المبتكر",
        description: "أنت تبحث عن حلول جديدة للمشاكل القديمة. لا تخاف من تجربة ما لم يجرّبه أحد.",
        color: "#4A9FE8",
        icon: "💡",
        match: "إيلون ماسك (Tesla)"
      },
      strategic: {
        type: "الاستراتيجي",
        description: "أنت تحسب خطواتك. كل قرار لديك مبني على تحليل وわからない.",
        color: "#E8B547",
        icon: "♟️",
        match: "جيف بيزوس (Amazon)"
      },
      risk_taker: {
        type: "المخاطر",
        description: "أنت لا تتردد. تؤمن بأن المخاطرة الحسابية هي سر التفوق.",
        color: "#E86A6A",
        icon: "🎲",
        match: "ريتشارد برانسون (Virgin)"
      }
    }
  },

  // === Challenge 3: Dead Street Store ===
  challenge3: {
    title: "محل في شارع ميت",
    subtitle: "أنقذ المتجر الفاشل",
    instruction: "لديك متجر فاشل بالكامل — ممنوع عليك تغيير الموقع أو زيادة الأسعار أو رأس المال أو الإغلاق. مهمتك الوحيدة: أنقذ المشروع.",

    store: {
      name: "عصائر السعادة",
      description: "محل عصائر في شارع تجاري شبه مهجور",
      problems: [
        { id: 1, title: "الموقع السيئ", description: "الشارع بعيد عن المراكز التجارية والجامعات", icon: "📍", severity: "عالي" },
        { id: 2, title: "المنافسة", description: "5 محلات عصائر أخرى في المنطقة", icon: "⚔️", severity: "متوسط" },
        { id: 3, title: "الimage", description: "المحل يبدو قديمًا وغير جذاب", icon: "🎨", severity: "عالي" },
        { id: 4, title: "الموسمية", description: "المبيعات تنخفض 70% في الشتاء", icon: "❄️", severity: "متوسط" },
        { id: 5, title: "التكلفة", description: "الإيجار يستهلك 60% من الإيرادات", icon: "💰", severity: "عالي" }
      ],
      constraints: [
        "ممنوع تغيير الموقع",
        "ممنوع زيادة الأسعار",
        "ممنوع زيادة رأس المال",
        "ممنوع إغلاق المشروع"
      ],
      pivots: [
        { id: 1, title: "غيّر المنتج", description: "بدل العصائر، أعد تعريف ما تبيعه", examples: ["مشروبات صحية", "وجبات خفيفة", "منتجات مجافة"] },
        { id: 2, title: "غيّر العميل", description: "استهدف شريحة مختلفة تمامًا", examples: ["شركات (توصيل دفعات)", "живdefines حضور", "تعليم"] },
        { id: 3, title: "غيّر التجربة", description: "حوّل زيارتك لتجربة مختلفة", examples: ["ورش عمل صنع العصير", "مكان لقاءات", "مساحة عمل"] },
        { id: 4, title: "غيّر نموذج العمل", description: "غيّر كيف تكسب المال", examples: ["اشتراك شهري", " franExtensions", "بيع بالجملة"] },
        { id: 5, title: "غيّر التسويق", description: "وصّل رسالتك بطريقة مختلفة", examples: ["تلف جوال", "شراكات محلية", "محتوى رقمي"] }
      ],
      timeLimit: 600 // 10 minutes
    }
  },

  // === Challenge 4: Convince Me ===
  challenge4: {
    title: "أقنعني",
    subtitle: "نفس المنتج — أربعة عملاء مختلفين",
    instruction: "لديك منتج واحد. عليك إقناع 4 شخصيات مختلفة — كل واحد يحتاج منطقًا وطريقة مختلفة",

    product: {
      name: "قُفازات ذكية تقيس نبض القلب وتُنبهك عند الإجهاد",
      description: "قُفازات رياضية مدمج فيها مستشعرات ذكية تراقب نبض القلب وتُرسل تنبيهات لحظية عبر التطبيق"
    },

    personas: [
      {
        id: 1,
        name: "أحمد",
        role: "طبيب قلب",
        personality: " analytical، يطلب بيانات وأرقام، يشك في كل شيء",
        icon: "👨‍⚕️",
        challenge: "يقول: 'أنا أعرف أقيس النبض بأفضل من أي جهاز'",
        hints: ["اعرض عليه الدقة العلمية", "استشهد بالأبحاث", "أظهر كيف يُكمل عمله لا يحل محله"],
        timeLimit: 120
      },
      {
        id: 2,
        name: "نورة",
        role: "أم لثلاثة أطفال",
        personality: "عملي، مشغولة، تريد حلول سريعة وسهلة",
        icon: "👩‍👧‍👦",
        challenge: "تقول: 'ما عندي وقت ألعب بأجهزة'",
        hints: ["ركز على البساطة والسرعة", "أظهر كيف تحافظ على صحة أسرتها", "القيمة العاطفية أهم من التقنية"],
        timeLimit: 120
      },
      {
        id: 3,
        name: "خالد",
        role: "مدير تنفيذي لشركة تقنية",
        personality: "يريد القيمة الاستثمارية والنمو",
        icon: "👔",
        challenge: "يقول: 'أين السوق؟ كم المستخدمين المحتملين؟'",
        hints: ["اعرض حجم السوق", "أظهر نموذج الإيرادات", "استخدم لغة الأرقام"],
        timeLimit: 120
      },
      {
        id: 4,
        name: "سارة",
        role: "رياضية محترفة",
        personality: "แข็งกร้าا، تريد أداء أعلى، لا تثق بالمنتجات",
        icon: "🏃‍♀️",
        challenge: "تقول: 'جرّبت مئة منتج مثل هذا — كلها فاشلة'",
        hints: ["اعرض الفرق الحقيقي", "استشهد برياضيين يستخدمونه", "أظهر النتائج الملموسة"],
        timeLimit: 120
      }
    ],

    evaluationCriteria: [
      { name: "فهم الشخصية", weight: 30 },
      { name: "تنقيب القيمة", weight: 30 },
      { name: "الإقناع", weight: 20 },
      { name: "المرونة", weight: 20 }
    ]
  }
};
