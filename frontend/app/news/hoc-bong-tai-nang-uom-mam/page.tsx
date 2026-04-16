import { CalendarDays, Mail, Printer, Share2, Tag, User } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("vi-VN");
}

export default function ScholarshipUomMamPage() {
  const publishedDate = "2026-04-09";
  const authorName = "admindaotao";
  const pageTitle = "HỌC BỔNG MIỄN 50% HỌC PHÍ TRONG NĂM HỌC THỨ NHẤT";

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
                {pageTitle}
              </h1>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-14 md:py-16">
          <article className="mx-auto max-w-5xl">
            <header className="space-y-4">
              <h2 className="text-2xl font-bold leading-tight text-[#102e6a] md:text-3xl">
                {pageTitle}
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
                  {authorName}
                </span>
              </div>
            </header>

            <section className="mt-6 max-w-none text-[16px] leading-8 text-slate-900 md:text-[17px]">
              <p>
                Năm 2026, Học viện Công nghệ Bưu chính Viễn thông cấp tối đa <strong>300 suất học bổng miễn 50% học phí trong năm học thứ nhất</strong> cho đối tượng là các thí sinh đạt giải trong kỳ thi học sinh giỏi hoặc đạt kết quả cao trong kỳ thi tốt nghiệp THPT năm 2026.
              </p>
              <p className="mt-4">
                Đối tượng xét tuyển gồm thí sinh đạt giải trong kỳ thi học sinh giỏi quốc gia, thí sinh đạt giải trong kỳ thi học sinh giỏi cấp Tỉnh/Thành phố trực thuộc TW các môn Toán, Vật lí, Hóa và Tin học hoặc thí sinh có kết quả cao trong kỳ thi tốt nghiệp THPT năm 2026.
              </p>
              <p className="mt-4 italic">
                Thí sinh nhận học bổng cần đảm bảo đáp ứng các điều kiện xét tuyển và duy trì kết quả học tập theo quy định trong suốt thời gian học.
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