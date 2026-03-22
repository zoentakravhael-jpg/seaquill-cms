"use client";

import { useEffect, useState } from "react";

export default function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="preloader" style={{ display: visible ? "flex" : "none" }}>
      <button className="th-btn preloaderCls" onClick={() => setVisible(false)}>
        Cancel Preloader
      </button>
      <div className="preloader-inner">
        <img src="/assets/img/logo.svg" alt="Seaquill" />
        <div className="heart-rate">
          <img src="/assets/img/shape/preloader.svg" alt="" />
          <div className="fade-in"></div>
          <div className="fade-out"></div>
        </div>
      </div>
    </div>
  );
}
