import { createFileRoute } from '@tanstack/react-router';
import { MainLayout } from '@/shared/layouts';
import { ConversationView } from '@/features/chats/components/ConversationView';

export const Route = createFileRoute('/chats/$chatId')({
  component: ChatConversationPage,
});

function ChatConversationPage() {
  const { chatId } = Route.useParams();
  const id = Number(chatId);

  return (
    <MainLayout>
      <ConversationView chatId={id} />
    </MainLayout>
  );
}
