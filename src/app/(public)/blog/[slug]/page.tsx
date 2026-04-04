export const dynamic = "force-dynamic";

import { getArticleBySlug, getPublishedArticles } from "@/actions/content";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd, articleSchema } from "@/components/seo/json-ld";
import { TableOfContents } from "@/components/content/table-of-contents";
import { ContentCta } from "@/components/content/content-cta";
import { ArticleCard } from "@/components/content/article-card";
import { generateMeta } from "@/lib/seo";
import Image from "next/image";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const { articles } = await getPublishedArticles(undefined, 1, 1000);
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return generateMeta({
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt || "",
    ogImage: article.ogImage || article.featuredImage,
    type: "article",
  }) as Metadata;
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article || !article.published) notFound();

  const { articles: related } = await getPublishedArticles(undefined, 1, 4);
  const relatedFiltered = related.filter((a) => a.id !== article.id).slice(0, 3);

  const bodyWithIds = article.body.replace(
    /<(h[23])>(.*?)<\/\1>/g,
    (_, tag, text) => {
      const id = text.toLowerCase().replace(/<[^>]*>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      return `<${tag} id="${id}">${text}</${tag}>`;
    }
  );

  const readTime = Math.max(1, Math.ceil(article.body.replace(/<[^>]*>/g, "").split(/\s+/).length / 200));

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <JsonLd data={articleSchema(article)} />
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
        ...(article.category ? [{ label: article.category.name, href: `/blog/category/${article.category.slug}` }] : []),
        { label: article.title, href: `/blog/${article.slug}` },
      ]} />

      <header className="mb-8">
        {article.category && <span className="text-[11px] uppercase tracking-[0.05em] text-[#15803d] font-medium">{article.category.name}</span>}
        <h1 className="text-[32px] font-extrabold tracking-[-0.03em] text-[#1a1a1a] mt-1 leading-tight">{article.title}</h1>
        <div className="flex items-center gap-3 mt-3 text-[13px] text-[#71717a]">
          {article.publishedAt && <span>{new Date(article.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>}
          <span>·</span>
          <span>{readTime} min read</span>
        </div>
      </header>

      {article.featuredImage && (
        <div className="aspect-video relative rounded-[10px] overflow-hidden mb-8">
          <Image src={article.featuredImage} alt={article.title} fill className="object-cover" />
        </div>
      )}

      <TableOfContents html={article.body} />

      <article
        className="prose prose-lg max-w-none prose-headings:font-extrabold prose-headings:tracking-[-0.02em] prose-a:text-[#15803d]"
        dangerouslySetInnerHTML={{ __html: bodyWithIds }}
      />

      <ContentCta />

      {relatedFiltered.length > 0 && (
        <section className="mt-12">
          <h2 className="text-[20px] font-extrabold tracking-[-0.02em] text-[#1a1a1a] mb-4">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedFiltered.map((a) => (
              <ArticleCard key={a.id} title={a.title} slug={a.slug} excerpt={a.excerpt} featuredImage={a.featuredImage} publishedAt={a.publishedAt?.toISOString() || null} categoryName={a.category?.name} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}