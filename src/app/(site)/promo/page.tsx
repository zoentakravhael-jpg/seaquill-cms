import type { Metadata } from "next";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Promo & Event | Sea-Quill Indonesia",
  description: "Temukan promo terbaru dan event menarik dari Sea-Quill. Dapatkan penawaran terbaik untuk produk suplemen kesehatan berkualitas.",
  openGraph: {
    title: "Promo & Event | Sea-Quill Indonesia",
    description: "Temukan promo terbaru dan event menarik dari Sea-Quill.",
    type: "website",
  },
};

export default async function PromoPage() {
  const [promos, events] = await Promise.all([
    prisma.promoItem.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.eventItem.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return (
    <>
      <Breadcrumb title="About Us" />

      {/* Promo Section */}
      <div className="overflow-hidden space" id="project-sec">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-5">
              <div className="title-area text-center">
                <span className="sub-title text-anime-style-2">Promo Spesial</span>
                <h2 className="sec-title text-anime-style-3">
                  <span className="fw-normal">Nikmati Penawaran Terbaik,</span> Promo Menarik dari Seaquill!
                </h2>
              </div>
            </div>
          </div>
          <div className="gallery-divider"></div>
          <div className="row gy-4 gallery-row filter-active">
            {promos.length > 0 ? promos.map((promo) => (
              <div key={promo.id} className="col-lg-6 col-xl-4 col-xxl-auto filter-item">
                <div className="gallery-card">
                  <div className="box-img global-img">
                    <img src={promo.image} alt="gallery image" />
                    <a href={promo.ctaLink} className="icon-btn">
                      <i className="fa-light fa-arrow-right-long"></i>
                    </a>
                  </div>
                  <div className="gallery-content">
                    <h2 className="box-title">{promo.title}</h2>
                    <p className="box-text">{promo.description}</p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-12 text-center">
                <p className="sec-text fs-18">Belum ada promo yang tersedia saat ini.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event Section */}
      <section className="positive-relative overflow-hidden space overflow-hidden" id="blog-sec">
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-lg-7">
              <div className="title-area text-center">
                <span className="sub-title sub-title2 text-anime-style-2">Event &amp; Aktivitas</span>
                <h2 className="sec-title text-anime-style-3">
                  <span className="fw-normal">Jangan Lewatkan,</span> Event Seru Bersama Seaquill!
                </h2>
                <p className="sec-text fs-18 wow fadeInUp">
                  Ikuti event edukasi kesehatan, giveaway, dan live streaming interaktif bersama Seaquill. Raih hadiah dan informasi bermanfaat setiap bulannya!
                </p>
              </div>
            </div>
          </div>
          <div className="row gx-24 gy-30">
            {events.length > 0 ? events.map((event, index) => (
              <div key={event.id} className={index === 0 ? "col-xl-6" : "col-xl-6"}>
                {index === 0 ? (
                  <div className="blog-grid wow fadeInUp" data-wow-delay=".2s">
                    <div className="box-content">
                      <div className="blog-meta">
                        <a href="#">
                          <i className="fa-solid fa-calendar"></i> {event.date}
                        </a>
                        <a href="#">
                          <i className="fa-solid fa-location-dot"></i> {event.location}
                        </a>
                      </div>
                      <h3 className="box-title">
                        <a href={event.ctaLink}>{event.title}</a>
                      </h3>
                      <p className="box-text">{event.description}</p>
                      <a href={event.ctaLink} className="th-btn black-border">
                        {event.ctaText} <i className="fa-regular fa-arrow-right ms-2"></i>
                      </a>
                    </div>
                    <div className="blog-img global-img">
                      <img src={event.image} alt="blog image" />
                    </div>
                  </div>
                ) : (
                  <div className={`blog-grid style2 ${index > 1 ? "mt-30" : ""} wow fadeInUp`} data-wow-delay={`${0.2 + index * 0.2}s`}>
                    <div className="blog-img global-img">
                      <img src={event.image} alt="blog image" />
                    </div>
                    <div className="box-content">
                      <div className="blog-meta">
                        <a href="#">
                          <i className="fa-solid fa-calendar"></i> {event.date}
                        </a>
                        <a href="#">
                          <i className="fa-solid fa-location-dot"></i> {event.location}
                        </a>
                      </div>
                      <h3 className="box-title">
                        <a href={event.ctaLink}>{event.title}</a>
                      </h3>
                      <p className="box-text">{event.description}</p>
                      <a href={event.ctaLink} className="th-btn black-border">
                        {event.ctaText} <i className="fa-regular fa-arrow-right ms-2"></i>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )) : (
              <div className="col-12 text-center">
                <p className="sec-text fs-18">Belum ada event yang tersedia saat ini.</p>
              </div>
            )}
          </div>
        </div>
        <div className="shape-mockup movingX d-none d-lg-block" data-top="10%" data-right="5%">
          <img src="/assets/img/shape/element-13.png" alt="" />
        </div>
        <div className="shape-mockup spin d-none d-lg-block" data-bottom="2%" data-left="5%">
          <img src="/assets/img/shape/element-10.png" alt="" />
        </div>
      </section>
    </>
  );
}
