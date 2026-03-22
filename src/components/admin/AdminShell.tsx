"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebarNew";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";
import AdminToaster from "./AdminToaster";
import KeyboardShortcuts from "./KeyboardShortcuts";

interface AdminShellProps {
  children: React.ReactNode;
  userName: string;
  userRole?: string;
  messageCount?: number;
}

export default function AdminShell({ children, userName, userRole = "admin", messageCount = 0 }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-body">
      <AdminSidebar
        userName={userName}
        userRole={userRole}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        messageCount={messageCount}
      />
      <div className="admin-main">
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          messageCount={messageCount}
        />
        <div className="admin-content">{children}</div>
        <AdminFooter />
      </div>
      <AdminToaster />
      <KeyboardShortcuts />
    </div>
  );
}
