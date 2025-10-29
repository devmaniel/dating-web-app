import { RouterProvider, createRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen";
import { ThemeProvider } from "./shared/contexts/theme-context";
import { LikeProvider } from "./shared/contexts/LikeContext";
import { useGlobalChatSync } from "./shared/hooks/useGlobalChatSync";
import { useMatchSync } from "./shared/hooks/useMatchSync";

const router = createRouter({routeTree});

// Supports weights 300-900
import '@fontsource-variable/merriweather';

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}


function App() {
  // Initialize global chat unread counts on app startup
  useGlobalChatSync();
  
  // Initialize global match synchronization
  useMatchSync();

  return (
    <LikeProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </LikeProvider>
  )
}

export default App
