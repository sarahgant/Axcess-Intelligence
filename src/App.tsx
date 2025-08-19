import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ConductingTax } from "./screens/ConductingTax";
import { Home } from "./screens/Home/Home";
import { ExtractingDocument } from "./screens/ExtractingDocument";
import { ExtractingDocumentScreen } from "./screens/ExtractingDocumentScreen";
import { Chat } from "./screens/Chat";

const router = createBrowserRouter([
  {
    path: "/*",
    element: <Home />,
  },
  {
    path: "/document-intelligenceu58-home-screen",
    element: <Home />,
  },
  {
    path: "/extracting-document-insights-2",
    element: <ExtractingDocument />,
  },
  {
    path: "/conducting-tax-research",
    element: <ConductingTax />,
  },
  {
    path: "/extracting-document-insights-3b",
    element: <ExtractingDocumentScreen />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
], {
  future: {
    v7_startTransition: true,
  },
});

export const App = () => {
  return (
    <ErrorBoundary boundaryName="Global-App">
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
};
