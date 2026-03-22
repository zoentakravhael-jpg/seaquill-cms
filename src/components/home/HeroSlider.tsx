"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination, Autoplay } from "swiper/modules";
import Link from "next/link";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

interface HeroSlideData {
  id: number;
  subtitle: string;
  title: string;
  bgImage: string;
  ctaText: string;
  ctaLink: string;
  ctaText2: string;
  ctaLink2: string;
}

interface SocialLinks {
  instagram: string;
  facebook: string;
  twitter: string;
  linkedin: string;
}

export interface HeroSliderConfig {
  autoplay: boolean;
  autoplayDelay: number;
  loop: boolean;
  pauseOnHover: boolean;
}

function renderTitle(title: string) {
  const parts = title.split(/(Sea-Quill)/gi);
  return parts.map((part, i) =>
    /^sea-quill$/i.test(part) ? (
      <span key={i} className="text-theme">{part}</span>
    ) : (
      part
    )
  );
}

const defaultConfig: HeroSliderConfig = {
  autoplay: true,
  autoplayDelay: 5000,
  loop: true,
  pauseOnHover: true,
};

export default function HeroSlider({
  slides,
  socialLinks,
  sliderConfig,
}: {
  slides: HeroSlideData[];
  socialLinks: SocialLinks;
  sliderConfig?: HeroSliderConfig;
}) {
  const swiperRef = useRef(null);
  const config = { ...defaultConfig, ...sliderConfig };

  return (
    <div className="th-hero-wrapper hero-1" id="hero">
      <Swiper
        className="th-slider"
        modules={[EffectFade, Pagination, Autoplay]}
        effect="fade"
        loop={config.loop}
        autoplay={
          config.autoplay
            ? {
                delay: config.autoplayDelay,
                disableOnInteraction: false,
                pauseOnMouseEnter: config.pauseOnHover,
              }
            : false
        }
        pagination={{
          el: ".slider-pagination",
          clickable: true,
        }}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="hero-inner">
              <div
                className="th-hero-bg"
                data-bg-src={slide.bgImage}
                style={{
                  backgroundImage: `url(${slide.bgImage})`,
                }}
              ></div>
              <div className="container">
                <div className="row align-items-end">
                  <div className="col-xl-7">
                    <div className="hero-style1">
                      <span
                        className="sub-title"
                        data-ani="slideinup"
                        data-ani-delay="0.2s"
                      >
                        {slide.subtitle}
                      </span>
                      <h1
                        className="hero-title"
                        data-ani="slideinup"
                        data-ani-delay="0.4s"
                      >
                        {renderTitle(slide.title)}
                      </h1>
                      <div
                        className="btn-group justify-content-xl-start justify-content-center"
                        data-ani="slideinup"
                        data-ani-delay="0.8s"
                      >
                        <Link href={slide.ctaLink} className="th-btn style1">
                          {slide.ctaText}{" "}
                          <i className="fa-solid fa-calendar-days ms-2"></i>
                        </Link>
                        <Link href={slide.ctaLink2} className="th-btn th-border">
                          {slide.ctaText2}{" "}
                          <i className="fa-light fa-arrow-right-long ms-2"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-5">
                    <div
                      className="hero-image"
                      data-ani="slideinup"
                      data-ani-delay="0.4s"
                    >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
        <div className="slider-controller">
          <div className="slider-pagination"></div>
        </div>
      </Swiper>
      <div className="scroll-down">
        <a href="#about-sec" className="hero-scroll-wrap">
          <span></span>
        </a>
        <span className="title">Scroll</span>
      </div>
      <div className="social-links">
        {socialLinks.instagram && (
          <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
        )}
        {socialLinks.facebook && (
          <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook-f"></i>
          </a>
        )}
        {socialLinks.twitter && (
          <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter"></i>
          </a>
        )}
        {socialLinks.linkedin && (
          <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-linkedin-in"></i>
          </a>
        )}
      </div>
    </div>
  );
}
