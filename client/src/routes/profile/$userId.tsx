import { createFileRoute } from '@tanstack/react-router';
import { useChat } from '@/features/chats/hooks';
import { ProtectedLayout } from '@/shared/layouts';

export const Route = createFileRoute('/profile/$userId')({
  component: ProfilePage,
});

function ProfilePage() {
  const { userId } = Route.useParams();
  const id = Number(userId);
  const { chat } = useChat(id);
  
  if (!chat) {
    return (
      <ProtectedLayout>
        <div className="p-4">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
            <p className="text-gray-500">The requested profile could not be found.</p>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
    <div className="p-4">
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-4">
          {chat.avatar ? (
            <img 
              src={chat.avatar} 
              alt={chat.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
          )}
        </div>
        <h1 className="text-2xl font-bold">{chat.name}, {chat.age}</h1>
        <p className="text-gray-600 mt-1">{chat.school}</p>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h2 className="font-semibold text-lg mb-2">About</h2>
        <p className="text-gray-700">
          This is a placeholder for the user's profile information. In a real application, 
          this would include more details about the user's interests, hobbies, and bio.
        </p>
      </div>
      
      <div className="flex gap-3">
        <button className="flex-1 bg-black text-white py-3 rounded-lg font-medium">
          Message
        </button>
        <button className="flex-1 bg-gray-100 text-gray-900 py-3 rounded-lg font-medium">
          Report
        </button>
      </div>
    </div>
    </ProtectedLayout>
  );
}
