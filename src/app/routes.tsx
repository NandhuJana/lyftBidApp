import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { ProductDetails } from "./components/ProductDetails";
import { SellerDashboard } from "./components/SellerDashboard";
import { CreateProduct } from "./components/CreateProduct";
import { ExistingListings } from "./components/ExistingListings";
import { ProductPreview } from "./components/ProductPreview";
import { MyBids } from "./components/MyBids";
import { NotFound } from "./components/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "product/:id",
        Component: ProductDetails,
      },
      {
        path: "seller",
        Component: SellerDashboard,
      },
      {
        path: "create",
        Component: CreateProduct,
      },
      {
        path: "seller/existing",
        Component: ExistingListings,
      },
      {
        path: "preview/:id",
        Component: ProductPreview,
      },
      {
        path: "my-bids",
        Component: MyBids,
      },
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },
]);

export { router };
