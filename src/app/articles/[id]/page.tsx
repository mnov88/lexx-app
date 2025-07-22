import { ArticleViewer } from '@/components/articles/ArticleViewer'

interface ArticlePageProps {
  params: Promise<{ id: string }>
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params
  
  return <ArticleViewer articleId={id} />
}