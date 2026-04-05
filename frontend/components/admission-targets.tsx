"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Users,
  GraduationCap,
  Building,
  Monitor,
  Radio,
  Cpu,
  Film,
  Shield,
  BarChart3,
  TrendingUp,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type Program = {
  name: string;
  quota: number;
  icon: LucideIcon;
  slug: string;
};

type CampusData = {
  name: string;
  location: string;
  totalQuota: number;
  programs: Program[];
};

const campusData: Record<"hanoi" | "hcmc", CampusData> = {
  hanoi: {
    name: "Cơ Sở Phía Bắc (Hà Nội)",
    location: "Km10, Nguyễn Trãi, Hà Đông, Hà Nội",
    totalQuota: 4500,
    programs: [
      { name: "Công Nghệ Thông Tin", quota: 800, icon: Monitor, slug: "cong-nghe-thong-tin" },
      { name: "Kĩ thuật Điện tử Viễn thông", quota: 600, icon: Radio, slug: "dien-tu-vien-thong" },
      { name: "Công Nghệ Kĩ Thuật Điện, Điện Tử", quota: 500, icon: Cpu, slug: "dien-tu-vien-thong" },
      { name: "Công Nghệ Đa Phương Tiện", quota: 400, icon: Film, slug: "cong-nghe-da-phuong-tien" },
      { name: "An Toàn Thông Tin", quota: 350, icon: Shield, slug: "bao-mat-thong-tin" },
      { name: "Quản Trị Kinh Doanh", quota: 450, icon: BarChart3, slug: "quan-tri-kinh-doanh" },
    ],
  },
  hcmc: {
    name: "Cơ Sở Phía Nam (TPHCM)",
    location: "11 Nguyễn Đình Chiểu, Quận 1, Thành Phố Hồ Chí Minh",
    totalQuota: 2500,
    programs: [
      { name: "Công Nghệ Thông Tin", quota: 500, icon: Monitor, slug: "cong-nghe-thong-tin" },
      { name: "Kĩ thuật Điện tử Viễn thông", quota: 400, icon: Radio, slug: "ky-thuat-vien-thong" },
      { name: "Công Nghệ Kĩ Thuật Điện, Điện Tử", quota: 350, icon: Cpu, slug: "dien-tu-vien-thong" },
      { name: "Công Nghệ Đa Phương Tiện", quota: 300, icon: Film, slug: "cong-nghe-da-phuong-tien" },
      { name: "Tiếp Thị", quota: 250, icon: TrendingUp, slug: "tiep-thi" },
      { name: "Thương Mại Điện Tử", quota: 300, icon: ShoppingCart, slug: "thuong-mai-dien-tu" },
    ],
  },
};

function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function AdmissionTargets() {
  const [activeTab, setActiveTab] = useState<"hanoi" | "hcmc">("hanoi");
  const campus = campusData[activeTab];

  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <span className="mb-2 inline-block rounded-full bg-[#b31f24]/10 px-4 py-1.5 text-sm font-medium text-[#b31f24]">
            Năm Học 2026
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            Chỉ Tiêu Tuyển Sinh
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Khám phá chỉ tiêu tuyển sinh ở các cơ sở và chương trình khác nhau
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-xl bg-muted p-1.5">
            <button
              onClick={() => setActiveTab("hanoi")}
              className={`flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === "hanoi"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MapPin className="h-4 w-4" />
              Cơ Sở Phía Bắc
            </button>
            <button
              onClick={() => setActiveTab("hcmc")}
              className={`flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === "hcmc"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MapPin className="h-4 w-4" />
              Cơ Sở Phía Nam
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="mb-8 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            <div className="border-b border-border bg-gradient-to-r from-[#b31f24]/5 to-transparent p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="flex items-center gap-2 text-xl font-bold text-foreground">
                    <Building className="h-5 w-5 text-[#b31f24]" />
                    {campus.name}
                  </h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {campus.location}
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-[#b31f24] px-5 py-3 text-white">
                  <TrendingUp className="h-5 w-5" />
                  <div>
                    <div className="text-2xl font-bold">{formatNumber(campus.totalQuota)}</div>
                    <div className="text-xs opacity-80">Chỉ Tiêu Tuyển Sinh</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <GraduationCap className="h-4 w-4" />
                Chương Trình & Chỉ Tiêu
              </h4>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {campus.programs.map((program) => (
                  <Link
                    key={program.name}
                    href={`/nganh/${program.slug}`}
                    className="group rounded-xl border border-border bg-muted/30 p-4 transition-all duration-200 hover:border-[#b31f24]/30 hover:bg-[#b31f24]/5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#b31f24]/10 text-[#b31f24]">
                          <program.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h5 className="font-medium text-foreground">{program.name}</h5>
                          <p className="text-xs text-muted-foreground">Chương Trình</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[#b31f24]">{program.quota}</div>
                        <div className="text-xs text-muted-foreground">chỗ</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
