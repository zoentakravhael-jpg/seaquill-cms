import Link from "next/link";
import Image from "next/image";

interface AboutData {
  subTitle: string;
  heading: string;
  paragraph: string;
  checklist: string[];
  ctaText: string;
  ctaLink: string;
  image1: string;
  image2: string;
  image3: string;
}

export default function AboutSection({ data }: { data: AboutData }) {
  return (
    <div className="about-area overflow-hidden space-bottom" id="about-sec">
      <div className="container">
        <div className="row gy-4">
          <div className="col-xxl-8 mb-30 mb-xl-0">
            <div className="title-area">
              <span className="sub-title text-anime-style-2">
                {data.subTitle}
              </span>
              <h2 className="sec-title text-anime-style-3">
                {data.heading || "Pilihan Tepat, untuk Hidup Sehat dan Berkualitas"}
              </h2>
            </div>
            <div className="img-box1">
              <div className="about-wrapper">
                <div className="img1">
                  <Image src={data.image1} alt="About" width={600} height={400} sizes="(max-width: 768px) 100vw, 50vw" />
                  <a href="" className="">
                    <i className=""></i>
                  </a>
                </div>
                <div className="">
                  <p
                    className="fs-18 mb-30 wow fadeInUp"
                    data-wow-delay=".1s"
                  >
                    {data.paragraph}
                  </p>
                  <div className="checklist mb-50">
                    <ul>
                      {data.checklist?.map((item, i) => (
                        <li
                          key={i}
                          className="wow fadeInUp"
                          data-wow-delay={`${0.1 + i * 0.2}s`}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div
                    className="btn-group mt-40 wow fadeInUp"
                    data-wow-delay=".4s"
                  >
                    <Link href={data.ctaLink || "/tentang"} className="th-btn style2">
                      {data.ctaText || "Selengkapnya tentang Sea-Quill"}{" "}
                      <i className="fa-light fa-arrow-right-long ms-2"></i>
                    </Link>
                    <div className="call-info"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xxl-4">
            <div className="img-box2">
              <div className="img-box-wrapp">
                <div className="img1">
                  <Image src={data.image2} alt="About" width={400} height={500} sizes="25vw" />
                </div>
                <div className="img2">
                  <Image src={data.image3} alt="About" width={400} height={500} sizes="25vw" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="shape-mockup"
        data-bottom="7%"
        data-left="0%"
      >
        <img src="/assets/img/shape/element-1.png" alt="" />
      </div>
    </div>
  );
}
