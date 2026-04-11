"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { SwiperClass } from "swiper/react";
import Link from "next/link";
import Image from "next/image";

import "swiper/css";
import "swiper/css/navigation";

interface BlogData {
  id: number;
  title: string;
  slug: string;
  image: string;
  author: string;
  publishedAt: string | Date;
}

interface SectionData {
  subTitle: string;
  heading: string;
  paragraph: string;
}

interface BlogSliderConfig {
  autoplay: boolean;
  autoplayDelay: number;
  loop: boolean;
  pauseOnHover: boolean;
}

export default function BlogSlider({
  blogs,
  section,
  sliderConfig,
}: {
  blogs: BlogData[];
  section: SectionData;
  sliderConfig?: BlogSliderConfig;
}) {
  const swiperRef = useRef<SwiperClass | null>(null);

  const config = sliderConfig ?? { autoplay: true, autoplayDelay: 4000, loop: true, pauseOnHover: true };

  // Duplicate slides for Swiper loop mode (needs > slidesPerView * 2)
  const minSlidesForLoop = 7; // max slidesPerView is 3
  let displayBlogs = [...blogs];
  if (config.loop && blogs.length > 0 && blogs.length < minSlidesForLoop) {
    while (displayBlogs.length < minSlidesForLoop) {
      displayBlogs = [...displayBlogs, ...blogs];
    }
  }

  const enableLoop = config.loop && blogs.length > 0;
  const enableAutoplay = config.autoplay && blogs.length > 0;

  return (
    <section
      className="overflow-hidden space overflow-hidden"
      id="blog-sec"
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="title-area text-center">
              <span className="sub-title text-anime-style-2">
                {section.subTitle}
              </span>
              <h2 className="sec-title text-anime-style-3">
                <span className="fw-normal">{section.heading?.replace("Sea-Quill", "").trim()}</span> Sea-Quill
              </h2>
              <p className="fs-18 wow fadeInUp">
                {section.paragraph}
              </p>
            </div>
          </div>
        </div>
        <div className="gallery-divider"></div>
        <div className="slider-area">
          <Swiper
            className="th-slider has-shadow"
            modules={[Navigation, Autoplay]}
            loop={enableLoop}
            autoplay={enableAutoplay ? { delay: config.autoplayDelay, disableOnInteraction: false, pauseOnMouseEnter: config.pauseOnHover } : false}
            navigation={{
              prevEl: ".blog-slider-prev",
              nextEl: ".blog-slider-next",
            }}
            breakpoints={{
              0: { slidesPerView: 1, spaceBetween: 30 },
              576: { slidesPerView: 1, spaceBetween: 30 },
              768: { slidesPerView: 2, spaceBetween: 40 },
              992: { slidesPerView: 2, spaceBetween: 40 },
              1200: { slidesPerView: 3, spaceBetween: 50 },
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              if (enableAutoplay) {
                setTimeout(() => swiper.autoplay?.start(), 100);
              }
            }}
          >
            {displayBlogs.map((blog, idx) => (
              <SwiperSlide key={`${blog.id}-${idx}`}>
                <div className="blog-card wow fadeInUp">
                  <div className="box-img global-img">
                    <Image src={blog.image} alt={blog.title} width={800} height={450} sizes="(max-width: 768px) 100vw, (max-width: 992px) 50vw, 33vw" />
                  </div>
                  <div className="box-content">
                    <div className="blog-meta">
                      <Link href="/artikel">
                        <i className="fa-solid fa-user"></i>{blog.author}
                      </Link>
                      <Link href="/artikel">
                        <i className="fa-solid fa-messages"></i>No Comment
                      </Link>
                    </div>
                    <h3 className="box-title">
                      <Link href={`/artikel/detail/${blog.slug}`}>{blog.title}</Link>
                    </h3>
                    <Link href={`/artikel/detail/${blog.slug}`} className="line-btn">
                      Selengkapnya{" "}
                      <i className="fa-regular fa-arrow-right ms-2"></i>
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <button className="slider-arrow slider-prev blog-slider-prev">
            <i className="far fa-arrow-left"></i>
          </button>
          <button className="slider-arrow slider-next blog-slider-next">
            <i className="far fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
}
