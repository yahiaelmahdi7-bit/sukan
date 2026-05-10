import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="pt-20">{children}</main>
      <Footer />
    </div>
  );
}
