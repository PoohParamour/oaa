import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono", 
  subsets: ["latin"],
});

export const metadata = {
  title: "ระบบแจ้งปัญหา - OAA Issue Tracker",
  description: "ระบบแจ้งปัญหาออนไลน์ สำหรับลูกค้า",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-pink-50 min-h-screen `}
      >
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fdf2f8',
              color: '#831843',
              border: '2px solid #f9a8d4',
              borderRadius: '12px',
              fontWeight: '500'
            },
            success: {
              style: {
                background: '#f0fdf4',
                color: '#166534',
                border: '2px solid #86efac'
              }
            },
            error: {
              style: {
                background: '#fef2f2',
                color: '#991b1b',
                border: '2px solid #fca5a5'
              }
            }
          }}
        />
      </body>
    </html>
  );
}
