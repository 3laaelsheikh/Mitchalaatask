import logo from "./logo.svg";
import "./App.css";
import Products from "./Components/Products/Products";
import Layout from "./Components/Layout/Layout";
import { RouterProvider, createHashRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const myrouter = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [{ path: "", element: <Products /> }],
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={myrouter} />

      <Toaster />
    </>
  );
};

export default App;
