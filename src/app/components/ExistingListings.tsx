import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Package, FileText, Box, Shirt } from "lucide-react";
import { Button } from "./ui/button";
import { productsAPI, type ProductResponse } from "@/services/api";
import { FALLBACK_PRODUCTS } from "../data/fallbackData"; // TODO: Remove once API is live

const categoryIcons: Record<string, typeof Package> = {
  electronics: Package,
  fashion: Shirt,
  sports: Box,
};

export function ExistingListings() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsAPI
      .getAll({ size: 50 })
      .then((data) => {
        // TODO: Remove fallback once API is live
        setListings(data.products.length > 0 ? data.products : FALLBACK_PRODUCTS);
      })
      .catch(() => {
        // TODO: Remove fallback once API is live
        setListings(FALLBACK_PRODUCTS);
      })
      .finally(() => setLoading(false));
  }, []);

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "open":
        return "bg-green-100 text-green-700 border-green-200";
      case "closed":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusDisplay = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const getCategoryIcon = (category: string) => {
    return categoryIcons[category?.toLowerCase()] || FileText;
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/seller")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl">My Listings</h1>
        </div>
        <p className="text-sm text-gray-600 ml-12">
          {listings.length} {listings.length === 1 ? "listing" : "listings"}
        </p>
      </div>

      {/* Listings */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-gray-500">Loading listings...</p>
          </div>
        ) : listings.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {listings.map((product) => {
              const Icon = getCategoryIcon(product.category);

              return (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="block"
                >
                  <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-base mb-1 truncate">
                          {product.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                          {product.description}
                        </p>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-gray-500">
                            {product.bidCount} {product.bidCount === 1 ? "bid" : "bids"}
                          </span>
                          <span className="text-gray-300">&bull;</span>
                          <span className="text-gray-900 font-medium">
                            ${product.startingPrice}
                          </span>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusVariant(
                            product.status
                          )}`}
                        >
                          {getStatusDisplay(product.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div className="text-gray-300 mb-4">
              <Package className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium mb-2">No listings yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first listing to get started
            </p>
            <Button
              onClick={(e) => {
                e.preventDefault();
                navigate("/create");
              }}
              className="rounded-full"
            >
              Create Listing
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
