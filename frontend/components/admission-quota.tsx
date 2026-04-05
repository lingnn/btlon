"use client"

import { useState } from "react"
import { MapPin, Monitor, Wifi, Cpu, Film, Shield, TrendingUp, Building } from "lucide-react"
import { cn } from "@/lib/utils"

// Helper function to format numbers consistently to avoid hydration mismatch
function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

interface Program {
  name: string
  quota: number
  icon: React.ReactNode
}

interface Campus {
  id: string
  name: string
  location: string
  totalQuota: number
  programs: Program[]
}

const campuses: Campus[] = [
  {
    id: "north",
    name: "Cơ Sở Phía Bắc (Hà Nội)",
    location: "Km10, Nguyễn Trãi, Hà Đông, Hà Nội",
    totalQuota: 4500,
    programs: [
      { name: "Công Nghệ Thông Tin", quota: 800, icon: <Monitor className="w-5 h-5" /> },
      { name: "Kĩ thuật Điện tử Viễn thông", quota: 600, icon: <Wifi className="w-5 h-5" /> },
      { name: "Công Nghệ Kĩ Thuật Điện, Điện Tử", quota: 500, icon: <Cpu className="w-5 h-5" /> },
      { name: "Công Nghệ Đa Phương Tiện", quota: 400, icon: <Film className="w-5 h-5" /> },
      { name: "An Toàn Thông Tin", quota: 350, icon: <Shield className="w-5 h-5" /> },
      { name: "Quản Trị Kinh Doanh", quota: 450, icon: <TrendingUp className="w-5 h-5" /> },
    ],
  },
  {
    id: "south",
    name: "Cơ Sở Phía Nam (TP. Hồ Chí Minh)",
    location: "11 Nguyễn Đình Chiểu, Quận 3, TP. Hồ Chí Minh",
    totalQuota: 3800,
    programs: [
      { name: "Công Nghệ Thông Tin", quota: 700, icon: <Monitor className="w-5 h-5" /> },
      { name: "Kĩ thuật Điện tử Viễn thông", quota: 520, icon: <Wifi className="w-5 h-5" /> },
      { name: "Công Nghệ Kĩ Thuật Điện, Điện Tử", quota: 420, icon: <Cpu className="w-5 h-5" /> },
      { name: "Công Nghệ Đa Phương Tiện", quota: 350, icon: <Film className="w-5 h-5" /> },
      { name: "An Toàn Thông Tin", quota: 300, icon: <Shield className="w-5 h-5" /> },
      { name: "Quản Trị Kinh Doanh", quota: 380, icon: <TrendingUp className="w-5 h-5" /> },
    ],
  },
]

export function AdmissionQuota() {
  const [activeCampus, setActiveCampus] = useState("north")
  const currentCampus = campuses.find((c) => c.id === activeCampus) || campuses[0]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block bg-red-100 text-red-600 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            Năm Học 2026
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Chỉ Tiêu Tuyển Sinh
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Khám phá chỉ tiêu tuyển sinh ở các cơ sở và chương trình khác nhau
          </p>
        </div>

        {/* Campus Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-lg border border-gray-200 p-1">
            {campuses.map((campus) => (
              <button
                key={campus.id}
                onClick={() => setActiveCampus(campus.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all",
                  activeCampus === campus.id
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Building className="w-4 h-4" />
                {campus.id === "north" ? "Cơ Sở Phía Bắc" : "Cơ Sở Phía Nam"}
              </button>
            ))}
          </div>
        </div>

        {/* Campus Card */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* Campus Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Building className="w-5 h-5 text-red-600" />
                  <h3 className="text-xl font-bold text-red-600">{currentCampus.name}</h3>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{currentCampus.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-red-50 rounded-xl px-5 py-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{formatNumber(currentCampus.totalQuota)}</div>
                  <div className="text-xs text-gray-500">Chỉ Tiêu Tuyển Sinh</div>
                </div>
              </div>
            </div>
          </div>

          {/* Programs Grid */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 bg-red-600 rounded-full" />
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Chương Trình & Chỉ Tiêu
              </span>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentCampus.programs.map((program) => (
                <div
                  key={program.name}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                    {program.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate">{program.name}</h4>
                    <p className="text-xs text-gray-500">Chương Trình</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-600">{program.quota}</div>
                    <div className="text-xs text-gray-500">chỉ</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
