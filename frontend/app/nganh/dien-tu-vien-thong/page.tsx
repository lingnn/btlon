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
      { title: "Vật lý 1 và Thí nghiệm", credit: "4" },
      { title: "Xác suất thống kê", credit: "2" },
    ],
  },
  {
    name: "Học kỳ 3",
    courses: [
      { title: "Chủ nghĩa xã hội khoa học", credit: "2" },
      { title: "Tiếng Anh (Course 2)", credit: "4" },
      { title: "Tín hiệu và hệ thống", credit: "3" },
      { title: "Vật lý và Thí nghiệm", credit: "4" },
      { title: "Lý thuyết mạch", credit: "3" },
      { title: "Linh kiện và mạch điện tử", credit: "3" },
    ],
  },
  {
    name: "Học kỳ 4",
    courses: [
      { title: "Tư tưởng Hồ Chí Minh", credit: "2" },
      { title: "Tiếng Anh (Course 3)", credit: "4" },
      { title: "Xử lý tín hiệu số", credit: "3" },
      { title: "Kỹ thuật siêu cao tần", credit: "3" },
      { title: "Điện tử số", credit: "3" },
      { title: "Lý thuyết truyền tin", credit: "3" },
    ],
  },
  {
    name: "Học kỳ 5",
    courses: [
      { title: "Tiếng Anh (Course 3 Plus)", credit: "2" },
      { title: "Lịch sử Đảng cộng sản VN", credit: "2" },
      { title: "Truyền sóng và anten", credit: "3" },
      { title: "Toán rời rạc", credit: "3" },
      { title: "Kỹ thuật lập trình", credit: "3" },
      { title: "Kiến trúc máy tính", credit: "3" },
      { title: "Kỹ thuật vi xử lý", credit: "3" },
    ],
  },
  {
    name: "Học kỳ 6",
    courses: [
      { title: "Hệ điều hành", credit: "2" },
      { title: "Cấu trúc dữ liệu và giải thuật", credit: "3" },
      { title: "Kỹ thuật thông tin quang", credit: "3" },
      { title: "Kỹ thuật mạng truyền thông", credit: "3" },
      { title: "Kỹ thuật thông tin vô tuyến", credit: "2" },
      { title: "Công nghệ phần mềm", credit: "3" },
      { title: "Mô phỏng hệ thống truyền thông", credit: "2" },
    ],
  },
  {
    name: "Học kỳ 7",
    courses: [
      { title: "Phương pháp luận NCKH", credit: "2" },
      { title: "Internet và các giao thức", credit: "3" },
      { title: "Mạng truyền thông và quang", credit: "3" },
      { title: "Thông tin di động", credit: "3" },
      { title: "An toàn mạng thông tin", credit: "3" },
      { title: "Cơ sở dữ liệu", credit: "3" },
    ],
  },
  {
    name: "Học kỳ 8",
    courses: [
      { title: "Điện toán và đám mây", credit: "2" },
      { title: "Lập trình hướng đối tượng", credit: "3" },
      { title: "Tự chọn 1", credit: "2" },
      { title: "Tự chọn 2", credit: "2" },
      { title: "Tự chọn 3", credit: "3" },
      { title: "Tự chọn 4", credit: "3" },
      { title: "Tự chọn 5", credit: "3" },
      { title: "Chuyên đề mạng và dịch vụ Internet", credit: "1" },
    ],
  },
  {
    name: "Học kỳ 9",
    courses: [{ title: "Thực tập và tốt nghiệp", credit: "12" }],
  },
];

export default function DienTuVienThongPage() {
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
            <span>Ngành Kĩ thuật Điện tử Viễn thông</span>
          </div>
          <h1 className="text-4xl font-semibold">
            Ngành Kĩ thuật Điện tử Viễn thông
          </h1>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-4 lg:grid-cols-4">
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Mã ngành</p>
            <p className="mt-4 text-2xl font-semibold text-red-600">7520207</p>
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
                  Ngành Kĩ thuật Điện tử Viễn thông được xây dựng với 3 chuyên
                  ngành: Mạng và dịch vụ Internet, Thông tin vô tuyến và di động
                  và Hệ thống IoT.
                </p>
                <p>
                  Khối lượng chương trình: <strong>150 tín chỉ</strong> (không
                  bao gồm Giáo dục thể chất, Giáo dục quốc phòng và Kỹ năng
                  mềm).
                </p>
                <div className="grid gap-2 rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
                  <div className="font-semibold text-slate-900">Chỉ tiêu</div>
                  <div>Năm 2024: 390</div>
                  <div>Năm 2023: 350</div>
                  <div>Năm 2022: 480</div>
                  <div>Năm 2021: 440</div>
                </div>
                <div className="grid gap-2 rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
                  <div className="font-semibold text-slate-900">
                    Điểm trúng tuyển
                  </div>
                  <div>Năm 2024: 25,75</div>
                  <div>Năm 2023: 25,68</div>
                  <div>Năm 2022: 25,60</div>
                  <div>Năm 2021: 25,65</div>
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
                  <p className="font-semibold">1.1 Về Kiến thức</p>
                  <ul className="mt-3 list-disc space-y-2 pl-5">
                    <li>
                      Hiểu biết cơ bản về các lĩnh vực liên quan đến ngành điện
                      tử viễn thông.
                    </li>
                    <li>
                      Nắm vững phương pháp, công cụ để phân tích, thiết kế, phát
                      triển, vận hành mạng, hệ thống và thiết bị viễn thông.
                    </li>
                    <li>
                      Nắm vững kiến thức về cơ sở dữ liệu, thu thập và phân tích
                      dữ liệu.
                    </li>
                    <li>
                      Vận dụng tốt kiến thức hệ thống thông tin và truyền thông,
                      có khả năng tích hợp hệ thống.
                    </li>
                    <li>
                      Nắm vững kiến thức, công cụ để quản lý và ứng dụng công
                      nghệ truyền thông vào thực tế.
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold">
                    Chuyên ngành Mạng và dịch vụ Internet
                  </p>
                  <ul className="mt-3 list-disc space-y-2 pl-5">
                    <li>
                      Triển khai và phát triển sản phẩm, giải pháp trên nền tảng
                      mạng viễn thông và Internet.
                    </li>
                    <li>Phát triển phần mềm ứng dụng trong viễn thông.</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold">
                    Chuyên ngành Thông tin vô tuyến và di động
                  </p>
                  <ul className="mt-3 list-disc space-y-2 pl-5">
                    <li>
                      Triển khai và phát triển giải pháp truyền thông trên nền
                      tảng công nghệ vô tuyến và mạng di động.
                    </li>
                    <li>Phát triển phần mềm ứng dụng di động.</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold">Chuyên ngành Hệ thống IoT</p>
                  <ul className="mt-3 list-disc space-y-2 pl-5">
                    <li>
                      Triển khai và phát triển sản phẩm truyền thông trên nền
                      tảng mạng Internet và hệ thống IoT.
                    </li>
                    <li>Phát triển phần mềm ứng dụng IoT.</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold">1.2 Về Kỹ năng</p>
                  <ul className="mt-3 list-disc space-y-2 pl-5">
                    <li>
                      Đạo đức nghề nghiệp, trung thực, trách nhiệm và tin cậy.
                    </li>
                    <li>
                      Thành thạo kỹ năng tổ chức, sắp xếp công việc, làm việc
                      độc lập và tự tin.
                    </li>
                    <li>
                      Thực hành xây dựng mục tiêu cá nhân và phát triển sự
                      nghiệp.
                    </li>
                    <li>
                      Thành thạo tiếng Anh chuyên ngành, tin học và ứng dụng
                      trong công việc.
                    </li>
                    <li>Phát hiện, phân tích và đánh giá vấn đề kỹ thuật.</li>
                    <li>Lập luận tư duy và xử lý thông tin định lượng.</li>
                    <li>
                      Nghiên cứu, khám phá thông tin và triển khai thí nghiệm
                      thực tế.
                    </li>
                    <li>Tư duy hệ thống, logic và phân tích đa chiều.</li>
                    <li>
                      Hiểu rõ bối cảnh xã hội, lịch sử và văn hóa trong lĩnh vực
                      chuyên môn.
                    </li>
                    <li>
                      Làm việc thành công trong tổ chức và nắm rõ văn hóa doanh
                      nghiệp.
                    </li>
                    <li>
                      Vận dụng kiến thức, kỹ năng vào thực tiễn và quản lý dự
                      án.
                    </li>
                    <li>
                      Phát triển sáng tạo và dẫn dắt thay đổi nghề nghiệp.
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold">1.3 Về Kỹ năng mềm</p>
                  <ul className="mt-3 list-disc space-y-2 pl-5">
                    <li>Làm việc theo nhóm và thích ứng với sự thay đổi.</li>
                    <li>Quản lý và lãnh đạo nhóm hiệu quả.</li>
                    <li>
                      Giao tiếp văn bản, email và truyền thông chuyên nghiệp.
                    </li>
                    <li>
                      Phát triển bản thân, cập nhật thông tin và thích ứng môi
                      trường quốc tế.
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold">
                    1.4 Về Năng lực tự chủ và trách nhiệm
                  </p>
                  <ul className="mt-3 list-disc space-y-2 pl-5">
                    <li>
                      Sẵn sàng đương đầu rủi ro, kiên trì, linh hoạt và tự tin.
                    </li>
                    <li>
                      Thích ứng với thực tế phức tạp, tự học và quản lý bản
                      thân.
                    </li>
                    <li>
                      Có ý thức nghề nghiệp, trách nhiệm công dân và sáng tạo.
                    </li>
                    <li>
                      Khả năng tự định hướng và nâng cao trình độ chuyên môn.
                    </li>
                    <li>
                      Sáng kiến khi thực hiện nhiệm vụ và đánh giá cải tiến hoạt
                      động chuyên môn.
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold">1.5 Về Hành vi đạo đức</p>
                  <ul className="mt-3 list-disc space-y-2 pl-5">
                    <li>
                      Phẩm chất đạo đức tốt, lễ độ, khiêm tốn, trung thực và
                      chính trực.
                    </li>
                    <li>
                      Tinh thần trách nhiệm, tin cậy và nhiệt tình trong công
                      việc.
                    </li>
                    <li>Chấp hành pháp luật và có ý thức bảo vệ Tổ quốc.</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold">1.6 Về Ngoại ngữ</p>
                  <ul className="mt-3 list-disc space-y-2 pl-5">
                    <li>Đạt trình độ TOEIC 450 hoặc tương đương.</li>
                    <li>
                      Sử dụng tiếng Anh phục vụ học tập, nghiên cứu và hòa nhập
                      quốc tế.
                    </li>
                    <li>
                      Thành thạo nghe, nói, đọc, viết và tiếng Anh chuyên ngành.
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
                Cấu trúc chương trình
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-700">
                Chương trình đào tạo gồm các môn bắt buộc chung, cơ sở ngành,
                chuyên ngành và học phần tự chọn.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 border-b border-slate-200 pb-4">
                {structureSemesters.map((semester) => (
                  <div
                    key={semester.name}
                    className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                    {semester.name}
                  </div>
                ))}
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
                          <div className="mb-2 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-600">
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
              id="nghe-nghiep"
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-red-600">
                Nghề nghiệp
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    Làm tại phòng Kỹ thuật các đài truyền hình, đài phát thanh
                    và các phòng chức năng của Sở Thông tin và Truyền thông, Bưu
                    điện.
                  </li>
                  <li>
                    Cán bộ nghiên cứu, giảng dạy về viễn thông tại viện nghiên
                    cứu và cơ sở đào tạo.
                  </li>
                  <li>Kỹ sư vận hành, giám sát hạ tầng truyền thông.</li>
                  <li>
                    Kỹ sư phát triển ứng dụng cho doanh nghiệp viễn thông và
                    Internet.
                  </li>
                  <li>Chuyên gia kỹ thuật triển khai hệ thống ICT.</li>
                  <li>
                    Quản lý, điều hành cơ quan nhà nước liên quan viễn thông và
                    CNTT.
                  </li>
                </ul>
                <p>
                  Có khả năng học lên Thạc sĩ, Tiến sĩ và thực hiện đề tài
                  nghiên cứu khoa học.
                </p>
              </div>
            </article>

            <article
              id="hoc-phi"
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-red-600">Học phí</h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
                <p>
                  Học phí thanh toán theo số tín chỉ mỗi học kỳ. Thời gian đóng
                  học phí là 1 tháng kể từ khi có thông báo của nhà trường.
                </p>
                <p>
                  Học phí theo tín chỉ năm 2022:{" "}
                  <strong>655.000 đ/tín chỉ</strong>.
                </p>
                <p>Lưu ý:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    Thời gian hoàn thành chương trình phụ thuộc vào số tín chỉ
                    đăng ký.
                  </li>
                  <li>Học phí điều chỉnh phù hợp với chất lượng đào tạo.</li>
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
                  <ul className="list-disc space-y-2 pl-5">
                    <li>
                      Thí sinh tốt nghiệp THPT chính quy hoặc giáo dục thường
                      xuyên tại Việt Nam.
                    </li>
                    <li>
                      Hoặc tốt nghiệp trung cấp và hoàn thành đủ khối lượng kiến
                      thức văn hóa THPT.
                    </li>
                    <li>
                      Thí sinh tốt nghiệp THPT nước ngoài phải đạt trình độ
                      tương đương THPT Việt Nam.
                    </li>
                    <li>Có đủ sức khỏe để học tập theo quy định hiện hành.</li>
                  </ul>
                </div>
                <div>
                  <p className="mt-4 font-semibold">
                    b) Xét tuyển dựa vào kết quả thi THPT
                  </p>
                  <p>
                    Ngoài điều kiện chung, thí sinh tham dự kỳ thi tốt nghiệp
                    THPT với tổ hợp phù hợp.
                  </p>
                </div>
                <div>
                  <p className="mt-4 font-semibold">c) Xét tuyển kết hợp</p>
                  <p>
                    Ngoài điều kiện chung, thí sinh cần thỏa một trong các điều
                    kiện sau:
                  </p>
                  <ul className="list-disc space-y-2 pl-5">
                    <li>
                      SAT &gt;= 1130/1600 hoặc ACT &gt;= 25/36 và điểm trung
                      bình lớp 10-12 hoặc học kỳ 1 lớp 12 từ 7,5 trở lên, hạnh
                      kiểm Khá trở lên.
                    </li>
                    <li>
                      IELTS &gt;= 5.5 hoặc TOEFL iBT &gt;= 65 hoặc TOEFL ITP
                      &gt;= 513 và điểm trung bình lớp 10-12 hoặc học kỳ 1 lớp
                      12 từ 7,5 trở lên, hạnh kiểm Khá trở lên.
                    </li>
                    <li>
                      Đạt giải Khuyến khích kỳ thi chọn HSG quốc gia, hoặc giải
                      Nhất/Nhì/Ba kỳ thi chọn HSG cấp tỉnh/thành phố các môn
                      Toán, Lý, Hóa, Tin học và điểm trung bình lớp 10-12 hoặc
                      học kỳ 1 lớp 12 từ 7,5 trở lên, hạnh kiểm Khá trở lên.
                    </li>
                    <li>
                      Học sinh chuyên Toán, Lý, Hóa, Tin học của trường THPT
                      chuyên hoặc hệ chuyên trọng điểm và điểm trung bình lớp
                      10-12 hoặc học kỳ 1 lớp 12 từ 8,0 trở lên, hạnh kiểm Khá
                      trở lên.
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="mt-4 font-semibold">
                    d) Xét tuyển dựa vào kết quả đánh giá năng lực/tư duy
                  </p>
                  <ul className="list-disc space-y-2 pl-5">
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
                  <ul className="list-disc space-y-2 pl-5">
                    <li>
                      Tuyển thẳng và ưu tiên xét tuyển theo Quy chế hiện hành
                      của Bộ Giáo dục và Đào tạo.
                    </li>
                    <li>Xét tuyển dựa vào kết quả thi tốt nghiệp THPT.</li>
                    <li>
                      Xét tuyển kết hợp kết quả học tập THPT và chứng chỉ quốc
                      tế/thành tích học sinh giỏi.
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
                  Thí sinh thực hiện đăng ký xét tuyển, nộp hồ sơ, chờ thông báo
                  kết quả và xác nhận nhập học đúng hạn.
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    Đăng ký và nộp hồ sơ xét tuyển theo hướng dẫn của Học viện.
                  </li>
                  <li>
                    Nhận thông báo trúng tuyển và xác nhận nhập học đúng hạn.
                  </li>
                  <li>Hoàn thiện thủ tục nhập học tại cơ sở đào tạo.</li>
                  <li>
                    Đăng ký môn học, đóng học phí và bắt đầu học kỳ theo lịch
                    nhà trường.
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
                <p>Chương trình đào tạo gồm các nhóm học phần:</p>
                <ul className="list-disc space-y-2 pl-5">
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
          </section>
        </div>
      </main>
    </div>
  );
}
