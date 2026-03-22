import Link from "next/link";

interface PaginationProps {
  basePath: string;
}

export default function Pagination({ basePath }: PaginationProps) {
  return (
    <div className="th-pagination text-center mt-60">
      <ul>
        <li>
          <Link href={basePath}>
            <i className="fa-regular fa-arrow-left"></i>
          </Link>
        </li>
        <li>
          <Link href={basePath}>1</Link>
        </li>
        <li>
          <Link href={basePath}>2</Link>
        </li>
        <li>
          <Link href={basePath}>3</Link>
        </li>
        <li>
          <Link href={basePath}>4</Link>
        </li>
        <li>
          <Link href={basePath}>
            Next <i className="fa-regular fa-arrow-right"></i>
          </Link>
        </li>
      </ul>
    </div>
  );
}
