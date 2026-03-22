import Breadcrumb from "@/components/layout/Breadcrumb";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Breadcrumb title="Error Page" />
      <section className="space">
        <div className="container">
          <div className="error-img">
            <div className="row justify-content-center text-center">
              <div className="col-xl-8">
                <div className="error-img">
                  <img src="/assets/img/theme-img/error.svg" alt="error image" />
                </div>
                <h2 className="error-title">Oops! Halaman Tidak Ditemukan</h2>
                <p className="error-text fs-18">
                  Halaman yang Anda cari tidak tersedia atau sudah dipindahkan. Silakan kembali ke halaman utama untuk melanjutkan.
                </p>
                <Link href="/" className="th-btn mt-3">
                  <i className="fa-solid fa-home me-2"></i>KEMBALI KE BERANDA
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
