export type Guide = {
  slug: string;
  nameEn: string;
  nameAr: string;
  state: string;
  heroImage: string;
  introEn: string;
  introAr: string;
  sections: {
    titleEn: string;
    titleAr: string;
    bodyEn: string;
    bodyAr: string;
  }[];
  vitals: {
    typicalRentEn: string;
    typicalRentAr: string;
    powerReliability: "Excellent" | "Good" | "Variable" | "Limited";
    waterReliability: "Excellent" | "Good" | "Variable" | "Limited";
    diasporaFavored: boolean;
    nearestAirportKm: number;
  };
};

export const guides: Guide[] = [
  {
    slug: "khartoum-2",
    nameEn: "Khartoum 2",
    nameAr: "الخرطوم ٢",
    state: "khartoum",
    heroImage:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3CTdrgC2CdR16Mhg8ltaktkLuTj/hf_20260510_214533_9e3366a7-1f0f-42ae-b416-11579eb34fe8.png",
    introEn:
      "Khartoum 2 sits on the southern bank of the Blue Nile, close enough to the confluence that you can smell the water on a cool morning. It has long been the first neighbourhood Sudanese diaspora families point to when they talk about coming home — wide, relatively tree-lined streets, a concentration of good villas, and an easy reach of the international school corridor. The area weathered the displacement pressures of recent years better than most; its walled compounds offer a privacy that residents value highly. Rents are the highest in Khartoum, but the market is liquid: landlords here understand USD transactions and short-hold leases in a way that is still rare elsewhere in the city.",
    introAr:
      "يقع حي الخرطوم ٢ على الضفة الجنوبية للنيل الأزرق، قريباً جداً من نقطة التقاء النيلين لدرجة تشعر فيها برائحة المياه في الصباح البارد. طالما كان الوجهة الأولى التي تشير إليها عائلات المغتربين السودانيين حين يتحدثون عن العودة إلى الوطن — شوارع عريضة يكسوها الشجر نسبياً، وتركّز ملحوظ للفيلات الراقية، وقرب من ممر المدارس الدولية. صمد الحي أمام ضغوط النزوح التي عصفت بالبلاد خلال السنوات الأخيرة أفضل من معظم الأحياء، وتمنح مجمعاته المسوّرة خصوصية يقدّرها السكان تقديراً عالياً. الإيجارات هنا الأعلى في الخرطوم، غير أن السوق سيولة جيدة: الملاك في هذا الحي على دراية بمعاملات الدولار وعقود الإيجار القصيرة بطريقة نادراً ما تجدها في أحياء المدينة الأخرى.",
    sections: [
      {
        titleEn: "Who lives here",
        titleAr: "من يسكن هنا",
        bodyEn:
          "Khartoum 2 draws a specific demographic: returning diaspora families who need familiarity alongside comfort, senior civil servants and NGO staff who want proximity to embassies and UN offices, and a growing cohort of Gulf-educated young professionals who lease apartments rather than rent villas. The neighbourhood has a noticeable Sudanese-Egyptian-Lebanese commercial layer along its main artery — pharmacies, bakeries, a handful of decent restaurants. It is not a neighbourhood you pass through; people move here deliberately and tend to stay several years.",
        bodyAr:
          "يستقطب حي الخرطوم ٢ فئة سكانية بعينها: عائلات المغتربين العائدين الذين يرجون الألفة والراحة في آنٍ واحد، وكبار موظفي الدولة والعاملين في المنظمات غير الحكومية الراغبين في القرب من السفارات ومكاتب الأمم المتحدة، فضلاً عن شريحة متنامية من الشباب المتعلمين في الخليج ممن يفضلون استئجار الشقق على الفيلات. يتميز الحي بطابع تجاري سوداني-مصري-لبناني واضح على امتداد شريانه الرئيسي — صيدليات ومخابز وعدد من المطاعم المحترمة. هذا ليس حياً تمر منه عابراً؛ الناس يقصدونه قصداً ويميلون إلى البقاء فيه لسنوات.",
      },
      {
        titleEn: "What it's like day-to-day",
        titleAr: "الحياة اليومية",
        bodyEn:
          "Power reliability in Khartoum 2 sits at the better end of the Khartoum spectrum — expect eight to twelve hours of grid power on a typical day, with many compounds running generator backup that kicks in automatically. Water pressure is generally adequate, fed by a network that serves this side of the city with slightly more consistency than Omdurman. The main souq on Street 15 is close enough to walk if you live centrally; a larger produce market opens on Friday mornings two blocks north. The Mosque of Al-Khirij is the neighbourhood anchor for Friday prayer and community events.",
        bodyAr:
          "تُعدّ موثوقية الكهرباء في الخرطوم ٢ من الأفضل ضمن نطاق الخرطوم — توقّع ما بين ثماني واثنتي عشرة ساعة يومياً من التيار الكهربائي، مع عمل معظم المجمعات على مولدات احتياطية تعمل تلقائياً. ضغط المياه مناسب عموماً، يُغذّيه شبكة تخدم هذا الجانب من المدينة بانتظام أكثر من أم درمان. سوق الشارع ١٥ الرئيسي قريب بما يكفي للمشي إن كنت تقطن في المنطقة المركزية، ويفتح سوق للمنتجات الطازجة صباح الجمعة على بُعد منعطفين شمالاً. ومسجد الخيرج هو المرتكز الاجتماعي للحي مع صلاة الجمعة والفعاليات المجتمعية.",
      },
      {
        titleEn: "What to know before renting",
        titleAr: "ما يجب معرفته قبل الاستئجار",
        bodyEn:
          "Khartoum 2 landlords almost universally price in USD or ask for the SDG equivalent at a fixed exchange rate they set — rarely the market rate. Clarify which currency and rate applies before any viewing. Most quality villas require two to three months' deposit upfront and an annual lease, paid in advance either as twelve post-dated cheques or a lump sum. If you are renting remotely, insist on a live video walkthrough via WhatsApp before wiring anything. Verify title deeds are registered with the Khartoum State Land Registry, not just a seller's certificate; this is more common a problem in newer builds than in established villas.",
        bodyAr:
          "يُسعِّر ملاك الخرطوم ٢ تقريباً بشكل شبه عالمي بالدولار الأمريكي، أو يطلبون ما يعادله بالجنيه السوداني وفق سعر صرف يحددونه بأنفسهم — نادراً ما يكون سعر السوق. وضّح العملة المعتمدة وسعر الصرف المطبّق قبل أي معاينة. تستلزم معظم الفيلات الجيدة دفع وديعة تتراوح بين شهرين وثلاثة مقدماً، مع عقد إيجار سنوي يُسدَّد مقدماً إما بشيكات مؤجلة لاثني عشر شهراً أو دفعة واحدة. إن كنت تستأجر عن بُعد، أصرّ على جولة فيديو مباشرة عبر واتساب قبل إرسال أي مبلغ. تحقق من تسجيل صكوك الملكية في سجل أراضي ولاية الخرطوم، لا الاكتفاء بشهادة البائع فحسب؛ هذه الإشكالية أكثر شيوعاً في المباني الحديثة منها في الفيلات الراسخة.",
      },
    ],
    vitals: {
      typicalRentEn: "$450–900/mo for a 2BR apartment",
      typicalRentAr: "٤٥٠–٩٠٠ دولار/شهر لشقة غرفتين",
      powerReliability: "Good",
      waterReliability: "Good",
      diasporaFavored: true,
      nearestAirportKm: 14,
    },
  },
  {
    slug: "khartoum-3",
    nameEn: "Khartoum 3",
    nameAr: "الخرطوم ٣",
    state: "khartoum",
    heroImage:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3CTdrgC2CdR16Mhg8ltaktkLuTj/hf_20260510_214536_97349bea-6063-45b5-980b-305f13e15c4e.png",
    introEn:
      "Khartoum 3 is the city's densest mixed-use neighbourhood — a grid of mid-rise apartments over ground-floor shops, broken up by mosques, schools, and the occasional tree-shaded courtyard that hints at what it looked like before the concrete arrived. It is not scenic in the way Khartoum 2 is, but it is alive in a different register: the streets are busy from early morning prayer until well past midnight, small businesses proliferate, and the market access is genuinely excellent. For families who need central Khartoum services without the premium of Khartoum 2, Khartoum 3 delivers solid value. Water pressure here is notably consistent — one of the better-served areas in the capital.",
    introAr:
      "الخرطوم ٣ هو الحي الأكثر كثافة سكانية وتمازجاً في المدينة — شبكة من الشقق متوسطة الارتفاع فوق محلات الطوابق الأرضية، تتخللها المساجد والمدارس وأفنية خضراء متفرقة تذكّرك بما كان يبدو عليه الحي قبل أن يصل الإسمنت. ليس ذا جمال طبيعي كالخرطوم ٢، لكنه مفعم بحياة مختلفة: الشوارع نشطة من صلاة الفجر حتى بعد منتصف الليل، والأعمال الصغيرة تنتشر، وإمكانية الوصول إلى الأسواق ممتازة حقاً. للعائلات التي تحتاج خدمات وسط الخرطوم دون أعباء الخرطوم ٢، يقدم الخرطوم ٣ قيمة متميزة. ضغط المياه هنا منتظم بشكل لافت — إذ تُعدّ المنطقة من الأفضل خدمة في العاصمة.",
    sections: [
      {
        titleEn: "Who lives here",
        titleAr: "من يسكن هنا",
        bodyEn:
          "Khartoum 3 is home to a broad cross-section of working Khartoum: teachers, mid-level government staff, private-sector workers in trade and logistics, and an increasing number of young couples who have been priced out of Khartoum 2 but refuse to move further out. It also hosts a significant community of Sudanese returnees from Saudi Arabia and Qatar who want the familiar proximity of a dense Arab city. The neighbourhood has a reputation for community solidarity; during power cuts, neighbours share generators with a casualness that would surprise visitors.",
        bodyAr:
          "يضم حي الخرطوم ٣ شريحة عريضة من سكان الخرطوم العاملين: معلمون وموظفون حكوميون من المستويات المتوسطة وعمال القطاع الخاص في التجارة والخدمات اللوجستية، إلى جانب عدد متزايد من الأزواج الشباب الذين أُبعدوا من الخرطوم ٢ بسبب ارتفاع الأسعار لكنهم يرفضون الانتقال إلى أطراف المدينة. كما يضم مجتمعاً كبيراً من السودانيين العائدين من المملكة العربية السعودية وقطر ممن يتوقون إلى الألفة الحضرية لمدينة عربية مكتنزة. يُعرف الحي بتضامن اجتماعي قوي؛ خلال انقطاعات الكهرباء يتشارك الجيران المولدات بعفوية تُدهش الزوار.",
      },
      {
        titleEn: "What it's like day-to-day",
        titleAr: "الحياة اليومية",
        bodyEn:
          "The municipal water supply in Khartoum 3 is one of the most dependable in the capital — most buildings have water for at least eighteen hours a day, and roof-top storage tanks are standard. Power is less reliable: expect cuts of four to eight hours, typically in the afternoon when grid load peaks. The neighbourhood has excellent ground-level retail: pharmacies open late, fresh-bread shops at corners, two sizeable produce markets, and a cluster of hardware and electronics shops near the central roundabout. Three schools within walking distance make it practical for families. The Corniche is only a fifteen-minute drive, a relief on evenings when you need the Nile breeze.",
        bodyAr:
          "إمدادات المياه البلدية في الخرطوم ٣ من أكثرها موثوقية في العاصمة — تتوافر المياه في معظم المباني لمدة لا تقل عن ثماني عشرة ساعة يومياً، وخزانات التخزين على الأسطح معيارية. الكهرباء أقل موثوقية: توقع انقطاعات تتراوح بين أربع وثماني ساعات، عادةً في فترة ما بعد الظهر حين يبلغ الحمل على الشبكة ذروته. يتميز الحي بتجارة شاملة في مستوى الشارع: صيدليات تعمل حتى منتصف الليل، ومحلات خبز طازج في الأركان، وسوقان كبيران للمنتجات، ومجموعة من محلات الأدوات والإلكترونيات بالقرب من الدوار المركزي. ثلاث مدارس ضمن مسافة المشي تجعله عملياً للعائلات، والكورنيش لا يبعد إلا ربع ساعة بالسيارة، نعمة في الأمسيات التي تحتاج فيها نسيم النيل.",
      },
      {
        titleEn: "What to know before renting",
        titleAr: "ما يجب معرفته قبل الاستئجار",
        bodyEn:
          "Khartoum 3 has a large informal rental sector — many landlords rent through personal networks without formal contracts. Always get a written lease, even if the landlord resists. Ask specifically about the building's generator arrangement: some buildings have shared generators with monthly fuel costs passed to tenants, others have none. Inspect the roof water tank for cleanliness; older tanks are sometimes neglected. If you are a diaspora tenant renting remotely, appoint a trusted local contact — ideally not the agent — to verify the unit is vacant and as described before your arrival.",
        bodyAr:
          "يمتلك الخرطوم ٣ قطاعاً تأجيرياً غير رسمي واسعاً — كثير من الملاك يؤجرون عبر شبكات شخصية دون عقود رسمية. احرص دائماً على الحصول على عقد إيجار مكتوب حتى لو قاوم الملاك ذلك. اسأل تحديداً عن ترتيب مولد الكهرباء في المبنى: بعض المباني لديها مولدات مشتركة تُحوَّل تكاليف الوقود الشهرية إلى المستأجرين، وأخرى لا تمتلك شيئاً. افحص خزان المياه على السطح للتأكد من نظافته؛ الخزانات القديمة مهملة أحياناً. إن كنت مستأجراً مغترباً تستأجر عن بُعد، عيّن جهة اتصال محلية موثوقة — يُفضَّل أن لا تكون الوسيط — للتحقق من خلو الوحدة وتطابقها مع الوصف قبل وصولك.",
      },
    ],
    vitals: {
      typicalRentEn: "$280–550/mo for a 2BR apartment",
      typicalRentAr: "٢٨٠–٥٥٠ دولار/شهر لشقة غرفتين",
      powerReliability: "Variable",
      waterReliability: "Good",
      diasporaFavored: false,
      nearestAirportKm: 18,
    },
  },
  {
    slug: "bahri-riverside",
    nameEn: "Bahri Riverside",
    nameAr: "بحري الكورنيش",
    state: "khartoum",
    heroImage:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3CTdrgC2CdR16Mhg8ltaktkLuTj/hf_20260510_214539_9d749881-c7dc-479b-a789-238e62bd9332.png",
    introEn:
      "Bahri — formally Khartoum North — sits on the north bank of the Blue Nile directly opposite central Khartoum, connected by three bridges that, on a clear day, let you watch the city's skyline from the river. Bahri Riverside specifically refers to the strip of neighbourhoods hugging the Nile bend: Al-Halfaya, Al-Haj Yousif waterfront, and the older villas between them. The Nile here is wide and slow, and in the cooler months, evening walks along the bank are genuinely restorative. Family compounds dominate — extended families who have held land here for generations — which makes the rental market tight but genuine when units do come to market.",
    introAr:
      "بحري — أو الخرطوم بحري رسمياً — تقع على الضفة الشمالية للنيل الأزرق مباشرةً في مواجهة وسط الخرطوم، يربطها بها ثلاثة جسور تتيح لك في يوم صافٍ مشاهدة أفق المدينة من النهر. يشير مصطلح «بحري الكورنيش» تحديداً إلى شريط الأحياء المحاذية لانحناء النيل: الحلفاية وكورنيش الحاج يوسف والفيلات العريقة بينهما. النيل هنا واسع وهادئ، وفي الأشهر الباردة، تكون نزهات المساء على الضفة مجددة للروح حقاً. تهيمن على المشهد المجمعات العائلية — عائلات ممتدة تمتلك أراضي هنا منذ أجيال — مما يجعل سوق الإيجار ضيقاً، لكنه أصيل حين تخرج وحدات للسوق.",
    sections: [
      {
        titleEn: "Who lives here",
        titleAr: "من يسكن هنا",
        bodyEn:
          "Bahri Riverside is dominated by established Sudanese families who have deep roots in the north bank. The rental market is small — most property here is owner-occupied or passed through family networks — but what exists tends to be large: multi-bedroom family homes or floor apartments within compound villas. There is a growing interest from diaspora families who specifically want the Nile view and the slightly cooler microclimate the river provides, even if the commute to central Khartoum across the bridges can be unpredictable during peak hours.",
        bodyAr:
          "يهيمن على بحري الكورنيش عائلات سودانية راسخة ذات جذور عميقة في الضفة الشمالية. سوق الإيجار صغير — معظم العقارات هنا يسكنها أصحابها أو تتداولها الشبكات العائلية — لكن ما هو متاح يميل إلى الاتساع: منازل عائلية متعددة الغرف أو شقق طابقية داخل فيلات مسوّرة. ويتصاعد الاهتمام من جانب عائلات المغتربين الذين يريدون تحديداً إطلالة النيل والمناخ الأكثر برودة نسبياً الذي يوفره النهر، حتى وإن كان التنقل إلى وسط الخرطوم عبر الجسور قد يكون متقلباً في أوقات الذروة.",
      },
      {
        titleEn: "What it's like day-to-day",
        titleAr: "الحياة اليومية",
        bodyEn:
          "Power in Bahri follows a similar pattern to central Khartoum — variable, but slightly more reliable on the quieter residential streets away from the main road. The Nile-adjacent compounds benefit from natural ventilation that meaningfully reduces cooling needs in spring and autumn. The Al-Halfaya market, one of the oldest in greater Khartoum, operates daily and is excellent for produce, spices, and hardware. The major Bahri mosque near the bridge is an anchor for the community. Commuting to south Khartoum during the morning rush adds unpredictability — the bridges bottleneck and thirty minutes can stretch to ninety.",
        bodyAr:
          "تسير الكهرباء في بحري وفق نمط مشابه لوسط الخرطوم — متقلبة، لكن أكثر موثوقية قليلاً في الشوارع السكنية الهادئة بعيداً عن الطريق الرئيسي. تستفيد المجمعات المطلة على النيل من التهوية الطبيعية التي تقلل بشكل حقيقي الحاجة إلى التبريد في الربيع والخريف. سوق الحلفاية، أحد أعرق أسواق الخرطوم الكبرى، يعمل يومياً ويُعدّ رائعاً للمنتجات الطازجة والبهارات والأدوات. يُشكّل المسجد الكبير في بحري بالقرب من الجسر مركزاً مجتمعياً للحي. يُضيف التنقل إلى جنوب الخرطوم في ساعة الذروة الصباحية قدراً من عدم اليقين — الجسور تتحول إلى عنق زجاجة وقد تمتد رحلة نصف ساعة إلى تسعين دقيقة.",
      },
      {
        titleEn: "What to know before renting",
        titleAr: "ما يجب معرفته قبل الاستئجار",
        bodyEn:
          "The best Bahri Riverside units rarely reach public listings — they move through family and community networks. A local agent who has worked the north bank for years is more valuable here than a digital platform. When a unit does appear publicly, move quickly: demand from diaspora families has recently outpaced supply. Inspect flood-risk carefully for any ground-floor or basement unit — the Nile level varies seasonally, and in wet years Bahri has experienced minor inundation in lower-lying areas. The road network behind the Nile strip is sometimes poor; ask specifically about the access road condition in the rainy season.",
        bodyAr:
          "أفضل وحدات بحري الكورنيش نادراً ما تصل إلى القوائم العامة — تتداولها الشبكات العائلية والمجتمعية. وسيط عقاري محلي أمضى سنوات في العمل بالضفة الشمالية أكثر قيمة هنا من أي منصة رقمية. حين تظهر وحدة في القوائم العامة، تصرف بسرعة: طلب عائلات المغتربين تجاوز مؤخراً العرض المتاح. افحص خطر الفيضان بعناية لأي وحدة في الطابق الأرضي أو السفلي — منسوب النيل يتفاوت موسمياً، وشهدت بحري في سنوات الأمطار الغزيرة فيضانات طفيفة في المناطق المنخفضة. شبكة الطرق خلف شريط النيل متردية أحياناً؛ اسأل تحديداً عن حالة طريق الوصول في موسم الأمطار.",
      },
    ],
    vitals: {
      typicalRentEn: "$350–700/mo for a 3BR family home",
      typicalRentAr: "٣٥٠–٧٠٠ دولار/شهر لمنزل عائلي بثلاث غرف",
      powerReliability: "Variable",
      waterReliability: "Variable",
      diasporaFavored: true,
      nearestAirportKm: 20,
    },
  },
  {
    slug: "omdurman-mulazimin",
    nameEn: "Omdurman Mulazimin",
    nameAr: "أم درمان الملازمين",
    state: "khartoum",
    heroImage:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3CTdrgC2CdR16Mhg8ltaktkLuTj/hf_20260510_214542_363f26b9-aa43-42ce-87f1-c3873da97d04.png",
    introEn:
      "Mulazimin is the oldest residential quarter of Omdurman, which is itself the oldest continuous urban settlement on the confluence. The neighbourhood grew around the barracks of the Mahdist army — 'mulazimin' meaning 'attached troops' — and the architecture still carries echoes of that layered history: broad-walled houses with interior courtyards, rooms added generation by generation, trees that have been growing for a hundred years. It is not a neighbourhood designed for outsiders, but for those who come to live rather than to visit, the texture of community life here is unlike anything in central Khartoum.",
    introAr:
      "الملازمين هو الحي السكني الأقدم في أم درمان، التي تُعدّ بدورها أقدم تجمّع حضري مستمر على ملتقى النيلين. نشأ الحي حول ثكنات جيش المهدية — إذ يعني «الملازمون» الجنود الملازمين — ولا يزال العمران يحمل أصداء تلك التاريخ المتراكم: منازل ذات جدران سميكة وأفنية داخلية، وغرف أُضيفت جيلاً بعد جيل، وأشجار تنمو منذ مئة عام. ليس حياً مُهيأً للغرباء، لكن لمن يأتي ليسكن لا ليزور، تتمتع الحياة الاجتماعية هنا بنسيج لا يشبه شيئاً في وسط الخرطوم.",
    sections: [
      {
        titleEn: "Who lives here",
        titleAr: "من يسكن هنا",
        bodyEn:
          "Mulazimin is multigenerational in a way that is increasingly rare in Sudanese cities: grandparents, parents, and grandchildren under one extended roof is still normal here, not exceptional. The community is predominantly northern Sudanese with family roots running deep into the Nile Valley — Jaalyeen, Shaigiyya, Danagla families who have held these streets since the late nineteenth century. There are no expats, few NGO workers, and almost no short-term renters. For diaspora families with roots in Omdurman, returning to Mulazimin often feels like the only honest choice.",
        bodyAr:
          "الملازمين متعدد الأجيال بطريقة باتت نادرة في المدن السودانية: الأجداد والآباء والأحفاد تحت سقف ممتد واحد لا يزال أمراً طبيعياً هنا لا استثنائياً. المجتمع في معظمه من شمال السودان بجذور عائلية ضاربة في وادي النيل — عائلات جعليين وشايقية ودناقلة تمتلك هذه الشوارع منذ أواخر القرن التاسع عشر. لا أجانب هنا، ولا عمال منظمات غير حكومية يُذكر، وكاد المستأجرون قصيرو الأمد يغيبون تماماً. لعائلات المغتربين ذوي الجذور في أم درمان، العودة إلى الملازمين كثيراً ما تبدو الخيار الصادق الوحيد.",
      },
      {
        titleEn: "What it's like day-to-day",
        titleAr: "الحياة اليومية",
        bodyEn:
          "Power in Mulazimin is variable and cuts are long — eight to fourteen hours without power is possible on bad days. Generator culture is strong but less universal than in Khartoum 2; many households manage with rechargeable lights and patience. Water pressure is better than Omdurman's reputation: the main supply line serving this part of the city was upgraded in 2019 and has been reasonably reliable since. The Omdurman central souq is a fifteen-minute walk — one of the great market experiences in Sudan. The tomb of the Mahdi and the Khalifa's House museum are ten minutes away; on a quiet Tuesday morning, walking this stretch is a lesson in the texture of Sudanese history.",
        bodyAr:
          "الكهرباء في الملازمين متقلبة والانقطاعات طويلة — من الممكن أن تمر بثماني إلى أربع عشرة ساعة بدون تيار في الأيام السيئة. ثقافة المولدات راسخة لكنها ليست شاملة كما في الخرطوم ٢؛ كثير من الأسر تدبّر أمرها بالإضاءة القابلة للشحن والصبر. ضغط المياه أفضل مما تشتهر به أم درمان: خط الإمداد الرئيسي الذي يخدم هذا الجزء من المدينة جُدِّد عام ٢٠١٩ وأصبح موثوقاً بشكل معقول منذئذ. سوق أم درمان المركزي على بُعد ربع ساعة مشياً — أحد أروع تجارب الأسواق في السودان. قبة المهدي وبيت الخليفة المتحف على بُعد عشر دقائق؛ وفي صباح يوم ثلاثاء هادئ، يُعلمك المشي في هذا الامتداد درساً في نسيج التاريخ السوداني.",
      },
      {
        titleEn: "What to know before renting",
        titleAr: "ما يجب معرفته قبل الاستئجار",
        bodyEn:
          "The rental market in Mulazimin is almost entirely informal — most transactions happen through community introductions, not agents or platforms. If you arrive without a local contact, finding a quality rental is genuinely difficult. Pricing is still denominated in SDG, not USD, which means exchange-rate risk for diaspora renters sending money from abroad. Leases, where they exist, are typically annual verbal agreements witnessed by a community elder. The neighbourhood has minimal commercial infrastructure compared to central Khartoum — there are no Western pharmacies, no delivery services, and limited connectivity. For many residents, that is precisely the point.",
        bodyAr:
          "سوق الإيجار في الملازمين غير رسمي بالكامل تقريباً — معظم الصفقات تجري من خلال توصيات مجتمعية لا وكلاء أو منصات. إن وصلت دون جهة اتصال محلية، فإيجاد سكن جيد صعب حقاً. التسعير لا يزال بالجنيه السوداني لا بالدولار، مما يعني مخاطر صرف العملات للمستأجرين المغتربين الذين يرسلون الأموال من الخارج. عقود الإيجار، حيث توجد، عادةً اتفاقيات شفهية سنوية يشهد عليها شيخ المجتمع. البنية التحتية التجارية في الحي محدودة مقارنة بوسط الخرطوم — لا صيدليات حديثة، ولا خدمات توصيل، واتصالات محدودة. بالنسبة لكثير من السكان، هذا بالضبط ما يريدونه.",
      },
    ],
    vitals: {
      typicalRentEn: "$150–300/mo for a 3BR traditional house",
      typicalRentAr: "١٥٠–٣٠٠ دولار/شهر لمنزل تقليدي بثلاث غرف",
      powerReliability: "Limited",
      waterReliability: "Variable",
      diasporaFavored: false,
      nearestAirportKm: 30,
    },
  },
  {
    slug: "khartoum-amarat",
    nameEn: "Khartoum Amarat",
    nameAr: "الخرطوم العمارات",
    state: "khartoum",
    heroImage:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3CTdrgC2CdR16Mhg8ltaktkLuTj/hf_20260510_214544_2807559f-64a3-4e17-aec3-d9db72e6b806.png",
    introEn:
      "Amarat is the commercial-residential seam of Khartoum — the neighbourhood where a ground-floor insurance office sits beneath three floors of apartments, where the line between office and home has always been blurry. Stretching along Africa Road and its tributaries, it houses a concentration of businesses, law firms, travel agencies, and mid-size restaurants that make it the most economically active residential zone in the city. Living here means accepting noise and traffic as ambient conditions, in exchange for being walking distance from almost every service you need.",
    introAr:
      "العمارات هي خياطة الخرطوم التجارية والسكنية — الحي الذي يجلس فيه مكتب تأمين في الطابق الأرضي تحت ثلاثة طوابق من الشقق، حيث الحد الفاصل بين المكتب والمنزل كان دائماً ضبابياً. يمتد على طول شارع أفريقيا وروافده، ويضم تركزاً من الأعمال ومكاتب المحامين ووكالات السفر والمطاعم متوسطة الحجم، مما يجعله المنطقة السكنية الأكثر نشاطاً اقتصادياً في المدينة. العيش هنا يعني القبول بالضوضاء والازدحام كظروف محيطة، في مقابل أن تكون على مقربة من تقريباً كل خدمة تحتاجها.",
    sections: [
      {
        titleEn: "Who lives here",
        titleAr: "من يسكن هنا",
        bodyEn:
          "Amarat's apartment stock is the city's widest — studios through four-bedrooms, old walk-up blocks, newer buildings with lifts and parking. The population is correspondingly diverse: single professionals, young families, business owners who live above their office, and an above-average concentration of Sudanese diaspora who want convenience over prestige. The neighbourhood has historically been home to a Lebanese and Egyptian commercial community, leaving behind restaurants and bakeries that are still operating under the same family names.",
        bodyAr:
          "رصيد شقق العمارات هو الأوسع في المدينة — من الاستوديو إلى أربع غرف، ومن المباني القديمة ذات السلالم حتى المباني الجديدة ذات المصاعد والمواقف. السكان متنوعون بالمثل: متخصصون عازبون، وعائلات شابة، وأصحاب أعمال يسكنون فوق مكاتبهم، وتركّز فوق المتوسط من المغتربين السودانيين الذين يفضلون الراحة على المكانة. شهد الحي تاريخياً وجود مجتمع تجاري لبناني ومصري، خلّف مطاعم ومخابز لا تزال تعمل بنفس أسماء العائلات.",
      },
      {
        titleEn: "What it's like day-to-day",
        titleAr: "الحياة اليومية",
        bodyEn:
          "Power in Amarat is somewhat better than the city average — the commercial concentration means the grid prioritises this corridor. Expect six to ten hour cuts rather than twelve. Water is generally adequate in upper-floor apartments when roof tanks are maintained, but ground and first-floor units in older buildings can have pressure issues. The neighbourhood has excellent food options at all price points: a fresh juice stand on most corners, several decent Sudanese lunch restaurants, a Lebanese bakery near Africa Road that opens at 06:00. Traffic between 07:30 and 09:00 and again at 16:00–18:30 is genuinely congested; if you work nearby, consider the timing.",
        bodyAr:
          "الكهرباء في العمارات أفضل قليلاً من متوسط المدينة — التركّز التجاري يعني أن الشبكة تُعطي الأولوية لهذا الممر. توقع انقطاعات من ست إلى عشر ساعات لا اثنتي عشرة. المياه كافية عموماً في شقق الطوابق العليا حين تُصان الخزانات، لكن وحدات الطابق الأرضي والأول في المباني القديمة قد تعاني من ضعف الضغط. الحي يوفر خيارات طعام ممتازة بجميع الأسعار: عصير طازج في كل ركن تقريباً، وعدة مطاعم سودانية محترمة لوجبة الغداء، ومخبز لبناني قرب شارع أفريقيا يفتح السادسة صباحاً. الازدحام المروري بين الساعة ٧:٣٠ و٩:٠٠ وبين ١٦:٠٠ و١٨:٣٠ حقيقي ومؤثر؛ إن كان عملك قريباً، راعِ هذا التوقيت.",
      },
      {
        titleEn: "What to know before renting",
        titleAr: "ما يجب معرفته قبل الاستئجار",
        bodyEn:
          "Amarat has a more professionalised rental market than most Khartoum neighbourhoods — more listings appear on platforms, more landlords use written contracts, and there is a well-established agent network. Pricing is a mix of USD and SDG; the higher-quality buildings typically price in USD. Noise is the underreported issue: if you are sensitive to street noise, inspect the unit on a weekday afternoon rather than a Friday when the streets are quiet. Generator fuel costs, if the building uses one, are typically passed to tenants as a monthly levy and can add $30–60 to the effective rent.",
        bodyAr:
          "يتمتع حي العمارات بسوق إيجاري أكثر احترافية من معظم أحياء الخرطوم — مزيد من القوائم يظهر على المنصات، وأكثر الملاك يستخدمون عقوداً مكتوبة، وشبكة وسطاء راسخة. التسعير مزيج من الدولار والجنيه؛ المباني الأعلى جودة تسعّر عادةً بالدولار. الضوضاء هي القضية الأقل تناولاً: إن كنت حساساً لضجيج الشارع، افحص الوحدة ظهر يوم عمل لا يوم جمعة حين تهدأ الشوارع. تكاليف وقود المولد، إن كان المبنى يستخدم واحداً، تُحوَّل عادةً إلى المستأجرين كرسوم شهرية، وقد تضيف من ٣٠ إلى ٦٠ دولاراً إلى الإيجار الفعلي.",
      },
    ],
    vitals: {
      typicalRentEn: "$320–700/mo for a 2BR apartment",
      typicalRentAr: "٣٢٠–٧٠٠ دولار/شهر لشقة غرفتين",
      powerReliability: "Good",
      waterReliability: "Variable",
      diasporaFavored: true,
      nearestAirportKm: 16,
    },
  },
  {
    slug: "port-sudan-corniche",
    nameEn: "Port Sudan Corniche",
    nameAr: "بورتسودان الكورنيش",
    state: "red_sea",
    heroImage:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3CTdrgC2CdR16Mhg8ltaktkLuTj/hf_20260510_214747_a3f5dd79-789a-424f-8cf2-3408ab0b579c.png",
    introEn:
      "Port Sudan's Corniche district runs along the Red Sea waterfront between the old port gates and the newer diplomatic quarter, a strip of seafront apartments and villas that has become, unexpectedly, a destination of growing diaspora interest. The Red Sea city was less disrupted by the 2023 conflict than Khartoum, which drove a wave of internal migration and, alongside it, an uptick in permanent relocation decisions from diaspora families who had been planning to return eventually but chose to accelerate. The Corniche offers sea breezes year-round, a more temperate climate than the interior, and a port city's particular cosmopolitan energy.",
    introAr:
      "يمتد حي كورنيش بورتسودان على امتداد الواجهة البحرية للبحر الأحمر بين بوابات الميناء القديم والحي الدبلوماسي الجديد، شريط من الشقق والفيلات المطلة على البحر أصبح، على نحو غير متوقع، وجهةً تتصاعد فيها اهتمامات المغتربين. تأثرت مدينة البحر الأحمر بصراع ٢٠٢٣ بدرجة أقل من الخرطوم، مما دفع موجة من الهجرة الداخلية ومعها ارتفاعاً في قرارات الانتقال الدائم من عائلات المغتربين التي كانت تخطط للعودة ذات يوم وقررت التعجيل بها. يوفر الكورنيش نسيم البحر طوال العام ومناخاً أكثر اعتدالاً من الداخل وطاقة مدينة ميناء ذات طابع كوسموبوليتاني خاص.",
    sections: [
      {
        titleEn: "Who lives here",
        titleAr: "من يسكن هنا",
        bodyEn:
          "Port Sudan Corniche has always attracted a mixed population: Beja families with deep coastal roots, trading families with Yemeni and Saudi connections, government and military personnel, and increasingly, Khartoum-origin families who relocated during or after 2023. The newer arrivals have driven up apartment rents significantly from 2023 to 2025. The neighbourhood has a more heterogeneous social texture than Khartoum's homogenous residential zones — the port city's history of trade and movement shows in the faces and accents you hear walking the waterfront in the evening.",
        bodyAr:
          "اجتذب كورنيش بورتسودان دائماً سكاناً متنوعين: عائلات بجاوية بجذور ساحلية عميقة، وعائلات تجارية ذات صلات يمنية وسعودية، وموظفون حكوميون وعسكريون، ومتزايداً عائلات ذات أصول خرطومية انتقلت إبان ٢٠٢٣ أو بعده. رفع القادمون الجدد إيجارات الشقق ارتفاعاً ملحوظاً بين ٢٠٢٣ و٢٠٢٥. يتمتع الحي بنسيج اجتماعي أكثر تنوعاً من المناطق السكنية المتجانسة في الخرطوم — يتجلى تاريخ مدينة الميناء في التجارة والحركة على الوجوه واللهجات التي تسمعها حين تسير على الواجهة البحرية مساءً.",
      },
      {
        titleEn: "What it's like day-to-day",
        titleAr: "الحياة اليومية",
        bodyEn:
          "Power reliability in Port Sudan Corniche is notably better than Khartoum — the city benefits from a more stable grid connected to eastern Sudan's power infrastructure and periodic Saudi-funded improvements. Expect four to eight hours of cuts rather than the Khartoum norm of eight to twelve. Water is generally good in the seafront buildings, though newer construction sometimes has plumbing issues in the first years. The Corniche market is small but fresh: fresh fish daily is a significant quality-of-life advantage. The heat between June and August is intense even with sea breezes — ceiling fans and good insulation matter more than anywhere in the country.",
        bodyAr:
          "موثوقية الكهرباء في كورنيش بورتسودان أفضل بشكل لافت من الخرطوم — تستفيد المدينة من شبكة أكثر استقراراً متصلة بالبنية التحتية للطاقة في شرق السودان وتحسينات دورية بتمويل سعودي. توقع انقطاعات من أربع إلى ثماني ساعات لا الثماني إلى اثنتي عشرة المعتادة في الخرطوم. المياه جيدة عموماً في مباني الواجهة البحرية، وإن كانت المباني الجديدة أحياناً تعاني من مشكلات في السباكة في السنوات الأولى. سوق الكورنيش صغير لكنه طازج: السمك الطازج يومياً ميزة حياتية كبيرة. الحر بين يونيو وأغسطس شديد حتى مع نسيم البحر — المراوح السقفية والعزل الجيد أهم هنا من أي مكان آخر في البلاد.",
      },
      {
        titleEn: "What to know before renting",
        titleAr: "ما يجب معرفته قبل الاستئجار",
        bodyEn:
          "The Port Sudan rental market has become notably more expensive since 2023 and is less transparent than Khartoum's. Many landlords are aware that diaspora and internally-displaced tenants have fewer alternatives and price accordingly. Verify comparable rents before signing — the spread between fair market and opportunistic pricing is wide. Sea-facing apartments attract a 30–50% premium over equivalent inland units; decide honestly whether the view justifies the cost given the heat. Check that the building has adequate ventilation and that windows facing the sea seal properly — salt air and humidity accelerate corrosion in poorly maintained buildings.",
        bodyAr:
          "أصبح سوق الإيجار في بورتسودان أغلى بشكل ملحوظ منذ ٢٠٢٣ وأقل شفافية من سوق الخرطوم. كثير من الملاك يعون أن المغتربين والمهجَّرين داخلياً أمامهم بدائل أقل ويسعّرون وفقاً لذلك. تحقق من الإيجارات المقارنة قبل التوقيع — الفجوة بين السعر العادل والتسعير الانتهازي واسعة. الشقق المطلة على البحر تجذب علاوة ٣٠–٥٠٪ فوق الوحدات المماثلة في الداخل؛ قرر بصدق إن كانت الإطلالة تستحق التكلفة مع الأخذ بعين الاعتبار شدة الحر. تحقق من وجود تهوية كافية في المبنى وأن النوافذ المطلة على البحر محكمة الإغلاق — الهواء المالح والرطوبة تُسرّع التآكل في المباني سيئة الصيانة.",
      },
    ],
    vitals: {
      typicalRentEn: "$350–750/mo for a 2BR seafront apartment",
      typicalRentAr: "٣٥٠–٧٥٠ دولار/شهر لشقة غرفتين مطلة على البحر",
      powerReliability: "Good",
      waterReliability: "Good",
      diasporaFavored: true,
      nearestAirportKm: 8,
    },
  },
  {
    slug: "wad-madani-center",
    nameEn: "Wad Madani Center",
    nameAr: "وسط مدينة ودمدني",
    state: "al_jazirah",
    heroImage:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3CTdrgC2CdR16Mhg8ltaktkLuTj/hf_20260510_214749_9d7037cd-e157-4e3f-9fe2-c60f7a9d8c16.png",
    introEn:
      "Wad Madani is the capital of Al-Jazirah state, positioned at the heart of the Gezira agricultural scheme — the vast irrigated cotton- and sorghum-growing plain between the Blue and White Niles that has sustained central Sudan for a century. The city center is compact and functional: a main street, a large souq, the state government buildings, and a ring of residential quarters that feel a generation behind Khartoum in infrastructure but considerably ahead in affordability. For families priced out of the capital, or those who never wanted its pace, Wad Madani Center offers a genuine mid-size Sudanese city life with surprisingly good transport connections north.",
    introAr:
      "ودمدني عاصمة ولاية الجزيرة، تقع في قلب مشروع الجزيرة الزراعي — السهل الشاسع المروي بزراعة القطن والذرة بين النيل الأزرق والأبيض الذي أسهم في إعاشة وسط السودان قرناً كاملاً. مركز المدينة مدمج وعملي: شارع رئيسي وسوق كبير ومباني حكومة الولاية وحلقة من الأحياء السكنية التي تبدو جيلاً متأخراً عن الخرطوم في البنية التحتية لكنها متقدمة كثيراً من حيث القدرة الشرائية. للعائلات التي يُبعدها ارتفاع أسعار العاصمة، أو تلك التي لم تُرِد إيقاعها قط، يُقدم وسط ودمدني حياة مدينة سودانية متوسطة الحجم حقيقية مع روابط نقل جيدة بشكل مفاجئ باتجاه الشمال.",
    sections: [
      {
        titleEn: "Who lives here",
        titleAr: "من يسكن هنا",
        bodyEn:
          "Wad Madani Center is inhabited predominantly by government workers, agricultural administrators, teachers, and traders who service the Gezira agricultural network. The city has a large student population around its university and agricultural research institute. There is no significant diaspora community in Wad Madani — it is not a city people return to from abroad in the same way as Khartoum; it is a city people move to for work and stay for life. The social fabric is close-knit in a way that Khartoum no longer is: neighbours know each other, mosque attendance is high, and community obligations are still taken seriously.",
        bodyAr:
          "يسكن وسط ودمدني في معظمه موظفو حكومة ومديرو زراعة ومعلمون وتجار يخدمون شبكة مشروع الجزيرة الزراعي. للمدينة تجمع طلابي كبير حول جامعتها ومعهد أبحاث الزراعة. لا يوجد مجتمع مغتربين ذو بال في ودمدني — فهي ليست مدينة يعود إليها الناس من الخارج بنفس الطريقة التي يعودون بها إلى الخرطوم؛ بل مدينة يأتي إليها الناس للعمل ويبقون فيها طيلة حياتهم. النسيج الاجتماعي متماسك بطريقة لم تعد الخرطوم تعرفها: الجيران يعرفون بعضهم، وحضور المساجد مرتفع، والالتزامات المجتمعية لا تزال تُؤخذ بجدية.",
      },
      {
        titleEn: "What it's like day-to-day",
        titleAr: "الحياة اليومية",
        bodyEn:
          "Power in Wad Madani is variable but has a particular pattern: cuts tend to cluster in the morning and early evening, and midday power is often stable. The agricultural water network means piped water is generally available, though pressure can be low in the summer months when irrigation demand peaks. The central souq is one of the best-stocked in central Sudan for household goods, agricultural supplies, and fresh produce from the surrounding scheme. The main street has several decent restaurants and a Khartoum-standard pastry shop. Bus connections to Khartoum run every thirty minutes from the main station, a three-hour journey in normal conditions.",
        bodyAr:
          "الكهرباء في ودمدني متقلبة لكن لها نمط خاص: الانقطاعات تتركز في الصباح وأوائل المساء، وغالباً ما يكون التيار في منتصف النهر مستقراً. الشبكة الزراعية المائية تعني أن المياه المنقولة متاحة عموماً، وإن كان الضغط قد ينخفض في أشهر الصيف حين يبلغ الطلب على الري ذروته. السوق المركزي من أفضل أسواق وسط السودان تموُّداً لمواد المنزل والمستلزمات الزراعية والمنتجات الطازجة من المشروع المحيط. الشارع الرئيسي فيه عدة مطاعم محترمة ومحل حلويات بمستوى الخرطوم. حافلات الخرطوم تعمل كل ثلاثين دقيقة من المحطة الرئيسية، رحلة ثلاث ساعات في الظروف الاعتيادية.",
      },
      {
        titleEn: "What to know before renting",
        titleAr: "ما يجب معرفته قبل الاستئجار",
        bodyEn:
          "Wad Madani rents are among the most affordable of any state capital in Sudan — a three-bedroom family home for under $150 per month is realistic in many parts of the city center. Pricing is in SDG; few landlords here have experience with USD transactions, so diaspora renters should anticipate currency logistics. Lease agreements are often informal, and the concept of deposit is less formalised. There is a limited online presence for Wad Madani rentals; the most effective search strategy is arriving in the city, staying briefly in a known guesthouse, and spending two days walking the residential quarters around the university area.",
        bodyAr:
          "إيجارات ودمدني من الأرخص بين عواصم الولايات في السودان — منزل عائلي بثلاث غرف بأقل من ١٥٠ دولاراً شهرياً أمر واقعي في كثير من أجزاء مركز المدينة. التسعير بالجنيه السوداني؛ قلة من الملاك هنا لديهم خبرة في معاملات الدولار، لذا على المستأجرين المغتربين توقع متطلبات لوجستية تتعلق بالعملة. عقود الإيجار غير رسمية في الغالب، ومفهوم الوديعة أقل رسوخاً. الحضور الإلكتروني لإيجارات ودمدني محدود؛ أجدى استراتيجية بحث هي الحضور إلى المدينة، والإقامة لفترة قصيرة في استراحة معروفة، وقضاء يومين في التجوال بالأحياء السكنية حول منطقة الجامعة.",
      },
    ],
    vitals: {
      typicalRentEn: "$80–200/mo for a 3BR family home",
      typicalRentAr: "٨٠–٢٠٠ دولار/شهر لمنزل عائلي بثلاث غرف",
      powerReliability: "Variable",
      waterReliability: "Variable",
      diasporaFavored: false,
      nearestAirportKm: 170,
    },
  },
  {
    slug: "khartoum-garden-city-burri",
    nameEn: "Khartoum Garden City / Burri",
    nameAr: "الخرطوم جاردن سيتي / بري",
    state: "khartoum",
    heroImage:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&auto=format&fit=crop",
    introEn:
      "Garden City and Burri sit in the arc of eastern Khartoum between the Blue Nile and the airport road — a zone that diaspora families have quietly claimed as their own over the past two decades. The neighbourhood is a mix of older mid-rise apartment blocks from the 1980s and 1990s, newer compound villas behind high walls, and a scattering of embassy annexes and international NGO offices that give the area a particular calibre of upkeep. Streets here are wider than central Khartoum, trees survive in the median strips, and the density stays low enough to feel residential even at midday. For families returning from the Gulf or North America who want proximity to the airport and a degree of physical privacy, Garden City and Burri consistently top the shortlist.",
    introAr:
      "تقع جاردن سيتي وبري في القوس الشرقي من الخرطوم بين النيل الأزرق وطريق المطار — منطقة استوطنتها عائلات المغتربين بهدوء على مدى العقدين الماضيين. يجمع الحي بين مباني شقق متوسطة الارتفاع تعود إلى الثمانينيات والتسعينيات، وفيلات مسوّرة أحدث خلف جدران عالية، وتوزع متفرق من ملحقات السفارات ومكاتب المنظمات الدولية يمنح المنطقة مستوى لافتاً من الصيانة. الشوارع هنا أوسع من وسط الخرطوم، والأشجار تصمد في الجزر الوسطية، والكثافة تبقى منخفضة بما يجعل الطابع سكنياً حتى في منتصف النهار. للعائلات العائدة من الخليج أو أمريكا الشمالية التي تريد القرب من المطار وقدراً من الخصوصية، تتصدر جاردن سيتي وبري القائمة المختصرة باستمرار.",
    sections: [
      {
        titleEn: "Who lives here",
        titleAr: "من يسكن هنا",
        bodyEn:
          "Garden City and Burri have attracted a particular profile: Sudanese professionals who spent years in Riyadh, Dubai, or London and want a home that does not feel like a downgrade. The neighbourhood has an unusually high proportion of owner-occupiers who bought or built in the 1990s and 2000s, many of them diaspora families who remitted consistently until they could afford a compound purchase. The rental market that exists is largely sub-letting — children of owners who have moved abroad leasing their parents' ground floors. Embassy staff and UN personnel account for a secondary demand layer, keeping standards high and vacancy rates low. The community skews educated, cosmopolitan, and socially quiet.",
        bodyAr:
          "استقطبت جاردن سيتي وبري ملفاً بعينه: محترفون سودانيون أمضوا سنوات في الرياض أو دبي أو لندن ويريدون منزلاً لا يبدو تراجعاً عن ما اعتادوه. يتمتع الحي بنسبة غير عادية من السكان أصحاب الملك ممن اشتروا أو بنوا في التسعينيات والألفية، كثير منهم عائلات مغتربة حوّلت باستمرار حتى استطاعت شراء مجمع. السوق الإيجاري القائم هو في معظمه تأجير من الباطن — أبناء الملاك المغتربين يؤجرون الطوابق الأرضية لبيوت آبائهم. يمثل موظفو السفارات وهيئات الأمم المتحدة طبقة طلب ثانوية تُبقي المعايير مرتفعة ومعدلات الشواغر منخفضة. المجتمع في مجمله متعلم وكوسموبوليتاني وهادئ اجتماعياً.",
      },
      {
        titleEn: "What it's like day-to-day",
        titleAr: "الحياة اليومية",
        bodyEn:
          "Power reliability in Garden City and Burri sits at the better end of the Khartoum scale — the area benefits from a grid circuit shared with embassy and diplomatic zones, which enjoy a degree of informal priority. Expect eight to eleven hours of grid supply, with most quality compounds running generator backup that covers the remainder. Water pressure is generally good; the pipe network serving this corridor has benefited from periodic NGO-funded maintenance. Day-to-day retail is somewhat thin compared to Khartoum 3 or Amarat: there is no central souq, but a handful of neighbourhood grocery shops, a pharmacy, and a bakery cover basics. For anything larger, the Riyadh shopping strip is ten minutes by car. The airport corridor is the defining geographic advantage — early-morning and late-night flights are significantly less stressful when you are six kilometres from the terminal.",
        bodyAr:
          "موثوقية الكهرباء في جاردن سيتي وبري من الأفضل في الخرطوم — تستفيد المنطقة من دائرة كهربائية مشتركة مع مناطق السفارات والدبلوماسيين التي تحظى بأولوية غير رسمية. توقع ثماني إلى إحدى عشرة ساعة من إمداد الشبكة، ومعظم المجمعات الجيدة تشغّل مولدات احتياطية تغطي الباقي. ضغط المياه جيد عموماً؛ شبكة الأنابيب التي تخدم هذا الممر استفادت من صيانة دورية بتمويل المنظمات الدولية. التجزئة اليومية محدودة نسبياً مقارنة بالخرطوم ٣ أو العمارات: لا يوجد سوق مركزي، لكن حفنة من محلات البقالة الحيّية وصيدلية ومخبز تغطي الأساسيات. لأي شيء أكبر، شارع تسوق الرياض على بُعد عشر دقائق بالسيارة. ممر المطار هو الميزة الجغرافية الحاسمة — الرحلات المبكرة وأواخر الليل أقل إرهاقاً بكثير حين تكون على بعد ستة كيلومترات من الصالة.",
      },
      {
        titleEn: "What to know before renting",
        titleAr: "ما يجب معرفته قبل الاستئجار",
        bodyEn:
          "Garden City and Burri landlords are among Khartoum's most internationally-minded — most price in USD, understand lease agreements in writing, and are familiar with the expectations of diaspora or international tenants. The trade-off is that they also price accordingly: a two-bedroom apartment in a well-maintained compound will rarely appear below $500 per month. Sub-letting arrangements require the original owner's written consent — this is often overlooked, creating legal ambiguity if the primary lease is challenged. If renting remotely, verify that the person showing the property actually has authority to lease it, not just the keys. The best Garden City and Burri units rarely surface on public platforms — a trusted local contact or an agent who works specifically this corridor is worth more than any app.",
        bodyAr:
          "ملاك جاردن سيتي وبري من أكثر ملاك الخرطوم توجهاً دولياً — معظمهم يسعّرون بالدولار ويفهمون عقود الإيجار المكتوبة ويدركون توقعات المستأجرين المغتربين والدوليين. المقابل هو أنهم يسعّرون وفق ذلك: شقة بغرفتين في مجمع جيد الصيانة نادراً ما تظهر بأقل من ٥٠٠ دولار شهرياً. ترتيبات الإيجار من الباطن تستلزم موافقة خطية من المالك الأصلي — كثيراً ما يُتغاضى عن هذا، مما يخلق غموضاً قانونياً إن طُعن في عقد الإيجار الأساسي. إن كنت تستأجر عن بُعد، تحقق من أن الشخص الذي يُريك العقار لديه فعلاً صلاحية تأجيره لا مجرد المفاتيح. أفضل وحدات جاردن سيتي وبري نادراً ما تظهر على المنصات العامة — جهة اتصال محلية موثوقة أو وسيط يعمل تحديداً في هذا الممر تستحق أكثر من أي تطبيق.",
      },
    ],
    vitals: {
      typicalRentEn: "$500–1,200/mo for a 2BR apartment",
      typicalRentAr: "٥٠٠–١٢٠٠ دولار/شهر لشقة غرفتين",
      powerReliability: "Good",
      waterReliability: "Good",
      diasporaFavored: true,
      nearestAirportKm: 6,
    },
  },
  {
    slug: "khartoum-riyadh",
    nameEn: "Khartoum Riyadh",
    nameAr: "الخرطوم الرياض",
    state: "khartoum",
    heroImage:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&auto=format&fit=crop",
    introEn:
      "Riyadh is Khartoum's most deliberately modern residential neighbourhood — planned in the 1970s and 1980s with wider boulevards, setback buildings, and a grid that still feels ordered compared to the organic density of older quarters. Named for the Saudi capital whose influence on Sudanese architecture, wealth, and aspiration is visible on every street, Riyadh has become the address of choice for diaspora families returning from the Gulf with specific expectations about space, services, and social environment. The neighbourhood clusters around a main shopping and restaurant strip that runs for several blocks — the closest Khartoum gets to a genuine commercial high street — and spills into quieter villa compounds behind. Rents are the second-highest in the city, and for many families, the investment is justified.",
    introAr:
      "الرياض هو الحي السكني الأكثر حداثةً وعمدية في الخرطوم — مُخطَّط في السبعينيات والثمانينيات بشوارع رئيسية أوسع ومبانٍ متراجعة عن حدود الشارع وشبكة لا تزال تبدو منظمة مقارنة بكثافة الأحياء القديمة العضوية. سُمّي تيمّناً بالعاصمة السعودية التي يبدو تأثيرها على العمارة والثروة والطموح السوداني جلياً في كل شارع، وأصبح الرياض العنوان المفضل لعائلات المغتربين العائدين من الخليج بتوقعات محددة بشأن المساحة والخدمات والبيئة الاجتماعية. يتمحور الحي حول شارع تسوق ومطاعم رئيسي يمتد لعدة بنايات — أقرب ما وصلت إليه الخرطوم من شارع تجاري حقيقي — ثم يتسع إلى مجمعات فيلات أهدأ خلفه. الإيجارات الثانية الأعلى في المدينة، ولكثير من العائلات الاستثمار مبرر.",
    sections: [
      {
        titleEn: "Who lives here",
        titleAr: "من يسكن هنا",
        bodyEn:
          "Riyadh is diaspora Khartoum in concentrated form: senior professionals returning from Saudi Arabia, the Emirates, Kuwait, and Qatar who want an environment that does not disorient them after years abroad. The neighbourhood also houses a significant contingent of Gulf-based Sudanese who maintain a Riyadh property without living in it full-time, using it for family visits and as an eventual return base. International school families cluster here — the corridor to several private schools runs through or near Riyadh, making morning drop-offs practical. There is a visible social layer of business owners and entrepreneurs, people who run import-export operations or contracting firms and who use the neighbourhood's commercial strip as much as its residential quiet.",
        bodyAr:
          "الرياض هو الخرطوم المغتربة في صورة مكثّفة: محترفون رفيعو المستوى يعودون من المملكة العربية السعودية والإمارات والكويت وقطر ويريدون بيئة لا تزعزع توازنهم بعد سنوات في الخارج. يضم الحي أيضاً شريحة كبيرة من السودانيين المقيمين في الخليج الذين يمتلكون عقاراً في الرياض دون الإقامة فيه بدوام كامل، يستخدمونه لزيارات العائلة وقاعدة عودة محتملة. تتجمع عائلات المدارس الدولية هنا — يمر الممر إلى عدة مدارس خاصة عبر الرياض أو بالقرب منه مما يُسهّل إيصال الأبناء صباحاً. ثمة طبقة اجتماعية مرئية من أصحاب الأعمال والرواد، ممن يديرون عمليات الاستيراد والتصدير أو شركات المقاولات ويستخدمون الشريط التجاري للحي بقدر ما يستخدمون هدوءه السكني.",
      },
      {
        titleEn: "What it's like day-to-day",
        titleAr: "الحياة اليومية",
        bodyEn:
          "Power in Riyadh is the best in Khartoum by reliable accounts — the area's commercial strip and the density of businesses with their own generator investments create an informal grid resilience that benefits residential neighbours. In the villa compounds, many landlords have invested in high-capacity generators that cover gaps without the tenant ever noticing. Water supply is good throughout the neighbourhood; pipe networks here are better maintained than in older quarters. The commercial strip provides genuine daily convenience: supermarkets that stock imported goods, several decent restaurants, a pharmacy open late, and service businesses — tailors, printers, logistics offices — that make daily life functional. The airport, four kilometres away, is close enough to reach in fifteen minutes even at moderate traffic.",
        bodyAr:
          "الكهرباء في الرياض الأفضل في الخرطوم وفق روايات موثوقة — يخلق الشريط التجاري للحي وكثافة الأعمال ذات مولداتها الخاصة مرونة شبكية غير رسمية تفيد الجيران السكنيين. في مجمعات الفيلات، استثمر كثير من الملاك في مولدات عالية الطاقة تغطي الانقطاعات دون أن يلحظ المستأجر ذلك. إمداد المياه جيد في أرجاء الحي؛ شبكات الأنابيب هنا أفضل صيانةً من الأحياء القديمة. يوفر الشريط التجاري راحة يومية حقيقية: سوبرماركت يخزّن سلعاً مستوردة، وعدة مطاعم محترمة، وصيدلية تعمل حتى الليل، وأعمال خدمية — خياطون وطابعات ومكاتب لوجستية — تجعل الحياة اليومية وظيفية. المطار على بُعد أربعة كيلومترات، قريب بما يكفي للوصول إليه في خمس عشرة دقيقة حتى في ازدحام معتدل.",
      },
      {
        titleEn: "What to know before renting",
        titleAr: "ما يجب معرفته قبل الاستئجار",
        bodyEn:
          "Riyadh is Khartoum's most transparent rental market: written leases are the norm, USD pricing is standard for quality units, and agents who work this area tend to be more professionally oriented than the city average. The premium over comparable Khartoum 2 stock is real — expect to pay $100–200 more per month for equivalent space — and for many families the payoff is the commercial access and social environment. One practical note: the restaurant strip creates noise on weekends and evenings that extends into some of the closer residential blocks; visit on a Thursday or Friday evening to calibrate. If you are negotiating a long lease, ask specifically about service charges — some buildings levy monthly fees for security, cleaning, and generator fuel that are not always disclosed upfront.",
        bodyAr:
          "الرياض هو أكثر أسواق الإيجار في الخرطوم شفافية: عقود الإيجار المكتوبة هي القاعدة، والتسعير بالدولار معيار للوحدات الجيدة، والوسطاء العاملون في هذه المنطقة أكثر احترافاً من متوسط المدينة. العلاوة على مخزون الخرطوم ٢ المماثل حقيقية — توقع دفع ١٠٠–٢٠٠ دولار أكثر شهرياً للمساحة المعادلة — ولكثير من العائلات العائد هو الوصول التجاري والبيئة الاجتماعية. ملاحظة عملية: يخلق شريط المطاعم ضجيجاً في عطلات نهاية الأسبوع والأمسيات يمتد إلى بعض المباني السكنية الأقرب؛ قم بزيارة مساء الخميس أو الجمعة للمعايرة. إن كنت تتفاوض على عقد طويل، اسأل تحديداً عن رسوم الخدمات — بعض المباني تفرض رسوماً شهرية للأمن والنظافة ووقود المولد لا تُكشف دائماً مسبقاً.",
      },
    ],
    vitals: {
      typicalRentEn: "$800–1,800/mo for a 2BR apartment",
      typicalRentAr: "٨٠٠–١٨٠٠ دولار/شهر لشقة غرفتين",
      powerReliability: "Excellent",
      waterReliability: "Good",
      diasporaFavored: true,
      nearestAirportKm: 4,
    },
  },
  {
    slug: "bahri-kafouri",
    nameEn: "Bahri Kafouri",
    nameAr: "بحري كفوري",
    state: "khartoum",
    heroImage:
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1600&auto=format&fit=crop",
    introEn:
      "Kafouri sits on the eastern flank of Bahri — Khartoum North — in what was, until relatively recently, the city's developmental frontier. Planned residential blocks replaced farmland and open desert here in a construction wave that peaked in the 2000s and early 2010s, leaving Kafouri with a distinctly newer fabric than the older Bahri riverside neighbourhoods: wider streets, more standardised apartment blocks, and a grid that was designed rather than accumulated. The neighbourhood has become a practical choice for families who want a modern apartment at a price point below the premium Khartoum 2 and Riyadh corridors, without sacrificing the social capital of the greater Khartoum address. A growing diaspora community has begun to take notice.",
    introAr:
      "يقع كفوري على الجانب الشرقي من بحري — الخرطوم بحري — فيما كان حتى وقت قريب الحدود التنموية للمدينة. حلّت المجمعات السكنية المخططة محل الأراضي الزراعية والصحراء المفتوحة في موجة بناء بلغت ذروتها في الألفية الأولى ومطلع العشرينيات، تاركةً لكفوري نسيجاً أحدث وضوحاً من أحياء بحري الكورنيش القديمة: شوارع أوسع ومبانٍ شقق أكثر توحداً وشبكة صُمِّمت عمداً بدلاً من تراكمها عضوياً. أصبح الحي خياراً عملياً للعائلات التي تريد شقة حديثة بسعر أدنى من ممرات الخرطوم ٢ والرياض الراقية دون التضحية بالرأسمال الاجتماعي لعنوان الخرطوم الكبرى. وبدأ مجتمع مغتربين متنامٍ في الالتفات إليه.",
    sections: [
      {
        titleEn: "Who lives here",
        titleAr: "من يسكن هنا",
        bodyEn:
          "Kafouri's residential population skews young and upwardly mobile: teachers, engineers, and mid-level civil servants who bought or rented in the 2010s and have stayed as the neighbourhood matured. There is a meaningful diaspora presence — primarily Sudanese-Canadian and Sudanese-British families who found Kafouri when Khartoum 2 and Riyadh rents moved out of reach, and discovered a community that is friendly, functional, and still affordable. The neighbourhood has a particularly strong internal community culture: residents' WhatsApp groups coordinate everything from generator-sharing to collective negotiations with building management. For a family arriving without deep Khartoum roots, Kafouri's newer-neighbourhood social openness can be easier to enter than the more established social hierarchies of older quarters.",
        bodyAr:
          "يميل السكان السكنيون في كفوري إلى الشباب والطموح الاجتماعي: معلمون ومهندسون وموظفون حكوميون من المستويات المتوسطة اشتروا أو استأجروا في العشرينيات وبقوا مع نضج الحي. ثمة حضور مغترب ذو بال — في المقام الأول عائلات سودانية-كندية وسودانية-بريطانية وجدت كفوري حين ابتعدت إيجارات الخرطوم ٢ والرياض عن متناولها، واكتشفت مجتمعاً ودوداً وظيفياً ولا يزال بأسعار معقولة. يتميز الحي بثقافة مجتمع داخلي قوية بشكل خاص: مجموعات واتساب للسكان تنسّق كل شيء من تشارك المولدات إلى التفاوض الجماعي مع إدارة المبنى. للعائلة الوافدة دون جذور عميقة في الخرطوم، الانفتاح الاجتماعي لحي كفوري الأحدث يمكن أن يكون أسهل دخولاً من التراتبيات الاجتماعية الأكثر رسوخاً في الأحياء القديمة.",
      },
      {
        titleEn: "What it's like day-to-day",
        titleAr: "الحياة اليومية",
        bodyEn:
          "Power in Kafouri is good by greater Khartoum standards — the newer grid infrastructure serving this side of Bahri tends to be more reliable than the ageing systems in central Khartoum. Expect eight to twelve hours of supply on a typical day, with individual buildings varying considerably based on their own backup arrangements. Water is the honest variable: the distribution network here was extended quickly to serve a rapidly developing area and pressure can drop significantly in the summer months, particularly on upper floors. Roof-top storage tanks are not just standard — they are essential. The neighbourhood has decent ground-level retail along its main arteries: fresh produce markets, pharmacies, and several tea and food stalls that operate from early morning. The Khartoum North industrial zone nearby gives the area its working-week hum.",
        bodyAr:
          "الكهرباء في كفوري جيدة بمعايير الخرطوم الكبرى — البنية التحتية للشبكة الأحدث التي تخدم هذا الجانب من بحري تميل إلى أن تكون أكثر موثوقية من الأنظمة المتقادمة في وسط الخرطوم. توقع ثماني إلى اثنتي عشرة ساعة من الإمداد في يوم عادي مع تفاوت ملحوظ بين المباني بحسب ترتيباتها الاحتياطية الخاصة. المياه هي المتغير الصادق: شبكة التوزيع هنا امتدت بسرعة لخدمة منطقة تطورت بوتيرة سريعة ويمكن أن ينخفض الضغط بشكل ملحوظ في أشهر الصيف، لا سيما في الطوابق العليا. خزانات التخزين على الأسطح ليست معيارية فحسب — بل ضرورة. يمتلك الحي تجزئة جيدة على مستوى الشارع على طول شرايينه الرئيسية: أسواق منتجات طازجة وصيدليات وعدة أكشاك للشاي والطعام تعمل من الصباح الباكر. المنطقة الصناعية للخرطوم بحري القريبة تمنح المنطقة ضجّتها أيام أسبوع العمل.",
      },
      {
        titleEn: "What to know before renting",
        titleAr: "ما يجب معرفته قبل الاستئجار",
        bodyEn:
          "Kafouri's rental market is more formalised than older Bahri neighbourhoods — written leases and agent networks have become standard as the neighbourhood gentrified. Pricing is primarily in SDG, though diaspora tenants will often find landlords willing to negotiate USD terms. The fourteen-kilometre distance to Khartoum International Airport is the neighbourhood's most commonly cited drawback for frequent flyers; at peak traffic, the journey via the ring road can take forty-five minutes. Diaspora families who have been here consistently report that the neighbourhood's value-for-space ratio is the best in greater Khartoum: a three-bedroom apartment at $400–900 per month delivers a quality and modernity that comparably-priced units in older central Khartoum quarters do not. Check the building's water arrangements carefully before signing; pump and tank maintenance varies significantly between buildings.",
        bodyAr:
          "سوق الإيجار في كفوري أكثر رسوخاً من أحياء بحري القديمة — عقود الإيجار المكتوبة وشبكات الوسطاء باتت معيارية مع رقي الحي. التسعير بالجنيه السوداني في المقام الأول، وإن كان المستأجرون المغتربون سيجدون في الغالب ملاكاً مستعدين للتفاوض بشروط الدولار. المسافة الأربعة عشر كيلومتراً إلى مطار الخرطوم الدولي هي أكثر ما يُذكر كعيب للحي للمسافرين المتكررين؛ في ذروة الازدحام، يمكن أن تستغرق الرحلة عبر الطريق الدائري خمساً وأربعين دقيقة. العائلات المغتربة التي أقامت هنا باستمرار تُفيد بأن نسبة القيمة مقابل المساحة في الحي هي الأفضل في الخرطوم الكبرى: شقة بثلاث غرف بين ٤٠٠ و٩٠٠ دولار شهرياً توفر جودة وحداثة لا توفرهما وحدات مماثلة السعر في أحياء وسط الخرطوم القديمة. تحقق بعناية من ترتيبات المياه في المبنى قبل التوقيع؛ صيانة المضخة والخزان تتفاوت تفاوتاً كبيراً بين المباني.",
      },
    ],
    vitals: {
      typicalRentEn: "$400–900/mo for a 3BR apartment",
      typicalRentAr: "٤٠٠–٩٠٠ دولار/شهر لشقة ثلاث غرف",
      powerReliability: "Good",
      waterReliability: "Variable",
      diasporaFavored: true,
      nearestAirportKm: 14,
    },
  },
  {
    slug: "atbara",
    nameEn: "Atbara",
    nameAr: "عطبرة",
    state: "river_nile",
    heroImage:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&auto=format&fit=crop",
    introEn:
      "Atbara is Sudan's railway city — a fact that shaped everything from its grid plan to its social character to its rental market. The city grew at the junction of the Nile and the Atbara River specifically because the British colonial administration chose this point to base the Sudan Railways workshop in 1906, and for a century the locomotive repair sheds, the railway hospital, and the engineers' quarters defined urban life here. Today those sheds are quieter than they were, but the culture they created persists: Atbara is a city of skilled workers, practical people, and an educated workforce of engineers and teachers who have kept the city's institutions — its hospital, its schools, its technical college — running through decades of political turbulence. For families connected to River Nile State or northern Sudan, Atbara offers a functional, affordable, and surprisingly dignified city life.",
    introAr:
      "عطبرة هي مدينة السكك الحديدية في السودان — حقيقة شكّلت كل شيء من تخطيطها الشبكي إلى طابعها الاجتماعي وسوق إيجارها. نمت المدينة عند ملتقى النيل ونهر عطبرة تحديداً لأن الإدارة الاستعمارية البريطانية اختارت هذه النقطة لتأسيس ورش السكك الحديدية السودانية عام ١٩٠٦، وطوال قرن من الزمن كانت أسطح إصلاح القاطرات ومستشفى السكك الحديدية وأحياء المهندسين تُحدِّد الحياة الحضرية هنا. اليوم تلك الأسطح أهدأ مما كانت عليه، لكن الثقافة التي أوجدتها باقية: عطبرة مدينة عمال مهرة وناس عمليين وقوى عاملة متعلمة من المهندسين والمعلمين حافظوا على مؤسسات المدينة — مستشفاها ومدارسها وكليتها التقنية — طوال عقود من الاضطراب السياسي. للعائلات المرتبطة بولاية نهر النيل أو شمال السودان، تقدم عطبرة حياة مدينة وظيفية ميسورة التكلفة وذات كرامة مفاجئة.",
    sections: [
      {
        titleEn: "Who lives here",
        titleAr: "من يسكن هنا",
        bodyEn:
          "Atbara's population is more occupationally homogenous than most Sudanese cities — engineers, railway and infrastructure technicians, hospital workers, and teachers make up the backbone of permanent residents. The university and technical institute draw a transient student population that keeps the rental market for smaller units active. Demand from the public sector is consistent and relatively recession-resistant: government-posted employees rotate through on two to three-year assignments, always needing accommodation. There is no significant diaspora-returnee community in Atbara in the way Khartoum or Port Sudan have — the city does not pull people back in the same way — but it does attract specialists who are posted here for infrastructure and railway rehabilitation projects, creating a secondary demand layer for furnished units.",
        bodyAr:
          "سكان عطبرة أكثر تجانساً مهنياً من معظم المدن السودانية — المهندسون وفنيو السكك الحديدية والبنية التحتية والعمال الصحيون والمعلمون يشكلون عمود فقرات السكان الدائمين. الجامعة والمعهد التقني يجلبان طلاباً متغيرين يُبقيان سوق الإيجار للوحدات الصغيرة نشطاً. الطلب من القطاع العام ثابت ومقاوم للركود نسبياً: موظفو الحكومة المُكلَّفون يتداولون في مهام مدتها سنتان إلى ثلاث، ويحتاجون دائماً إلى مسكن. لا يوجد مجتمع مغتربين عائدين ذو شأن في عطبرة بالطريقة التي تحظى بها الخرطوم أو بورتسودان — المدينة لا تستقطب العائدين بنفس الطريقة — لكنها تستقطب متخصصين مُكلَّفين هنا لمشاريع إعادة تأهيل البنية التحتية والسكك الحديدية، مما يخلق طبقة طلب ثانوية للوحدات المفروشة.",
      },
      {
        titleEn: "What it's like day-to-day",
        titleAr: "الحياة اليومية",
        bodyEn:
          "Power in Atbara is variable and tied to the national grid's reliability in River Nile State, which experiences cuts that pattern differently from Khartoum — longer in summer when air-conditioning load on the northern grid peaks, shorter in winter. Generator culture is present but not universal; many households manage with solar charging for lights and phone power. Water supply is generally good — the Nile is close, the city's water infrastructure was built by engineers and has been maintained with an engineer's care. The central souq is compact but well-stocked for a city of this size: good produce markets, a decent pharmacy row, and the railway workers' cooperative shops that have been there since the colonial era and still run. The Atbara-Nile confluence, a fifteen-minute walk from the city center, is one of northern Sudan's more underrated natural vantage points.",
        bodyAr:
          "الكهرباء في عطبرة متقلبة ومرتبطة بموثوقية الشبكة الوطنية في ولاية نهر النيل، التي تعاني انقطاعات تتخذ نمطاً مختلفاً عن الخرطوم — أطول في الصيف حين يبلغ حمل تكييف الهواء على شبكة الشمال ذروته، وأقصر في الشتاء. ثقافة المولدات موجودة لكنها ليست شاملة؛ كثير من الأسر تكتفي بالشحن الشمسي للإضاءة وشحن الهواتف. إمداد المياه جيد عموماً — النيل قريب، والبنية التحتية للمياه في المدينة بُنيت بأيدي مهندسين وصُونت بعناية مهندسية. السوق المركزي مدمج لكنه متنوع لمدينة بهذا الحجم: أسواق منتجات جيدة وصف صيدليات محتشم ومتاجر تعاونية لعمال السكك الحديدية موجودة منذ الحقبة الاستعمارية ولا تزال تعمل. ملتقى عطبرة والنيل على بُعد خمس عشرة دقيقة مشياً من مركز المدينة، من أكثر نقاط المشاهدة الطبيعية في شمال السودان إهمالاً رغم جمالها.",
      },
      {
        titleEn: "What to know before renting",
        titleAr: "ما يجب معرفته قبل الاستئجار",
        bodyEn:
          "Atbara's rental market is small, affordable, and almost entirely informal. A three-bedroom family home for $200–500 per month is realistic across most of the city; the upper end of that range gets you a well-maintained house in the older railway quarter, which has the most character. Pricing is in SDG; landlords here have essentially no experience with USD transactions, so diaspora renters need to manage currency conversion independently. The nearest commercial airport is over 270 kilometres away — Khartoum International — making Atbara a destination for families with genuine roots here or a specific reason to be in the city, rather than a casual relocation choice. Rail connections south to Khartoum and north toward Port Sudan, though irregular, are Atbara's transport pride; the train journey to Khartoum, when it runs, is a distinct experience and takes six to eight hours depending on connections.",
        bodyAr:
          "سوق الإيجار في عطبرة صغير وميسور التكلفة وغير رسمي بالكامل تقريباً. منزل عائلي بثلاث غرف مقابل ٢٠٠–٥٠٠ دولار شهرياً واقعي في معظم أرجاء المدينة؛ الطرف الأعلى من هذا النطاق يمنحك منزلاً جيد الصيانة في حي السكك الحديدية القديم الذي يتمتع بأكبر قدر من الطابع المميز. التسعير بالجنيه السوداني؛ لا خبرة تذكر للملاك هنا في معاملات الدولار، لذا على المستأجرين المغتربين إدارة تحويل العملة باستقلالية. أقرب مطار تجاري يبعد أكثر من ٢٧٠ كيلومتراً — مطار الخرطوم الدولي — مما يجعل عطبرة وجهة للعائلات ذات الجذور الحقيقية هنا أو سبب محدد للوجود في المدينة، لا خياراً عشوائياً لإعادة التوطن. الاتصالات السككية جنوباً إلى الخرطوم وشمالاً نحو بورتسودان، وإن كانت غير منتظمة، هي كبرياء وسائل النقل في عطبرة؛ رحلة القطار إلى الخرطوم، حين تسير، تجربة مميزة تستغرق ست إلى ثماني ساعات حسب الاتصالات.",
      },
    ],
    vitals: {
      typicalRentEn: "$200–500/mo for a 3BR home",
      typicalRentAr: "٢٠٠–٥٠٠ دولار/شهر لمنزل بثلاث غرف",
      powerReliability: "Variable",
      waterReliability: "Good",
      diasporaFavored: false,
      nearestAirportKm: 270,
    },
  },
  {
    slug: "kassala-town",
    nameEn: "Kassala Town",
    nameAr: "مدينة كسلا",
    state: "kassala",
    heroImage:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3CTdrgC2CdR16Mhg8ltaktkLuTj/hf_20260510_214752_4a1ed493-105e-4076-9d27-bba448880edd.png",
    introEn:
      "Kassala is Sudan's eastern anchor — a city of 700,000 at the foot of the Taka Mountains, whose granite domes rise with an abruptness that has made this skyline one of the most photographed in the country. The old town grew around the ruins of the Egyptian fort and the Khatmiyya sufi order's shrine, giving it a spiritual and aesthetic depth that larger Sudanese cities lack. The Gash river runs through the city seasonally, shaping the landscape and dictating the pace of agricultural life around it. Kassala's position near the Eritrean and Ethiopian borders has made it permanently cosmopolitan: Eritrean refugees, Beja traders, Tigrinya speakers, and established Sudanese families all share the same markets.",
    introAr:
      "كسلا هي المرساة الشرقية للسودان — مدينة تضم سبعمائة ألف نسمة عند سفح جبال توتا، يعلو قبابها الجرانيتية بحدّة جعلت هذا الأفق من أكثر الأفق تصويراً في البلاد. نشأت المدينة القديمة حول أطلال القلعة المصرية وضريح الطريقة الختمية الصوفية، مما يمنحها عمقاً روحياً وجمالياً تفتقر إليه المدن السودانية الأكبر. يجري نهر القاش عبر المدينة موسمياً، يُشكّل المشهد ويُحدد وتيرة الحياة الزراعية المحيطة به. موقع كسلا قرب الحدود الإريترية والإثيوبية جعلها كوسموبوليتانية بشكل دائم: لاجئون إريتريون وتجار بجاويون وناطقون بالتيغرينيا وعائلات سودانية راسخة يتشاركون جميعاً الأسواق ذاتها.",
    sections: [
      {
        titleEn: "Who lives here",
        titleAr: "من يسكن هنا",
        bodyEn:
          "Kassala's permanent population is a mix of Beja and Hadendoa families with deep eastern Sudanese roots, urban Sudanese who followed government employment to the east, and a substantial long-term displaced community from Eritrea and Ethiopia. The rental market is modest in scale but active, driven partly by government staff on posting rotations and by NGO workers supporting the regional refugee response. For diaspora families with eastern Sudan roots — Kassala, Gedaref, Red Sea — the city offers a return that feels meaningfully different from Khartoum, more connected to landscape and slower in pace.",
        bodyAr:
          "يُشكّل السكان الدائمون لكسلا مزيجاً من عائلات البجا والهدندوة ذوي الجذور العميقة في شرق السودان، وسودانيين حضريين تبعوا التوظيف الحكومي إلى الشرق، ومجتمع كبير من المهجَّرين طويلي الأمد من إريتريا وإثيوبيا. سوق الإيجار محدود الحجم لكنه نشط، يحركه جزئياً موظفو الحكومة في دورات التكليف وعمال المنظمات غير الحكومية الداعمون للاستجابة الإقليمية للاجئين. لعائلات المغتربين ذوي جذور شرق السودان — كسلا وجدارف والبحر الأحمر — تُقدم المدينة عودةً تبدو مختلفة بشكل حقيقي عن الخرطوم، أعمق ارتباطاً بالطبيعة وأهدأ إيقاعاً.",
      },
      {
        titleEn: "What it's like day-to-day",
        titleAr: "الحياة اليومية",
        bodyEn:
          "Power in Kassala is limited and unpredictable — this is the honest reality of a city far from the national grid's main generation points. Eight to sixteen hours without power per day is not unusual; households serious about comfort invest in solar panels, which have good economics in a city with this much direct sun. Water comes from the Gash basin and is generally available, though quality varies and filtration is advisable. The central market is extraordinary for fruit in season — Kassala's mangoes are considered the finest in Sudan, and the seasonal Gash flooding makes the surrounding farmland productive in ways that reach the market daily. The Taka Mountain trails are forty minutes walk from the town center.",
        bodyAr:
          "الكهرباء في كسلا محدودة وغير متوقعة — هذا هو الواقع الصادق لمدينة بعيدة عن نقاط التوليد الرئيسية في الشبكة الوطنية. ثماني إلى ست عشرة ساعة يومياً بدون تيار ليست استثنائية؛ الأسر الجادة في توفير الراحة تستثمر في الألواح الشمسية، التي لها جدوى اقتصادية جيدة في مدينة بهذا المقدار من أشعة الشمس المباشرة. تأتي المياه من حوض القاش وهي متاحة عموماً، وإن تفاوتت الجودة والتصفية موصى بها. السوق المركزي استثنائي في الفواكه الموسمية — مانجو كسلا يُعدّ الأجود في السودان، وفيضانات القاش الموسمية تجعل الأراضي الزراعية المحيطة منتجة بطريقة تصل إلى السوق يومياً. مسارات جبال توتا على بُعد أربعين دقيقة مشياً من مركز المدينة.",
      },
      {
        titleEn: "What to know before renting",
        titleAr: "ما يجب معرفته قبل الاستئجار",
        bodyEn:
          "Kassala's rental market is small enough that personal introductions are almost the only reliable path to quality housing. There are few agents and fewer formal listings. Rents are very low by national standards but quality varies considerably — older houses near the central market have character but often need work; newer construction in the outskirts is more complete but far from services. The seasonal Gash flooding is a genuine consideration: ask carefully about flood history for any ground-floor unit within 500 metres of the riverbed. If you are relocating from Khartoum or abroad, plan a two-week stay before committing to a long lease — the pace and the heat require an honest assessment.",
        bodyAr:
          "سوق الإيجار في كسلا صغير لدرجة أن التعريف الشخصي يكاد يكون المسار الموثوق الوحيد للحصول على سكن جيد. وكلاء قلائل وقوائم رسمية أقل. الإيجارات منخفضة جداً بالمقاييس الوطنية لكن الجودة تتفاوت تفاوتاً كبيراً — المنازل القديمة قرب السوق المركزي لها طابع لكنها غالباً تحتاج تجديداً؛ البناء الحديث في الأطراف أكثر اكتمالاً لكنه بعيد عن الخدمات. فيضانات القاش الموسمية اعتبار حقيقي: اسأل بعناية عن تاريخ الفيضانات لأي وحدة في الطابق الأرضي ضمن ٥٠٠ متر من مجرى النهر. إن كنت تنتقل من الخرطوم أو الخارج، خطط لإقامة أسبوعين قبل الالتزام بعقد طويل — الإيقاع والحرارة يستوجبان تقييماً صادقاً.",
      },
    ],
    vitals: {
      typicalRentEn: "$60–180/mo for a 2–3BR home",
      typicalRentAr: "٦٠–١٨٠ دولار/شهر لمنزل بغرفتين إلى ثلاث",
      powerReliability: "Limited",
      waterReliability: "Variable",
      diasporaFavored: false,
      nearestAirportKm: 5,
    },
  },
];

export function getGuideBySlug(slug: string): Guide | null {
  return guides.find((g) => g.slug === slug) ?? null;
}
