"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { updateHeroSliderConfig } from "@/app/admin/actions";

interface HeroSliderConfigData {
  autoplay: boolean;
  autoplayDelay: number;
  loop: boolean;
  pauseOnHover: boolean;
}

const defaultConfig: HeroSliderConfigData = {
  autoplay: true,
  autoplayDelay: 5000,
  loop: true,
  pauseOnHover: true,
};

export default function HeroSliderConfigPanel({
  initialConfig,
}: {
  initialConfig?: HeroSliderConfigData;
}) {
  const [config, setConfig] = useState<HeroSliderConfigData>({
    ...defaultConfig,
    ...initialConfig,
  });
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const result = await updateHeroSliderConfig(config);
      if (result.success) {
        toast.success("Konfigurasi slider berhasil disimpan!");
      } else {
        toast.error(result.error || "Gagal menyimpan konfigurasi");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-card" style={{ marginBottom: 24 }}>
      <div
        className="admin-card-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={() => setOpen(!open)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <i className="fas fa-cog" style={{ color: "var(--admin-primary)" }}></i>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>
            Konfigurasi Auto-Slide
          </h3>
        </div>
        <i
          className={`fas fa-chevron-${open ? "up" : "down"}`}
          style={{ fontSize: 12, color: "var(--admin-text-muted)" }}
        ></i>
      </div>

      {open && (
        <div className="admin-card-body">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 20,
            }}
          >
            {/* Autoplay Toggle */}
            <div className="admin-form-group">
              <label className="admin-form-label" style={{ marginBottom: 8, display: "block" }}>
                Autoplay
              </label>
              <label
                className="admin-form-label-inline"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "1px solid var(--admin-border)",
                  background: config.autoplay
                    ? "var(--admin-success-bg, #f0fdf4)"
                    : "var(--admin-bg-secondary, #f9fafb)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <input
                  type="checkbox"
                  checked={config.autoplay}
                  onChange={(e) =>
                    setConfig((c) => ({ ...c, autoplay: e.target.checked }))
                  }
                  style={{ width: 18, height: 18, accentColor: "var(--admin-primary)" }}
                />
                <span style={{ fontSize: 14 }}>
                  {config.autoplay ? "Aktif" : "Nonaktif"}
                </span>
              </label>
              <p className="admin-form-hint">Slide berganti otomatis</p>
            </div>

            {/* Delay */}
            <div className="admin-form-group">
              <label className="admin-form-label" style={{ marginBottom: 8, display: "block" }}>
                Interval (ms)
              </label>
              <input
                type="number"
                className="admin-form-input"
                min={1000}
                max={30000}
                step={500}
                value={config.autoplayDelay}
                onChange={(e) =>
                  setConfig((c) => ({
                    ...c,
                    autoplayDelay: parseInt(e.target.value) || 5000,
                  }))
                }
                disabled={!config.autoplay}
              />
              <p className="admin-form-hint">
                {(config.autoplayDelay / 1000).toFixed(1)} detik antar slide (1000–30000)
              </p>
            </div>

            {/* Loop Toggle */}
            <div className="admin-form-group">
              <label className="admin-form-label" style={{ marginBottom: 8, display: "block" }}>
                Loop
              </label>
              <label
                className="admin-form-label-inline"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "1px solid var(--admin-border)",
                  background: config.loop
                    ? "var(--admin-success-bg, #f0fdf4)"
                    : "var(--admin-bg-secondary, #f9fafb)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <input
                  type="checkbox"
                  checked={config.loop}
                  onChange={(e) =>
                    setConfig((c) => ({ ...c, loop: e.target.checked }))
                  }
                  style={{ width: 18, height: 18, accentColor: "var(--admin-primary)" }}
                />
                <span style={{ fontSize: 14 }}>
                  {config.loop ? "Aktif" : "Nonaktif"}
                </span>
              </label>
              <p className="admin-form-hint">Ulangi dari awal setelah slide terakhir</p>
            </div>

            {/* Pause on Hover Toggle */}
            <div className="admin-form-group">
              <label className="admin-form-label" style={{ marginBottom: 8, display: "block" }}>
                Pause on Hover
              </label>
              <label
                className="admin-form-label-inline"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "1px solid var(--admin-border)",
                  background: config.pauseOnHover
                    ? "var(--admin-success-bg, #f0fdf4)"
                    : "var(--admin-bg-secondary, #f9fafb)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <input
                  type="checkbox"
                  checked={config.pauseOnHover}
                  onChange={(e) =>
                    setConfig((c) => ({ ...c, pauseOnHover: e.target.checked }))
                  }
                  disabled={!config.autoplay}
                  style={{ width: 18, height: 18, accentColor: "var(--admin-primary)" }}
                />
                <span style={{ fontSize: 14 }}>
                  {config.pauseOnHover ? "Aktif" : "Nonaktif"}
                </span>
              </label>
              <p className="admin-form-hint">Jeda autoplay saat mouse di atas slider</p>
            </div>
          </div>

          <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={handleSave}
              disabled={saving}
              style={{ minWidth: 160 }}
            >
              {saving ? (
                <>
                  <i className="fas fa-spinner fa-spin" style={{ marginRight: 6 }}></i>
                  Menyimpan...
                </>
              ) : (
                <>
                  <i className="fas fa-save" style={{ marginRight: 6 }}></i>
                  Simpan Konfigurasi
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
