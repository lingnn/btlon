import Link from "next/link";
import { ArrowRight, Award, CalendarDays, Sparkles } from "lucide-react";

type ScholarshipCard = {
  title: string;
  subtitle: string;
  value: string;
  note: string;
  date: string;
  banner: string;
  accent: string;
  ribbon: string;
  href: string;
};

const scholarshipCards: ScholarshipCard[] = [
  {
    title: "Học bổng Tài năng Ưu tú",
    subtitle: "Giá trị lên đến",
    value: "100.000.000 VND/suất",
    note: "(100% học phí 2 năm đầu)",
    date: "27/06/2025",
    banner: "HỌC BỔNG\nTÀI NĂNG ƯU TÚ",
    accent: "from-[#ff9a76] via-[#ff6a4f] to-[#e2362f]",
    ribbon: "Rực rỡ nhất",
    href: "/news/hoc-bong-ban-phan",
  },
  {
    title: "Học bổng Tài năng Triển vọng",
    subtitle: "Tương đương",
    value: "100% học phí năm 1",
    note: "Ưu tiên cho thí sinh có thành tích nổi bật",
    date: "27/06/2025",
    banner: "HỌC BỔNG\nTÀI NĂNG TRIỂN VỌNG",
    accent: "from-[#ffb08f] via-[#ff7a63] to-[#df2f28]",
    ribbon: "Nổi bật",
    href: "/news/hoc-bong-tai-nang-trien-vong",
  },
  {
    title: "Học bổng Tài năng Ươm mầm",
    subtitle: "Tương đương",
    value: "50% học phí năm 1",
    note: "Dành cho học sinh có kết quả học tập tốt",
    date: "09/04/2026",
    banner: "HỌC BỔNG\nTÀI NĂNG ƯƠM MẦM",
    accent: "from-[#ff9b64] via-[#ff6f54] to-[#dc2f2b]",
    ribbon: "Phù hợp nhất",
    href: "/news/hoc-bong-tai-nang-uom-mam",
  },
];

export function ScholarshipPrograms() {
  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#b31f24]/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.2em] text-[#b31f24]">
            <Sparkles className="h-4 w-4" />
            Giới thiệu
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            Chương trình học bổng
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {scholarshipCards.map((card) => (
            <article
              key={card.title}
              className="group overflow-hidden rounded-[28px] border border-white/70 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(179,31,36,0.15)]"
            >
              <div
                className={`relative overflow-hidden rounded-[18px] bg-gradient-to-br ${card.accent} p-5 text-white`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.35),transparent_45%)]" />
                <div className="relative flex items-start justify-between gap-4">
                  <div className="border-l-4 border-white/80 pl-3">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/90">
                      {card.banner.split("\n")[0]}
                    </p>
                    <p className="text-lg font-extrabold leading-tight sm:text-xl">
                      {card.banner.split("\n")[1]}
                    </p>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 ring-2 ring-white/30">
                    <Award className="h-7 w-7 text-white" />
                  </div>
                </div>

                <div className="relative mt-8">
                  <div className="mb-3 flex items-center gap-2 text-white/90">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm font-semibold uppercase tracking-[0.18em]">{card.subtitle}</span>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3 text-center text-[#e2362f] shadow-lg">
                    <div className="text-2xl font-extrabold leading-none sm:text-[28px]">{card.value}</div>
                  </div>
                  <p className="mt-3 text-center text-xs font-medium text-white/90">{card.note}</p>
                </div>

                <div className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  {card.ribbon}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm font-medium text-[#b31f24]">
                <CalendarDays className="h-4 w-4" />
                {card.date}
              </div>
              <h3 className="mt-3 text-2xl font-bold leading-tight text-slate-800">
                {card.title}
              </h3>
              <div className="mt-4 flex items-center justify-between">
                <Link
                  href={card.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#b31f24] transition-colors hover:text-[#8f191d]"
                >
                  Xem chi tiết
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  Cập nhật mới
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          {[0, 1, 2, 3, 4].map((dot) => (
            <span
              key={dot}
              className={`h-2.5 rounded-full transition-all ${
                dot === 3 ? "w-8 bg-[#b31f24]" : "w-2.5 bg-[#b31f24]/20"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}