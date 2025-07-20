"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ChatBubbleLeftEllipsisIcon,
  EyeIcon,
  PhotoIcon,
  UserIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
  PlusIcon,
  XMarkIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";

export default function AdminDashboard() {
  const router = useRouter();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [adminResponse, setAdminResponse] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    contact_admin: 0,
    completed: 0,
  });

  const statusConfig = {
    pending: {
      label: "รอดำเนินการ",
      icon: ClockIcon,
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      dotColor: "bg-yellow-500",
    },
    in_progress: {
      label: "กำลังดำเนินการ",
      icon: ExclamationCircleIcon,
      color: "bg-blue-100 text-blue-800 border-blue-200",
      dotColor: "bg-blue-500",
    },
    contact_admin: {
      label: "ติดต่อแอดมินทางไลน์",
      icon: ChatBubbleLeftEllipsisIcon,
      color: "bg-purple-100 text-purple-800 border-purple-200",
      dotColor: "bg-purple-500",
    },
    completed: {
      label: "เสร็จสิ้น",
      icon: CheckCircleIcon,
      color: "bg-green-100 text-green-800 border-green-200",
      dotColor: "bg-green-500",
    },
  };

  const problemTypeLabels = {
    youtube_premium:
      "1. ไม่ขึ้นพรีเมี่ยมใช้งานไม่ได้ ซื้อนานแล้ว เฉพาะ Family ก่อนวันที่ 30 มิ.ย. (ไม่เกินวันที่ 30) กรณีนี้หลุดพรีเมี่ยมและต้องขึ้น Family Manager",
    family_plan:
      "กลุ่มครอบครัวไม่พร้อมใช้งาน เช็คหน้า Family แล้วไม่ขึ้นกลุ่มครอบครัว",
    email_not_working:
      "อีเมลร้านติดยืนยัน ใช้งานไม่ได้ ไม่สามารถ Login และต้องยืนยันเบอร์โทร",
    "Google Form":
      "ลูกค้าส่ง Google Form เก่าของทางร้าน เช่น ย้าย Family รวมทั้งกรณีเลือกรับเมลร้าน แต่ยังไม่ได้รับการแก้ไข หรือรับเมล หรือ กลุ่มครอบครัวไม่พร้อมใช้งาน แต่ยังไม่มีสถานะในชีท Update",
  };

  useEffect(() => {
    checkAuth();
    fetchIssues();
  }, [currentPage, filter, searchQuery]);

  const checkAuth = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    // Set up axios default header
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        status: filter !== "all" ? filter : "",
        search: searchQuery,
      });

      const response = await axios.get(
        `https://api.femistyhouse.com/api/admin/issues?${params}`
      );

      if (response.data.success) {
        setIssues(response.data.data.issues);
        setTotalPages(response.data.data.pagination.totalPages);
        setStats(response.data.data.statusSummary);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
      } else {
        toast.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    delete axios.defaults.headers.common["Authorization"];
    toast.success("ออกจากระบบเรียบร้อย");
    router.push("/admin/login");
  };

  const openModal = (issue) => {
    setSelectedIssue(issue);
    setAdminResponse(issue.admin_response || "");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedIssue(null);
    setAdminResponse("");
    setSelectedFiles([]);
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);

    if (files.length + selectedFiles.length > 2) {
      toast.error("อัพโหลดได้สูงสุด 2 รูป");
      return;
    }

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 10MB)");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("รองรับเฉพาะไฟล์รูปภาพ");
        return;
      }
    }

    setSelectedFiles([...selectedFiles, ...files]);
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
  };

  const updateIssue = async (status) => {
    if (!selectedIssue) return;

    try {
      setIsSubmitting(true);

      // Update issue status and response
      const updateData = {
        status,
        adminResponse: adminResponse,
      };

      const response = await axios.put(
        `https://api.femistyhouse.com/api/admin/issues/${selectedIssue.id}`,
        updateData
      );

      if (response.data.success) {
        // Upload admin images if any
        if (selectedFiles.length > 0) {
          const formData = new FormData();
          selectedFiles.forEach((file) => {
            formData.append("images", file);
          });

          try {
            await axios.post(
              `https://api.femistyhouse.com/api/upload/admin-images/${selectedIssue.id}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
          } catch (uploadError) {
            console.error("Upload error:", uploadError);
            toast.error("อัพเดทสำเร็จ แต่อัพโหลดรูปภาพไม่สำเร็จ");
          }
        }

        toast.success("อัพเดทข้อมูลเรียบร้อย");
        closeModal();
        fetchIssues();
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.error || "เกิดข้อผิดพลาดในการอัพเดท");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusCounts = () => {
    if (!stats) return []; // ป้องกัน error
    return [
      {
        key: "all",
        label: "ทั้งหมด",
        count: stats.total || 0,
        color: "bg-slate-500",
      },
      {
        key: "pending",
        label: "รอดำเนินการ",
        count: stats.pending || 0,
        color: "bg-yellow-500",
      },
      {
        key: "in_progress",
        label: "กำลังดำเนินการ",
        count: stats.in_progress || 0,
        color: "bg-blue-500",
      },
      {
        key: "contact_admin",
        label: "ติดต่อแอดมิน",
        count: stats.contact_admin || 0,
        color: "bg-purple-500",
      },
      {
        key: "completed",
        label: "เสร็จสิ้น",
        count: stats.completed || 0,
        color: "bg-green-500",
      },
    ];
  };

  if (loading && issues.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-pink-200">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border-4 border-pink-300 border-t-pink-600 rounded-full animate-spin"></div>
            <span className="text-gray-700 font-medium">
              กำลังโหลดข้อมูล...
            </span>
          </div>
        </div>
      </div>
    );
  }

  const getPagination = (current, total) => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= current - delta && i <= current + delta)
      ) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 text-[#000]">
      {/* Header */}
      <nav className="bg-white/70 backdrop-blur-md border-b border-pink-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <ShieldCheckIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600">ระบบจัดการปัญหา</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-medium shadow-md"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              ออกจากระบบ
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {getStatusCounts().map((stat) => (
            <div
              key={stat.key}
              onClick={() => {
                setFilter(stat.key);
                setCurrentPage(1);
              }}
              className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-200 p-6 cursor-pointer transition-all hover:shadow-2xl transform hover:scale-105 ${
                filter === stat.key ? "ring-2 ring-pink-400" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {stat.count}
                  </p>
                </div>
                <div className={`w-3 h-3 ${stat.color} rounded-full`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-pink-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 text-pink-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="ค้นหาตามรหัสติดตาม, ชื่อลูกค้า, หรือรายละเอียด..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-pink-200 rounded-xl focus:border-pink-400 focus:outline-none transition-all bg-pink-50/30 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <AdjustmentsHorizontalIcon className="w-5 h-5 text-pink-600" />
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-pink-400 focus:outline-none transition-all bg-pink-50/30 focus:bg-white"
              >
                <option value="all">ทุกสถานะ</option>
                <option value="pending">รอดำเนินการ</option>
                <option value="in_progress">กำลังดำเนินการ</option>
                <option value="contact_admin">ติดต่อแอดมิน</option>
                <option value="completed">เสร็จสิ้น</option>
              </select>
            </div>
          </div>
        </div>

        {/* Issues List */}

        <div className="space-y-6">
          {issues.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-pink-200 p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ChartBarIcon className="w-12 h-12 text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">
                ไม่มีข้อมูล
              </h3>
              <p className="text-gray-600">
                ไม่พบปัญหาที่ตรงกับเงื่อนไขการค้นหา
              </p>
            </div>
          ) : (
            issues
              .filter((issue) => {
                const query = searchQuery.toLowerCase();
                return (
                  issue.tracking_code.toLowerCase().includes(query) ||
                  issue.customer_line_name.toLowerCase().includes(query) ||
                  (Array.isArray(issue.emails)
                    ? issue.emails.some((email) =>
                        email.toLowerCase().includes(query)
                      )
                    : false)
                );
              })
              .map((issue) => (
                <div
                  key={issue.id}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-pink-200 overflow-hidden hover:shadow-2xl transition-all"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                      {/* Issue Info */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                              รหัส: {issue.tracking_code}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <UserIcon className="w-4 h-4 text-pink-500" />
                                {issue.customer_line_name}
                              </div>
                              <div className="flex items-center gap-1">
                                <CalendarDaysIcon className="w-4 h-4 text-pink-500" />
                                {formatDate(issue.created_at)}
                              </div>
                            </div>
                          </div>

                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 text-sm font-medium ${
                              statusConfig[issue.status].color
                            }`}
                          >
                            {(() => {
                              const Icon = statusConfig[issue.status].icon;
                              return <Icon className="w-4 h-4" />;
                            })()}
                            {statusConfig[issue.status].label}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              ประเภทปัญหา:
                            </p>
                            <p className="font-medium text-gray-900">
                              {problemTypeLabels[issue.problem_type] ||
                                issue.problem_type}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              อีเมลที่เกี่ยวข้อง:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {(issue.emails || [])
                                .slice(0, 2)
                                .map((email, index) => (
                                  <span
                                    key={index}
                                    className="bg-gradient-to-r from-pink-50 to-rose-50 text-gray-700 px-2 py-1 rounded-lg text-xs border border-pink-200"
                                  >
                                    {email}
                                  </span>
                                ))}
                              {(issue.emails || []).length > 2 && (
                                <span className="text-gray-500 text-xs">
                                  +{(issue.emails || []).length - 2} อื่นๆ
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600 mb-2">
                            รายละเอียดปัญหา:
                          </p>
                          <p className="text-gray-700 bg-gradient-to-br from-pink-50 to-rose-50 p-3 rounded-xl text-sm leading-relaxed border border-pink-100 overflow-scroll">
                            {issue.problem_description.length > 100
                              ? `${issue.problem_description.substring(
                                  0,
                                  100
                                )}...`
                              : issue.problem_description}
                          </p>
                        </div>

                        {/* Images preview */}
                        {issue.customer_images &&
                          issue.customer_images.length > 0 && (
                            <div>
                              <p className="text-sm text-slate-600 mb-2">
                                รูปภาพประกอบ:
                              </p>
                              <div className="flex gap-2">
                                {issue.customer_images
                                  .slice(0, 3)
                                  .map((image, index) => (
                                    <img
                                      key={index}
                                      src={`https://api.femistyhouse.com${image}`}
                                      alt={`รูปภาพ ${index + 1}`}
                                      className="w-16 h-16 object-cover rounded-lg border border-slate-200 cursor-pointer hover:scale-110 transition-transform"
                                      onClick={() =>
                                        window.open(
                                          `https://api.femistyhouse.com${image}`,
                                          "_blank"
                                        )
                                      }
                                    />
                                  ))}
                                {issue.customer_images.length > 3 && (
                                  <div className="w-16 h-16 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center">
                                    <span className="text-xs text-slate-600">
                                      +{issue.customer_images.length - 3}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                      </div>

                      {/* Actions */}
                      <div className="lg:w-48 flex flex-col gap-3">
                        <button
                          onClick={() => openModal(issue)}
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-medium flex items-center justify-center gap-2 transform hover:scale-105 shadow-lg"
                        >
                          <EyeIcon className="w-5 h-5" />
                          จัดการ
                        </button>

                        {issue.admin_response && (
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-xl border border-purple-200">
                            <p className="text-xs text-gray-600 mb-1">
                              ตอบกลับแล้ว:
                            </p>
                            <p className="text-sm text-gray-700 leading-relaxed overflow-hidden">
                              {issue.admin_response.length > 50
                                ? `${issue.admin_response.substring(0, 50)}...`
                                : issue.admin_response}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <div className="flex justify-center">
              <div className="flex items-center gap-2 overflow-x-auto max-w-full px-2 py-2 rounded-lg bg-white shadow-sm scrollbar-hide">
                {/* ปุ่มก่อนหน้า */}
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex-shrink-0 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ก่อนหน้า
                </button>

                {/* ปุ่มเลขหน้า */}
                {getPagination(currentPage, totalPages).map((item, index) =>
                  item === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="flex-shrink-0 px-3 py-2 text-sm text-gray-500 select-none"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setCurrentPage(item)}
                      className={`flex-shrink-0 px-3 py-2 text-sm rounded-lg transition-colors ${
                        currentPage === item
                          ? "bg-purple-600 text-white shadow"
                          : "bg-white border border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}

                {/* ปุ่มถัดไป */}
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex-shrink-0 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ถัดไป
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedIssue && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-600 to-slate-800 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">จัดการปัญหา</h2>
                  <p className="text-slate-200">
                    รหัส: {selectedIssue.tracking_code}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-slate-300 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
              <div className="space-y-6">
                {/* Issue Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">
                      ข้อมูลลูกค้า
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-slate-600">ชื่อไลน์:</span>{" "}
                        {selectedIssue.customer_line_name}
                      </p>
                      <p>
                        <span className="text-slate-600">ประเภทปัญหา:</span>{" "}
                        {problemTypeLabels[selectedIssue.problem_type]}
                      </p>
                      <p>
                        <span className="text-slate-600">วันที่แจ้ง:</span>{" "}
                        {formatDate(selectedIssue.created_at)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">
                      อีเมลที่เกี่ยวข้อง
                    </h3>
                    <div className="space-y-1">
                      {(selectedIssue.emails || []).map((email, index) => (
                        <div
                          key={index}
                          className="bg-slate-100 px-3 py-2 rounded-lg text-sm"
                        >
                          {email}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Problem Description */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">
                    รายละเอียดปัญหา
                  </h3>
                  <div
                    className="bg-slate-50 p-4 rounded-xl border border-slate-200 
    max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100"
                  >
                    <p className="text-slate-700 whitespace-pre-wrap break-words leading-relaxed">
                      {selectedIssue.problem_description}
                    </p>
                  </div>
                </div>

                {/* Customer Images */}
                {selectedIssue.customer_images &&
                  selectedIssue.customer_images.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3">
                        รูปภาพจากลูกค้า
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {selectedIssue.customer_images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={`https://api.femistyhouse.com${image}`}
                              alt={`รูปภาพ ${index + 1}`}
                              className="w-full h-48 object-cover rounded-xl border border-slate-200 cursor-pointer group-hover:scale-105 transition-transform"
                              onClick={() =>
                                window.open(
                                  `https://api.femistyhouse.com${image}`,
                                  "_blank"
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Admin Response */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">
                    การตอบกลับ
                  </h3>
                  <textarea
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    placeholder="พิมพ์การตอบกลับหรือข้อมูลเพิ่มเติม..."
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-slate-500 focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* File Upload */}
                {/* <div>
                  <h3 className="font-semibold text-slate-900 mb-3">
                    แนบรูปภาพ (ไม่บังคับ)
                  </h3>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-slate-400 transition-colors">
                    <PhotoIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600 mb-2">คลิกเพื่อเลือกรูปภาพ</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                    />
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-slate-50 p-3 rounded-lg"
                        >
                          <span className="text-sm text-slate-700">
                            {file.name}
                          </span>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div> */}
                {/* Modal Footer */}
                <div className="bg-slate-50 px-4 py-4 border-t border-slate-200  overflow-y-scroll">
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                    <button
                      onClick={() => updateIssue("pending")}
                      disabled={isSubmitting}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 disabled:opacity-50 transition-colors w-full sm:w-auto"
                    >
                      รอดำเนินการ
                    </button>
                    <button
                      onClick={() => updateIssue("in_progress")}
                      disabled={isSubmitting}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors w-full sm:w-auto"
                    >
                      กำลังดำเนินการ
                    </button>
                    <button
                      onClick={() => updateIssue("contact_admin")}
                      disabled={isSubmitting}
                      className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 disabled:opacity-50 transition-colors w-full sm:w-auto"
                    >
                      ติดต่อแอดมิน
                    </button>
                    <button
                      onClick={() => updateIssue("completed")}
                      disabled={isSubmitting}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50 transition-colors w-full sm:w-auto"
                    >
                      เสร็จสิ้น
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer
            <div className="bg-slate-50 px-4 py-4 border-t border-slate-200  overflow-y-scroll">
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                <button
                  onClick={() => updateIssue("pending")}
                  disabled={isSubmitting}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 disabled:opacity-50 transition-colors w-full sm:w-auto"
                >
                  รอดำเนินการ
                </button>
                <button
                  onClick={() => updateIssue("in_progress")}
                  disabled={isSubmitting}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors w-full sm:w-auto"
                >
                  กำลังดำเนินการ
                </button>
                <button
                  onClick={() => updateIssue("contact_admin")}
                  disabled={isSubmitting}
                  className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 disabled:opacity-50 transition-colors w-full sm:w-auto"
                >
                  ติดต่อแอดมิน
                </button>
                <button
                  onClick={() => updateIssue("completed")}
                  disabled={isSubmitting}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50 transition-colors w-full sm:w-auto"
                >
                  เสร็จสิ้น
                </button>
              </div>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
}
