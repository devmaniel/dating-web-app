import { createFileRoute } from '@tanstack/react-router'
import { SignInForm } from '@/features/sign-in/SignInForm'

export const Route = createFileRoute('/sign_in')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SignInForm />
}
