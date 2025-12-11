import Navbar from "../Common/Navbar";
import "./globals.css";
import Footer from "../Common/Footer";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";


export const metadata = {
  title: "Chop & Chicks",
  description: "Fresh chicken delivery app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#F5F7FA]">
         <Suspense fallback={null}>
        <Navbar />
        </Suspense>
        <Toaster/>
        <main className="">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
