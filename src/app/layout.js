import Navbar from "../Common/Navbar";
import "./globals.css";
import Footer from "../Common/Footer";
import { Toaster } from "react-hot-toast";


export const metadata = {
  title: "Chop & Chicks",
  description: "Fresh chicken delivery app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#F5F7FA]">
        <Navbar />
        <Toaster/>
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
