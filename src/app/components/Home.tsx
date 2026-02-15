import { Link } from "react-router";
import { Plus, Clock, User } from "lucide-react";
import { mockProducts } from "../data/mockData";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const productImages: Record<string, string> = {
  "1": "https://images.unsplash.com/photo-1588420635201-3a9e2a2a0a07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2FtZXJhJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzcwNzk1MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "2": "https://images.unsplash.com/photo-1639564879163-a2a85682410e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaCUyMHRpbWVwaWVjZXxlbnwxfHx8fDE3NzA3ODM3Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "3": "https://images.unsplash.com/photo-1656480930913-dc35796ff5cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGJpa2UlMjBvdXRkb29yfGVufDF8fHx8MTc3MDg1OTE5Mnww&ixlib=rb-4.1.0&q=80&w=1080",
};

export function Home() {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl">Marketplace</h1>
          <Button asChild size="icon" className="rounded-full">
            <Link to="/create">
              <Plus className="h-5 w-5" />
            </Link>
          </Button>
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
        {mockProducts.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="block"
          >
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={productImages[product.id]}
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
                    <p className="text-sm text-gray-500">Ask Price</p>
                    <p className="font-semibold text-lg">${product.askPrice}</p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={product.status === "open" ? "default" : "secondary"}
                      className="mb-1"
                    >
                      {product.status === "open" ? "Bid Open" : "Bid Closed"}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="h-3 w-3" />
                      <span>{product.timeToClose}</span>
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