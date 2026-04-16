import { Navbar } from "@/components/navbar";
import { HeroSection } from "../components/hero-section";
import { AdmissionTargets } from "@/components/admission-targets";
import { ScholarshipPrograms } from "@/components/scholarship-programs";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Grid Background Pattern */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `radial-gradient(circle, #d1d5db 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <Navbar />

      <main>
        <HeroSection />
        <ScholarshipPrograms />
        <AdmissionTargets />
      </main>

      <Footer />
    </div>
  );
}
