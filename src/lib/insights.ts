export type Insight = {
  slug: string;
  titleEn: string;
  titleAr: string;
  publishedAt: string;
  authorEn: string;
  authorAr: string;
  excerptEn: string;
  excerptAr: string;
  heroImage: string;
  bodyEn: string;
  bodyAr: string;
  category: "Market" | "Diaspora" | "Neighborhoods" | "Policy";
};

export const insights: Insight[] = [
  {
    slug: "khartoum-rental-market-q1-2026",
    titleEn: "Khartoum rental market Q1 2026: where prices are climbing",
    titleAr: "سوق الإيجار في الخرطوم — الربع الأول من ٢٠٢٦: أين ترتفع الأسعار",
    publishedAt: "2026-04-08",
    authorEn: "Sukan Editorial",
    authorAr: "تحرير سُكَن",
    excerptEn:
      "Diaspora demand, power-reliability premiums, and the USD-SDG divide are reshaping Khartoum's rental market in patterns that are becoming predictable — and navigable.",
    excerptAr:
      "يُعيد طلب المغتربين وعلاوات موثوقية الكهرباء والهوة بين الدولار والجنيه تشكيل سوق الإيجار في الخرطوم وفق أنماط باتت قابلة للتنبؤ والتعامل.",
    heroImage:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&auto=format&fit=crop",
    category: "Market",
    bodyEn: `The first quarter of 2026 has confirmed a trend that Khartoum landlords felt clearly in 2025 and tenants are now feeling in their wallets: rents in the city's upper-tier neighbourhoods are rising faster than general inflation, while mid-market areas are holding or softening.

**The diaspora premium is real — and growing**

The most significant structural shift is the emergence of a two-track market: one priced in USD for returning diaspora and international tenants, another in SDG for domestic renters. In Khartoum 2 and Amarat, landlords with well-maintained villas and apartments are increasingly advertising in USD and accepting only USD-denominated payments. This is not purely opportunism — the currency-depreciation risk is real, and a landlord collecting SDG rent on a USD mortgage or renovation loan is taking on genuine financial exposure.

The practical effect for a diaspora family returning from the Gulf or Europe: you will often pay 20–40% more than a locally-employed peer for the same unit, simply because the landlord categories you differently from the moment of first contact. This is worth knowing before negotiations begin.

**Power reliability has become the single biggest driver of rent differential**

Buildings with reliable generator backup — the kind that kicks in within thirty seconds and runs twelve-hour shifts without rationing — now command a significant premium above comparable generator-free stock. In Khartoum 2, the spread between a villa with full generator coverage and an equivalent villa without it has reached $150–200 per month. This is a rational market response to a real cost: running a private generator consumes 8–12 litres of diesel per day, which at current prices means $5–8 per day or $150–240 monthly, a cost the landlord is effectively absorbing into rent.

For tenants, the calculus is straightforward: pay the generator premium upfront in rent, or pay the equivalent in private diesel costs, heat stress, and disrupted sleep. Most families do the math and pay the premium.

**Where prices are still moving**

*Khartoum 2* continues to be the city's strongest performer. Q1 2026 saw median asking rents for two-bedroom apartments rise approximately 18% year-on-year in USD terms. The neighbourhood absorbed a second wave of displacement-linked demand in late 2025 as some families who had relocated to Port Sudan began to move back. Vacancy rates are tight.

*Khartoum Amarat* saw a more modest 10–12% rise, driven by commercial activity rather than diaspora demand. The neighbourhood's mix of residential and office use makes it resilient; when the city economy moves, Amarat moves with it.

*Khartoum 3* is the outlier: prices softened 5–8% in SDG terms, partly because of additional supply from newer blocks completed in 2024–2025, partly because the neighbourhood's domestic-renter base is more price-sensitive and less willing to absorb increases during a difficult economic period. For the budget-conscious tenant, Khartoum 3 remains the most rational choice.

**The USD-SDG arbitrage problem**

One pattern worth watching: the spread between official and parallel-market exchange rates creates opportunities for some actors to price in one currency while accepting the other at a rate advantageous to themselves. A landlord who quotes $500 but is willing to accept SDG at a rate 15% below the current parallel rate is effectively charging you $575. Always clarify at the start of a negotiation: which currency, and which exchange rate, on which date.

**What to expect in Q2–Q3 2026**

The structural forces driving Khartoum 2 and Amarat prices upward — diaspora demand, power-premium, generator-equipped supply constraint — show no signs of reversal. If anything, the anticipated arrival of additional diaspora families before the Eid season will add to Q2 pressure. Tenants who can commit for twelve months will find better rates than those seeking six-month flexibility. Landlords are rational about this: a twelve-month committed tenant at $450 is more valuable than a six-month tenant at $550.`,
    bodyAr: `أكد الربع الأول من عام ٢٠٢٦ توجهاً شعر به ملاك الخرطوم بوضوح في ٢٠٢٥ ويشعر به المستأجرون الآن في محافظهم: ترتفع الإيجارات في أحياء المدينة الراقية بوتيرة أسرع من التضخم العام، في حين تتماسك الأسواق المتوسطة أو تنكمش.

**علاوة المغتربين حقيقية — وفي ازدياد**

أبرز التحولات الهيكلية هو ظهور سوق ذي مسارين: واحد مسعَّر بالدولار للمغتربين العائدين والمستأجرين الدوليين، وآخر بالجنيه السوداني للمستأجرين المحليين. في الخرطوم ٢ والعمارات، يُعلن الملاك أصحاب الفيلات والشقق الجيدة الصيانة عن أسعارهم بالدولار ويقبلون المدفوعات بالدولار فحسب. هذا ليس انتهازاً صرفاً — مخاطر انخفاض قيمة العملة حقيقية، والمالك الذي يجمع إيجاراً بالجنيه على قرض عقاري أو قرض تجديد بالدولار يتحمل مخاطرة مالية حقيقية.

الأثر العملي على عائلة مغتربة عائدة من الخليج أو أوروبا: ستدفع في الغالب ٢٠–٤٠٪ أكثر من نظيرك الموظف محلياً للوحدة ذاتها، ببساطة لأن المالك يُصنّفك بشكل مختلف منذ لحظة التواصل الأولى. يستحق هذا الأمر المعرفة قبل بدء المفاوضات.

**موثوقية الكهرباء باتت المحرك الأكبر لفوارق الإيجار**

المباني ذات النسخ الاحتياطي الموثوق من المولدات — النوع الذي يعمل خلال ثلاثين ثانية ويشتغل اثنتي عشرة ساعة دون تقنين — تجني الآن علاوة ملحوظة فوق الأسهم المماثلة الخالية من المولدات. في الخرطوم ٢، وصل الفارق بين فيلا مكتملة التغطية بالمولد وفيلا مماثلة دونها إلى ١٥٠–٢٠٠ دولار شهرياً. هذا استجابة سوقية عقلانية لتكلفة حقيقية: تشغيل مولد خاص يستهلك ٨–١٢ لتراً من الديزل يومياً، وبالأسعار الحالية يعني ذلك ٥–٨ دولارات يومياً أو ١٥٠–٢٤٠ دولاراً شهرياً، تكلفة يستوعبها المالك فعلياً في الإيجار.

للمستأجر الحساب بسيط: ادفع علاوة المولد مقدماً في الإيجار، أو ادفع ما يعادلها في تكاليف الديزل الخاصة وضغط الحرارة ومقاطعة النوم. تُجري معظم العائلات الحساب وتدفع العلاوة.

**أين لا تزال الأسعار تتحرك**

*الخرطوم ٢* تواصل قيادة السوق. شهد الربع الأول من ٢٠٢٦ ارتفاع متوسط الإيجارات المطلوبة لشقق غرفتين نحو ١٨٪ سنوياً بالدولار. استوعب الحي موجة طلب ثانية مرتبطة بالنزوح في أواخر ٢٠٢٥ إذ بدأت بعض العائلات التي انتقلت إلى بورتسودان العودة. معدلات الشواغر ضيقة.

*العمارات في الخرطوم* شهدت ارتفاعاً أكثر تواضعاً بنحو ١٠–١٢٪، تحركه النشاط التجاري لا طلب المغتربين. مزيج الاستخدام السكني والمكتبي في الحي يجعله مرناً؛ حين يتحرك اقتصاد المدينة، تتحرك العمارات معه.

*الخرطوم ٣* هي الاستثناء: انخفضت الأسعار ٥–٨٪ بالجنيه السوداني، جزئياً بسبب عرض إضافي من مباني جديدة أُكملت في ٢٠٢٤–٢٠٢٥، وجزئياً لأن قاعدة المستأجرين المحليين في الحي أكثر حساسية للسعر وأقل استعداداً لاستيعاب الزيادات في فترة اقتصادية صعبة. للمستأجر المحدود الميزانية، يبقى الخرطوم ٣ الخيار الأعقل.

**ما تتوقعه في الربعين الثاني والثالث من ٢٠٢٦**

القوى الهيكلية التي تدفع أسعار الخرطوم ٢ والعمارات للأعلى — طلب المغتربين وعلاوة الكهرباء وضيق العرض المجهّز بمولدات — لا تُظهر أي علامة تراجع. بل إن الوصول المتوقع لعائلات مغتربة إضافية قبيل موسم العيد سيُضيف ضغطاً في الربع الثاني. المستأجرون القادرون على الالتزام باثني عشر شهراً سيجدون أسعاراً أفضل من أولئك الذين يسعون لمرونة ستة أشهر. الملاك عقلانيون في هذا: مستأجر ملتزم لاثني عشر شهراً بـ٤٥٠ دولاراً أكثر قيمة من مستأجر ستة أشهر بـ٥٥٠ دولاراً.`,
  },
  {
    slug: "diaspora-buyers-guide-5-checks",
    titleEn:
      "A diaspora buyer's guide: 5 things to verify before wiring money home",
    titleAr: "دليل المغترب: ٥ أشياء تتحقق منها قبل تحويل الأموال إلى الوطن",
    publishedAt: "2026-03-15",
    authorEn: "Sukan Editorial",
    authorAr: "تحرير سُكَن",
    excerptEn:
      "Buying or renting property in Sudan from abroad is not impossible — but it requires specific verification steps that protect you in ways a verbal agreement never will.",
    excerptAr:
      "شراء أو استئجار عقار في السودان من الخارج ليس مستحيلاً — لكنه يتطلب خطوات تحقق محددة تحميك بطرق لن يحميك بها الاتفاق الشفهي أبداً.",
    heroImage:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600&auto=format&fit=crop",
    category: "Diaspora",
    bodyEn: `Every year, Sudanese diaspora families lose money — sometimes significant money — on property transactions gone wrong. A deposit wired for an apartment that was already rented to someone else. A purchase price paid for land whose title was disputed. An annual rent paid in advance for a villa that needed $10,000 in repairs the landlord had described as "cosmetic." These are not rare cases.

This guide does not exist to discourage you. Buying or renting from abroad is entirely possible and thousands of families do it successfully each year. But it requires deliberate caution in five specific areas, and those who skip steps often wish they hadn't.

**1. Verify the title deed, properly**

A seller or landlord presenting a "certificate of ownership" or a private document signed before a witness is not the same as title registered with the relevant state land registry. In Khartoum, title should be registered with the Khartoum State Land Registry (Tasjeel Al-Aradhi). In other states, the relevant authority varies. Ask explicitly: "Is this registered at [relevant registry]?" and ask for the registration number. A legitimate property will have one.

The most common fraud pattern in Sudan's property market is selling or renting property under disputed or unregistered title — where the seller or landlord has a document of some kind but it has no formal legal backing. Your recourse if this surfaces after payment is nearly zero.

**2. Use a video walkthrough, live, with someone you trust**

Never complete a transaction based on photos or pre-recorded video. Photos can be years old. Pre-recorded video can be edited or from a different property entirely.

The minimum standard for a remote transaction is a live WhatsApp video call during which the person showing the property walks from street to front door (so you see the approach, the entrance, and the street), through every room, opens every window, flushes every toilet, turns on every tap, and walks you to the fuse box to confirm generator or mains connection. This takes twenty to thirty minutes. Any landlord who refuses this level of transparency for a serious remote renter should be a dealbreaker.

Better: ask a trusted friend, family member, or a paid local verifier (not the agent) to conduct this walkthrough independently. The agent's incentive is to close the deal.

**3. Understand what escrow alternatives exist**

Sudan has no formal escrow infrastructure equivalent to what you might know from a Western market. This is the honest reality. What exists instead:

The most reliable alternative is conditional payment through a trusted mutual third party — a shared family member, an elder of both parties' community, a lawyer both parties know. The money sits with that third party and is released when conditions are met: keys handed over, inspection completed, no disputes raised within 48 hours.

Some NGO-aligned platforms are beginning to offer basic transaction verification services. These are nascent but worth seeking out.

The worst option — but the most common for diaspora transactions — is wiring the full deposit and advance rent directly to the landlord's mobile money account before any verification. If the landlord is fraudulent, you have no recourse. Wire only what you can afford to lose until keys are physically in trusted hands.

**4. Verify your agent's legitimacy**

Sudan has no formal real estate agent licensing system. Anyone can call themselves an agent. This creates a specific risk for diaspora renters who find agents through social media, WhatsApp groups, or community forums.

Before paying any agent fee: ask for their full name and national ID number. Ask for references from at least two previous clients you can contact independently — not numbers they give you, but names you can find through the community. Ask how long they have operated and in which neighbourhoods. A legitimate agent who has worked Khartoum 2 for five years will have a reputation; you can verify it.

Agent fees in Sudan are not standardised: typically one month's rent for a successful placement, split between tenant and landlord or paid by the party who engages the agent. Be suspicious of agents who demand payment before showing any properties.

**5. Get the timing of currency transfers right**

The SDG-USD exchange rate in Sudan's parallel market is not stable. A transfer of $5,000 made at the wrong moment can be worth 15% less in SDG by the time it clears through informal channels.

If you are sending money for a USD-denominated transaction, wire in USD and ensure the receiving channel (hawala or mobile money aggregator) delivers in USD or at an agreed, locked rate. Get the locked rate in writing — even a WhatsApp message that records the agreed rate is evidence.

If the transaction is SDG-denominated, convert as close to the payment date as possible. Holding SDG for weeks while paperwork is finalised exposes you to depreciation risk.

One practical approach: transfer a small verification amount first — $200–300. Confirm it arrives correctly and at what rate. Then proceed with the main transfer. The friction of this extra step is significantly less than the friction of a disputed transaction.

---

None of this is designed to make you distrust Sudan's property market categorically. Most landlords are honest. Most agents want to close deals rather than perpetrate fraud. But the verification steps above are what separate diaspora families who transact successfully from those who share cautionary stories in community forums. Do the steps. They take time. They are worth it.`,
    bodyAr: `كل عام تخسر عائلات مغتربة سودانية أموالاً — أحياناً أموالاً طائلة — في صفقات عقارية أعادت خيبة أمل. وديعة مُحوَّلة لشقة كانت مؤجرة لآخر. ثمن شراء دُفع لأرض محل نزاع في ملكيتها. إيجار سنوي دُفع مقدماً لفيلا كانت تحتاج إصلاحات بعشرة آلاف دولار وصفها المالك بـ"تجميلية". هذه ليست حالات نادرة.

هذا الدليل لا يهدف إلى تثبيطك. الشراء أو الاستئجار من الخارج ممكن تماماً وتنجح فيه آلاف العائلات كل عام. لكنه يتطلب حذراً متعمداً في خمسة مجالات محددة، ومن يتخطى الخطوات كثيراً ما يتمنى لو لم يفعل.

**١. تحقق من صك الملكية، بشكل صحيح**

بائع أو مالك يُقدم "شهادة ملكية" أو وثيقة خاصة موقّعة أمام شاهد لا يعادل ملكية مسجلة في سجل الأراضي المعني بالولاية. في الخرطوم، يجب أن يكون الصك مسجلاً في سجل أراضي ولاية الخرطوم (تسجيل الأراضي). في الولايات الأخرى، تتفاوت الجهة المختصة. اسأل صراحةً: "هل هذا مسجل في [السجل المختص]؟" واطلب رقم التسجيل. العقار الحقيقي سيمتلكه.

أكثر أنماط الاحتيال شيوعاً في سوق العقارات السوداني هو بيع أو تأجير عقار بموجب ملكية متنازع عليها أو غير مسجلة — حيث يمتلك البائع أو المالك وثيقة من نوع ما لكن ليس لها سند قانوني رسمي. ملجأك إن اكتشفت هذا بعد الدفع يكاد يكون معدوماً.

**٢. استخدم جولة فيديو مباشرة مع شخص تثق به**

لا تُكمل صفقة بناءً على صور أو فيديو مسجل مسبقاً. الصور قد تكون بعمر سنوات. الفيديو المسجل مسبقاً قد يكون مُحرَّراً أو من عقار مختلف كلياً.

الحد الأدنى لصفقة عن بُعد هو مكالمة فيديو واتساب مباشرة يسير فيها من يُري العقار من الشارع إلى الباب الأمامي (لترى المدخل والشارع)، ثم عبر كل غرفة، يفتح كل نافذة، يُسيل كل مرحاض، يُشغّل كل صنبور، ويُريك لوحة الكهرباء للتأكد من اتصال المولد أو الشبكة. يستغرق هذا عشرين إلى ثلاثين دقيقة. أي مالك يرفض هذا المستوى من الشفافية لمستأجر عن بُعد جاد يجب أن يكون سبباً لإلغاء الصفقة.

الأفضل: اطلب من صديق موثوق أو فرد عائلي أو متحقق محلي مدفوع (لا الوسيط) إجراء هذه الجولة باستقلالية. حافز الوسيط هو إغلاق الصفقة.

**٣. افهم البدائل المتاحة للضمان المحتجز**

لا يوجد في السودان بنية تحتية رسمية للضمان المحتجز مماثلة لما تعرفه في السوق الغربي. هذا هو الواقع الصادق. ما يوجد بدلاً منه:

البديل الأكثر موثوقية هو الدفع المشروط عبر طرف ثالث مشترك موثوق — فرد عائلي مشترك، أو شيخ مجتمع لكلا الطرفين، أو محامٍ يعرفه الطرفان. تبقى الأموال لدى هذا الطرف وتُحرَّر حين تُستوفى الشروط: تسليم المفاتيح وإتمام الفحص وعدم إثارة نزاعات خلال ٤٨ ساعة.

بعض المنصات المرتبطة بالمنظمات غير الحكومية تبدأ في تقديم خدمات تحقق أساسية من المعاملات. هذه في طور النشأة لكن يستحق البحث عنها.

أسوأ خيار — لكنه الأكثر شيوعاً في صفقات المغتربين — هو تحويل الوديعة الكاملة وإيجار الدفعة المقدمة مباشرةً لحساب محفظة نقدية المالك قبل أي تحقق. إن كان المالك محتالاً، لا ملجأ لك. حوّل فقط ما تستطيع تحمّل خسارته حتى تكون المفاتيح فعلياً في يد موثوقة.

**٤. تحقق من شرعية وسيطك**

لا يوجد في السودان نظام ترخيص رسمي للوسطاء العقاريين. أي شخص يمكنه تسمية نفسه وسيطاً. هذا يُفرز مخاطرة محددة للمستأجرين المغتربين الذين يجدون وسطاء عبر وسائل التواصل الاجتماعي أو مجموعات واتساب أو منتديات مجتمعية.

قبل دفع أي رسوم وسيط: اطلب اسمه الكامل ورقم بطاقة هويته الوطنية. اطلب مراجع من عميلين سابقين على الأقل تستطيع التواصل معهما باستقلالية — ليس أرقاماً يُعطيك إياها، بل أسماء تستطيع إيجادها عبر المجتمع. اسأل كم من الوقت عمل وفي أي أحياء. وسيط شرعي عمل في الخرطوم ٢ لخمس سنوات سيكون له سمعة يمكن التحقق منها.

رسوم الوسيط في السودان غير معيارية: عادةً شهر إيجار لعملية ناجحة، موزعة بين المستأجر والمالك أو يدفعها الطرف الذي يستعين بالوسيط. احذر من الوسطاء الذين يطالبون بالدفع قبل عرض أي عقارات.

**٥. اضبط توقيت تحويلات العملة بدقة**

سعر صرف الجنيه السوداني مقابل الدولار في السوق الموازية ليس مستقراً. تحويل ٥٠٠٠ دولار في اللحظة الخطأ قد يساوي ١٥٪ أقل بالجنيه حين يصل عبر القنوات غير الرسمية.

إن كنت ترسل مالاً لصفقة مسعَّرة بالدولار، حوّل بالدولار وتأكد أن قناة الاستلام (حوالة أو مجمّع نقدي متنقل) تُسلّم بالدولار أو بسعر متفق ومثبّت. احصل على السعر المثبّت كتابةً — حتى رسالة واتساب تُسجّل السعر المتفق عليه تُعدّ دليلاً.

إن كانت الصفقة بالجنيه السوداني، حوّل أقرب ما يمكن من موعد الدفع. الاحتفاظ بالجنيه لأسابيع ريثما تُكتمل الأوراق يُعرّضك لمخاطر الانخفاض.

نهج عملي واحد: حوّل أولاً مبلغاً صغيراً للتحقق — ٢٠٠–٣٠٠ دولار. تأكد من وصوله بالشكل الصحيح وبأي سعر. ثم تابع التحويل الرئيسي. احتكاك هذه الخطوة الإضافية أقل بكثير من احتكاك صفقة متنازع عليها.`,
  },
  {
    slug: "bahri-vs-omdurman-which-side-of-the-river",
    titleEn: "Bahri vs Omdurman: which side of the river fits your family?",
    titleAr: "بحري أم أم درمان: أي ضفتَي النهر تناسب عائلتك؟",
    publishedAt: "2026-02-20",
    authorEn: "Sukan Editorial",
    authorAr: "تحرير سُكَن",
    excerptEn:
      "Two cities, one river. The choice between Bahri and Omdurman is not just about geography — it is about pace, roots, and what kind of Khartoum life you want.",
    excerptAr:
      "مدينتان ونهر واحد. الاختيار بين بحري وأم درمان ليس عن الجغرافيا فحسب — بل عن الإيقاع والجذور ونوعية حياة الخرطوم التي تريدها.",
    heroImage:
      "https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?w=1600&auto=format&fit=crop",
    category: "Neighborhoods",
    bodyEn: `Khartoum's metropolitan area is built on the confluence of two Niles, and the city that grew around that meeting point is really three cities: Khartoum proper on the south bank of the Blue Nile, Bahri on the north bank, and Omdurman to the west across the White Nile. For a family relocating or returning, the choice between Bahri and Omdurman is among the most consequential they will make — and it is not primarily a question of price or availability, but of character.

**The character of each side**

Bahri is a port city grafted onto a residential suburb. Its dominant industries have always been manufacturing, logistics, and the trade that flows through its industrial zones along the north bank. The residential areas — Al-Halfaya, Al-Sahafa, Al-Kalakin — are quieter than their industrial neighbours, predominantly family compounds with Nile views that make the commute into central Khartoum feel worthwhile. Bahri has always had a slightly hardworking, practical character: people who live here often work with their hands, in industry, in the port, in the large commercial concerns that have operated from this side of the river for generations.

Omdurman is something older and more layered. It was the Mahdist capital in the 1880s, the largest city in sub-Saharan Africa at one point, and its street grid and neighbourhood names still carry the marks of that history. The souq — the large central market that stretches across several blocks — is one of the great commercial experiences in Sudan, a place where you can find Tuareg silver alongside Chinese electronics alongside fresh dates from the Northern State. The pace of Omdurman is slower than Khartoum's but the social density is higher: neighbours know each other's affairs, community obligations are real, the mosque attendance on Fridays is high. For families with roots in western or northern Sudan, Omdurman often feels like the natural return.

**Schools, markets, and daily movement**

Schools: both Bahri and Omdurman have adequate public schooling, but if your priority is the private and international school corridor, neither side competes with the strip running through Khartoum 2, Amarat, and Riyadh. If public schools are acceptable, Omdurman has a broader distribution of quality neighbourhood schools — some of the older ones, particularly near the university area, have maintained reasonable standards. Bahri's schools are adequate but the best options require a drive.

Markets: Omdurman wins decisively. The central souq operates at a scale and variety that nothing in Bahri matches. Fresh produce arrives daily from the White Nile and Gezira agricultural areas. Craft and textile markets in Omdurman are genuinely excellent. Bahri has good neighbourhood-level markets — Al-Halfaya market is well-stocked — but it lacks the critical mass of Omdurman's commercial heart.

Daily movement: Bahri's bridges to central Khartoum are a morning variable. The Shambat Bridge and the new bridge over the Blue Nile carry significant traffic, and during the morning rush (07:30–09:00) the crossing can double journey times. Omdurman's connection to central Khartoum via the White Nile bridges is similarly bottlenecked, but the White Nile Bridge has more lanes and tends to flow slightly better. If your work is in central Khartoum, factor bridge crossing time honestly — it is not theoretical.

**Water and power: the honest comparison**

Water: Bahri's Nile-adjacent neighbourhoods generally have better water availability than their reputation, particularly in the newer areas where pipe networks have been upgraded. Omdurman has a more uneven water distribution network — areas closer to the White Nile tend to do better; the older interior neighbourhoods sometimes experience pressure drops in summer months when agricultural demand peaks.

Power: both Bahri and Omdurman are served by the same national grid and both experience significant cuts — expect eight to fourteen hours without power per day in residential areas on both sides. Neither has a systematic advantage. What matters more than which side of the river you are on is whether your specific building has generator backup.

**The social texture question**

This is the question that matters most for families, and it is the hardest to reduce to a checklist. Bahri has a more heterogeneous population — different backgrounds, less defined social pressure, a slightly more urban-anonymous quality. Omdurman has a more defined social fabric: there are extended family networks, community expectations, a texture of traditional Sudanese life that some families find grounding and others find constraining.

If you are returning from a decade or more in Gulf cities, Europe, or North America, Omdurman's social intensity can be a genuine adjustment. If you have roots in Omdurman and are returning to family, it will feel like coming home. If you do not have roots there, it is worth spending a week in the neighbourhood before committing — the social texture is not something you can assess from photographs.

**The verdict**

Bahri for: families who value Nile views, have connections to the north bank, can tolerate bridge commuting, and want a more practical less-prestige neighbourhood.

Omdurman (Mulazimin, Al-Morada) for: families with deep northern Sudanese roots, those who want the cultural weight of the older city, budget-conscious renters, and those who find the texture of traditional community life sustaining rather than confining.

Neither side is objectively better. They are different answers to the same question: what kind of life do you want to build in greater Khartoum?`,
    bodyAr: `المنطقة الحضرية للخرطوم مبنية على ملتقى نيلين، والمدينة التي نشأت حول هذا اللقاء هي في الحقيقة ثلاث مدن: الخرطوم ذاتها على الضفة الجنوبية للنيل الأزرق، وبحري على الضفة الشمالية، وأم درمان غرباً عبر النيل الأبيض. للعائلة التي تعيد التوطن أو العودة، الاختيار بين بحري وأم درمان من أكثر القرارات أثراً — وليس سؤال سعر أو توافر في المقام الأول، بل سؤال طابع وشخصية.

**طابع كل ضفة**

بحري مدينة ميناء مُدمجة بضاحية سكنية. صناعاتها الرئيسية كانت دائماً التصنيع والخدمات اللوجستية والتجارة المتدفقة عبر مناطقها الصناعية على الضفة الشمالية. الأحياء السكنية — الحلفاية والصحافة والكلاكلة — أهدأ من جيرانها الصناعيين، وتغلب عليها المجمعات العائلية ذات إطلالات النيل التي تجعل التنقل إلى وسط الخرطوم يستحق العناء. تحمل بحري دائماً طابعاً عملياً مجتهداً: من يسكنونها غالباً يعملون بأيديهم، في الصناعة والميناء والمشاريع التجارية الكبرى التي تعمل من هذه الضفة عبر أجيال.

أم درمان شيء أقدم وأكثر تعقيداً. كانت عاصمة المهدية في ثمانينيات القرن التاسع عشر، وأكبر مدينة في أفريقيا جنوب الصحراء في لحظة ما، ولا تزال شبكة شوارعها وأسماء أحيائها تحمل آثار ذلك التاريخ. السوق — السوق المركزي الكبير الممتد عبر عدة مبانٍ — من أروع التجارب التجارية في السودان، مكان تجد فيه الفضة الطوارقية جنباً إلى جنب مع الإلكترونيات الصينية والتمر الطازج من الولاية الشمالية. إيقاع أم درمان أهدأ من الخرطوم لكن الكثافة الاجتماعية أعلى: الجيران يعرفون شؤون بعض، والالتزامات المجتمعية حقيقية، وحضور المساجد في الجمعة مرتفع. للعائلات ذات الجذور في غرب أو شمال السودان، تبدو أم درمان في الغالب العودة الطبيعية.

**المدارس والأسواق والحركة اليومية**

المدارس: تمتلك بحري وأم درمان تعليماً حكومياً كافياً، لكن إن كانت أولويتك الممر الخاص والدولي، لا تنافس أيٌّ منهما الشريط المار عبر الخرطوم ٢ والعمارات والرياض. إن كانت المدارس الحكومية مقبولة، تمتلك أم درمان توزيعاً أوسع لمدارس الأحياء الجيدة — بعض القديمة منها، لا سيما قرب منطقة الجامعة، حافظت على معايير معقولة. مدارس بحري كافية لكن أفضل الخيارات تستلزم التنقل بالسيارة.

الأسواق: تفوز أم درمان بشكل حاسم. السوق المركزي يعمل بحجم وتنوع لا يضاهيه شيء في بحري. المنتجات الطازجة تصل يومياً من مناطق النيل الأبيض والجزيرة الزراعية. أسواق الحرف والنسيج في أم درمان ممتازة حقاً. لدى بحري أسواق محلية جيدة — سوق الحلفاية متنوع — لكنها تفتقر للكتلة الحرجة لقلب أم درمان التجاري.

الحركة اليومية: جسور بحري إلى وسط الخرطوم متغيّرة في الصباح. تحمل جسر شمبات والجسر الجديد على النيل الأزرق حركة مرور كثيفة، وفي ساعة الذروة (٧:٣٠–٩:٠٠) قد يضاعف العبور أوقات الرحلة. الارتباط بين أم درمان ووسط الخرطوم عبر جسور النيل الأبيض مشابه في الاختناق، لكن جسر النيل الأبيض أوسع مسارات ويميل للسيولة قليلاً. إن كان عملك في وسط الخرطوم، احسب وقت العبور بصدق — ليس مسألة نظرية.

**المياه والكهرباء: المقارنة الصادقة**

المياه: تتمتع أحياء بحري المطلة على النيل عموماً بتوافر مياه أفضل مما تشتهر به، لا سيما في المناطق الجديدة التي جُدِّدت فيها شبكات الأنابيب. توزيع المياه في أم درمان أكثر تفاوتاً — المناطق الأقرب للنيل الأبيض تُحسن أداءً؛ الأحياء الداخلية القديمة تعاني أحياناً من انخفاض الضغط في أشهر الصيف حين يبلغ الطلب الزراعي ذروته.

الكهرباء: كلا الجانبين يُخدَم من نفس الشبكة الوطنية وكلاهما يعاني انقطاعات كبيرة — توقع من ثماني إلى أربع عشرة ساعة يومياً بدون تيار في المناطق السكنية في كلا الجانبين. لا ميزة منهجية لأي منهما. الأهم من أي ضفة تقطن ما إذا كان مبناك المحدد لديه نسخة احتياطية من مولد.

**الحكم**

بحري لـ: العائلات التي تُقدّر إطلالات النيل، ولها روابط بالضفة الشمالية، وتتحمل التنقل عبر الجسور، وتريد حياً عملياً بلا وطأة مكانة.

أم درمان (الملازمين، المورادة) لـ: العائلات ذات الجذور السودانية الشمالية العميقة، ومن يريدون ثقل المدينة العريقة، والمستأجرين المحدودي الميزانية، ومن يجدون في نسيج حياة المجتمع التقليدي عوناً لا قيداً.

لا ضفة أفضل بشكل موضوعي. هما إجابتان مختلفتان على السؤال ذاته: ما نوع الحياة التي تريد بناءها في الخرطوم الكبرى؟`,
  },
];

export function getInsightBySlug(slug: string): Insight | null {
  return insights.find((i) => i.slug === slug) ?? null;
}
