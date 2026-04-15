import Link from "next/link";

interface BreadcrumbProps {
  title: string;
  bgImage?: string;
  items?: { label: string; href?: string }[];
}

export default function Breadcrumb({
  title,
  bgImage = "/assets/img/bg/breadcumb-bg.jpg",
  items,
}: BreadcrumbProps) {
  const breadcrumbItems = items || [
    { label: "Home", href: "/" },
    { label: title },
  ];

  return (
    <div
      className="breadcumb-wrapper"
      data-bg-src={bgImage}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
    </div>
  );
}
