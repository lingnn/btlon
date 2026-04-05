import Image from "next/image";
import { Phone, Mail, Globe } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-8 lg:py-12">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#b31f24] to-[#8f191d] p-8 shadow-2xl lg:p-12">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <div className="relative flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
            <div className="max-w-xl text-center lg:text-left">
              <div className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white">
                Năm Học 2026-2027
              </div>
              <h1 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                THÔNG TIN
                <br />
                TUYỂN SINH 2026
              </h1>
              <p className="mb-8 text-base text-white/80 lg:text-lg">
                Học viện Công nghệ Bưu chính Viễn thông chào đón các bạn học sinh tham gia vào chương trình học tập của chúng.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
                <div className="flex items-center gap-2 text-white/90">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span className="text-sm">(024) 3854 0095</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span className="text-sm">tuyensinh@ptit.edu.vn</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                    <Globe className="h-4 w-4" />
                  </div>
                  <span className="text-sm">tuyensinh.ptit.edu.vn</span>
                </div>
              </div>
            </div>

            <div className="relative w-full max-w-[420px] flex-shrink-0 lg:max-w-[460px]">
              <StudentIllustration />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StudentIllustration() {
  return (
    <div className="relative aspect-[4/3] w-full">
      <div className="absolute inset-5 rounded-[28px] bg-[#6a001d]/35 blur-2xl" />
      <Image
        src="/images/Gemini_Generated_Image_ludbqsludbqsludb.png"
        alt="Tòa nhà Học viện Công nghệ Bưu chính Viễn thông"
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 460px"
        className="rounded-2xl object-cover object-center ring-1 ring-white/15 [mask-image:radial-gradient(circle_at_center,black_58%,transparent_100%)]"
      />
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_center,transparent_40%,rgba(10,12,25,0.45)_100%)]" />
    </div>
  );
}
