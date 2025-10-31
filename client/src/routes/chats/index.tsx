import { createFileRoute } from '@tanstack/react-router';
import { IndexPage } from '@/features/chats/IndexPage';
import { ProtectedLayout } from '@/shared/layouts';

export const Route = createFileRoute('/chats/')({
  component: ChatsIndexPage,
});

function ChatsIndexPage() {
  return (
    <ProtectedLayout>
      <IndexPage />
    </ProtectedLayout>
  );
}
