export type InquiryChannel = "whatsapp" | "phone" | "platform";

export type MockInquiry = {
  id: string;
  listing_id: string;
  inquirer_name_en: string;
  inquirer_name_ar: string;
  inquirer_phone: string;
  message_en: string;
  message_ar: string;
  channel: InquiryChannel;
  created_at: string; // ISO-8601
  is_read: boolean;
};

export function getMockInquiries(): MockInquiry[] {
  return [
    {
      id: "inq-001",
      listing_id: "khartoum-2-3br-apt",
      inquirer_name_en: "Amira Hassan",
      inquirer_name_ar: "أميرة حسن",
      inquirer_phone: "+249912100001",
      message_en:
        "Hello, I'm interested in the three-bedroom apartment in Khartoum 2. Is it still available? I'd like to visit this week if possible.",
      message_ar:
        "مرحباً، أنا مهتمة بشقة ثلاث غرف في الخرطوم 2. هل هي متاحة الآن؟ أودّ الزيارة هذا الأسبوع إن أمكن.",
      channel: "whatsapp",
      created_at: "2026-05-09T14:32:00Z",
      is_read: false,
    },
    {
      id: "inq-002",
      listing_id: "omdurman-villa-thawra",
      inquirer_name_en: "Tariq Al-Mahi",
      inquirer_name_ar: "طارق المهي",
      inquirer_phone: "+249912100002",
      message_en:
        "Good morning. I saw your villa listing in Omdurman Al-Thawra. Can you tell me more about the land area and if the title deed is transferable?",
      message_ar:
        "صباح الخير. رأيت إعلان الفيلا في أم درمان الثورة. هل يمكنك إخباري بمساحة الأرض وهل الصك قابل للتحويل؟",
      channel: "platform",
      created_at: "2026-05-08T09:15:00Z",
      is_read: true,
    },
    {
      id: "inq-003",
      listing_id: "khartoum-2-3br-apt",
      inquirer_name_en: "Salma Nour",
      inquirer_name_ar: "سلمى نور",
      inquirer_phone: "+249912100003",
      message_en:
        "Hi, is the apartment in Khartoum 2 still available for rent? We are a family of four looking to move in from the beginning of June.",
      message_ar:
        "مرحباً، هل الشقة في الخرطوم 2 ما زالت متاحة للإيجار؟ نحن عائلة مكوّنة من أربعة أشخاص ونريد الانتقال مع بداية يونيو.",
      channel: "whatsapp",
      created_at: "2026-05-08T18:47:00Z",
      is_read: false,
    },
    {
      id: "inq-004",
      listing_id: "port-sudan-shop",
      inquirer_name_en: "Kamal Idris",
      inquirer_name_ar: "كمال إدريس",
      inquirer_phone: "+249912100004",
      message_en:
        "I'm interested in the commercial shop on Sawakin Road. Is the lease term negotiable and can I see the space before signing anything?",
      message_ar:
        "أنا مهتم بالمحل التجاري في شارع سواكن. هل مدة الإيجار قابلة للتفاوض وهل يمكنني معاينة المكان قبل التوقيع؟",
      channel: "phone",
      created_at: "2026-05-07T11:05:00Z",
      is_read: true,
    },
    {
      id: "inq-005",
      listing_id: "river-nile-land-shendi",
      inquirer_name_en: "Hind Osman",
      inquirer_name_ar: "هند عثمان",
      inquirer_phone: "+249912100005",
      message_en:
        "Hello, I'd like to know more about the agricultural land near Shendi. Are there existing water rights registered with the land deed?",
      message_ar:
        "مرحباً، أريد الاستفسار عن الأرض الزراعية قرب شندي. هل حقوق المياه مسجّلة مع صك الملكية؟",
      channel: "platform",
      created_at: "2026-05-06T16:22:00Z",
      is_read: true,
    },
    {
      id: "inq-006",
      listing_id: "khartoum-2-3br-apt",
      inquirer_name_en: "Mustafa Siddiq",
      inquirer_name_ar: "مصطفى صديق",
      inquirer_phone: "+249912100006",
      message_en:
        "Salam. Is a shorter lease possible — maybe three months? I'm relocating for work and may need to leave by September.",
      message_ar:
        "السلام عليكم. هل عقد إيجار قصير ممكن — ثلاثة أشهر مثلاً؟ أنا منتقل بسبب العمل وقد أغادر قبل سبتمبر.",
      channel: "whatsapp",
      created_at: "2026-05-05T08:10:00Z",
      is_read: false,
    },
  ];
}
