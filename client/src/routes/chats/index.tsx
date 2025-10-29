import { createFileRoute } from '@tanstack/react-router';
import { MainLayout } from '@/shared/layouts';
import { IndexPage } from '@/features/chats/IndexPage';

export const Route = createFileRoute('/chats/')({
  component: ChatsIndexPage,
});

function ChatsIndexPage() {
  return (
    <MainLayout>
      <IndexPage />
    </MainLayout>
  );
}
