import { ReportBuilder } from '@/components/reports/ReportBuilder'
// import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
// import { UserRole } from '@/lib/auth'

export default function ReportsPage() {
  return (
    // Temporarily disable auth for testing
    // <ProtectedRoute requiredRole={UserRole.LAWYER}>
      <ReportBuilder />
    // </ProtectedRoute>
  )
}