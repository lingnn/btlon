"use client";

import Link from "next/link";
import { useState } from "react";

const menuItems = [
  { id: "tong-quan", label: "Tổng quan" },
  { id: "chuan-dau-ra", label: "Chuẩn đầu ra" },
  { id: "cau-truc", label: "Cấu trúc chương trình" },
  { id: "nghe-nghiep", label: "Nghề nghiệp" },
  { id: "hoc-phi", label: "Học phí" },
  { id: "dieu-kien", label: "Điều kiện tuyển sinh" },
  { id: "quy-trinh", label: "Quy trình nhập học" },
  { id: "tai-lieu", label: "Tài liệu đào tạo" },
];

const structureTabs = [
  "Chuyên ngành Mạng máy tính và truyền thông dữ liệu",
  "Chuyên ngành Hệ thống thông tin",
  "Chuyên ngành Công nghệ phần mềm",
];

const structureSemesters = [
  {
    name: "Học kỳ 1",
    courses: [
      { title: "Triết học Mác-Lênin", credit: "3" },
      { title: "Tin học cơ sở 1", credit: "2" },
      { title: "Giải tích 1", credit: "3" },
      { title: "Đại số", credit: "3" },
    ],
  },
  {
    name: "Học kỳ 2",
    courses: [
      { title: "Kinh tế chính trị Mác-Lênin", credit: "2" },
      { title: "Tiếng Anh (Course 1)", credit: "4" },
      { title: "Tin học cơ sở 2", credit: "2" },
      { title: "Giải tích 2", credit: "3" },
    ],
  },
  {
    name: "Học kỳ 3",
    courses: [
      { title: "Pháp luật đại cương", credit: "2" },
      { title: "Vật lý ứng dụng", credit: "4" },
      { title: "Kỹ thuật số", credit: "2" },
      { title: "Chủ nghĩa xã hội khoa học", credit: "2" },
      { title: "Tiếng Anh (Course 2)", credit: "4" },
      { title: "Ngôn ngữ lập trình C++", credit: "3" },
      { title: "Toán rời rạc 1", credit: "3" },
      { title: "Xử lý tín hiệu số", credit: "2" },
      { title: "Xác suất thống kê", credit: "3" },
    ],
  },
  {
    name: "Học kỳ 4",
    courses: [
      { title: "Tư tưởng Hồ Chí Minh", credit: "2" },
      { title: "Tiếng Anh (Course 3)", credit: "4" },
      { title: "Kiến trúc máy tính", credit: "3" },
      { title: "Toán rời rạc 2", credit: "3" },
      { title: "Cấu trúc dữ liệu và giải thuật", credit: "3" },
      { title: "Lý thuyết thông tin", credit: "3" },
    ],
  },
  {
    name: "Học kỳ 5",
    courses: [
      { title: "Lịch sử Đảng cộng sản VN", credit: "2" },
      { title: "Tiếng Anh (Course 3 Plus)", credit: "2" },
      { title: "Hệ điều hành", credit: "3" },
      { title: "Lập trình hướng đối tượng", credit: "3" },
      { title: "Cơ sở dữ liệu", credit: "3" },
      { title: "Mạng máy tính", credit: "3" },
      { title: "Lập trình Python", credit: "3" },
    ],
  },
  {
    name: "Học kỳ 6",
    courses: [
      { title: "Nhập môn công nghệ phần mềm", credit: "3" },
      { title: "Nhập môn trí tuệ nhân tạo", credit: "3" },
      { title: "An toàn và bảo mật hệ thống thông tin", credit: "3" },
      { title: "Lập trình web", credit: "3" },
      { title: "Cơ sở dữ liệu phân tán", credit: "3" },
      { title: "Thực tập cơ sở", credit: "4" },
    ],
  },
  {
    name: "Học kỳ 7",
    courses: [
      { title: "QLDA phần mềm", credit: "3" },
      { title: "IoT và ứng dụng", credit: "3" },
      { title: "Phân tích và thiết kế HTTT", credit: "3" },
      { title: "Xử lý ảnh", credit: "3" },
      { title: "Học phần tự chọn", credit: "6" },
    ],
  },
  {
    name: "Học kỳ 8",
    courses: [
      { title: "Thiết kế mạng máy tính", credit: "3" },
      { title: "Đánh giá hiệu năng mạng", credit: "3" },
      { title: "Quản lý mạng máy tính", credit: "3" },
      { title: "An ninh mạng", credit: "3" },
      { title: "Học phần tự chọn", credit: "3" },
      { title: "Phương pháp luận nghiên cứu khoa học", credit: "2" },
    ],
  },
  {
    name: "Học kỳ 9",
    courses: [{ title: "Thực tập và tốt nghiệp", credit: "12" }],
  },
];

const accentMap: Record<string, string> = {
  sky: "border-sky-300 bg-sky-50",
  cyan: "border-cyan-300 bg-cyan-50",
  blue: "border-blue-300 bg-blue-50",
  rose: "border-rose-300 bg-rose-50",
};

function CourseCard({
  title,
  credit,
  tone,
}: {
  title: string;
  credit: string;
  tone: string;
}) {
  const accent = accentMap[tone] ?? accentMap.sky;

  return (
    <div
      className={`relative overflow-hidden rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm ${accent}`}
    >
      <div className="absolute inset-y-0 left-0 w-1 rounded-full bg-current opacity-20" />
      <div className="relative">
        <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-red-600">
          {credit} tín chỉ
        </span>
        <h3 className="mt-4 text-sm font-semibold text-slate-900">{title}</h3>
      </div>
    </div>
  );
}

export default function CongNgheThongTinPage() {
  const [activeTab, setActiveTab] = useState(structureTabs[0]);
  const [activeSection, setActiveSection] = useState(menuItems[0].id);

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[url('/images/Gemini_Generated_Image_ludbqsludbqsludb.png')] bg-cover bg-center opacity-100" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_30%,rgba(2,6,23,0.72)_96%)]" />
        <div className="absolute inset-0 bg-slate-950/36" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 text-white">
          <div className="mb-4 text-sm text-slate-200">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-200 hover:text-white"
            >
              <span>🏠</span> Trang chủ
            </Link>
            <span className="mx-2">/</span>
            <span>
              Nhóm các ngành, chương trình đào tạo lĩnh vực Kỹ thuật, Công nghệ
            </span>
            <span className="mx-2">/</span>
            <span>Ngành Công nghệ thông tin</span>
          </div>
          <h1 className="text-4xl font-semibold">Ngành Công nghệ thông tin</h1>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-4 lg:grid-cols-4">
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Mã ngành</p>
            <p className="mt-4 text-2xl font-semibold text-red-600">7480201</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Thời gian</p>
            <p className="mt-4 text-2xl font-semibold text-red-600">4,5 năm</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Kỳ nhập học</p>
            <p className="mt-4 text-2xl font-semibold text-red-600">Mùa thu</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Cơ sở</p>
            <p className="mt-4 text-2xl font-semibold text-red-600">
              Hà Nội và Tp Hồ Chí Minh
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="relative">
            <div className="sticky top-24 space-y-3 rounded-3xl border-l border-slate-200 bg-white/90 p-6 shadow-sm">
              {menuItems.map((item) => {
                const isActive = item.id === activeSection;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setActiveSection(item.id)}
                    className={`block rounded-r-2xl border-l-4 px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "border-red-600 bg-red-50 text-red-800 shadow-sm"
                        : "border-transparent bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
          </aside>

          <section className="space-y-8">
            <article
              id="tong-quan"
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-red-600">Tổng quan</h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
                <p>
                  Ngành Công nghệ thông tin gồm ba chuyên ngành: Mạng máy tính
                  và truyền thông dữ liệu, Công nghệ phần mềm, Hệ thống thông
                  tin. Tuyển sinh không xét chuyên ngành, sinh viên tự chọn
                  chuyên ngành khi vào học.
                </p>
                <p>
                  Mã ngành: <strong>7480201</strong>
                </p>
                <p>
                  Khối lượng chương trình: <strong>150 tín chỉ</strong> (không
                  bao gồm Giáo dục thể chất, Giáo dục quốc phòng và Kỹ năng
                  mềm).
                </p>
                <div className="grid gap-2 rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
                  <div className="font-semibold text-slate-900">Chỉ tiêu</div>
                  <div>Năm 2024: 600</div>
                  <div>Năm 2023: 730</div>
                  <div>Năm 2022: 840</div>
                  <div>Năm 2021: 770</div>
                </div>
                <div className="grid gap-2 rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
                  <div className="font-semibold text-slate-900">
                    Điểm trúng tuyển
                  </div>
                  <div>Năm 2024: 26,40</div>
                  <div>Năm 2023: 26,59</div>
                  <div>Năm 2022: 27,25</div>
                  <div>Năm 2021: 26,90</div>
                </div>
                <p>
                  Tổ hợp xét tuyển: <strong>Toán – Lý – Hóa (A00)</strong> hoặc{" "}
                  <strong>Toán – Lý – Anh (A01)</strong>.
                </p>
              </div>
            </article>

            <article
              id="chuan-dau-ra"
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-red-600">
                Chuẩn đầu ra
              </h2>
              <div className="mt-6 space-y-6 text-sm leading-7 text-slate-700">
                <div>
                  <p className="font-semibold">1. Chuẩn về kiến thức</p>
                  <ul className="mt-3 list-outside list-disc space-y-2 pl-5">
                    <li>
                      [LO1]: Vận dụng được kiến thức về Lý luận của Chủ nghĩa
                      Mác Lênin và Tư tưởng Hồ Chí Minh, Pháp luật, Khoa học tự
                      nhiên, chú trọng nền tảng Toán học cho Công nghệ thông
                      tin.
                    </li>
                    <li>
                      [LO2]: Vận dụng kiến thức cơ sở ngành Công nghệ thông tin
                      để xây dựng và phát triển hệ thống máy tính, hệ thống
                      thông tin, phát triển phần mềm, trí tuệ nhân tạo và các
                      ứng dụng quan trọng.
                    </li>
                    <li>
                      [LO3]: Vận dụng kiến thức chuyên sâu để thiết kế, phát
                      triển, cài đặt, vận hành và bảo trì phần mềm (Công nghệ
                      phần mềm); thu thập, xử lý, phân tích dữ liệu và xây dựng
                      hệ thống mạng (Mạng máy tính và truyền thông dữ liệu); xây
                      dựng, phát triển và vận hành hệ thống thông tin (Hệ thống
                      thông tin).
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">2. Chuẩn về kỹ năng</p>
                  <div className="mt-3 space-y-3">
                    <p className="font-semibold">
                      2.1 Kỹ năng nghề nghiệp chung
                    </p>
                    <ul className="list-outside list-disc space-y-2 pl-5">
                      <li>
                        [LO4]: Áp dụng toán học, khoa học, công nghệ để giải
                        quyết vấn đề.
                      </li>
                      <li>
                        [LO5]: Thiết kế, thực hiện và phân tích kết quả thực
                        nghiệm.
                      </li>
                      <li>
                        [LO6]: Thiết kế hệ thống phù hợp với ràng buộc kinh tế,
                        xã hội, văn hóa, an toàn và bền vững.
                      </li>
                      <li>
                        [LO7]: Nhận biết, mô hình và giải quyết vấn đề công
                        nghệ.
                      </li>
                      <li>
                        [LO8]: Trình bày và làm việc với các vấn đề đương đại.
                      </li>
                      <li>
                        [LO9]: Áp dụng kỹ thuật, kỹ năng và công cụ công nghệ
                        hiện đại.
                      </li>
                      <li>
                        [LO10]: Chuyển lý thuyết kỹ thuật thành ứng dụng thực
                        tế.
                      </li>
                    </ul>
                  </div>
                  <div className="mt-3 space-y-3">
                    <p className="font-semibold">
                      2.2 Kỹ năng nghề nghiệp chuyên ngành
                    </p>
                    <p className="font-semibold">a) Công nghệ phần mềm</p>
                    <ul className="list-outside list-disc space-y-2 pl-5">
                      <li>[LO11]: Thu thập và phân tích yêu cầu người dùng.</li>
                      <li>
                        [LO12]: Thiết kế và cài đặt hệ thống phần mềm đáp ứng
                        thực tế.
                      </li>
                      <li>[LO13]: Lập kế hoạch và ước lượng dự án phần mềm.</li>
                      <li>
                        [LO14]: Lập kế hoạch kiểm thử và quản lý chất lượng.
                      </li>
                      <li>
                        [LO15]: Áp dụng sáng tạo tri thức vào giải quyết bài
                        toán phát triển phần mềm.
                      </li>
                    </ul>
                    <p className="font-semibold mt-4">b) Hệ thống thông tin</p>
                    <ul className="list-outside list-disc space-y-2 pl-5">
                      <li>
                        [LO11]: Lựa chọn quy trình và giải pháp phần cứng, phần
                        mềm, dữ liệu phù hợp.
                      </li>
                      <li>
                        [LO12]: Vận dụng kiến thức để giải quyết vấn đề hệ thống
                        thông tin.
                      </li>
                      <li>
                        [LO13]: Xác định và cụ thể hóa giải pháp kỹ thuật, tích
                        hợp hệ thống.
                      </li>
                      <li>
                        [LO14]: Thu nhận, lưu trữ, xử lý và truyền thông dữ
                        liệu.
                      </li>
                      <li>
                        [LO15]: Áp dụng kiến thức phân tích, khai phá dữ liệu
                        trong phát triển hệ thống thông tin.
                      </li>
                    </ul>
                    <p className="font-semibold mt-4">
                      c) Mạng máy tính và truyền thông dữ liệu
                    </p>
                    <ul className="list-outside list-disc space-y-2 pl-5">
                      <li>
                        [LO11]: Nghiên cứu và áp dụng kiến thức về mạng và
                        truyền thông máy tính.
                      </li>
                      <li>
                        [LO12]: Phân tích, thiết kế hệ thống mạng truyền thông
                        máy tính.
                      </li>
                      <li>
                        [LO13]: Cài đặt, bảo trì hệ thống mạng truyền thông máy
                        tính.
                      </li>
                      <li>
                        [LO14]: Quản lý và khai thác hệ thống mạng truyền thông
                        máy tính.
                      </li>
                      <li>
                        [LO15]: Sử dụng công cụ thiết kế và đánh giá hoạt động
                        hệ thống mạng.
                      </li>
                    </ul>
                  </div>
                  <div className="mt-3 space-y-2">
                    <p className="font-semibold">2.3 Kỹ năng mềm</p>
                    <ul className="list-outside list-disc space-y-2 pl-5">
                      <li>
                        [LO16]: Có năng lực tiếng Anh tối thiểu TOEIC 450 hoặc
                        tương đương.
                      </li>
                      <li>
                        [LO17]: Hoạt động và tương tác tốt trong môi trường đa
                        ngành, hòa nhập quốc tế.
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <p className="font-semibold">
                    3. Năng lực tự chủ và trách nhiệm
                  </p>
                  <ul className="mt-3 list-outside list-disc space-y-2 pl-5">
                    <li>[LO18]: Hiểu rõ đạo đức và trách nhiệm nghề nghiệp.</li>
                    <li>
                      [LO19]: Nhận thức ảnh hưởng của giải pháp công nghệ trong
                      môi trường, kinh tế và xã hội toàn cầu.
                    </li>
                  </ul>
                </div>
              </div>
            </article>

            <article
              id="cau-truc"
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-red-600">
                Cấu trúc chương trình các chuyên ngành (Tiến trình học tập theo
                học chế tín chỉ)
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-700">
                Chương trình đào tạo bao gồm các môn bắt buộc chung, bộ môn cơ
                sở, môn chuyên ngành và học phần tự chọn. Sau khi nhập học, sinh
                viên sẽ chọn chuyên ngành phù hợp.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 border-b border-slate-200 pb-4">
                {structureTabs.map((tab) => {
                  const isActive = tab === activeTab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        isActive
                          ? "bg-red-50 text-red-600 shadow-sm"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
              <div className="mt-8 space-y-10">
                {structureSemesters.map((semester) => (
                  <div
                    key={semester.name}
                    className="grid gap-4 xl:grid-cols-[140px_1fr]"
                  >
                    <div className="text-sm font-semibold uppercase text-slate-500">
                      {semester.name}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      {semester.courses.map((course) => (
                        <div
                          key={course.title}
                          className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
                        >
                          <div className="mb-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-600">
                            {course.credit} tín chỉ
                          </div>
                          <div className="text-sm font-semibold text-slate-900">
                            {course.title}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article
              id="hoc-phi"
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-red-600">Học phí</h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
                <p>
                  Học phí đóng theo từng học kỳ, dựa trên số tín chỉ đăng ký.
                  Thời gian đóng học phí là 1 tháng kể từ khi có thông báo của
                  nhà trường.
                </p>
                <p>
                  Học phí theo tín chỉ năm 2022:{" "}
                  <strong>655.000 đ/tín chỉ</strong>.
                </p>
                <p>Lưu ý:</p>
                <ul className="list-outside list-disc space-y-2 pl-5">
                  <li>
                    Thời gian hoàn thành chương trình phụ thuộc vào số tín chỉ
                    đăng ký mỗi học kỳ.
                  </li>
                  <li>
                    Mức học phí điều chỉnh phù hợp với chất lượng đào tạo.
                  </li>
                  <li>
                    Tỷ lệ tăng học phí tối đa không quá 15%/năm theo Nghị định
                    81/2021/NĐ-CP.
                  </li>
                </ul>
              </div>
            </article>

            <article
              id="dieu-kien"
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-red-600">
                Điều kiện tuyển sinh
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
                <div>
                  <p className="font-semibold">1. Đối tượng tuyển sinh</p>
                  <p className="mt-3 font-semibold">a) Quy định chung</p>
                  <ul className="list-outside list-disc space-y-2 pl-5">
                    <li>
                      Thí sinh tốt nghiệp THPT chính quy hoặc giáo dục thường
                      xuyên tại Việt Nam.
                    </li>
                    <li>
                      Hoặc tốt nghiệp trung cấp và có bằng tốt nghiệp THPT hoặc
                      đã hoàn thành đủ khối lượng kiến thức văn hóa THPT.
                    </li>
                    <li>
                      Thí sinh tốt nghiệp chương trình THPT nước ngoài phải đạt
                      trình độ tương đương THPT Việt Nam.
                    </li>
                    <li>Có đủ sức khỏe để học tập theo quy định hiện hành.</li>
                  </ul>
                </div>
                <div>
                  <p className="mt-4 font-semibold">
                    b) Xét tuyển dựa vào kết quả thi THPT
                  </p>
                  <p className="mt-2">
                    Ngoài điều kiện chung, thí sinh cần tham dự kỳ thi tốt
                    nghiệp THPT hàng năm với tổ hợp xét tuyển phù hợp.
                  </p>
                </div>
                <div>
                  <p className="mt-4 font-semibold">c) Xét tuyển kết hợp</p>
                  <p className="mt-2">
                    Ngoài điều kiện chung, thí sinh cần thỏa một trong các điều
                    kiện sau:
                  </p>
                  <ul className="list-outside list-disc space-y-2 pl-5">
                    <li>
                      SAT &gt;= 1130/1600 hoặc ACT &gt;= 25/36, và điểm trung
                      bình lớp 10-12 hoặc học kỳ 1 lớp 12 từ 7,5 trở lên, hạnh
                      kiểm Khá trở lên.
                    </li>
                    <li>
                      IELTS &gt;= 5.5 hoặc TOEFL iBT &gt;= 65 hoặc TOEFL ITP
                      &gt;= 513, và điểm trung bình lớp 10-12 hoặc học kỳ 1 lớp
                      12 từ 7,5 trở lên, hạnh kiểm Khá trở lên.
                    </li>
                    <li>
                      Đạt giải Khuyến khích kỳ thi chọn học sinh giỏi quốc gia,
                      hoặc đã tham gia kỳ thi chọn học sinh giỏi quốc gia, hoặc
                      đạt giải Nhất/Nhì/Ba kỳ thi chọn học sinh giỏi cấp
                      tỉnh/thành phố các môn Toán, Lý, Hóa, Tin học, và điểm
                      trung bình lớp 10-12 hoặc học kỳ 1 lớp 12 từ 7,5 trở lên,
                      hạnh kiểm Khá trở lên.
                    </li>
                    <li>
                      Học sinh chuyên các môn Toán, Lý, Hóa, Tin học của trường
                      THPT chuyên toàn quốc hoặc hệ chuyên các trường THPT trọng
                      điểm, và điểm trung bình lớp 10-12 hoặc học kỳ 1 lớp 12 từ
                      8,0 trở lên, hạnh kiểm Khá trở lên.
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="mt-4 font-semibold">
                    d) Xét tuyển dựa vào kết quả đánh giá năng lực / tư duy
                  </p>
                  <ul className="list-outside list-disc space-y-2 pl-5">
                    <li>
                      Điểm đánh giá năng lực Đại học Quốc gia Hà Nội năm 2022 từ
                      80 điểm trở lên.
                    </li>
                    <li>
                      Điểm đánh giá năng lực Đại học Quốc gia Tp. Hồ Chí Minh
                      năm 2022 từ 700 điểm trở lên.
                    </li>
                    <li>
                      Điểm đánh giá tư duy Đại học Bách khoa Hà Nội năm 2022 từ
                      25 điểm trở lên.
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="mt-4 font-semibold">2. Phạm vi tuyển sinh</p>
                  <p>
                    Học viện tuyển sinh trên phạm vi toàn quốc. Thí sinh đăng ký
                    vào cơ sở đào tạo nào sẽ theo học tại cơ sở đó.
                  </p>
                </div>
                <div>
                  <p className="mt-4 font-semibold">
                    3. Phương thức tuyển sinh
                  </p>
                  <ul className="list-outside list-disc space-y-2 pl-5">
                    <li>
                      Tuyển thẳng và ưu tiên xét tuyển theo Quy chế của Bộ Giáo
                      dục và Đào tạo.
                    </li>
                    <li>Xét tuyển dựa vào kết quả thi tốt nghiệp THPT.</li>
                    <li>
                      Xét tuyển kết hợp giữa kết quả học tập THPT và chứng chỉ
                      quốc tế / thành tích học sinh giỏi.
                    </li>
                    <li>
                      Xét tuyển dựa vào kết quả bài thi đánh giá năng lực hoặc
                      đánh giá tư duy.
                    </li>
                  </ul>
                </div>
              </div>
            </article>

            <article
              id="quy-trinh"
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-red-600">
                Quy trình nhập học
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
                <p>
                  Thí sinh hoàn thành đăng ký xét tuyển theo phương thức phù
                  hợp, nộp hồ sơ và chờ thông báo kết quả từ Học viện.
                </p>
                <ul className="list-outside list-disc space-y-2 pl-5">
                  <li>
                    Đăng ký và nộp hồ sơ xét tuyển theo hướng dẫn của Học viện.
                  </li>
                  <li>
                    Nhận thông báo trúng tuyển và xác nhận nhập học đúng hạn.
                  </li>
                  <li>
                    Hoàn thiện thủ tục nhập học tại cơ sở đào tạo đã đăng ký.
                  </li>
                  <li>
                    Đăng ký môn học, đóng học phí và bắt đầu học kỳ mới theo
                    lịch của nhà trường.
                  </li>
                </ul>
                <p>
                  Chi tiết quy trình sẽ được Học viện công bố trong thông báo
                  tuyển sinh hàng năm.
                </p>
              </div>
            </article>

            <article
              id="tai-lieu"
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-red-600">
                Tài liệu đào tạo
              </h2>
              <div className="mt-4 text-sm leading-7 text-slate-700">
                <p>Chương trình đào tạo gồm các nhóm học phần sau:</p>
                <ul className="mt-3 list-outside list-disc space-y-2 pl-5">
                  <li>Bắt buộc chung</li>
                  <li>Bắt buộc chung nhóm ngành</li>
                  <li>Cơ sở ngành</li>
                  <li>Chuyên ngành</li>
                  <li>Giáo dục chuyên nghiệp</li>
                  <li>Bổ trợ ngành</li>
                  <li>Thực tập</li>
                  <li>Luận văn tốt nghiệp</li>
                </ul>
              </div>
            </article>

            <article
              id="nghe-nghiep"
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-red-600">
                Nghề nghiệp
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
                <p>
                  Sau khi tốt nghiệp, sinh viên có thể làm việc tại các cơ quan,
                  doanh nghiệp trong lĩnh vực công nghệ thông tin, truyền thông,
                  nghiên cứu và quản lý hệ thống.
                </p>
                <ul className="list-outside list-disc space-y-2 pl-5">
                  <li>
                    Các Cục, Vụ: Công nghệ thông tin, Viễn thông, Quản lý phát
                    thanh truyền hình, Ứng dụng công nghệ thông tin, Công nghệ
                    thông tin nghiệp vụ, Thương mại điện tử, Công nghệ thông tin
                    và thống kê hải quan, Công nghệ thông tin, Bưu chính.
                  </li>
                  <li>
                    Các Viện, Trung tâm nghiên cứu: Công nghệ thông tin, Công
                    nghệ phần mềm, Nghiên cứu điện tử - tin học - tự động hóa,
                    Chiến lược thông tin và truyền thông, Internet Việt Nam, Ứng
                    cứu khẩn cấp máy tính, Trung tâm Thông tin trực thuộc
                    Bộ/Tổng cục.
                  </li>
                  <li>
                    Các tập đoàn, tổng công ty: VNPT, Viettel, VTC, GTEL, FPT và
                    các công ty công nghệ thông tin, viễn thông.
                  </li>
                  <li>
                    Các phòng chức năng thuộc Sở Thông tin và Truyền thông, Bưu
                    điện, Sở Khoa học và Công nghệ, phòng Công nghệ thông tin,
                    phòng Quản lý công nghệ, phòng Hệ thống quản trị, phòng An
                    ninh mạng.
                  </li>
                </ul>
              </div>
            </article>
          </section>
        </div>
      </main>
    </div>
  );
}
