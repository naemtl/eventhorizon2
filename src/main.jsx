import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import Calendar from "./pages/Calendar/Calendar.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";
import Event from "./pages/Event/Event.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
  },
  {
    path: "/calendar",
    element: <Calendar />,
  },
  {
    path: "/event/:eventId",
    element: <Event />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
