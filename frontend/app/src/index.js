import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";


// ? ROUTES HERE ? //
import App from "./App";
import Login from "./components/Login";
import AnalyticsMarket from "./components/Analytics-Market";
import TablePage from "./components/TablePage"
import ShowDiffPage from "./components/ShowDiffPage";
import ServerPage from "./components/ServerPage";
import ProfilePage from "./components/ProfilePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/marketing",
    element: <AnalyticsMarket/>
  }, 
  {
    path: "/tables",
    element: <TablePage/>
  },
  {
    path: "/showdiff",
    element: <ShowDiffPage/>
  },
  {
    path: "/server",
    element: <ServerPage/>
  },
  {
    path: "/profile",
    element: <ProfilePage/>
  }
]);

<style>
@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap')
</style>



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);