"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section 
          className="relative text-white py-24 md:py-32 overflow-hidden"
          style={{
            backgroundImage: 'url(/images/about-hero.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-800/90 to-red-900/80"></div>
          
          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6">
              <Link href="/" className="hover:text-red-200 transition-colors flex items-center gap-1">
                <span>🏠</span>
                <span>Giới thiệu</span>
              </Link>
              <span>›</span>
              <span>Tổng quan học viện</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Tổng quan học viện</h1>
            <p className="text-red-100 text-lg max-w-2xl">Khám phá lịch sử, sứ mệnh và tầm nhìn của Học viện Công nghệ Bưu chính Viễn thông</p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* About Institution */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 w-8 bg-red-600 rounded"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Học viện Công nghệ Bưu chính Viễn thông
                </h2>
              </div>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Học viện Công nghệ Bưu chính Viễn thông được thành lập theo quyết định số 516/TT của Thủ tướng Chính phủ ngày 11 tháng 7 năm 1997 trên cơ sở sáp xếp lại 4 đơn vị thành viên thuộc Tổng Công ty Bưu chính Viễn thông Việt Nam, nay là Tập đoàn Bưu chính Viễn thông Việt Nam là Viện Khoa học Kỹ thuật Bưu điện, Viện kinh tế Bưu điện, Trung tâm đào tạo Bưu chính Viễn thông và 2 trường dạy nghề Bưu chính Viễn thông 1 và 2. Các đơn vị thành viên này có bộ máy lãnh đạo, quản lý, đội ngũ giảng viên hàng năm là 1953.
                </p>
                
                <p>
                  Từ năm 1/7/2014, thực hiện Quyết định của Thủ tướng Chính phủ, Bộ Thông tin và Truyền thông đã ban hành Quyết định số 878/QĐ-BTTTT điều chuyển quyền quản lý Học viện Công nghệ Bưu chính Viễn thông về Bộ Thông tin và Truyền thông. Học viện Công nghệ Bưu chính Viễn thông là đơn vị sự nghiệp trực thuộc Bộ. Là trường đại học, đơn vị nghiên cứu, phát triển nguồn nhân lực trong điểm của Ngành Thông tin và Truyền thông.
                </p>
              </div>
            </div>

            {/* Mission & Vision */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 w-8 bg-red-600 rounded"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Sứ mệnh và Tầm nhìn
                </h2>
              </div>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Với thế là đơn vị đào tạo, nghiên cứu trong điểm, chủ lực của Ngành Thông tin và Truyền thông Việt Nam, là trường đại học trong điểm quốc gia trong lĩnh vực ICT, những thành tựu trong gần kết giữa Nghiên cứu – Đào tạo – Sản xuất kinh doanh năng lực, quy mô phát triển của Học viện hôm nay. Học viện sẽ có những đóng góp hiệu quả phục vụ sự phát triển chung của Ngành và sự nghiệp xây dựng, bảo vệ tổ quốc, góp phần để đặt nước, để Ngành Thông tin và Truyền thông Việt Nam có sự tự chủ, độc lập về khoa học công nghệ và nguồn nhân lực.
                </p>
                
                <p>
                  Là trường Đại học, đơn vị nghiên cứu, phát triển nguồn nhân lực trong điểm của Ngành Thông tin và Truyền thông. Học viện sẽ có những đóng góp hiệu quả phục vụ sự phát triển chung của Ngành Thông tin và Truyền thông và sự nghiệp xây dựng, bảo vệ tổ quốc.
                </p>
              </div>
            </div>

            {/* Further Information */}
            <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Thông tin thêm</h3>
              <p className="text-gray-700 mb-4">
                Để biết thêm chi tiết về các chương trình đào tạo, hỗ trợ tuyển sinh và thông tin khác, vui lòng truy cập:
              </p>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold text-gray-900">Trang chủ Học viện:</span>{" "}
                  <a 
                    href="https://ptit.edu.vn" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-700 underline"
                  >
                    ptit.edu.vn
                  </a>
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Cổng tuyển sinh:</span>{" "}
                  <a 
                    href="https://tuyensinh.ptit.edu.vn" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-700 underline"
                  >
                    tuyensinh.ptit.edu.vn
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
