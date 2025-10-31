import { createFileRoute } from '@tanstack/react-router'
import { SignInForm } from '@/features/sign-in/SignInForm'
import { PublicRouteGuard } from '@/routes/guard/PublicRouteGuard'

export const Route = createFileRoute('/sign_in')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PublicRouteGuard>
      <SignInForm />
    </PublicRouteGuard>
  )
}
