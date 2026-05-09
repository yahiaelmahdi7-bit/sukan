export type MockUser = {
  id: string;
  full_name_en: string;
  full_name_ar: string;
  email: string;
  phone: string;
  whatsapp: string;
  city_en: string;
  city_ar: string;
  role: "tenant" | "landlord" | "agent";
  preferred_locale: "en" | "ar";
  joined_year: number;
  /** null = use SukanMark fallback */
  avatar_url: null;
};

export function getMockUser(): MockUser {
  return {
    id: "mock-user-001",
    full_name_en: "Yasir Ahmed",
    full_name_ar: "ياسر أحمد",
    email: "yasir.ahmed@example.com",
    phone: "+249912000001",
    whatsapp: "+249912000001",
    city_en: "Khartoum",
    city_ar: "الخرطوم",
    role: "landlord",
    preferred_locale: "en",
    joined_year: 2024,
    avatar_url: null,
  };
}
