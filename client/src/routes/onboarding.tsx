import { createFileRoute } from '@tanstack/react-router'
import { Onboarding } from '@/features/onboarding'

export const Route = createFileRoute('/onboarding')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Onboarding />
}
