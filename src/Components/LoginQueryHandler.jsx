"use client";

import { useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function LoginQueryHandler({ onLogin }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const loginParam = searchParams.get("login");

    if (loginParam === "true") {
      onLogin(true);

      const params = new URLSearchParams(searchParams.toString());
      params.delete("login");

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, pathname, router, onLogin]);

  return null;
}
