"use client";

import Link from "next/link";

interface ArticleWithRelations {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  publishedAt: string | null;
  updatedAt: string;
  category: { name: string } | null;
}

export function ArticlesClient({ articles }: { articles: ArticleWithRelations[] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] font-extrabold tracking-[-0.03em] text-[#1a1a1a]">Articles</h1>
        <Link
          href="/admin/content/articles/new"
          className="bg-[#15803d] text-white text-[13px] font-medium px-4 py-2 rounded-lg hover:bg-[#166534] transition-colors"
        >
          New Article
        </Link>
      </div>

      <div className="bg-white rounded-[10px] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#f4f4f5]">
              <th className="text-left text-[11px] uppercase tracking-[0.05em] text-[#a1a1aa] px-4 py-3">Title</th>
              <th className="text-left text-[11px] uppercase tracking-[0.05em] text-[#a1a1aa] px-4 py-3">Category</th>
              <th className="text-left text-[11px] uppercase tracking-[0.05em] text-[#a1a1aa] px-4 py-3">Status</th>
              <th className="text-left text-[11px] uppercase tracking-[0.05em] text-[#a1a1aa] px-4 py-3">Updated</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="border-b border-[#f4f4f5] last:border-0 hover:bg-[#f8faf8]">
                <td className="px-4 py-3">
                  <Link href={`/admin/content/articles/${article.id}`} className="text-[13px] font-medium text-[#1a1a1a] hover:text-[#15803d]">
                    {article.title}
                  </Link>
                  <p className="text-[11px] text-[#a1a1aa]">/blog/{article.slug}</p>
                </td>
                <td className="px-4 py-3 text-[13px] text-[#71717a]">{article.category?.name || "—"}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${article.published ? "bg-[#f0f5f0] text-[#15803d]" : "bg-[#f4f4f5] text-[#71717a]"}`}>
                    {article.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-[13px] text-[#71717a]">
                  {new Date(article.updatedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {articles.length === 0 && (
          <p className="text-center text-[#71717a] text-[14px] py-12">No articles yet.</p>
        )}
      </div>
    </div>
  );
}
