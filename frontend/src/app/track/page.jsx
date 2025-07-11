"use client";

import { useState, useEffect } from "react";
export const dynamic = 'force-dynamic'
import { Suspense } from 'react'
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ChatBubbleLeftEllipsisIcon,
  HeartIcon,
  CalendarDaysIcon,
  UserIcon,
  ShieldCheckIcon,
  SparklesIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";

function TrackPage() {
  const searchParams = useSearchParams();
  const [trackingCode, setTrackingCode] = useState(
    searchParams.get("code") || ""
  );
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const statusConfig = {
    pending: {
      label: "รอดำเนินการ",
      icon: ClockIcon,
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      gradientColor: "from-yellow-400 to-amber-500",
      dotColor: "bg-yellow-500",
      description: "ปัญหาของคุณได้รับการบันทึกแล้ว กำลังรอทีมงานตรวจสอบ",
    },
    in_progress: {
      label: "กำลังดำเนินการ",
      icon: ExclamationCircleIcon,
      color: "bg-blue-100 text-blue-800 border-blue-200",
      gradientColor: "from-blue-400 to-sky-500",
      dotColor: "bg-blue-500",
      description: "ทีมงานกำลังตรวจสอบและดำเนินการแก้ไขปัญหา",
    },
    contact_admin: {
      label: "ติดต่อแอดมินทางไลน์",
      icon: ChatBubbleLeftEllipsisIcon,
      color: "bg-purple-100 text-purple-800 border-purple-200",
      gradientColor: "from-purple-400 to-pink-500",
      dotColor: "bg-purple-500",
      description: "กรุณาติดต่อแอดมินทางไลน์เพื่อข้อมูลเพิ่มเติม",
    },
    completed: {
      label: "เสร็จสิ้น",
      icon: CheckCircleIcon,
      color: "bg-green-100 text-green-800 border-green-200",
      gradientColor: "from-green-400 to-emerald-500",
      dotColor: "bg-green-500",
      description: "ปัญหาได้รับการแก้ไขเรียบร้อยแล้ว",
    },
  };

  const problemTypeLabels = {
    youtube_premium:
      "ไม่ขึ้นพรีเมี่ยมใช้งานไม่ได้ ซื้อนานแล้ว เฉพาะก่ ...",
    family_plan:
      "กลุ่มครอบครัวไม่พร้อมใช้งาน เช็คหน้า Family ...",
    email_not_working:
      "อีเมลร้านติดยืนยัน ใช้งานไม่ได้ ไม่สามารถ Lo ...",
    "Google Form":
      "ลูกค้าส่ง Google Form เก่าของทางร้าน เช่น ...",
  };

  useEffect(() => {
    if (trackingCode) {
      searchIssue();
    }
  }, []);

  const searchIssue = async () => {
    if (!trackingCode.trim()) {
      toast.error("กรุณากรอกรหัสติดตาม");
      return;
    }

    try {
      setLoading(true);
      setSearched(true);

      const response = await axios.get(
        `https://api.femistyhouse.com/api/issues/track/${trackingCode}`
      );

      if (response.data.success) {
        setIssue(response.data.data);
      } else {
        setIssue(null);
        toast.error("ไม่พบข้อมูลปัญหาที่ตรงกับรหัสนี้");
      }
    } catch (error) {
      console.error("Search error:", error);
      setIssue(null);
      if (error.response?.status === 404) {
        toast.error("ไม่พบข้อมูลปัญหาที่ตรงกับรหัสนี้");
      } else {
        toast.error("เกิดข้อผิดพลาดในการค้นหา");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 text-[#000]">
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
              <span className="font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Femistyhouse Support
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-md">
            <MagnifyingGlassIcon className="w-4 h-4" />
            ติดตามสถานะ
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              ติดตามสถานะ
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            ตรวจสอบความคืบหน้าการแก้ไขปัญหาของคุณ
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-pink-200 p-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-gray-800 font-semibold mb-3">
                  รหัสติดตาม
                </label>
                <input
                  type="text"
                  value={trackingCode}
                  onChange={(e) =>
                    setTrackingCode(e.target.value.toUpperCase())
                  }
                  onKeyPress={(e) => e.key === "Enter" && searchIssue()}
                  placeholder="ใส่รหัสติดตาม เช่น OAA123456789"
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-pink-400 focus:outline-none transition-all font-mono text-center bg-pink-50/30 focus:bg-white"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={searchIssue}
                  disabled={loading}
                  className="w-full md:w-auto bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 px-8 rounded-xl hover:from-pink-600 hover:to-rose-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all font-semibold flex items-center justify-center gap-2 transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ค้นหา...
                    </>
                  ) : (
                    <>
                      <MagnifyingGlassIcon className="w-5 h-5" />
                      ค้นหา
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {searched && (
          <div className="max-w-5xl mx-auto">
            {issue ? (
              <div className="space-y-8">
                {/* Status Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-pink-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-pink-400 to-rose-500 p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">สถานะปัญหา</h2>
                        <p className="text-pink-100">
                          รหัสติดตาม: {issue.tracking_code}
                        </p>
                      </div>
                      <div className="text-right">
                        <div
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30`}
                        >
                          {(() => {
                            const config = statusConfig[issue.status];
                            const Icon = config.icon;
                            return (
                              <>
                                <div
                                  className={`w-8 h-8 bg-gradient-to-br ${config.gradientColor} rounded-lg flex items-center justify-center`}
                                >
                                  <Icon className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-semibold">
                                  {config.label}
                                </span>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Issue Details */}
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <UserIcon className="w-5 h-5 text-pink-600" />
                            ข้อมูลผู้แจ้ง
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">ชื่อไลน์:</span>
                              <span className="font-medium text-gray-900">
                                {issue.customer_line_name}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                ประเภทปัญหา:
                              </span>
                              <span className="font-medium text-gray-900">
                                {problemTypeLabels[issue.problem_type] ||
                                  issue.problem_type}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <CalendarDaysIcon className="w-5 h-5 text-pink-600" />
                            เวลา
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">วันที่แจ้ง:</span>
                              <span className="font-medium text-gray-900">
                                {formatDate(issue.created_at)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                อัพเดทล่าสุด:
                              </span>
                              <span className="font-medium text-gray-900">
                                {formatDate(issue.updated_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status Description */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <ShieldCheckIcon className="w-5 h-5 text-pink-600" />
                          สถานะปัจจุบัน
                        </h3>
                        <div
                          className={`p-4 rounded-xl border-2 ${
                            statusConfig[issue.status].color
                          }`}
                        >
                          <p className="text-sm leading-relaxed">
                            {statusConfig[issue.status].description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Problem Description */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-pink-200 p-8">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-6">
                    รายละเอียดปัญหา
                  </h3>

                  <div
                    className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-200 
                    max-h-[300px] overflow-y-auto whitespace-pre-wrap break-words leading-relaxed 
                    scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-pink-100"
                  >
                    <p className="text-gray-800 text-sm">
                      {issue.problem_description}
                    </p>
                  </div>
                </div>

                {/* Emails */}
                {issue.emails && issue.emails.length > 0 && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-pink-200 p-8">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-6">
                      อีเมลที่เกี่ยวข้อง
                    </h3>
                    <div className="grid gap-3">
                      {issue.emails.map((email, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-200"
                        >
                          <span className="text-gray-700 font-mono">
                            {email}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Customer Images */}
                {issue.customer_images && issue.customer_images.length > 0 && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-pink-200 p-8">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-6">
                      รูปภาพประกอบ
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {issue.customer_images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={`https://api.femistyhouse.com${image}`}
                            alt={`รูปภาพประกอบ ${index + 1}`}
                            className="w-full h-64 object-cover rounded-2xl border border-pink-200 group-hover:scale-105 transition-transform duration-300 cursor-pointer shadow-lg"
                            onClick={() =>
                              window.open(
                                `https://api.femistyhouse.com${image}`,
                                "_blank"
                              )
                            }
                          />
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-md">
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                              <UserIcon className="w-4 h-4 text-pink-600" />
                              ลูกค้า
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin Response */}
                {issue.admin_response && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-pink-200 p-8">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-6">
                      การตอบกลับจากแอดมิน
                    </h3>

                    <div
                      className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 
                      max-h-[300px] overflow-y-auto"
                    >
                      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                        {issue.admin_response}
                      </div>
                    </div>

                    {/* Admin Images */}
                    {issue.admin_images && issue.admin_images.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                          รูปภาพจากแอดมิน
                        </h4>
                        <div className="grid md:grid-cols-2 gap-6">
                          {issue.admin_images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={`https://api.femistyhouse.com${image}`}
                                alt={`รูปภาพจากแอดมิน ${index + 1}`}
                                className="w-full h-64 object-cover rounded-2xl border border-purple-200 group-hover:scale-105 transition-transform duration-300 cursor-pointer shadow-lg"
                                onClick={() =>
                                  window.open(
                                    `https://api.femistyhouse.com${image}`,
                                    "_blank"
                                  )
                                }
                              />
                              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-md">
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                  <ShieldCheckIcon className="w-4 h-4 text-purple-600" />
                                  แอดมิน
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-pink-200 p-8">
                  <div className="text-center space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center justify-center gap-2">
                      <SparklesIcon className="w-5 h-5 text-pink-600" />
                      ต้องการความช่วยเหลือเพิ่มเติม?
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                      <Link
                        href="/report"
                        className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 px-6 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-medium text-center transform hover:scale-105 shadow-lg"
                      >
                        แจ้งปัญหาใหม่
                      </Link>
                      <Link
                        href="/"
                        className="flex-1 bg-pink-100 text-pink-700 py-3 px-6 rounded-xl hover:bg-pink-200 transition-colors font-medium text-center"
                      >
                        กลับหน้าหลัก
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* No Results */
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-pink-200 p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MagnifyingGlassIcon className="w-12 h-12 text-pink-400" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">
                  ไม่พบข้อมูล
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  ไม่พบปัญหาที่ตรงกับรหัสติดตามที่ระบุ
                  กรุณาตรวจสอบรหัสให้ถูกต้องและลองใหม่อีกครั้ง
                </p>
                <div className="space-y-3 max-w-sm mx-auto">
                  <p className="text-sm text-gray-500">เคล็ดลับ:</p>
                  <ul className="text-sm text-gray-600 text-left space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-pink-400 mt-1">•</span>
                      <span>ตรวจสอบว่าพิมพ์รหัสติดตามถูกต้อง</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-400 mt-1">•</span>
                      <span>รหัสติดตามจะขึ้นต้นด้วย "OAA"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-400 mt-1">•</span>
                      <span>ลองค้นหาใหม่อีกครั้ง</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>⏳ กำลังโหลดข้อมูล…</div>}>
      <TrackPage />
    </Suspense>
  )
}
