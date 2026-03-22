import Link from "next/link";

interface ServiceItem {
  icon: string;
  title: string;
  text: string;
  image: string;
  buttonText?: string;
}

interface ServiceData {
  subTitle: string;
  heading: string;
  paragraph: string;
  items: ServiceItem[];
}

const delays = [".2s", ".3s", ".5s", ".6s"];

export default function ServiceList({ data }: { data: ServiceData }) {
  const items = data.items || [];
  return (
    <section
      className="position-relative overflow-hidden space"
      data-bg-src="/assets/img/bg/service_bg_1.jpg"
      style={{ backgroundImage: "url(/assets/img/bg/service_bg_1.jpg)" }}
      id="service-sec"
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-5">
            <div className="title-area text-center">
              <span className="sub-title text-anime-style-2">
                {data.subTitle}
              </span>
              <h2 className="sec-title text-anime-style-3">
                {data.heading}
              </h2>
              <p className="fs-18 wow fadeInUp">
                {data.paragraph}
              </p>
            </div>
          </div>
        </div>
        <div className="gallery-divider"></div>
        <div className="service-list-area">
          <div className="row gy-3">
            {items.map((service, index) => (
              <div className="col-12" key={index}>
                <div
                  className="service-grid2 wow fadeInUp"
                  data-wow-delay={delays[index] || ".3s"}
                >
                  <div className="service-content">
                    <div className="box-wrapp">
                      <div className="box-icon">
                        <img src={service.icon} alt="Icon" />
                      </div>
                      <h3 className="box-title">
                        <Link href="/artikel">{service.title}</Link>
                      </h3>
                      <p className="box-text">{service.text}</p>
                    </div>
                    <div className="box-right-wrapp">
                      <div className="box-img global-img">
                        <img src={service.image} alt="" />
                      </div>
                      <div className="service-btn">
                        <Link href="/artikel" className="th-btn black-border">
                          {service.buttonText || "Selengkapnya"}{" "}
                          <i className="fa-regular fa-arrow-right ms-2"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-60">
            <Link href="/artikel" className="th-btn style2">
              Lihat Lainnya{" "}
              <i className="fa-light fa-arrow-right-long ms-2"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
