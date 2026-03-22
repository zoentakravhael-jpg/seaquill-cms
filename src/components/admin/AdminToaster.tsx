"use client";

import { Toaster } from "react-hot-toast";

export default function AdminToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: "10px",
          background: "#0F172A",
          color: "#fff",
          fontSize: "14px",
          padding: "12px 16px",
        },
        success: {
          iconTheme: { primary: "#10B981", secondary: "#fff" },
        },
        error: {
          iconTheme: { primary: "#EF4444", secondary: "#fff" },
        },
      }}
    />
  );
}
