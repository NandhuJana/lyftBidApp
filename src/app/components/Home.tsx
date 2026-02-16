import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Plus, Clock, User, LogIn } from "lucide-react";
import { productsAPI, type ProductResponse } from "@/services/api";
import { FALLBACK_PRODUCT_PAGE } from "../data/fallbackData"; // TODO: Remove once API is live
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

function getTimeRemaining(endTime: string): string {
  const end = new Date(endTime).getTime();
  const now = Date.now();
  const diff = end - now;
  if (diff <= 0) return "Ended";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}d ${hours}h`;
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function Home() {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    productsAPI
      .getAll({ size: 20 })
      .then((data) => {
        // TODO: Remove fallback once API is live
        setProducts(data.products.length > 0 ? data.products : FALLBACK_PRODUCT_PAGE.products);
      })
      .catch(() => {
        // TODO: Remove fallback once API is live
        setProducts(FALLBACK_PRODUCT_PAGE.products);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl">Marketplace</h1>
          <div className="flex items-center gap-2">
            {!isAuthenticated && (
              <Button asChild size="icon" variant="outline" className="rounded-full">
                <Link to="/">
                  <LogIn className="h-5 w-5" />
                </Link>
              </Button>
            )}
            <Button asChild size="icon" className="rounded-full">
              <Link to="/create">
                <Plus className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link to="/seller">
              <User className="h-4 w-4 mr-2" />
              Seller
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link to="/my-bids">
              <User className="h-4 w-4 mr-2" />
              Bidder
            </Link>
          </Button>
        </div>
      </div>

      {/* Product List */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">Loading products...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">No products available</p>
          </div>
        )}

        {products.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="block"
          >
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={product.images?.[0] || "https://via.placeholder.com/800x400?text=No+Image"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg mb-1">{product.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <p className="text-sm text-gray-500">Starting Price</p>
                    <p className="font-semibold text-lg">${product.startingPrice}</p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={product.status === "ACTIVE" || product.status === "open" ? "default" : "secondary"}
                      className="mb-1"
                    >
                      {product.status === "ACTIVE" || product.status === "open" ? "Bid Open" : "Bid Closed"}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="h-3 w-3" />
                      <span>{getTimeRemaining(product.endTime)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
