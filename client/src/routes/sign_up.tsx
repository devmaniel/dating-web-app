import { createFileRoute } from '@tanstack/react-router';
import { SignUpForm } from '@/features/sign-up';
import { PublicRouteGuard } from '@/routes/guard/PublicRouteGuard';

export const Route = createFileRoute('/sign_up')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PublicRouteGuard>
      <SignUpForm />
    </PublicRouteGuard>
  );
}

