import { LegislationViewer } from '@/components/legislation/LegislationViewer'

interface LegislationPageProps {
  params: Promise<{ id: string }>
}

export default async function LegislationPage({ params }: LegislationPageProps) {
  const { id } = await params
  
  return <LegislationViewer legislationId={id} />
}