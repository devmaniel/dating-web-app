import { createFileRoute } from '@tanstack/react-router';
import { ConversationView } from '@/features/chats/components/ConversationView';
import { ProtectedLayout } from '@/shared/layouts';

export const Route = createFileRoute('/chats/$chatId')({
  component: ChatConversationPage,
});

function ChatConversationPage() {
  const { chatId } = Route.useParams();
  // Keep chatId as string (UUID) - don't convert to number

  return (
    <ProtectedLayout>
      <ConversationView conversationId={chatId} />
    </ProtectedLayout>
  );
}
