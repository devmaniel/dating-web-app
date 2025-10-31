import { RouterProvider, createRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen";
import { ThemeProvider } from "./shared/contexts/theme-context";
import { LikeProvider } from "./shared/contexts/LikeContext";
import { useGlobalChatSync } from "./shared/hooks/useGlobalChatSync";
import { useMatchSync } from "./shared/hooks/useMatchSync";
import { useAppInitialization } from "./shared/hooks/useAppInitialization";
import { useAuth } from "./shared/hooks/useAuth";

const router = createRouter({routeTree});

// Supports weights 300-900
import '@fontsource-variable/merriweather';

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}


function App() {
  // CRITICAL: Initialize auth FIRST before any other hooks
  // This ensures isAuthenticated is set before data fetching begins
  useAuth();
  
  // Initialize app-level data caching (user profile, liked you count)
  // These hooks check isAuthenticated before making API calls
  useAppInitialization();
  
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
