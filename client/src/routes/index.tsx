import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-black">Welcome to Chemistry! 🎉</h1>
        <p className="text-xl text-gray-600">You have successfully signed in.</p>
      </div>
    </div>
  )
}
