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
  {
    slug: "verifying-sudanese-property-from-abroad",
    titleEn:
      "Verifying a Sudanese property from abroad: a 6-step checklist",
    titleAr:
      "التحقق من عقار سوداني من الخارج: قائمة مرجعية من ٦ خطوات",
    publishedAt: "2026-05-08",
    authorEn: "Sukan Editorial",
    authorAr: "تحرير سُكَن",
    excerptEn:
      "Title deed lookup, agent verification, live video walkthroughs, escrow alternatives, currency timing, and knowing when to wire versus when to hold — six practical steps that protect diaspora renters and buyers from the most common traps.",
    excerptAr:
      "البحث في صك الملكية، والتحقق من الوسيط، والجولة الفيديو المباشرة، وبدائل الضمان المحتجز، وتوقيت العملة، ومعرفة متى تُحوّل ومتى تنتظر — ست خطوات عملية تحمي المغتربين المستأجرين والمشترين من أكثر المزالق شيوعاً.",
    heroImage:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600&auto=format&fit=crop",
    category: "Diaspora",
    bodyEn: `Wiring money to Sudan for a property you have never physically inspected is, for thousands of diaspora families, an act of faith. It should not be. The risks are real and well-documented: deposits paid for apartments already occupied by someone else, purchase prices transferred for land with contested titles, annual rents paid in advance for properties with undisclosed structural problems. What follows is not a counsel of despair — most transactions conclude without incident — but a practical checklist that separates the families who transact safely from those who share cautionary stories in community forums.

**Step 1: Run the title deed through the state land registry**

The first thing to ask any seller or landlord is not the price. It is: "Can I see the registration number from the relevant state land registry?" In Khartoum, the authority is the Khartoum State Land Registry (Tasjeel Al-Aradhi). In Port Sudan, the Red Sea State equivalent. In Wad Madani, the Al-Jazirah State registry.

A legitimate registered title has a number. You or a trusted local contact can verify that number corresponds to the described property by visiting or calling the registry. A seller who offers a private "certificate of ownership" or a witnessed document but cannot produce a registry number is presenting something with no formal legal standing. Your recourse after payment in that scenario is close to zero.

The pattern to watch for: sellers who have genuinely bought or inherited property using traditional arrangements that predate formal registration — a genuine seller, a real property, and yet no registry number because the transaction was never formalised. This is common in older Omdurman and Bahri neighbourhoods. The property may be legitimate in the community's eyes, but you carry the risk of any future legal challenge. Insist on formalisation before money moves.

**Step 2: Do the live video walkthrough, properly**

Photos lie by omission. Pre-recorded video can be from a different unit entirely. The minimum standard for a remote transaction is a live WhatsApp or Zoom call during which someone with actual access to the property walks you from the street entrance through every room, opens every window, flushes every toilet, runs every tap, shows you the roof water tank, and opens the electrical panel to confirm what generator or mains supply is in place.

This takes twenty to thirty minutes and is non-negotiable for any transaction over $500. A landlord who declines this standard for a remote tenant should be disqualifying themselves from consideration.

Better than a self-guided walkthrough by the landlord or agent: arrange for an independent local verifier — a friend, family member, or paid inspection service that is not connected to the agent — to conduct the walkthrough separately. The agent's incentive is to close. Your verifier's incentive should be your accuracy.

**Step 3: Verify your agent**

Sudan has no licensing system for real estate agents. The word "agent" covers everyone from a decade-long professional with a known track record to someone who read a listing on Facebook this morning and decided to represent it. Before paying any agent fee or trusting an agent's verification of a property, establish three things: their full name and national ID number; references from at least two previous clients you can contact independently (not numbers they provide — names you find through community networks); and a coherent answer to "which neighbourhoods have you worked in and for how long?"

An agent with five years of experience in Khartoum Riyadh or Garden City will be known in that community. Verify the knowledge, not just the claim.

Agent fees in Sudan are not regulated: typically one month's rent for a successful placement, paid by the party who engaged the agent or split. Be wary of anyone who demands fees before showing any properties or providing references.

**Step 4: Understand the escrow landscape and work with what exists**

Sudan does not have formal escrow infrastructure. This is the honest starting point. The institutional gap that protects buyers and renters in regulated property markets — a neutral account that holds funds until conditions are verified — does not exist in a standardised form here.

What exists instead: conditional payment through a trusted mutual third party. The most reliable version of this is a family member trusted by both parties, or a community elder whose reputation spans both networks. Funds sit with that person and transfer when physical keys are in the renter's hands and a 48-hour inspection period has passed without dispute.

Some platforms and NGO-adjacent services are beginning to offer basic transaction facilitation. These are nascent. For now, the practical rule is: do not wire more money than you can afford to lose until a trusted person physically holds the keys on your behalf.

**Step 5: Get the currency timing right**

The SDG-USD parallel rate in Sudan is volatile. A transfer timed poorly can arrive worth 10–20% less than you planned. Several practical principles apply:

If the transaction is USD-denominated, wire in USD and specify to the receiving hawala or transfer service that delivery should be in USD or at a rate agreed and recorded in writing before the transfer. A WhatsApp confirmation of the agreed rate from the counterparty is enforceable evidence in a dispute.

If the transaction is SDG-denominated, convert as close to the payment date as possible. Do not hold SDG for weeks while paperwork concludes — depreciation in that window is a real cost.

Always do a small verification transfer first: send $200–300 and confirm it arrives correctly and at what rate before sending the main amount. The extra step costs two days. A failed large transfer costs much more.

**Step 6: Know when to wire versus when to hold**

The single most common diaspora property mistake is paying before conditions are verified. The principle: funds should move only when something tangible and verified moves in return.

Reasonable to wire: a holding deposit of one month's rent once you have completed the live video walkthrough, the title check, and the agent verification — and once a trusted local contact has physically confirmed the property exists and is vacant as described.

Not reasonable to wire: a full advance rent payment, a purchase deposit, or any amount above a nominal holding sum before keys are in trusted hands and the title has been independently verified.

The social pressure in diaspora transactions is real — landlords who say the unit will be gone tomorrow, agents who create urgency. Good properties do move quickly in markets like Khartoum 2 and Riyadh. The answer to this pressure is not to skip steps; it is to have your local verifier ready before you start looking, so the process takes days rather than weeks.

---

None of this makes Sudan's property market exceptional in its risks — every market has information asymmetries that hurt remote buyers. Sudan's version is specific and navigable once you understand it. The families who transact well are not luckier; they are more prepared.`,
    bodyAr: `تحويل الأموال إلى السودان لعقار لم تُفتّشه جسدياً قط هو، بالنسبة لآلاف العائلات المغتربة، فعل توكّل. ينبغي ألا يكون كذلك. المخاطر حقيقية وموثقة جيداً: ودائع دُفعت لشقق يسكنها أشخاص آخرون، وأسعار شراء حُوِّلت لأراضٍ متنازع على ملكيتها، وإيجارات سنوية دُفعت مقدماً لعقارات ذات مشكلات هيكلية لم تُكشف. ما يلي ليس توصية باليأس — معظم الصفقات تُتم دون حوادث — بل قائمة مرجعية عملية تُفرّق بين العائلات التي تتعامل بأمان وتلك التي تشارك قصص التحذير في منتديات المجتمع.

**الخطوة الأولى: ابحث في صك الملكية عبر سجل الأراضي الحكومي**

أول ما تسأل عنه أي بائع أو مالك ليس السعر. بل: "هل يمكنني رؤية رقم التسجيل من سجل الأراضي الحكومي المختص؟" في الخرطوم، الجهة هي سجل أراضي ولاية الخرطوم (تسجيل الأراضي). في بورتسودان، النظير في ولاية البحر الأحمر. في ودمدني، سجل أراضي ولاية الجزيرة.

الملكية المسجلة الشرعية لها رقم. يمكنك أنت أو جهة اتصال محلية موثوقة التحقق من أن الرقم يقابل العقار الموصوف بزيارة السجل أو الاتصال به. بائع يُقدم "شهادة ملكية" خاصة أو وثيقة مشهوداً عليها لكنه لا يستطيع إثبات رقم التسجيل يُقدم شيئاً لا سند قانوني رسمي له. ملجأك بعد الدفع في هذا السيناريو يكاد يكون معدوماً.

النمط الذي يجب الانتباه إليه: بائعون اشتروا أو ورثوا الملكية عبر ترتيبات تقليدية تسبق التسجيل الرسمي — بائع حقيقي وعقار حقيقي وبدون رقم سجل لأن الصفقة لم تُضفَ إليها الرسمية قط. هذا شائع في أحياء أم درمان وبحري القديمة. قد يكون العقار شرعياً في نظر المجتمع، لكنك تحمل مخاطر أي طعن قانوني مستقبلي. أصرّ على الإضفاء الرسمي قبل تحرك الأموال.

**الخطوة الثانية: أجرِ جولة الفيديو المباشرة بالشكل الصحيح**

الصور تكذب بالحذف. الفيديو المسجل مسبقاً قد يكون من وحدة مختلفة كلياً. الحد الأدنى لصفقة عن بُعد هو مكالمة واتساب أو زوم مباشرة يسير فيها شخص لديه وصول فعلي للعقار من مدخل الشارع عبر كل غرفة، يفتح كل نافذة، يُسيل كل مرحاض، يُشغّل كل صنبور، يُريك خزان المياه على السطح، ويفتح لوحة الكهرباء لتأكيد ما هو متاح من مولد أو اتصال بالشبكة.

هذا يستغرق عشرين إلى ثلاثين دقيقة وهو غير قابل للتفاوض في أي صفقة تتجاوز ٥٠٠ دولار. مالك يرفض هذا المعيار لمستأجر عن بُعد يجب أن يُستبعد من الاعتبار تلقائياً.

أفضل من جولة موجَّهة ذاتياً من المالك أو الوسيط: رتّب لمتحقق محلي مستقل — صديق أو فرد عائلي أو خدمة فحص مدفوعة غير مرتبطة بالوسيط — لإجراء الجولة بشكل منفصل. حافز الوسيط هو إغلاق الصفقة. حافز متحققك يجب أن يكون دقتك.

**الخطوة الثالثة: تحقق من وسيطك**

لا يوجد في السودان نظام ترخيص للوسطاء العقاريين. كلمة "وسيط" تشمل كل شخص من محترف ذي عشر سنوات خبرة وسجل معروف إلى شخص قرأ إعلاناً على فيسبوك هذا الصباح وقرر تمثيله. قبل دفع أي رسوم وسيط أو الوثوق بتحقق وسيط من عقار، أثبت ثلاثة أشياء: اسمه الكامل ورقم هويته الوطنية؛ مراجع من عميلين سابقين على الأقل تستطيع التواصل معهما باستقلالية (ليس أرقاماً يُعطيها — بل أسماء تجدها عبر شبكات المجتمع)؛ وإجابة متماسكة على "في أي أحياء عملت ولكم من الوقت؟"

وسيط ذو خمس سنوات خبرة في الخرطوم الرياض أو جاردن سيتي سيكون معروفاً في ذلك المجتمع. تحقق من المعرفة لا من الادعاء فحسب.

رسوم الوسيط في السودان غير منظمة: عادةً شهر إيجار لعملية ناجحة تُدفع من الطرف الذي استعان بالوسيط أو مقسّمة. احذر من أي شخص يطالب برسوم قبل عرض أي عقارات أو تقديم مراجع.

**الخطوة الرابعة: افهم مشهد الضمان المحتجز واعمل بما هو متاح**

لا يوجد في السودان بنية تحتية رسمية للضمان المحتجز. هذه نقطة البداية الصادقة. الفجوة المؤسسية التي تحمي المشترين والمستأجرين في الأسواق العقارية المنظمة — حساب محايد يحتجز الأموال حتى تُتحقق الشروط — لا وجود لها بشكل معياري هنا.

ما يوجد بدلاً منه: الدفع المشروط عبر طرف ثالث مشترك موثوق. النسخة الأكثر موثوقية هي فرد عائلي موثوق به من كلا الطرفين، أو شيخ مجتمع تمتد سمعته عبر كلا الشبكتين. تبقى الأموال لدى هذا الشخص وتُحوَّل حين تكون مفاتيح العقار في يد المستأجر وانقضت مدة فحص ٤٨ ساعة دون نزاع.

بعض المنصات والخدمات المرتبطة بالمنظمات غير الحكومية تبدأ في تقديم تيسير أساسي للمعاملات. هذه في طور النشأة. في الوقت الراهن، القاعدة العملية هي: لا تُحوّل أكثر مما تستطيع تحمّل خسارته حتى يحمل شخص موثوق المفاتيح فعلياً نيابةً عنك.

**الخطوة الخامسة: اضبط توقيت العملة بدقة**

السعر الموازي للجنيه السوداني مقابل الدولار متقلب. تحويل مُوقَّت بشكل سيئ قد يصل بقيمة أقل بـ١٠–٢٠٪ مما خططت له. تنطبق عدة مبادئ عملية:

إن كانت الصفقة مسعَّرة بالدولار، حوّل بالدولار وحدد لخدمة الحوالة أو التحويل المتلقية أن التسليم يجب أن يكون بالدولار أو بسعر متفق ومُسجَّل كتابةً قبل التحويل. تأكيد واتساب للسعر المتفق عليه من الطرف المقابل هو دليل يمكن الاحتجاج به في نزاع.

إن كانت الصفقة مسعَّرة بالجنيه السوداني، حوّل أقرب ما يمكن من موعد الدفع. لا تحتفظ بالجنيه لأسابيع ريثما تُكتمل الأوراق — الانخفاض في تلك الفترة تكلفة حقيقية.

قم دائماً بتحويل تحقق صغير أولاً: أرسل ٢٠٠–٣٠٠ دولار وتأكد من وصوله بالشكل الصحيح وبأي سعر قبل إرسال المبلغ الرئيسي. الخطوة الإضافية تكلف يومين. تحويل رئيسي فاشل يكلف أكثر بكثير.

**الخطوة السادسة: اعرف متى تُحوّل ومتى تنتظر**

أكثر أخطاء العقار لدى المغتربين شيوعاً هو الدفع قبل التحقق من الشروط. المبدأ: يجب أن تتحرك الأموال فقط حين يتحرك شيء ملموس ومتحقق في المقابل.

مقبول التحويل: وديعة حجز بشهر إيجار واحد بمجرد إتمام جولة الفيديو المباشرة والتحقق من الصك والتحقق من الوسيط — وبمجرد أن جهة اتصال محلية موثوقة أكدت جسدياً أن العقار موجود وشاغر كما وُصف.

غير مقبول التحويل: دفعة إيجار مقدمة كاملة، أو وديعة شراء، أو أي مبلغ فوق وديعة احتجاز اسمية قبل وجود المفاتيح في يد موثوقة والتحقق المستقل من الصك.

الضغط الاجتماعي في صفقات المغتربين حقيقي — ملاك يقولون إن الوحدة ستُؤخذ غداً، ووسطاء يصنعون الإلحاح. العقارات الجيدة تتحرك بسرعة في أسواق كالخرطوم ٢ والرياض. الإجابة على هذا الضغط ليست تجاوز الخطوات؛ بل أن تجهّز متحققك المحلي قبل أن تبدأ البحث، حتى تستغرق العملية أياماً لا أسابيع.

---

لا شيء من هذا يجعل السوق العقاري السوداني استثنائياً في مخاطره — كل سوق لديه تفاوتات معلومات تضر بالمشترين عن بُعد. النسخة السودانية محددة وقابلة للتنقل حين تفهمها. العائلات التي تتعامل جيداً ليست أوفر حظاً؛ هي أكثر استعداداً.`,
  },
  {
    slug: "power-water-generators-what-listings-dont-say",
    titleEn:
      "Power, water, generators: what every Sudanese landlord knows that listings don't say",
    titleAr:
      "الكهرباء والمياه والمولدات: ما يعرفه كل مالك سوداني ولا تقوله القوائم",
    publishedAt: "2026-05-04",
    authorEn: "Sukan Editorial",
    authorAr: "تحرير سُكَن",
    excerptEn:
      "An honest look at infrastructure realities across Khartoum, Bahri, and Omdurman — and how to read between the lines of what listings don't say about power and water.",
    excerptAr:
      "نظرة صادقة على واقع البنية التحتية في الخرطوم وبحري وأم درمان — وكيفية قراءة ما بين سطور ما لا تقوله قوائم العقارات عن الكهرباء والمياه.",
    heroImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&auto=format&fit=crop",
    category: "Neighborhoods",
    bodyEn: `Every property listing in Khartoum mentions the apartment's bedrooms, its floor, its distance from a main road. Almost none of them mention the thing that will shape your daily life more than any of those features: how many hours a day you will actually have electricity, whether the water pressure dies in July, and what the building's generator arrangement costs to run.

This is not dishonesty on the part of landlords and agents — it is a shared assumption that tenants already know the infrastructure realities and will ask the right questions. Most diaspora and international tenants do not know, and do not ask, and then discover the truth one humid August afternoon when the power has been out since noon and the water pressure in the fourth-floor bathroom has dropped to a trickle.

**How to read the Khartoum grid**

The national electricity grid in Khartoum is managed by the Sudan Electricity Transmission and Distribution Company. The practical experience for a tenant is determined less by which company manages the grid and more by which circuit your building sits on, and whether your landlord has invested in backup.

The grid in greater Khartoum can be thought of in rough tiers. The first tier — diplomatic zones, parts of Khartoum 2, the area around key government buildings — gets informal priority because the political cost of cutting power to embassies and senior officials is higher than the political cost of cutting power to residential neighbourhoods. Buildings in or adjacent to these zones benefit tangentially. The second tier covers the main residential and commercial corridors: Amarat, Riyadh, Khartoum 3, Garden City, Kafouri in Bahri. Here, cuts are real and daily, but they pattern somewhat predictably — often rotating by sector, with the cut cycle running four to eight hours off, eight to twelve hours on. The third tier covers older residential areas, peripheral suburbs, and anywhere the grid infrastructure is most aged: parts of Mulazimin in Omdurman, older Bahri industrial neighbourhoods, and any area where the substation is known to be overloaded.

What matters most, and what no listing tells you, is the building's position relative to these circuits — and more importantly, what backup arrangement, if any, exists.

**The generator question: what to ask and how to ask it**

Sudan's private generator market is enormous and entirely informal. Every fuel station sells diesel. Every market has generator parts. The result is that there is an enormous range in backup quality across buildings that would appear identical on a listing.

The questions to ask before signing any lease:

"Does the building have a generator?" (Yes/No — basic but worth confirming)

"How many kilowatts is it?" (A small 5kW generator powers lights and fans. A 20kW unit powers air conditioning. A building that claims "generator" without specifying capacity may be describing something that runs a single stairwell light.)

"What does it cover?" (Common areas only? Or does it extend to apartments? Which floors?)

"Who manages it and how is fuel paid for?" (Some buildings include generator fuel in the rent — ask this explicitly, because the monthly fuel cost for a building's generator running eight-hour shifts can be $200–400, and the question is who is paying it.)

"How quickly does it kick in when the power goes off?" (An automatic transfer switch cuts in within thirty seconds — you barely notice. A manual generator that requires someone to walk to a shed and pull a cord can leave you dark for thirty minutes or more.)

The most expensive buildings in Khartoum 2 and Riyadh have answered all of these questions well. Most mid-market buildings in Khartoum 3 and Bahri have answered some of them. Older stock in Omdurman has often answered none.

**Water: the forgotten variable**

The water conversation is simpler than the power conversation but equally important and equally absent from listings.

Khartoum's piped water system supplies different parts of the city from different treatment and pumping points, and the pressure varies considerably. The basic question is: does the building have a roof-top storage tank? In almost all quality apartment buildings, the answer should be yes — a tank that refills when pressure is available and releases by gravity when it is not. If the answer is no, any ground-floor pressure problem directly affects your taps.

The second question: when was the tank last cleaned? In buildings with absentee landlords or poor management, tanks are sometimes neglected for years. Algae, sediment, and occasionally rodents find their way into neglected tanks. This is not a theoretical problem — it has genuine health implications. Ask. Look if you can.

The geography of water pressure in greater Khartoum follows its own logic. Bahri's newer areas — Kafouri, the planned residential zones along the eastern ring — have pipe networks extended relatively recently and pressure can be inconsistent, particularly in summer when agricultural and industrial demand peaks in the north bank's industrial corridor. Central Khartoum's older network, paradoxically, sometimes has better consistent pressure in the zones it was designed for. Omdurman is genuinely variable: some streets near the White Nile have good pressure; older interior streets can drop to almost nothing in a dry summer peak week.

**What to do with this information**

The practical conclusion is not to avoid any neighbourhood — it is to ask specific questions before any transaction and to price what you are actually getting, not what the listing implies.

A Khartoum 2 villa at $900/month with full generator coverage, automatic transfer, and a clean rooftop tank is genuinely different from the same villa at $700/month where you supply your own generator fuel arrangement and pray the municipal water is enough. The numbers are different. The life is different. The listing will not tell you which one you are renting.

Ask. Walk in on a weekday at 2pm when the grid load is highest and see what the power situation is. Run the taps. Ask when the tank was last cleaned. Talk to a neighbour on a different floor if you can. The five minutes of due diligence has a better return than almost anything else you can do in a Sudanese property search.`,
    bodyAr: `كل قائمة عقارية في الخرطوم تذكر غرف الشقة وطابقها وبُعدها عن الشارع الرئيسي. لا تكاد أي منها تذكر الشيء الذي سيُشكّل حياتك اليومية أكثر من أي من تلك الخصائص: عدد الساعات التي ستمتلك فيها الكهرباء فعلياً كل يوم، وما إذا كان ضغط المياه يختفي في يوليو، وما الذي تكلّفه ترتيبات مولد المبنى.

هذا ليس عدم أمانة من جانب الملاك والوسطاء — بل افتراض مشترك بأن المستأجرين يعرفون بالفعل واقع البنية التحتية وسيطرحون الأسئلة الصحيحة. معظم المغتربين والمستأجرين الدوليين لا يعرفون ولا يسألون، ثم يكتشفون الحقيقة في ظهيرة أغسطس رطبة حين تكون الكهرباء منقطعة منذ الظهر وضغط المياه في حمام الطابق الرابع قد نزل إلى خيط رفيع.

**كيف تقرأ شبكة الخرطوم**

الشبكة الكهربائية الوطنية في الخرطوم يديرها معيار الكهرباء السودانية. التجربة العملية للمستأجر تتحدد بدرجة أقل من قِبَل الشركة التي تدير الشبكة وأكثر من قِبَل الدائرة التي يقع مبناك عليها، وما إذا كان مالكك قد استثمر في احتياطي.

يمكن تصور الشبكة في الخرطوم الكبرى على مستويات تقريبية. المستوى الأول — المناطق الدبلوماسية وأجزاء من الخرطوم ٢ والمناطق المحيطة بالمباني الحكومية الرئيسية — تحظى بأولوية غير رسمية لأن التكلفة السياسية لقطع الكهرباء عن السفارات وكبار المسؤولين أعلى من التكلفة السياسية لقطعها عن الأحياء السكنية. المباني الواقعة في هذه المناطق أو المجاورة لها تستفيد بالتبعية. المستوى الثاني يشمل الممرات السكنية والتجارية الرئيسية: العمارات والرياض والخرطوم ٣ وجاردن سيتي وكفوري في بحري. هنا الانقطاعات حقيقية ويومية، لكنها تأخذ نمطاً يمكن التنبؤ به نسبياً — غالباً متناوب حسب القطاع، مع دورة انقطاع من أربع إلى ثماني ساعات إيقاف وثماني إلى اثنتي عشرة ساعة تشغيل. المستوى الثالث يشمل الأحياء السكنية القديمة والضواحي الطرفية وأي منطقة تكون فيها البنية التحتية للشبكة أكثر تقادماً: أجزاء من الملازمين في أم درمان وأحياء بحري الصناعية القديمة وأي منطقة يُعرف فيها المحول الفرعي بالحمل الزائد.

الأهم، وما لا تُخبرك به أي قائمة، هو موقع المبنى بالنسبة لهذه الدوائر — والأهم من ذلك، ما هو الترتيب الاحتياطي إن وُجد.

**سؤال المولد: ماذا تسأل وكيف**

سوق المولدات الخاصة في السودان ضخم وغير رسمي بالكامل. كل محطة وقود تبيع الديزل. كل سوق فيه قطع غيار مولدات. النتيجة هي أن ثمة تفاوتاً هائلاً في جودة الاحتياطي بين المباني التي قد تبدو متطابقة في القائمة.

الأسئلة التي تطرحها قبل توقيع أي عقد إيجار:

"هل يمتلك المبنى مولداً؟" (نعم/لا — أساسي لكنه يستحق التأكيد)

"كم كيلوواطه؟" (مولد صغير بـ٥ كيلوواط يُشغّل الأنوار والمراوح. وحدة ٢٠ كيلوواط تُشغّل التكييف. مبنى يدّعي "وجود مولد" دون تحديد الطاقة قد يصف شيئاً يُشغّل ضوء درج واحد فحسب.)

"ماذا يغطي؟" (المناطق المشتركة فقط؟ أم يمتد إلى الشقق؟ أي طوابق؟)

"من يديره وكيف تُدفع تكاليف الوقود؟" (بعض المباني تشمل وقود المولد في الإيجار — اسأل هذا صراحةً، لأن تكلفة الوقود الشهرية لمولد مبنى يعمل ثماني ساعات يومياً يمكن أن تبلغ ٢٠٠–٤٠٠ دولار، والسؤال من يدفعها.)

"كم يستغرق التشغيل حين تنقطع الكهرباء؟" (مفتاح تحويل تلقائي يعمل خلال ثلاثين ثانية — لا تكاد تلاحظ. مولد يدوي يستلزم من شخص ما المشي إلى غرفة وسحب حبل قد يتركك في الظلام نصف ساعة أو أكثر.)

أغلى المباني في الخرطوم ٢ والرياض أجابت على كل هذه الأسئلة جيداً. معظم مباني السوق المتوسط في الخرطوم ٣ وبحري أجابت على بعضها. المخزون القديم في أم درمان أجاب في الغالب على لا شيء.

**المياه: المتغير المنسي**

محادثة المياه أبسط من محادثة الكهرباء لكنها بالقدر نفسه من الأهمية وبالقدر نفسه غائبة عن القوائم.

نظام المياه المنقولة في الخرطوم يُمدّ أجزاء مختلفة من المدينة من نقاط معالجة وضخ مختلفة، والضغط يتفاوت تفاوتاً كبيراً. السؤال الأساسي هو: هل يمتلك المبنى خزان تخزين على السطح؟ في تقريباً جميع مباني الشقق الجيدة الجودة، الإجابة يجب أن تكون نعم — خزان يُعاد ملؤه حين يكون الضغط متاحاً ويُطلق بالجاذبية حين لا يكون. إن كانت الإجابة لا، فأي مشكلة ضغط في الطابق الأرضي تؤثر مباشرةً على صنابيرك.

السؤال الثاني: متى نُظِّف الخزان آخر مرة؟ في المباني ذات الملاك الغائبين أو الإدارة الضعيفة، تُهمل الخزانات أحياناً لسنوات. الطحالب والرواسب وأحياناً القوارض تجد طريقها إلى الخزانات المهملة. هذه ليست مشكلة نظرية — لها تداعيات صحية حقيقية. اسأل. انظر إن استطعت.

جغرافيا ضغط المياه في الخرطوم الكبرى تتبع منطقها الخاص. مناطق بحري الأحدث — كفوري والمناطق السكنية المخططة على طول الحلقة الشرقية — شبكات أنابيبها امتدت حديثاً نسبياً والضغط يمكن أن يكون متقطعاً، لا سيما في الصيف حين يبلغ الطلب الزراعي والصناعي ذروته في الممر الصناعي للضفة الشمالية. الشبكة القديمة لوسط الخرطوم، ومفارقة، أحياناً تتمتع بضغط منتظم أفضل في المناطق التي صُمِّمت لخدمتها. أم درمان متقلبة فعلاً: بعض الشوارع القريبة من النيل الأبيض لديها ضغط جيد؛ الشوارع الداخلية القديمة يمكن أن تنخفض إلى ما لا يكاد يُذكر في ذروة صيفية جافة.

**ما تفعله بهذه المعلومات**

الاستنتاج العملي ليس تجنب أي حي — بل طرح أسئلة محددة قبل أي صفقة وتسعير ما تحصل عليه فعلاً لا ما يُضمره الإعلان.

فيلا في الخرطوم ٢ بـ٩٠٠ دولار شهرياً مع تغطية كاملة بالمولد ومفتاح تحويل تلقائي وخزان سطح نظيف مختلفة فعلاً عن الفيلا ذاتها بـ٧٠٠ دولار حيث تدبّر ترتيب وقود المولد بنفسك وتأمل أن تكفي المياه البلدية. الأرقام مختلفة. الحياة مختلفة. القائمة لن تخبرك أي الاثنتين تستأجر.

اسأل. ادخل في يوم عمل الساعة الثانية ظهراً حين يكون حمل الشبكة في أعلاه وانظر إلى وضع الكهرباء. افتح الصنابير. اسأل متى نُظِّف الخزان آخر مرة. تحدث إلى جار في طابق آخر إن استطعت. دقائق الخمس للعناية الواجبة لها عائد أفضل من تقريباً أي شيء آخر تستطيع فعله في بحث العقار السوداني.`,
  },
  {
    slug: "khartoum-vs-rest-q2-2026-rentals",
    titleEn:
      "Khartoum vs the rest: where Q2 2026 rentals are heading",
    titleAr: "الخرطوم مقابل البقية: إلى أين تتجه إيجارات الربع الثاني من ٢٠٢٦",
    publishedAt: "2026-05-10",
    authorEn: "Sukan Editorial",
    authorAr: "تحرير سُكَن",
    excerptEn:
      "A quarterly read on rental price pressure across Sudan's top five cities. Diaspora demand spikes around Eid and summer break are reshaping seasonal patterns in ways that landlords feel and tenants should understand.",
    excerptAr:
      "قراءة ربع سنوية لضغط أسعار الإيجار عبر أبرز خمس مدن سودانية. ارتفاع طلب المغتربين حول العيد والإجازة الصيفية يعيد تشكيل الأنماط الموسمية بطرق يشعر بها الملاك ويجب أن يفهمها المستأجرون.",
    heroImage:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&auto=format&fit=crop",
    category: "Market",
    bodyEn: `Sudan's property market is often described as if it were one market. It is not. It is five or six city economies operating on different cycles, different supply constraints, and fundamentally different demand drivers. What is true of Khartoum Riyadh in May 2026 tells you almost nothing about the rental dynamics in Atbara or Kassala. This quarterly read separates the five cities that matter for diaspora and returning renters and gives an honest account of where things stand as Q2 2026 opens.

**Khartoum: tight at the top, soft in the middle**

Greater Khartoum is the market that shapes all other perceptions, and the Q2 picture is consistent with the Q1 pattern: the top end is tight and moving upward, the middle is holding, and the lower end is softening.

In Khartoum 2 and Riyadh — the two neighbourhoods that absorb most diaspora demand — asking rents for two-bedroom apartments in USD continue to track upward. The combination of genuine supply constraint (very little new quality construction), rising generator investment (landlords are spending more on backup infrastructure and pricing it into rent), and accelerating diaspora demand ahead of the Eid season has produced asking rents in Khartoum 2 that are now running 20–25% above their Q2 2025 levels in USD terms.

Khartoum Garden City and Burri are showing a similar pattern, albeit off a lower base. The discovery of these neighbourhoods by diaspora families who have been priced out of Khartoum 2 is a Q1 2026 development that appears to be continuing: enquiries have risen, vacancy rates have dropped, and a handful of landlords who had not priced in USD are now doing so.

Khartoum Amarat remains the market's stable centre: rents there are rising, but more slowly, driven by commercial demand and the office-residential mix that insulates it from pure diaspora cyclicality. Khartoum 3 is the outlier — new supply, price-sensitive domestic tenants, and limited diaspora pull have kept prices flat or declining in SDG terms.

**Port Sudan: the post-2023 price plateau**

Port Sudan's rental market ran very hot in 2023 and 2024 as displacement-driven internal migration flooded the city. By Q1 2026, that surge has largely been absorbed and the market is at a plateau — prices are not falling, but the rapid escalation has stopped.

Corniche-facing apartments, which commanded a 30–50% premium at the peak of the displacement crisis, are now trading at a more sustainable 15–25% above comparable inland units. The city's permanent population has grown by an estimated 15–20% since 2022, and that structural demand supports the current price level. For diaspora families who were considering Port Sudan as an alternative to Khartoum, the window of relative value may have closed somewhat: rents are now high enough relative to the city's services and infrastructure that the calculus requires honest assessment of what you are paying for.

**Wad Madani: agricultural cycle-driven stability**

Wad Madani's rental market follows the agricultural calendar of the Gezira scheme more than it follows the Khartoum calendar. Q2 is planting preparation season in the scheme, which brings government agricultural extension workers, NGO monitors, and equipment contractors into the city temporarily — a modest seasonal bump in demand for furnished and short-let units.

Overall, Wad Madani remains the most affordable city on this list at a structural level. A family can rent a three-bedroom house in the city center for under $150 per month in SDG terms. The currency conversion challenge for diaspora renters — landlords here are SDG-only — remains the main friction point rather than the price level itself.

**Kassala: demand steady, supply thin**

Kassala's rental market is fundamentally supply-constrained rather than demand-constrained. The city has consistent demand from government-posted staff, NGO workers supporting the regional refugee response, and a steady stream of agricultural contractors and researchers. What it lacks is adequate formal rental supply: much of the city's housing is owner-occupied or informally arranged within extended family networks.

Rents in Kassala are low in absolute terms ($60–180 per month for a two to three-bedroom home) but the finding of a quality unit at those prices requires local network access that external renters simply do not have. The gap between listed and unlisted supply is larger in Kassala than in any other major Sudanese city.

**Atbara: stable and overlooked**

Atbara's rental market barely registers in national property discussions, which understates its functionality. The city has genuine steady-state demand from railway and infrastructure sector workers, teachers, and hospital staff on posting rotations. The price level ($200–500/month for a three-bedroom home) reflects the wage levels of those sectors, not any shortage of supply. The market is liquid in a quiet way: units become available, units get filled, landlords and tenants know each other or know someone who knows someone. No platform captures this market effectively.

**The Eid and summer demand spike: what to expect**

The most predictable seasonal force in Sudan's diaspora-driven rental markets is the pattern around Eid Al-Adha and the summer school holiday window, which typically sees the largest concentration of diaspora families returning or visiting. For Q2 2026, Eid Al-Adha falls in early June, and the summer holiday window for diaspora families with school-age children in Gulf countries, the UK, and Canada runs from late June through August.

The practical effect: diaspora families who have not yet secured accommodation for a summer return are now competing with each other for the remaining quality stock in Khartoum 2, Riyadh, and Garden City. Landlords in those neighbourhoods are aware of this cycle and will price for it.

The advice for families in this position is straightforward but uncomfortable: commit earlier than feels natural. A lease signed in May is cheaper than the same lease offered in June. A landlord who agrees to hold a unit for three weeks on a modest deposit in May is more likely to honour that agreement than one approached in late June when their options have improved.

Families who can commit to twelve-month leases are in a structurally stronger position than those seeking six-month or summer-only arrangements. Twelve-month tenants provide the income certainty that landlords are managing for; short-term tenants during a demand spike are a worse deal for landlords even at a higher rate. Price accordingly when negotiating.

**What the next quarter looks like**

Q3 2026 will be shaped by three forces: post-Eid supply release (some families who held units for visits will release them after summer), the northern hemisphere school return in September (which brings diaspora families back, tightening supply again briefly), and the cumulative effect of generator-infrastructure investment on the stock of quality-rated units.

The structural direction of Khartoum's top-end rental market is upward, and has been for three years. That direction is unlikely to change in the next quarter absent a significant improvement in grid reliability — which would reduce the generator premium that currently inflates rents — or a significant addition to quality supply, which the construction pipeline does not yet show.

For renters, the market is navigable with preparation. For landlords with well-maintained, generator-equipped stock in the right postcodes, it remains one of the more rational investments available in greater Khartoum.`,
    bodyAr: `كثيراً ما يُوصف سوق العقارات السوداني كما لو كان سوقاً واحداً. ليس كذلك. بل هو خمسة أو ستة اقتصادات مدنية تعمل وفق دورات مختلفة وقيود عرض مختلفة ومحركات طلب مختلفة جوهرياً. ما ينطبق على الخرطوم الرياض في مايو ٢٠٢٦ لا يُخبرك تقريباً بشيء عن ديناميكيات الإيجار في عطبرة أو كسلا. هذه القراءة الربع سنوية تُفرّق بين المدن الخمس الأهم للمغتربين والمستأجرين العائدين وتُقدم تقييماً صادقاً للوضع مع فتح الربع الثاني من ٢٠٢٦.

**الخرطوم: ضيق في القمة، ليونة في المنتصف**

الخرطوم الكبرى هي السوق الذي يُشكّل كل التصورات الأخرى، وصورة الربع الثاني تتسق مع نمط الربع الأول: القمة ضيقة وتتحرك صعوداً، والمنتصف ثابت، والطرف الأدنى يلين.

في الخرطوم ٢ والرياض — الحيّين اللذين يستوعبان معظم طلب المغتربين — تواصل الإيجارات المطلوبة للشقق ذات الغرفتين بالدولار التتبع للأعلى. مزيج القيد الحقيقي في العرض (شبه غياب لبناء جيد جديد) وارتفاع استثمار المولدات (الملاك ينفقون أكثر على البنية التحتية الاحتياطية ويُسعّرونها في الإيجار) وتسارع طلب المغتربين قبيل موسم العيد أنتج إيجارات مطلوبة في الخرطوم ٢ تعمل الآن بارتفاع ٢٠–٢٥٪ فوق مستويات الربع الثاني من ٢٠٢٥ بالدولار.

جاردن سيتي وبري في الخرطوم تُظهران نمطاً مشابهاً وإن من قاعدة أدنى. اكتشاف العائلات المغتربة لهذين الحيين بعد أن ضاق بهم الخرطوم ٢ هو تطور الربع الأول من ٢٠٢٦ الذي يبدو أنه مستمر: الاستفسارات ارتفعت ومعدلات الشواغر انخفضت وحفنة من الملاك الذين لم يُسعّروا بالدولار باتوا يفعلون ذلك.

الخرطوم العمارات يبقى المركز الثابت للسوق: الإيجارات ترتفع لكن بوتيرة أبطأ، تدفعها الطلب التجاري والمزيج المكتبي-السكني الذي يُعزلها عن دورية المغتربين الخالصة. الخرطوم ٣ هو الاستثناء — عرض جديد ومستأجرون محليون حساسون للسعر وجاذبية محدودة للمغتربين أبقت الأسعار مستقرة أو منخفضة بالجنيه.

**بورتسودان: هضبة الأسعار ما بعد ٢٠٢٣**

سوق الإيجار في بورتسودان كان شديد الحرارة في ٢٠٢٣ و٢٠٢٤ مع فيضان الهجرة الداخلية المدفوعة بالنزوح في المدينة. بحلول الربع الأول من ٢٠٢٦، استُوعبت تلك الموجة إلى حد بعيد والسوق على هضبة — الأسعار لا تنخفض، لكن التصاعد السريع توقف.

الشقق المطلة على الكورنيش التي طالبت بعلاوة ٣٠–٥٠٪ في ذروة أزمة النزوح، تتداول الآن بعلاوة أكثر استدامة من ١٥–٢٥٪ فوق الوحدات المماثلة في الداخل. نمت السكان الدائمة للمدينة بنسبة ١٥–٢٠٪ تقديراً منذ ٢٠٢٢، وهذا الطلب الهيكلي يدعم مستوى الأسعار الراهن. للعائلات المغتربة التي كانت تعتبر بورتسودان بديلاً للخرطوم، ربما انغلق نافذة القيمة النسبية نسبياً: الإيجارات الآن مرتفعة بما يكفي نسبة إلى خدمات المدينة وبنيتها التحتية لتستوجب حساباً صادقاً لما تدفعه مقابله.

**ودمدني: استقرار مدفوع بالدورة الزراعية**

يتبع سوق الإيجار في ودمدني التقويم الزراعي لمشروع الجزيرة أكثر مما يتبع تقويم الخرطوم. الربع الثاني هو موسم تحضير الزراعة في المشروع، مما يجلب عمال الإرشاد الحكومي الزراعي ومراقبي المنظمات غير الحكومية ومقاولي المعدات إلى المدينة مؤقتاً — ارتفاع موسمي متواضع في الطلب على الوحدات المفروشة وقصيرة الإيجار.

بشكل عام، تبقى ودمدني المدينة الأرخص في هذه القائمة على المستوى الهيكلي. عائلة يمكنها استئجار منزل ثلاث غرف في مركز المدينة بأقل من ١٥٠ دولار شهرياً بالجنيه. تحدي تحويل العملة للمستأجرين المغتربين — الملاك هنا بالجنيه حصراً — يبقى نقطة الاحتكاك الرئيسية لا مستوى السعر ذاته.

**كسلا: طلب ثابت وعرض شحيح**

سوق الإيجار في كسلا مقيّد بالعرض جوهرياً لا بالطلب. للمدينة طلب ثابت من موظفي الحكومة المُكلَّفين وعمال المنظمات الداعمة للاستجابة الإقليمية للاجئين وتدفق ثابت من مقاولي الزراعة والباحثين. ما تفتقر إليه هو عرض إيجار رسمي كافٍ: كثير من مساكن المدينة يسكنها أصحابها أو مُرتَّبة بشكل غير رسمي داخل الشبكات العائلية الممتدة.

الإيجارات في كسلا منخفضة بمعايير مطلقة (٦٠–١٨٠ دولار شهرياً لمنزل غرفتين إلى ثلاث) لكن إيجاد وحدة جيدة بتلك الأسعار يستلزم وصولاً للشبكة المحلية ببساطة لا يمتلكه المستأجرون الخارجيون. الفجوة بين العرض المُدرج وغير المُدرج أكبر في كسلا من أي مدينة سودانية كبرى أخرى.

**عطبرة: ثابتة ومهملة**

سوق الإيجار في عطبرة بالكاد يرد في النقاشات العقارية الوطنية، مما يُقلّل من تقدير فاعليته. للمدينة طلب ثابت حقيقي من عمال قطاع السكك الحديدية والبنية التحتية والمعلمين والعاملين في المستشفيات ضمن دورات التكليف. مستوى السعر (٢٠٠–٥٠٠ دولار شهرياً لمنزل ثلاث غرف) يعكس مستويات أجور تلك القطاعات لا أي نقص في العرض. السوق سائل بطريقة هادئة: وحدات تُتاح ووحدات تُملأ وملاك ومستأجرون يعرفون بعضهم أو يعرفون من يعرف من. لا منصة تلتقط هذا السوق بفاعلية.

**ارتفاع طلب العيد والصيف: ما تتوقعه**

أكثر القوى الموسمية قدرة على التنبؤ في الأسواق الإيجارية المدفوعة بالمغتربين هو النمط حول عيد الأضحى ونافذة إجازة الصيف المدرسية، التي تشهد عادةً أكبر تركّز لعائلات المغتربين العائدين أو الزائرين. في الربع الثاني من ٢٠٢٦، يصادف عيد الأضحى مطلع يونيو، وتمتد نافذة الإجازة الصيفية لعائلات المغتربين ذوي الأبناء في سن الدراسة في دول الخليج والمملكة المتحدة وكندا من أواخر يونيو حتى أغسطس.

الأثر العملي: العائلات المغتربة التي لم تُؤمّن بعد مسكناً لعودة صيفية باتت تتنافس مع بعضها على المخزون الجيد المتبقي في الخرطوم ٢ والرياض وجاردن سيتي. الملاك في تلك الأحياء يدركون هذه الدورة وسيُسعّرون لها.

النصيحة للعائلات في هذا الوضع مباشرة لكنها غير مريحة: التزمي مبكراً مما يبدو طبيعياً. عقد إيجار موقّع في مايو أرخص من العقد ذاته المعروض في يونيو. مالك يوافق على حجز الوحدة لثلاثة أسابيع بوديعة متواضعة في مايو أكثر احتمالاً للوفاء بالاتفاق من مالك يُقترب منه في أواخر يونيو حين تحسّنت خياراته.

العائلات القادرة على الالتزام بعقود اثني عشر شهراً في موقع هيكلي أقوى من تلك التي تسعى لترتيبات ستة أشهر أو صيف فقط. المستأجرون لاثني عشر شهراً يوفرون يقين الدخل الذي يديره الملاك؛ المستأجرون قصيرو الأمد خلال ارتفاع الطلب صفقة أسوأ للملاك حتى بسعر أعلى. سعّر وفق ذلك حين تتفاوض.

**ما يبدو عليه الربع القادم**

سيُشكَّل الربع الثالث من ٢٠٢٦ بثلاثة عوامل: إطلاق العرض ما بعد العيد (بعض العائلات التي حجزت وحدات للزيارة ستُطلقها بعد الصيف)، وعودة الفصل الدراسي للنصف الشمالي من الكرة في سبتمبر (التي تعيد عائلات المغتربين مضيّقةً العرض مجدداً بإيجاز)، والأثر التراكمي لاستثمار البنية التحتية للمولدات على مخزون الوحدات ذات التقييم الجيد.

الاتجاه الهيكلي لسوق الإيجار الراقي في الخرطوم صاعد، ومستمر منذ ثلاث سنوات. من غير المرجح أن يتغير هذا الاتجاه في الربع القادم غياب تحسن جوهري في موثوقية الشبكة — مما سيُقلل من علاوة المولد التي تُضخّم الإيجارات حالياً — أو إضافة جوهرية للعرض الجيد، وهو ما لا تُظهره خطوط الإنشاء بعد.

للمستأجرين، السوق قابل للتنقل مع الاستعداد. للملاك ذوي المخزون الجيد الصيانة المجهز بمولد في الرموز البريدية الصحيحة، يبقى من الاستثمارات الأكثر عقلانية المتاحة في الخرطوم الكبرى.`,
  },
];

export function getInsightBySlug(slug: string): Insight | null {
  return insights.find((i) => i.slug === slug) ?? null;
}
