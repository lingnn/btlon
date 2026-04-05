"use client";

import Link from "next/link";
import { CheckCircle, Home, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ApplicationSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-0 shadow-xl text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-700">Nộp hồ sơ thành công!</CardTitle>
          <CardDescription className="text-base">
            Hồ sơ của bạn đã được gửi đi và đang chờ xét duyệt
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4 text-left">
            <h4 className="font-medium text-gray-900 mb-2">Các bước tiếp theo:</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                <span>Hệ thống sẽ xem xét hồ sơ của bạn trong vòng 3-5 ngày làm việc</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                <span>Kết quả sẽ được thông báo qua email và số điện thoại đã đăng ký</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                <span>Bạn có thể tra cứu trạng thái hồ sơ trên hệ thống</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Về trang chủ
              </Link>
            </Button>
            <Button asChild className="flex-1 bg-red-600 hover:bg-red-700">
              <Link href="/profile">
                <FileText className="w-4 h-4 mr-2" />
                Xem hồ sơ
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
