import { createFileRoute } from '@tanstack/react-router';
import { SignUpForm } from '@/features/sign-up';

export const Route = createFileRoute('/sign_up')({
  component: RouteComponent,
});

function RouteComponent() {
  return <SignUpForm />;
}

