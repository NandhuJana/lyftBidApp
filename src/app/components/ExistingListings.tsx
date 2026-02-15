import { Link, useNavigate } from "react-router";
import { ArrowLeft, Package, FileText, Box, Shirt } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { mockProducts, mockBids } from "../data/mockData";

const productImages: Record<string, string> = {
  "1": "https://images.unsplash.com/photo-1588420635201-3a9e2a2a0a07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2FtZXJhJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzcwNzk1MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "2": "https://images.unsplash.com/photo-1639564879163-a2a85682410e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaCUyMHRpbWVwaWVjZXxlbnwxfHx8fDE3NzA3ODM3Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "3": "https://images.unsplash.com/photo-1656480930913-dc35796ff5cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGJpa2UlMjBvdXRkb29yfGVufDF8fHx8MTc3MDg1OTE5Mnww&ixlib=rb-4.1.0&q=80&w=1080",
};

// Icon mapping for different categories
const categoryIcons = {
  electronics: Package,
  fashion: Shirt,
  sports: Box,
  default: FileText,
};

export function ExistingListings() {
  const navigate = useNavigate();
  
  // Filter products for current seller (assuming seller1 is current user)
  const myListings = mockProducts.filter((p) => p.sellerId === "seller1");

  const getBidsCount = (productId: string) => {
    return mockBids.filter((b) => b.productId === productId).length;
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
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
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getCategoryIcon = (category: string) => {
    const Icon = categoryIcons[category as keyof typeof categoryIcons] || categoryIcons.default;
    return Icon;
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
          {myListings.length} {myListings.length === 1 ? "listing" : "listings"}
        </p>
      </div>

      {/* Listings - List View */}
      <div className="flex-1 overflow-y-auto">
        {myListings.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {myListings.map((product) => {
              const bidsCount = getBidsCount(product.id);
              const Icon = getCategoryIcon(product.category);

              return (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="block"
                >
                  <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      {/* Icon on Left */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>

                      {/* Product Details in Middle */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-base mb-1 truncate">
                          {product.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                          {product.description}
                        </p>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-gray-500">
                            {bidsCount} {bidsCount === 1 ? "bid" : "bids"}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-900 font-medium">
                            ${product.askPrice}
                          </span>
                        </div>
                      </div>

                      {/* Status on Right */}
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