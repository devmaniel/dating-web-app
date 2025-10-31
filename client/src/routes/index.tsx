import { createFileRoute } from '@tanstack/react-router'
import { ProtectedLayout } from '@/shared/layouts'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ProtectedLayout>
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-black">Welcome to Chemistry! 🎉</h1>
          <p className="text-xl text-gray-600">You have successfully signed in.</p>
        </div>
      </div>
    </ProtectedLayout>
  )
}
