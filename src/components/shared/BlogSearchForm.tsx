"use client";

import { useRouter } from "next/navigation";
import { FormEvent } from "react";

export default function BlogSearchForm() {
  const router = useRouter();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = e.currentTarget.querySelector("input") as HTMLInputElement;
    const q = input.value.trim();
    if (q.length >= 2) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
      input.value = "";
    }
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input type="text" placeholder="Enter Keyword..." />
      <button type="submit">
        <i className="far fa-search"></i>
      </button>
    </form>
  );
}
