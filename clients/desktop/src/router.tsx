import { createBrowserRouter } from "react-router-dom";
import { App } from "./App";
import { Chat } from "./routes/Chat";
import { Home } from "./routes/Home";
import { Settings } from "./routes/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "chat",
        element: <Chat />
      },
      {
        path: "settings",
        element: <Settings />
      }
    ]
  }
]);
