import { RouterProvider, createRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen";

const router = createRouter({routeTree});

// Supports weights 300-900
import '@fontsource-variable/merriweather';

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}


function App() {
  return <RouterProvider router={router} />
}

export default App
