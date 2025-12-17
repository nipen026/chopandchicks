import "./globals.css";
import NavbarClient from "./NavbarClient";
import Footer from "../Common/Footer";
import { Suspense } from "react";
import Loader from "../Components/Loader";
export const metadata = {
  title: "Chop & Chicks",
  description: "Fresh chicken delivery app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#F5F7FA]">
        <NavbarClient />
       <Suspense fallback={<Loader />}>
          <main>{children}</main>
        </Suspense>
        <Footer />
      </body>
    </html>
  );
}
