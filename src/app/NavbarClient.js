"use client";

import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../Common/Navbar";
import { Toaster } from "react-hot-toast";

export default function NavbarClient() {
  useEffect(() => {
    // Initial session check (on refresh)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.access_token) {
        localStorage.setItem("auth-token", data.session.access_token);
        localStorage.setItem("userId", data.session.user.id);
      } else {
        localStorage.removeItem("auth-token");
        localStorage.removeItem("userId");
      }
    });

    // Listen auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.access_token) {
          localStorage.setItem("auth-token", session.access_token);
          localStorage.setItem("userId", session.user.id);
        } else {
          localStorage.removeItem("auth-token");
          localStorage.removeItem("userId");
        }

        // 🔥 notify same tab
        window.dispatchEvent(new Event("auth-change"));
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <Navbar />
      <Toaster />
    </>
  );
}
