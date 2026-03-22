export default function AdminFooter() {
  return (
    <footer className="admin-footer">
      <span>&copy; {new Date().getFullYear()} Sea-Quill. All rights reserved.</span>
      <span>
        Powered by <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">Next.js</a>
      </span>
    </footer>
  );
}
