import Link from "next/link";
import { DocumentTextIcon, MagnifyingGlassIcon, CogIcon, SparklesIcon, HeartIcon, StarIcon } from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      {/* Header/Navbar */}
      <nav className="bg-white/70 backdrop-blur-md border-b border-pink-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                <HeartIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Femistyhouse Support
              </h1>
            </div>
            {/* <Link 
              href="/admin/login"
              className="text-pink-600 hover:text-pink-700 text-sm font-medium transition-colors flex items-center gap-2"
            >
              <CogIcon className="w-4 h-4" />
              Admin Login
            </Link> */}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-md">
              <SparklesIcon className="w-4 h-4" />
              ระบบแจ้งปัญหาออนไลน์
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                แจ้งปัญหาได้ง่าย
              </span>
              <br />
              <span className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
                ติดตามได้ทันที
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              ระบบจัดการปัญหาที่ทันสมัย รวดเร็ว และใช้งานง่าย 
              พร้อมการติดตามสถานะแบบเรียลไทม์
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Report Issue */}
            <Link href="/report" className="group block">
              <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 text-center border border-pink-100 hover:border-pink-300 group-hover:scale-105 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 to-rose-400"></div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <DocumentTextIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-3">
                    แจ้งปัญหา
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    รายงานปัญหาพร้อมรายละเอียด
                    และรับรหัสติดตามทันที
                  </p>
                  <div className="inline-flex items-center text-pink-600 font-semibold group-hover:text-pink-700 transition-colors">
                    เริ่มแจ้งปัญหา
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Track Status */}
            <Link href="/track" className="group block">
              <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 text-center border border-pink-100 hover:border-pink-300 group-hover:scale-105 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-400 to-pink-400"></div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <MagnifyingGlassIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-3">
                    ติดตามสถานะ
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    ตรวจสอบความคืบหน้า
                    และรับการอัพเดทล่าสุด
                  </p>
                  <div className="inline-flex items-center text-rose-600 font-semibold group-hover:text-rose-700 transition-colors">
                    ติดตามสถานะ
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Admin Panel
            <Link href="/admin/login" className="group block">
              <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 text-center border border-pink-100 hover:border-pink-300 group-hover:scale-105 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 to-pink-400"></div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <CogIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                    ระบบจัดการ
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    สำหรับผู้ดูแลระบบ
                    จัดการและตอบกลับปัญหา
                  </p>
                  <div className="inline-flex items-center text-purple-600 font-semibold group-hover:text-purple-700 transition-colors">
                    เข้าสู่ระบบ
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link> */}
          </div>
        </div>

        {/* Guidelines Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-pink-200 shadow-xl">
            <h3 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-400 rounded-lg flex items-center justify-center shadow-md">
                <StarIcon className="w-5 h-5 text-white" />
              </div>
              แนวทางการใช้งาน
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100">
                <h4 className="font-semibold text-pink-800 mb-3 flex items-center gap-2">
                  <HeartIcon className="w-5 h-5 text-pink-600" />
                  เคล็ดลับการแจ้งปัญหา
                </h4>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-pink-400 mt-1">•</span>
                    <span>อธิบายปัญหาให้ละเอียดและชัดเจน</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-400 mt-1">•</span>
                    <span>แนบหลักฐานหรือภาพประกอบ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-400 mt-1">•</span>
                    <span>ระบุขั้นตอนที่ทำให้เกิดปัญหา</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-100">
                <h4 className="font-semibold text-rose-800 mb-3 flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-rose-600" />
                  ข้อควรระวัง
                </h4>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 mt-1">•</span>
                    <span>แจ้งปัญหาเพียงครั้งเดียวต่อปัญหา</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 mt-1">•</span>
                    <span>เก็บรหัสติดตามไว้อย่างปลอดภัย</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 mt-1">•</span>
                    <span>รอการตอบกลับจากแอดมิน</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
