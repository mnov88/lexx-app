import { CaseViewer } from '@/components/cases/CaseViewer'

interface CasePageProps {
  params: Promise<{ id: string }>
}

export default async function CasePage({ params }: CasePageProps) {
  const { id } = await params
  
  return <CaseViewer caseId={id} />
}