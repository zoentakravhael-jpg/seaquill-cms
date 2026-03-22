import Link from "next/link";
import { prisma } from "@/lib/prisma";
import BlogSearchForm from "./BlogSearchForm";
import ConsultationForm from "./ConsultationForm";

export default async function BlogSidebar() {
  const recentPosts = await prisma.blogPost.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    take: 4,
    select: {
      title: true,
      slug: true,
      image: true,
      publishedAt: true,
    },
  });

  return (
    <aside className="sidebar-area style2">
      <div className="widget widget_search">
        <h3 className="widget_title">Search</h3>
        <BlogSearchForm />
      </div>
      <div className="widget">
        <h3 className="widget_title">Recent Posts</h3>
        <div className="recent-post-wrap">
          {recentPosts.map((post) => {
            const dateStr = post.publishedAt.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "2-digit",
            });
            return (
              <div className="recent-post" key={post.slug}>
                <div className="media-img">
                  <Link href={`/artikel/detail/${post.slug}`}>
                    <img
                      src={post.image}
                      alt="Blog Image"
                    />
                  </Link>
                </div>
                <div className="media-body">
                  <div className="recent-post-meta">
                    <a href="#">
                      <i className="fa-sharp fa-solid fa-calendar-days"></i>{dateStr}
                    </a>
                  </div>
                  <h4 className="post-title">
                    <Link className="text-inherit" href={`/artikel/detail/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h4>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="widget widget_quote">
        <h3 className="widget_title">Konsultasi Gratis</h3>
        <ConsultationForm />
      </div>
      <div
        className="widget widget_offer"
        data-bg-src="/assets/img/bg/offer_bg_1.jpg"
        style={{ backgroundImage: "url(/assets/img/bg/offer_bg_1.jpg)" }}
      >
        <div className="offer-banner">
          <h4 className="banner-title">
            Kami siap membantu konsultasi kesehatan Anda
          </h4>
          <Link href="/hubungi-kami" className="th-btn style1">
            Hubungi Kami
          </Link>
        </div>
      </div>
    </aside>
  );
}
