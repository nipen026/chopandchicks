import Navbar from "@/Common/Navbar";
import "./globals.css";
import Footer from "@/Common/Footer";


export const metadata = {
  title: "Chop & Chicks",
  description: "Fresh chicken delivery app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#F5F7FA]">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
