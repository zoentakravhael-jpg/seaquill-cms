"use client";

import { useState } from "react";
import Link from "next/link";

export interface LayoutTab {
  key: string;
  label: string;
  icon: string;
}

export interface LayoutSectionProps {
  title: string;
  icon: string;
  iconColor: string;
  /** "db" = data dari database model, "json" = data dari SiteSetting JSON */
  badge?: { type: "db" | "json"; label: string };
  /** Link to separate CRUD page */
  manageLink?: { href: string; label: string };
  /** Info text */
  info?: string;
  children?: React.ReactNode;
}

interface LayoutPageEditorProps {
  pageTitle: string;
  pageSubtitle: string;
  pageIcon: string;
  pageIconBg: string;
  tabs: LayoutTab[];
  children: (activeTab: string) => React.ReactNode;
}

export function LayoutSection({ title, icon, iconColor, badge, manageLink, info, children }: LayoutSectionProps) {
  return (
    <div className="admin-layout-section-card">
      <div className="admin-layout-section-header">
        <span className="admin-layout-section-title">
          <i className={icon} style={{ color: iconColor }}></i>
          {title}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {badge && (
            <span className={`admin-layout-section-badge ${badge.type}`}>
              <i className={badge.type === "db" ? "fas fa-database" : "fas fa-code"}></i>
              {badge.label}
            </span>
          )}
          {manageLink && (
            <Link href={manageLink.href} className="admin-layout-link-btn">
              <i className="fas fa-external-link-alt"></i>
              {manageLink.label}
            </Link>
          )}
        </div>
      </div>
      <div className="admin-layout-section-body">
        {info && (
          <div className="admin-layout-info-box" style={{ marginBottom: children ? 16 : 0 }}>
            <i className="fas fa-info-circle"></i>
            <span dangerouslySetInnerHTML={{ __html: info }} />
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export default function LayoutPageEditor({
  pageTitle,
  pageSubtitle,
  pageIcon,
  pageIconBg,
  tabs,
  children,
}: LayoutPageEditorProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.key || "");

  return (
    <>
      {/* Page Header */}
      <div className="admin-layout-page-header">
        <div className="admin-layout-page-icon" style={{ background: pageIconBg }}>
          <i className={pageIcon}></i>
        </div>
        <div className="admin-layout-page-info">
          <h1>{pageTitle}</h1>
          <p>{pageSubtitle}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-layout-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`admin-layout-tab ${activeTab === tab.key ? "active" : ""}`}
          >
            <i className={tab.icon}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      {children(activeTab)}
    </>
  );
}
