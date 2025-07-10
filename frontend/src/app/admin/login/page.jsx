'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeftIcon, 
  LockClosedIcon, 
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  HeartIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast.error('กรุณากรอกข้อมูลให้ครบ');
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await axios.post('http://localhost:5001/api/admin/login', formData);
      
      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token);
        toast.success('เข้าสู่ระบบสำเร็จ');
        router.push('/admin/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.error || 'เข้าสู่ระบบไม่สำเร็จ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      {/* Header */}
      <nav className="bg-white/70 backdrop-blur-md border-b border-pink-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="flex items-center gap-3 text-pink-600 hover:text-pink-700 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span className="font-medium">กลับหน้าหลัก</span>
            </Link>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-500 rounded-lg flex items-center justify-center shadow-lg">
                <HeartIcon className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">OAA Support</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-80px)]">
        {/* Login Card */}
        <div className="w-full max-w-md">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <ShieldCheckIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Admin Login
            </h1>
            <p className="text-gray-600">
              เข้าสู่ระบบจัดการปัญหา
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-pink-200 overflow-hidden">
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Field */}
                <div>
                  <label className="block text-gray-800 font-semibold mb-3">
                    ชื่อผู้ใช้
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <UserIcon className="w-5 h-5 text-pink-400" />
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-pink-200 rounded-xl focus:border-pink-400 focus:outline-none transition-all bg-pink-50/30 focus:bg-white"
                      placeholder="ระบุชื่อผู้ใช้"
                      autoComplete="username"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-gray-800 font-semibold mb-3">
                    รหัสผ่าน
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <LockClosedIcon className="w-5 h-5 text-pink-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-12 py-3 border-2 border-pink-200 rounded-xl focus:border-pink-400 focus:outline-none transition-all bg-pink-50/30 focus:bg-white"
                      placeholder="ระบุรหัสผ่าน"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-pink-400 hover:text-pink-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all font-semibold transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      กำลังเข้าสู่ระบบ...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <ShieldCheckIcon className="w-5 h-5" />
                      เข้าสู่ระบบ
                    </div>
                  )}
                </button>
              </form>
            </div>

            {/* Footer */}
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 px-8 py-4 border-t border-pink-200">
              <p className="text-center text-gray-500 text-sm">
                สำหรับผู้ดูแลระบบเท่านั้น
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-pink-200">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <LockClosedIcon className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4 text-pink-600" />
                  ความปลอดภัย
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="text-pink-400 mt-1">•</span>
                    <span>ใช้ข้อมูลล็อกอินที่ได้รับจากผู้ดูแลระบบ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-400 mt-1">•</span>
                    <span>ออกจากระบบเมื่อเสร็จสิ้นการใช้งาน</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-400 mt-1">•</span>
                    <span>ไม่แชร์ข้อมูลล็อกอินกับผู้อื่น</span>
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