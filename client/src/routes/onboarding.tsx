import { createFileRoute } from '@tanstack/react-router'
import { Onboarding } from '@/features/onboarding'
import { OnboardingRouteGuard } from '@/routes/guard/OnboardingRouteGuard'

export const Route = createFileRoute('/onboarding')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <OnboardingRouteGuard>
      <Onboarding />
    </OnboardingRouteGuard>
  )
}
