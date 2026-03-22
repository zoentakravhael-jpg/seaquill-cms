import Breadcrumb from "@/components/layout/Breadcrumb";
import TentangProjectSlider from "@/components/tentang/TentangProjectSlider";
import { prisma } from "@/lib/prisma";

async function getSettings(keys: string[]) {
  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: keys } },
  });
  const map: Record<string, string> = {};
  for (const r of rows) map[r.key] = r.value;
  return map;
}

export default async function TentangPage() {
  const settings = await getSettings([
    "tentang_about_section",
    "tentang_feature_cards",
    "tentang_project_slider",
  ]);

  const about = JSON.parse(settings.tentang_about_section || "{}");
  const featureCards = JSON.parse(settings.tentang_feature_cards || "[]");
  const projectSlider = JSON.parse(settings.tentang_project_slider || "{}");

  const checklist: string[] = about.checklist || [];

  return (
    <>
      <Breadcrumb title="About Us" />

      {/* About Area */}
      <div className="about-area overflow-hidden overflow-hidden space" id="about-sec">
        <div className="container">
          <div className="row gy-4">
            <div className="col-xxl-6">
              <div className="img-box4 me-xl-3">
                <div className="img1">
                  <img src={about.aboutImage || "/assets/img/normal/about_4_1.jpg"} alt="About" />
                </div>
                <div className="about-wrapp"></div>
              </div>
            </div>
            <div className="col-xxl-6 mb-30 mb-xl-0">
              <div className="title-area">
                <span className="sub-title text-anime-style-2">{about.subTitle || "Tentang Seaquill"}</span>
                <h2 className="sec-title text-anime-style-3">
                  <span className="fw-normal">{about.headingNormal || "Pilihan Tepat,"}</span> {about.heading || "untuk Hidup Sehat dan Berkualitas"}
                </h2>
                <p className="fs-18 mb-30 pe-xl-5 wow fadeInUp">
                  {about.paragraph || ""}
                </p>
              </div>
              <div className="about-wrapper style2">
                <div className="">
                  <div className="checklist mb-50">
                    <ul>
                      {checklist.map((item: string, i: number) => (
                        <li key={i} className="wow fadeInUp" data-wow-delay={`${0.1 + i * 0.2}s`}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="video-img2 wow fadeInUp">
                  <img src={about.videoImage || "/assets/img/normal/about-video.jpg"} alt="About" />
                  <a
                    href={about.videoUrl || "https://www.youtube.com/watch?v=_sI_Ps7JSEk"}
                    className="video-play-btn popup-video"
                  >
                    <i className="fa-solid fa-play"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="position-relative">
        <div className="container">
          <div className="row gy-4 justify-content-center">
            {(featureCards as Array<{ title: string; text: string; btnText: string; href: string }>).map(
              (card, index) => (
                <div
                  key={index}
                  className={`col-md-6 col-xl-4 feature-card_wrapp wow ${
                    index === 0 ? "fadeInLeft" : index === 1 ? "fadeInUp" : "fadeInRight"
                  }`}
                  data-wow-delay={`${0.2 + index * 0.2}s`}
                >
                  <div className="feature-card th-ani">
                    <h3 className="box-title text-anime-style-2">{card.title}</h3>
                    <p className="box-text">{card.text}</p>
                    <a href={card.href} className="th-btn black-border">
                      {card.btnText} <i className="fa-regular fa-arrow-right ms-2"></i>
                    </a>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Project Slider Section */}
      <TentangProjectSlider data={projectSlider} />
    </>
  );
}
