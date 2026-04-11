import Link from "next/link";
import Image from "next/image";

interface BlogGridCardProps {
  title: string;
  image: string;
  slug: string;
  author: string;
}

export default function BlogGridCard({
  title,
  image,
  slug,
  author,
}: BlogGridCardProps) {
  return (
    <div className="col-xl-6">
      <div className="th-blog blog-single has-post-thumbnail single-grid">
        <div className="blog-img global-img">
          <Link href={`/artikel/detail/${slug}`}>
            {image && <Image src={image} alt={title} width={800} height={450} sizes="(max-width: 768px) 100vw, 50vw" />}
          </Link>
        </div>
        <div className="blog-content">
          <div className="blog-meta">
            <a className="author" href="#">
              <i className="fa-solid fa-user"></i>
              {author}
            </a>
            <a href="#">
              <i className="fa-solid fa-messages"></i>No Comment
            </a>
          </div>
          <h2 className="box-title">
            <Link href={`/artikel/detail/${slug}`}>{title}</Link>
          </h2>
          <Link
            href={`/artikel/detail/${slug}`}
            className="line-btn"
          >
            Read More{" "}
            <i className="fa-light fa-arrow-right-long ms-2"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
