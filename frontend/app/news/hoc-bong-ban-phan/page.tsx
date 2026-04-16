import Link from "next/link";
import { ArrowLeft, CalendarDays, Eye, Mail, Printer, Share2, User, Tag } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("vi-VN");
}

export default function ScholarshipBanPhanPage() {
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
                HỌC BỔNG BÁN PHẦN
              </h1>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-14 md:py-16">
          <article className="mx-auto max-w-5xl">
            <header className="space-y-4">
              <h2 className="text-2xl font-bold leading-tight text-[#102e6a] md:text-3xl">
                HỌC BỔNG BÁN PHẦN
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
                Năm 2026, Học viện Công nghệ Bưu chính Viễn thông cấp tối đa <strong>50 suất học bổng bán phần</strong> với giá trị học bổng tới <strong>100 triệu đồng</strong> <em>(tối đa bằng 100% học phí hai năm học đầu tiên của chương trình chất lượng cao)</em> cho các thí sinh đạt giải Khuyến khích trong kỳ thi chọn học sinh giỏi quốc gia các môn Toán, Vật lí và Tin học; thí sinh đạt giải Nhất, Nhì trong kỳ thi học sinh giỏi cấp Tỉnh/Thành phố trực thuộc TW các môn Toán, Vật lí và Tin học; thí sinh có điểm thi tốt nghiệp THPT từ 28,0 điểm trở lên (không bao gồm điểm cộng và điểm ưu tiên nếu có).
              </p>
              <p className="mt-4 italic">
                Người được nhận học bổng bán phần phải đảm bảo điểm trung bình chung tích lũy năm học liên tục đạt từ loại Giỏi trở lên trong thời gian học tập.
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