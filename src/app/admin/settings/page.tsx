import { prisma } from "@/lib/prisma";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const settings = await prisma.siteSetting.findMany();
  const settingsMap: Record<string, string> = {};
  for (const s of settings) {
    settingsMap[s.key] = s.value;
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Pengaturan Situs</h1>
          <p className="admin-page-subtitle">Konfigurasi umum website Sea-Quill</p>
        </div>
      </div>
      <SettingsForm settings={settingsMap} />
    </>
  );
}
