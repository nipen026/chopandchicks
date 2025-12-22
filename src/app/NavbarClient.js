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
      const localStorage = window.localStorage;
      const authToken = localStorage.getItem("auth-token");
      if ( session?.access_token) {
        localStorage.setItem("auth-token", JSON.stringify(session?.access_token));
        localStorage.setItem("userId", session?.user?.id);
      } else {
        localStorage.removeItem("auth-token");
        localStorage.removeItem("userId");
      }

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
