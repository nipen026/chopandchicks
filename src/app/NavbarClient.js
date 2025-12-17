"use client";

import { Suspense, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../Common/Navbar";
import { Toaster } from "react-hot-toast";
import Loader from "../Components/Loader";

export default function NavbarClient() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      console.log("Session:", data.session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth changed:", session);
    });
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      <Toaster />
    </>
  );
}
