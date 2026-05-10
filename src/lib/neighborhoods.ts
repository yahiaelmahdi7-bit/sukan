// Neighborhood/city editorial blurbs for the listing detail page.
// TODO: Expand with more cities; review Arabic copy with a native speaker.

export type NeighborhoodBlurb = {
  slug: string;
  nameEn: string;
  nameAr: string;
  /** ~50–70 word editorial blurb in English */
  bodyEn: string;
  /** ~50–70 word editorial blurb in Arabic */
  bodyAr: string;
};

export const neighborhoods: Record<string, NeighborhoodBlurb> = {
  khartoum: {
    slug: "khartoum",
    nameEn: "Khartoum",
    nameAr: "الخرطوم",
    bodyEn:
      "The capital sits at the confluence of the Blue and White Niles — a landmark that shapes everything from daily commutes to land prices. Central Khartoum draws diaspora buyers for its title-deed clarity and proximity to government offices, banks, and Afra Mall. Power cuts are managed with generator-backed buildings; water pressure varies by block. Streets like Africa Road and Shambat Bridge define the neighbourhood rhythm.",
    bodyAr:
      "تقع العاصمة عند التقاء النيلين الأزرق والأبيض، وهو موقع يحكم حركة السكان وأسعار الأراضي معاً. تستقطب الخرطوم المركزية المغتربين الراغبين في صكوك واضحة وقرب من الدوائر الحكومية والبنوك وأفرا مول. انقطاع الكهرباء مألوف لكن المباني الجيدة مزودة بمولدات، وضغط المياه يتفاوت من حيّ لآخر.",
  },
  "khartoum-2": {
    slug: "khartoum-2",
    nameEn: "Khartoum 2",
    nameAr: "الخرطوم 2",
    bodyEn:
      "Khartoum 2 is a mid-tier residential district west of the airport favoured by professionals and returning diaspora. It offers decent generator coverage, decent road access, and walking distance to Afra Mall. Buildings tend to be newer than inner Khartoum, with rooftop water tanks standard. Family apartment blocks dominate; street-level shops make errands convenient.",
    bodyAr:
      "الخرطوم 2 حي سكني متوسط الرقي غرب المطار، يُقبل عليه الموظفون والمغتربون العائدون. تتوفر تغطية جيدة للمولدات وخزانات مياه على الأسطح. المباني أحدث نسبياً مقارنةً بوسط الخرطوم، والمحلات التجارية في الطابق الأرضي تُسهّل قضاء الحوائج اليومية.",
  },
  "khartoum-3": {
    slug: "khartoum-3",
    nameEn: "Khartoum 3",
    nameAr: "الخرطوم 3",
    bodyEn:
      "A dense, commercial-residential mix that functions as Khartoum's informal trading heart. Khartoum 3 suits buyers who value cheap access to wholesale markets and the central bus terminal. Residential blocks are interspersed with workshops and small factories — noise is a genuine trade-off. Water outages are more frequent here; ground-floor tanks with pumps are common.",
    bodyAr:
      "الخرطوم 3 مزيج كثيف من السكن والتجارة، وهي قلب التجارة الشعبية في العاصمة. تناسب من يريد قرباً من الأسواق بالجملة ومحطات المواصلات. الضوضاء تعويض حقيقي هنا، وانقطاع المياه أكثر تواتراً، لذا تُعدّ خزانات الطابق الأرضي والمضخات ضرورة.",
  },
  omdurman: {
    slug: "omdurman",
    nameEn: "Omdurman",
    nameAr: "أم درمان",
    bodyEn:
      "Sudan's largest city by population, Omdurman pulses with market culture — Souq Omdurman and the Saturday livestock market define its commercial life. The city's older residential belts offer spacious walled compounds at lower prices than Khartoum. Diaspora selling to invest in Khartoum drives a steady supply of family homes here. Solar adoption is noticeably higher than in central Khartoum.",
    bodyAr:
      "أم درمان أكبر مدن السودان سكاناً، وتعيش على إيقاع السوق والمنطق التجاري. توفر أحياؤها السكنية القديمة مجمعات مسوّرة فسيحة بأسعار أقل من الخرطوم. كثير من المغتربين يبيعون هنا ليستثمروا في الخرطوم، مما يُتيح عرضاً مستمراً من المنازل العائلية. استخدام الطاقة الشمسية أوسع انتشاراً هنا مقارنةً بوسط الخرطوم.",
  },
  bahri: {
    slug: "bahri",
    nameEn: "Khartoum Bahri (North)",
    nameAr: "الخرطوم بحري",
    bodyEn:
      "Bahri sits on the east bank of the Nile opposite Omdurman, giving riverside apartments genuine water views from their balconies. Al-Halfaya is its premier sub-district — tree-lined, relatively quiet, and popular with families. Industrial areas to the north create noise but also employment. The Shambat Bridge route links Bahri to central Khartoum in 10–15 minutes during off-peak hours.",
    bodyAr:
      "تقع بحري على الضفة الشرقية للنيل مقابل أم درمان، مما يمنح شقق الواجهة النهرية إطلالات حقيقية. حي الحلفايا هو الأرقى فيها، هادئ نسبياً وتحيط به الأشجار، ومحبوب لدى العائلات. المناطق الصناعية شمالاً تجلب ضجيجاً لكنها أيضاً مصدر توظيف. جسر شمبات يربط بحري بوسط الخرطوم في 10–15 دقيقة خارج ذروة الازدحام.",
  },
  "port-sudan": {
    slug: "port-sudan",
    nameEn: "Port Sudan",
    nameAr: "بورتسودان",
    bodyEn:
      "Sudan's only functioning seaport city carries a distinct cosmopolitan energy shaped by traders, sailors, and aid workers. Properties near Sawakin Road and the central market command a rent premium. Sea-salt air accelerates building wear — check external walls carefully. Power from the national grid is more reliable here than inland; diesel backup is still advisable. A promising HNWI corridor is emerging near the port expansion zone.",
    bodyAr:
      "بورتسودان مدينة الميناء الوحيدة العاملة في البلاد، وتتسم بطابع كوزموبوليتاني مشكّل من التجار والبحارة وموظفي المساعدات. العقارات قرب شارع سواكن والسوق المركزي تحمل علاوة إيجارية. ملوحة الهواء تُسرّع تآكل المباني — افحص الجدران الخارجية جيداً. انقطاع الكهرباء أقل من المناطق الداخلية، لكن احتياطي الديزل لا يزال مستحسناً.",
  },
  "wad-madani": {
    slug: "wad-madani",
    nameEn: "Wad Madani",
    nameAr: "ود مدني",
    bodyEn:
      "Capital of Gezira state and the agricultural heartland of Sudan, Wad Madani benefits from the Gezira irrigation scheme — groundwater is generally reliable. Traditional courtyard houses dominate the residential stock; new apartment blocks are rare. Many diaspora buyers acquire here for retirement or family use. Prices are notably lower than Khartoum, and compound plots are generously sized.",
    bodyAr:
      "عاصمة ولاية الجزيرة وقلب الزراعة في السودان، تستفيد ود مدني من مشروع الجزيرة في توفر المياه الجوفية. المساكن التقليدية ذات الحوش تهيمن على المخزون السكني، والشقق الجديدة نادرة. كثير من المغتربين يشترون هنا للتقاعد أو لاستيعاب ذويهم. الأسعار أقل بكثير من الخرطوم والمساحات أكثر كرماً.",
  },
  kassala: {
    slug: "kassala",
    nameEn: "Kassala",
    nameAr: "كسلا",
    bodyEn:
      "Kassala is defined by its dramatic Taka mountain backdrop and its position as a regional trading gateway to Eritrea and Ethiopia. The city's diverse Beja, Rashaida, and Sudanese mix gives it a market energy unlike anywhere else in Sudan. Water pressure is inconsistent; most residences rely on rooftop tanks. The university quarter offers cheaper rentals suited to students and researchers.",
    bodyAr:
      "كسلا تُعرَّف بخلفيتها الجبلية الدراماتيكية ودورها كبوابة تجارية إقليمية نحو إريتريا وإثيوبيا. يمنحها مزيجها السكاني من البجا والرشايدة والسودانيين طاقةً سوقية فريدة. ضغط المياه غير منتظم ومعظم المساكن تعتمد على خزانات السطح. الحي الجامعي يوفر إيجارات أرخص تناسب الطلاب والباحثين.",
  },
  nyala: {
    slug: "nyala",
    nameEn: "Nyala",
    nameAr: "نيالا",
    bodyEn:
      "The commercial hub of South Darfur, Nyala moves at a merchant's pace — its markets supply goods across the wider Darfur region. Residential properties in Al-Wahda and nearby districts are spacious by Sudanese standards, with mature garden trees common. Solar uptake is high given erratic grid power. Family compounds with detached guest units are a distinctive feature of Nyala real estate.",
    bodyAr:
      "نيالا المحور التجاري لجنوب دارفور وأسواقها تُمد المنطقة الأوسع. العقارات السكنية في حي الوحدة والمناطق المجاورة فسيحة بمقاييس سودانية وكثيراً ما تزخر بأشجار الحدائق. الطاقة الشمسية واسعة الانتشار جراء تذبذب شبكة الكهرباء. المجمعات العائلية ذات وحدات الضيوف المنفصلة سمة مميزة في سوق العقارات هنا.",
  },
  "el-fasher": {
    slug: "el-fasher",
    nameEn: "El-Fasher",
    nameAr: "الفاشر",
    bodyEn:
      "Capital of North Darfur and one of Sudan's oldest cities, El-Fasher has a compact urban core where residential and commercial uses blend closely. Many sellers are families relocating to Khartoum, creating a buyer's market for walled compounds. Water is sourced mainly from tanker deliveries and ground wells. Solar panels are near-universal among owner-occupied homes.",
    bodyAr:
      "عاصمة شمال دارفور وإحدى أعرق مدن السودان، الفاشر بها نواة حضرية مدمجة تمتزج فيها السكن والتجارة. كثير من البائعين عائلات تنتقل إلى الخرطوم مما يُتيح سوقاً مناسباً للمشتري من حيث المجمعات المسوّرة. المياه تُوزَّع بالصهاريج والآبار الجوفية، والألواح الشمسية شبه عالمية في المنازل المملوكة.",
  },
  "el-obeid": {
    slug: "el-obeid",
    nameEn: "El-Obeid",
    nameAr: "الأبيض",
    bodyEn:
      "Gum arabic capital of the world and trading centre of North Kordofan, El-Obeid has a self-sufficient commercial energy that insulates it from Khartoum's volatility. Large family compounds with mature hosh trees are the norm. Groundwater is fairly accessible; generator-ready wiring is standard in most post-2010 builds. A steady diaspora remittance flow keeps the residential market surprisingly liquid.",
    bodyAr:
      "عاصمة الصمغ العربي عالمياً ومركز تجارة شمال كردفان، الأبيض بطاقة تجارية مكتفية ذاتياً تُخففها من تقلبات الخرطوم. المجمعات العائلية الكبيرة ذات أشجار الحوش هي القاعدة. المياه الجوفية متاحة نسبياً وأسلاك المولد معيارية في معظم المباني المشيدة بعد 2010. تدفق التحويلات من المغتربين يُبقي سوق السكن نشيطاً بشكل لافت.",
  },
  kosti: {
    slug: "kosti",
    nameEn: "Kosti",
    nameAr: "كوستي",
    bodyEn:
      "A Nile River crossing point in White Nile state, Kosti's real estate market is shaped by its role as a transit hub for south–north trade. Riverside flats with Nile views carry a modest premium. The town is compact and walkable; power from the White Nile scheme can be more consistent than Khartoum during peak seasons. Prices are among the lowest of any state capital.",
    bodyAr:
      "كوستي نقطة عبور على النيل في ولاية النيل الأبيض، وسوق عقاراتها يتشكّل من دورها محطةً ترانزيت للتجارة بين الجنوب والشمال. الشقق المطلة على النيل تحمل علاوة بسيطة. المدينة مضغوطة ويسهل التنقل فيها سيراً. كهرباء مشروع النيل الأبيض قد تكون أكثر انتظاماً من الخرطوم في مواسم الذروة. الأسعار من بين الأدنى بين عواصم الولايات.",
  },
};

/**
 * Tolerant lookup: lowercase, replace spaces with hyphens.
 * Falls back to the city portion before the first hyphen (e.g. "khartoum-north" → "khartoum").
 */
export function getNeighborhoodBlurb(cityOrSlug: string): NeighborhoodBlurb | null {
  if (!cityOrSlug) return null;

  const normalise = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "-");
  const key = normalise(cityOrSlug);

  if (neighborhoods[key]) return neighborhoods[key];

  // Try stripping trailing qualifier (e.g. "khartoum-north" → "khartoum")
  const base = key.split("-")[0];
  if (neighborhoods[base]) return neighborhoods[base];

  // Try matching against nameEn / nameAr (case-insensitive)
  const lower = key.replace(/-/g, " ");
  for (const blurb of Object.values(neighborhoods)) {
    if (
      blurb.nameEn.toLowerCase() === lower ||
      blurb.nameAr === cityOrSlug.trim()
    ) {
      return blurb;
    }
  }

  return null;
}
