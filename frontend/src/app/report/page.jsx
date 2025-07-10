"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  DocumentTextIcon,
  PhotoIcon,
  XMarkIcon,
  ArrowLeftIcon,
  PlusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";

export default function ReportPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emails, setEmails] = useState([""]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [trackingCode, setTrackingCode] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const problemTypes = [
    {
      value: "youtube_premium",
      label:
        "1. ไม่ขึ้นพรีเมี่ยมใช้งานไม่ได้ ซื้อนานแล้ว เฉพาะก่อนวันที่ 15 มิ.ย. (ไม่เกินวันที่ 15) กรณีนี้หลุดพรีเมี่ยมและต้องขึ้น Family manager",
    },
    {
      value: "family_plan",
      label:
        "2. กลุ่มครอบครัวไม่พร้อมใช้งาน เช็คหน้า Family แล้วไม่ขึ้นกลุ่มครอบครัว",
    },
    {
      value: "email_not_working",
      label:
        "3. อีเมลร้านติดยืนยัน ใช้งานไม่ได้ ไม่สามารถ Login และต้องยืนยันเบอร์โทร",
    },
  ];

  // Handle email fields
  const addEmail = () => {
    if (emails.length < 5) {
      setEmails([...emails, ""]);
    }
  };

  const removeEmail = (index) => {
    if (emails.length > 1) {
      const newEmails = emails.filter((_, i) => i !== index);
      setEmails(newEmails);
    }
  };

  const updateEmail = (index, value) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  // Handle file upload
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

  // Submit form
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Validate emails
      const validEmails = emails.filter((email) => email.trim() !== "");
      if (validEmails.length === 0) {
        toast.error("กรุณากรอกอีเมลอย่างน้อย 1 อีเมล");
        return;
      }

      // Create issue
      const issueData = {
        customerLineName: data.customerLineName,
        emails: validEmails,
        problemType: data.problemType,
        problemDescription: data.problemDescription,
      };

      const response = await axios.post(
        "http://localhost:5001/api/issues",
        issueData
      );

      if (response.data.success) {
        const issueId = response.data.issueId;
        const code = response.data.trackingCode;

        // Upload images if any
        if (selectedFiles.length > 0) {
          const formData = new FormData();
          selectedFiles.forEach((file) => {
            formData.append("images", file);
          });

          try {
            await axios.post(
              `http://localhost:5001/api/upload/admin-images/${issueId}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
          } catch (uploadError) {
            console.error("Upload error:", uploadError);
            toast.error("แจ้งปัญหาสำเร็จ แต่อัพโหลดรูปภาพไม่สำเร็จ");
          }
        }

        setTrackingCode(code);
        setIsSuccess(true);
        toast.success("แจ้งปัญหาเรียบร้อยแล้ว!");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(
        error.response?.data?.error || "เกิดข้อผิดพลาดในการแจ้งปัญหา"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex items-center justify-center p-4 ">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-pink-200">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircleIcon className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">
            แจ้งปัญหาเรียบร้อย! 🎉
          </h1>

          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 mb-6 border border-pink-200">
            <p className="text-sm text-gray-600 mb-3">รหัสติดตามของคุณ:</p>
            <div className="bg-white rounded-xl p-4 border-2 border-dashed border-pink-300">
              <span className="text-xl font-mono font-bold text-pink-600">
                {trackingCode}
              </span>
            </div>
          </div>

          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            โปรดเก็บรหัสนี้ไว้เพื่อติดตามสถานะการแก้ไขปัญหา
            ท่านจะได้รับการแจ้งเตือนเมื่อมีการอัพเดท
          </p>

          <div className="space-y-3">
            <Link
              href={`/track?code=${trackingCode}`}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 px-6 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-medium block transform hover:scale-105 shadow-lg"
            >
              ติดตามสถานะ
            </Link>

            <Link
              href="/"
              className="w-full bg-pink-100 text-pink-700 py-3 px-6 rounded-xl hover:bg-pink-200 transition-colors font-medium block"
            >
              กลับหน้าหลัก
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            <DocumentTextIcon className="w-4 h-4" />
            แจ้งปัญหาใหม่
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              แจ้งปัญหา
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            กรุณากรอกข้อมูลให้ละเอียดเพื่อความรวดเร็วในการแก้ไข
          </p>
        </div>

        {/* Form */}
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-pink-200 overflow-hidden"
          >
            <div className="p-8 space-y-8">
              {/* Customer Name */}
              <div>
                <label className="block text-gray-800 font-semibold mb-3">
                  ชื่อไลน์ลูกค้า <span className="text-pink-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("customerLineName", {
                    required: "กรุณากรอกชื่อไลน์ลูกค้า",
                    minLength: {
                      value: 2,
                      message: "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร",
                    },
                  })}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                    errors.customerLineName
                      ? "border-red-300 focus:border-red-400"
                      : "border-pink-200 focus:border-pink-400 bg-pink-50/30 focus:bg-white"
                  }`}
                  placeholder="ระบุชื่อไลน์ที่ใช้ติดต่อ"
                />
                {errors.customerLineName && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                    <ExclamationTriangleIcon className="w-4 h-4" />
                    {errors.customerLineName.message}
                  </div>
                )}
              </div>

              {/* Problem Type */}
              <div>
                <label className="block text-gray-800 font-semibold mb-3">
                  ประเภทปัญหา <span className="text-pink-500">*</span>
                </label>
                <select
                  {...register("problemType", {
                    required: "กรุณาเลือกประเภทปัญหา",
                  })}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                    errors.problemType
                      ? "border-red-300 focus:border-red-400"
                      : "border-pink-200 focus:border-pink-400 bg-pink-50/30 focus:bg-white"
                  }`}
                >
                  <option value="">-- เลือกประเภทปัญหา --</option>
                  {problemTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.problemType && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                    <ExclamationTriangleIcon className="w-4 h-4" />
                    {errors.problemType.message}
                  </div>
                )}
              </div>

              {/* Email Fields */}
              <div>
                <label className="block text-gray-800 font-semibold mb-3">
                  อีเมลที่เกี่ยวข้อง <span className="text-pink-500">*</span>
                </label>
                <div className="space-y-3">
                  {emails.map((email, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => updateEmail(index, e.target.value)}
                        className="flex-1 px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-pink-400 focus:outline-none transition-all bg-pink-50/30 focus:bg-white"
                        placeholder={`อีเมล ${index + 1}`}
                      />
                      {emails.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEmail(index)}
                          className="px-4 py-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {emails.length < 5 && (
                  <button
                    type="button"
                    onClick={addEmail}
                    className="mt-3 inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                    เพิ่มอีเมล
                  </button>
                )}
              </div>

              {/* Problem Description */}
              <div>
                <label className="block text-gray-800 font-semibold mb-3">
                  รายละเอียดปัญหา <span className="text-pink-500">*</span>
                </label>
                <textarea
                  {...register("problemDescription", {
                    required: "กรุณาอธิบายปัญหา",
                    minLength: {
                      value: 10,
                      message: "รายละเอียดต้องมีอย่างน้อย 10 ตัวอักษร",
                    },
                  })}
                  rows="6"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all resize-none ${
                    errors.problemDescription
                      ? "border-red-300 focus:border-red-400"
                      : "border-pink-200 focus:border-pink-400 bg-pink-50/30 focus:bg-white"
                  }`}
                  placeholder="อธิบายปัญหาที่พบ, ขั้นตอนที่ทำให้เกิดปัญหา, และข้อมูลอื่นที่เกี่ยวข้อง..."
                />
                {errors.problemDescription && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                    <ExclamationTriangleIcon className="w-4 h-4" />
                    {errors.problemDescription.message}
                  </div>
                )}
              </div>

              {/* File Upload */}
            </div>

            {/* Submit Section */}
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 px-8 py-6 border-t border-pink-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 px-6 rounded-xl hover:from-pink-600 hover:to-rose-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all font-semibold text-lg transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    กำลังส่ง...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <SparklesIcon className="w-5 h-5" />
                    ส่งการแจ้งปัญหา
                  </div>
                )}
              </button>

              <p className="text-center text-gray-500 text-sm mt-4">
                การแจ้งปัญหาจะได้รับการตอบกลับภายใน 24 ชั่วโมง
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
