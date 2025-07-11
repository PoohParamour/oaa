'use client';

import { useState } from 'react';
import Link from "next/link";
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  QuestionMarkCircleIcon, 
  HeartIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";

export default function FAQ() {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const faqs = [
    {
      id: 1,
      title: "วิธีตรวจสอบอีเมลหัวหน้ากลุ่ม Family (Family Manager)",
      icon: InformationCircleIcon,
      color: "from-blue-400 to-indigo-500",
      bgColor: "from-blue-50 to-indigo-50",
      content: (
        <div className="space-y-4 md:space-y-6">
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-pink-200">
            <h4 className="font-semibold text-pink-800 mb-3 flex items-center gap-2 text-sm md:text-base">
              <ExclamationTriangleIcon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
              ทำไมต้องตรวจสอบ?
            </h4>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed">
              เพื่อให้ร้านสามารถดำเนินการแก้ไขปัญหาได้อย่างรวดเร็ว ลูกค้าควรตรวจสอบอีเมลหัวหน้ากลุ่ม Family (Family Manager) ก่อนแจ้งปัญหา
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-base">
              <CheckCircleIcon className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
              ขั้นตอนการตรวจสอบ:
            </h4>
            <ol className="space-y-3 md:space-y-4 text-gray-700">
              <li className="flex gap-2 md:gap-3">
                <span className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold">1</span>
                <div className="min-w-0 flex-1">
                  <span className="text-sm md:text-base">เข้าไปที่ลิงก์ด้านล่าง:</span>
                  <br />
                  <a 
                    href="https://myaccount.google.com/u/0/family/details?continue=https://myaccount.google.com/u/9/people-and-sharing?utm_source%3Dsign_in_no_continue&utm_source=sign_in_no_continue&pageId=none"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:text-pink-700 underline mt-2 inline-block text-sm md:text-base break-words"
                  >
                    คลิกที่นี่เพื่อตรวจสอบ Family
                  </a>
                </div>
              </li>
              <li className="flex gap-2 md:gap-3">
                <span className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold">2</span>
                <span className="text-sm md:text-base break-words"><strong>ล็อกอินเพียงแค่อีเมลเดียวเท่านั้น</strong></span>
              </li>
              <li className="flex gap-2 md:gap-3">
                <span className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold">3</span>
                <span className="text-sm md:text-base break-words">ตรวจสอบอีเมลมุมขวาบนว่าตรงกับอีเมลที่ใช้เข้าร่วมกับทางร้านหรือไม่</span>
              </li>
              <li className="flex gap-2 md:gap-3">
                <span className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold">4</span>
                <span className="text-sm md:text-base break-words">หากขึ้นว่ามีอีเมล "Family Manager" หรือแสดงชื่อหัวหน้าครอบครัว ให้คลิกที่อีเมลดังกล่าว</span>
              </li>
            </ol>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-green-200">
            <h4 className="font-semibold text-green-800 mb-3 text-sm md:text-base">วิธีการแจ้งปัญหา:</h4>
            <p className="text-gray-700 text-sm md:text-base break-words">
              กรุณาระบุอีเมลหัวหน้าครอบครัว เช่น <code className="bg-green-100 px-2 py-1 rounded text-green-800 text-xs md:text-sm break-all">หัวแฟม: yourfamilyemail@gmail.com</code>
            </p>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "กรณีตรวจสอบแล้วพบว่ามี Family Manager",
      icon: CheckCircleIcon,
      color: "from-green-400 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
      content: (
        <div className="space-y-4 md:space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-green-200">
            <h4 className="font-semibold text-green-800 mb-3 text-sm md:text-base">หากพบอีเมลหัวหน้าครอบครัว (Family Manager):</h4>
            <ul className="space-y-2 md:space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1 flex-shrink-0">•</span>
                <span className="text-sm md:text-base break-words">ทางร้านจะสามารถแก้ไขลิมิต 12 เดือนให้ได้</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1 flex-shrink-0">•</span>
                <span className="text-sm md:text-base break-words">ลูกค้าจะถูกย้ายออกจากกลุ่มเก่า และจะเข้ากลุ่มใหม่ตามรอบบิล</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1 flex-shrink-0">•</span>
                <span className="text-sm md:text-base break-words">ร้านจะสร้าง Group Line เพื่อแจ้งรายละเอียดรอบบิล</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-3 text-sm md:text-base">เงื่อนไขในการแจ้ง:</h4>
            <ul className="space-y-2 md:space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-1 flex-shrink-0">•</span>
                <span className="text-sm md:text-base break-words">กรุณาระบุอีเมลหัวแฟมในช่องแจ้งปัญหา</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-1 flex-shrink-0">•</span>
                <span className="font-semibold text-red-600 text-sm md:text-base break-words">ไม่กดออกจากกลุ่มครอบครัวเด็ดขาด</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "กรณีขึ้นกลุ่มครอบครัวไม่พร้อมใช้งานและเมลอีเมลร้านมีปัญหา",
      icon: ExclamationTriangleIcon,
      color: "from-yellow-400 to-orange-500",
      bgColor: "from-yellow-50 to-orange-50",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200">
            <p className="text-gray-700 mb-4">
              ทางร้านจะแจ้งแนวทางแก้ไขหากต้องใช้เวลาในการแก้ไขเป็นระยะเวลานาน หรือไม่สามารถแก้ไขได้ ทางร้านจะแนะนำวิธีที่ดีที่สุด และมีทั้งสองวิธี
            </p>
            <p className="text-gray-700">
              ทั้งวิธีที่สามารถใช้ได้โดยไม่มีปัญหาใดๆแต่ต้องเพิ่มเงินอัพเป็นแพคเกจอื่นหรือวิธีที่ไม่ต้องจ่ายเพิ่มใช้งานได้ลื่นไหล แบบแฟมิลี่เหมือนเดิม ใช้ฟรีได้ตลอด โดยจะมีเงื่อนไขบางข้อที่ต้องยอมรับให้กับทางร้าน
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="bg-pink-50 p-3 md:p-4 rounded-xl border border-pink-200">
              <h4 className="font-semibold text-pink-800 mb-3 flex items-center gap-2 text-sm md:text-base">
                <ClockIcon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                ระยะเวลาการแก้ไข
              </h4>
              <ul className="space-y-2 text-gray-700 text-xs md:text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-pink-500 mt-1 flex-shrink-0">•</span>
                  <span className="break-words">หากสามารถแก้ไขได้โดยง่าย จะใช้เวลา <strong>1-2 วัน</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-500 mt-1 flex-shrink-0">•</span>
                  <span className="break-words">หากติดปัญหาอื่นเพิ่มเติมจะใช้เวลา <strong>4-7 วัน</strong></span>
                </li>
              </ul>
            </div>

            <div className="bg-rose-50 p-3 md:p-4 rounded-xl border border-rose-200">
              <h4 className="font-semibold text-rose-800 mb-3 text-sm md:text-base">อีเมลร้านมีปัญหา</h4>
              <p className="text-gray-700 text-xs md:text-sm break-words">
                ทางร้านจะแจ้งแนวทางและวิธีแก้ไขในการตอบกลับของแอดมิน โดยใช้เวลา <strong>1-7 วัน</strong>ในการดำเนินการค่ะ
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "ลูกค้าที่เคยส่ง Google Form แล้ว",
      icon: XCircleIcon,
      color: "from-red-400 to-pink-500",
      bgColor: "from-red-50 to-pink-50",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-2xl border border-red-200">
            <h4 className="font-semibold text-red-800 mb-3">เหตุผลที่ร้านยกเลิกการใช้ Google Form:</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>ไม่สามารถเช็คอีเมลได้อย่างแม่นยำ</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>ระบบสับสน เกิดการตกหล่น</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>การยืนยันหัวหน้า Family ซ้ำซ้อนและล่าช้า</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>กรณีทางร้านแก้ไขและเชิญแฟมิลี่ใหม่จากฟอร์มเดิมและมีปัญหา หากขึ้นกลุ่มครอบครัวไม่พร้อมใช้งาน ต้องเลือกปัญหา กลุ่มพร้อมไม่พร้อมใช้งาน</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
            <h4 className="font-semibold text-green-800 mb-3">ทางแก้:</h4>
            <p className="text-gray-700">
              กรุณาทำตามขั้นตอนใน <Link href="#faq-1" className="text-blue-600 hover:text-blue-700 underline font-semibold">FAQ 1</Link> เพื่อให้ร้านสามารถดำเนินการต่อได้อย่างรวดเร็ว
            </p>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "ระยะเวลาในการดำเนินการ & ข้อแนะนำให้แก้ไขไวขึ้น",
      icon: ClockIcon,
      color: "from-indigo-400 to-purple-500",
      bgColor: "from-indigo-50 to-purple-50",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
            <h4 className="font-semibold text-green-800 mb-3">⚡ ข้อสำคัญ:</h4>
            <p className="text-gray-700 font-semibold">
              หากลูกค้า "ห้ามออกจาก Family เดิม" ร้านจะสามารถดำเนินการใช้เมลเดิมต่อได้ทันที
            </p>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-2xl border border-red-200">
            <h4 className="font-semibold text-red-800 mb-3">ปัญหาหลัก:</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>หากร้านใช้เมลตัวเองเป็น Host → จะติดยืนยันไม่รู้จบจากระบบ Google</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>ร้านต้องย้ายกลุ่มให้ลูกค้าเพราะกูเกิ้ลยกเลิกแพ็คเกจครอบครัว 90% ของอีเมลหัวหน้ากลุ่ม</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3">วิธีช่วยให้แก้ไขได้เร็วขึ้น:</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>หากลูกค้าคนใดใน Family ยินดีเป็นหัวหน้า (Host) สามารถแจ้งร้านได้</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>เงื่อนไข:</strong> อีเมลใช้งานจริง &gt; 1 ปี</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>ร้านจะคืนยอดที่ต่ออายุ และให้ใช้งานฟรีสำหรับคนที่ต้องการเป็น Host</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>ร้านจะตั้ง Backup Code ให้เท่านั้น ไม่มีผลต่อการใช้งานอีเมล</span>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div className="bg-green-50 p-3 md:p-4 rounded-xl border border-green-200 text-center">
              <h4 className="font-semibold text-green-800 mb-2 text-sm md:text-base">มี Host</h4>
              <p className="text-green-700 font-semibold text-xl md:text-2xl">1-3 วัน</p>
            </div>
            <div className="bg-orange-50 p-3 md:p-4 rounded-xl border border-orange-200 text-center">
              <h4 className="font-semibold text-orange-800 mb-2 text-sm md:text-base">ไม่มี Host</h4>
              <p className="text-orange-700 font-semibold text-xl md:text-2xl">10-14 วัน</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "ขอคืนเงินได้หรือไม่?",
      icon: CurrencyDollarIcon,
      color: "from-red-400 to-rose-500",
      bgColor: "from-red-50 to-rose-50",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-red-50 to-rose-50 p-6 rounded-2xl border border-red-200">
            <h4 className="font-semibold text-red-800 mb-3 text-xl">❌ ขออภัย ไม่สามารถคืนเงินได้</h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>ทางร้านระบุชัดเจนในรายละเอียดว่ารับซื้อภายใต้เงื่อนไข <strong className="text-red-700">No Refund</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>ลูกค้าได้รับแจ้งเงื่อนไขก่อนซื้อทุกครั้งตั้งแต่เปิดให้บริการในเงื่อนไขนี้ ทั้งตอน Add LINE และในหน้าเพจ ทางร้านใช้เงื่อนไขนี้มาตั้งแต่เปิดให้บริการ</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>ทางร้านมีการอัปเดตปัญหาทาง X อย่างต่อเนื่อง และลูกค้าได้ตัดสินใจสั่งซื้อซึ่งบางท่านทางร้านได้เขียนแจ้งปัญหาย้ำเพิ่มเติมว่าอาจพบหากสั่งซื้อ</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: "ช่วงที่ใช้ไม่ได้ ร้านชดเชยยังไง?",
      icon: ShieldCheckIcon,
      color: "from-emerald-400 to-green-500",
      bgColor: "from-emerald-50 to-green-50",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-2xl border border-emerald-200">
            <h4 className="font-semibold text-emerald-800 mb-3">หากลูกค้าแจ้งปัญหา และสถานะเป็น "กำลังดำเนินการ"</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>ร้านจะส่งอีเมลสำรองให้ใช้ชั่วคราวหลังส่งแบบฟอร์มแจ้งปัญหาในเว็บภายใน <strong>24 ชั่วโมง</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>หลังแก้ไขเสร็จ จะชดเชยวันหมดอายุให้ตามจริง</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3">ตัวอย่าง:</h4>
            <div className="space-y-2 text-gray-700">
              <p>• หลุดใช้งานวันที่ <span className="bg-red-100 px-2 py-1 rounded">12/07/68</span> → แก้ไขวันที่ <span className="bg-green-100 px-2 py-1 rounded">19/07/68</span></p>
              <p>• วันหมดอายุจะเลื่อนไปจาก <span className="bg-red-100 px-2 py-1 rounded">12/08/68</span> → เป็น <span className="bg-green-100 px-2 py-1 rounded">19/08/68</span></p>
              <p>• กรณีหลุดวันที่ 25 และแก้ไขในวันที่ 3 เดือนหน้า วันหมดก็จะเลื่อนไปเป็นเดือนถัดไปของวันหมดอายุ (และเป็นวันที่ 3)</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 8,
      title: "ความหมายของสถานะในระบบติดตามปัญหา",
      icon: InformationCircleIcon,
      color: "from-cyan-400 to-blue-500",
      bgColor: "from-cyan-50 to-blue-50",
      content: (
        <div className="space-y-3 md:space-y-4">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-pink-200">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-pink-50 to-rose-50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-pink-800">สถานะ</th>
                  <th className="px-6 py-4 text-left font-semibold text-pink-800">ความหมาย</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="border-b border-pink-100">
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      รอดำเนินการ
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">รอแอดมินตรวจสอบ ใช้เวลา 12 ชม. - 3 วัน</td>
                </tr>
                <tr className="border-b border-pink-100">
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      กำลังดำเนินการ
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">แอดมินเริ่มแก้ไข อาจใช้เวลาเพิ่มหากมีปัญหาทั้งกลุ่ม</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      เสร็จสิ้น
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">แก้ไขเรียบร้อยแล้ว ลูกค้าทำตามคำแนะนำต่อได้เลย</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            <div className="bg-white p-3 rounded-xl border border-pink-200">
              <div className="mb-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  รอดำเนินการ
                </span>
              </div>
              <p className="text-gray-700 text-sm break-words">รอแอดมินตรวจสอบ ใช้เวลา 12 ชม. - 3 วัน</p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-pink-200">
              <div className="mb-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  กำลังดำเนินการ
                </span>
              </div>
              <p className="text-gray-700 text-sm break-words">แอดมินเริ่มแก้ไข อาจใช้เวลาเพิ่มหากมีปัญหาทั้งกลุ่ม</p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-pink-200">
              <div className="mb-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  เสร็จสิ้น
                </span>
              </div>
              <p className="text-gray-700 text-sm break-words">แก้ไขเรียบร้อยแล้ว ลูกค้าทำตามคำแนะนำต่อได้เลย</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 9,
      title: "กรณีทางร้านดำเนินการแก้ไขระยะเวลานาน",
      icon: HeartIcon,
      color: "from-pink-400 to-rose-500",
      bgColor: "from-pink-50 to-rose-50",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-6 rounded-2xl border border-pink-200">
            <p className="text-gray-700 leading-relaxed mb-4">
              เนื่องจากทางร้านได้ตั้งราคาที่ถูกกว่าตลาดการแชร์ Youtube Premium ตลอดการเปิดให้บริการ ราคาต่ำกว่าร้านอื่นค่อนข้างมาก ทางร้านไม่ได้นิ่งนอนใจในการแก้ไขปัญหาของระบบ Family ซึ่งในตอนนี้ค่อนข้างจำนวนมาก จึงทำให้ทางร้านมีงบประมาณจำกัดในการแก้ไขปัญหากับกำไรที่ทางร้านได้ จึงอาจต้องใช้เวลาในการแก้ไขล่าช้า <strong className="text-pink-700">ต้องขออภัยมาใน ณ ที่นี้</strong>
            </p>
            
            <p className="text-gray-700 leading-relaxed">
              ซึ่งทางร้านได้ทำการอัพเกรดระบบ มีทีม <strong className="text-pink-700">7 คน</strong>ในการแก้ไขปัญหาที่เกิดขึ้น ตามกำไรที่ทางได้รับจากลูกค้าแฟมิลี่ทั้งหมด เพื่อให้สามารถดำเนินการแก้ไขได้ไวที่สุด
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5" />
              หากต้องการให้การแก้ไขเป็นไปอย่างรวดเร็วมากขึ้น
            </h4>
            <p className="text-gray-700">
              รบกวนทำตามวิธีการดำเนินการให้ถูกต้อง ส่งข้อมูลที่ร้านได้แจงในหัวข้อปัญหาที่พบให้ครบถ้วนค่ะ
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      {/* Header/Navbar */}
      <nav className="bg-white/70 backdrop-blur-md border-b border-pink-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                <HeartIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Femistyhouse Support
              </h1>
            </Link>
            <Link 
              href="/"
              className="text-pink-600 hover:text-pink-700 text-sm font-medium transition-colors"
            >
              กลับหน้าหลัก
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 px-4">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-md">
              <QuestionMarkCircleIcon className="w-4 h-4" />
              คำถามที่พบบ่อย
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                FAQ
              </span>
              <br />
              <span className="text-pink-600">
                คำถามที่พบบ่อย
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              รวมคำถามและคำตอบที่พบบ่อย พร้อมคำแนะนำในการใช้งาน
              เพื่อให้คุณสามารถแก้ไขปัญหาได้อย่างรวดเร็ว
            </p>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-4 md:space-y-6">
            {faqs.map((faq, index) => {
              const IconComponent = faq.icon;
              const isExpanded = expandedFAQ === index;
              
              return (
                <div 
                  key={faq.id} 
                  id={`faq-${faq.id}`}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-pink-200 shadow-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full p-4 md:p-6 text-left flex items-start md:items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start md:items-center gap-3 md:gap-4 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                        <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm md:text-lg font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent leading-tight break-words">
                          FAQ {faq.id}: {faq.title}
                        </h3>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      {isExpanded ? (
                        <ChevronUpIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
                      )}
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div className="px-4 md:px-6 pb-4 md:pb-6">
                      <div className="md:pl-16 pl-0">
                        {faq.content}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-12 md:mt-16 grid md:grid-cols-2 gap-4 md:gap-6 px-4">
            <Link href="/report" className="group block">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-pink-200 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center shadow-md">
                    <DocumentTextIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-1 text-sm md:text-base">ยังไม่เจอคำตอบ?</h3>
                    <p className="text-gray-600 text-xs md:text-sm">แจ้งปัญหาของคุณได้ที่นี่</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/track" className="group block">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-pink-200 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                    <MagnifyingGlassIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-1 text-sm md:text-base">ติดตามปัญหา</h3>
                    <p className="text-gray-600 text-xs md:text-sm">ตรวจสอบสถานะการแก้ไข</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 