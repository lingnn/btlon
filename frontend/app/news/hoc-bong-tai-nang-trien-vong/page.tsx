import { CalendarDays, Mail, Printer, Share2, Tag, User } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("vi-VN");
}

export default function ScholarshipTienVongPage() {
  const publishedDate = "2025-06-27";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        <section
          className="relative overflow-hidden bg-[#6f0000] text-white"
          style={{
            backgroundImage: "url(/images/about-hero.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "left center",
          }}
        >
          <div className="absolute inset-0 bg-[#6f0000]/90" />
          <div className="relative mx-auto flex min-h-[195px] max-w-7xl items-center justify-end px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-right">
              <div className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-white/90">
                <span className="inline-flex items-center gap-1">
                  <span>🏠</span>
                  <span>Chi tiết bài viết</span>
                </span>
              </div>
              <h1 className="text-3xl font-extrabold uppercase tracking-tight sm:text-4xl lg:text-5xl">
                HỌC BỔNG TÀI NĂNG TRIỂN VỌNG
              </h1>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-14 md:py-16">
          <article className="mx-auto max-w-5xl">
            <header className="space-y-4">
              <h2 className="text-2xl font-bold leading-tight text-[#102e6a] md:text-3xl">
                HỌC BỔNG TÀI NĂNG TRIỂN VỌNG
              </h2>
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <Tag className="h-4 w-4 text-[#b31f24]" />
                  Chương trình học bổng
                </span>
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-[#b31f24]" />
                  {formatDate(publishedDate)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <User className="h-4 w-4 text-[#b31f24]" />
                  admintuyensinh
                </span>
              </div>
            </header>

            <section className="mt-6 max-w-none text-[16px] leading-8 text-slate-900 md:text-[17px]">
              <p>
                Năm 2026, Học viện Công nghệ Bưu chính Viễn thông cấp học bổng Tài năng Triển vọng cho các thí sinh có thành tích học tập nổi bật, với giá trị tương đương <strong>100% học phí năm học thứ nhất</strong>. Chương trình dành cho thí sinh đạt giải cao trong các kỳ thi học sinh giỏi, hoặc có kết quả xét tuyển thuộc nhóm dẫn đầu trong năm tuyển sinh.
              </p>
              <p className="mt-4">
                Học bổng áp dụng cho những thí sinh thể hiện năng lực học tập tốt, tinh thần nỗ lực cao và cam kết theo học đúng ngành đã đăng ký tại Học viện.
              </p>
              <p className="mt-4 italic">
                Người nhận học bổng cần duy trì kết quả học tập đáp ứng yêu cầu của chương trình đào tạo trong suốt thời gian học.
              </p>
            </section>

            <div className="mt-12 flex items-center gap-4">
              <span className="text-sm text-slate-600">Chia sẻ:</span>
              <div className="flex gap-3">
                <ActionButton label="Facebook" icon={<Share2 className="h-4 w-4" />} />
                <ActionButton label="Email" icon={<Mail className="h-4 w-4" />} />
                <ActionButton label="In" icon={<Printer className="h-4 w-4" />} />
              </div>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ActionButton({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full bg-[#c92b27] text-white transition-colors hover:bg-[#9e1d22]"
    >
      {icon}
    </button>
  );
}