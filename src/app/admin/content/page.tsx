import { getArticles, getPlatformPages, getStatePages, getToolPages, getComparisonPages } from "@/actions/content";
import { ContentDashboardClient } from "./content-dashboard-client";

export default async function ContentDashboardPage() {
  const [articles, platforms, states, tools, comparisons] = await Promise.all([
    getArticles(),
    getPlatformPages(),
    getStatePages(),
    getToolPages(),
    getComparisonPages(),
  ]);

  return (
    <ContentDashboardClient
      counts={{
        articles: articles.length,
        platforms: platforms.length,
        states: states.length,
        tools: tools.length,
        comparisons: comparisons.length,
        published: [
          ...articles.filter((a) => a.published),
          ...platforms.filter((p) => p.published),
          ...states.filter((s) => s.published),
          ...tools.filter((t) => t.published),
          ...comparisons.filter((c) => c.published),
        ].length,
      }}
    />
  );
}
