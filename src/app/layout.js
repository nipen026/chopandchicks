import "./globals.css";
import NavbarClient from "./NavbarClient";
import Footer from "../Common/Footer";

export const metadata = {
  title: "Chop & Chicks",
  description: "Fresh chicken delivery app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#F5F7FA]">
        <NavbarClient />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
