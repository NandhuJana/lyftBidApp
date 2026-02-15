import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Clock, DollarSign, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { mockProducts, mockBids } from "../data/mockData";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";

const productImages: Record<string, string> = {
  "1": "https://images.unsplash.com/photo-1588420635201-3a9e2a2a0a07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2FtZXJhJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzcwNzk1MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "2": "https://images.unsplash.com/photo-1639564879163-a2a85682410e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaCUyMHRpbWVwaWVjZXxlbnwxfHx8fDE3NzA3ODM3Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "3": "https://images.unsplash.com/photo-1656480930913-dc35796ff5cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGJpa2UlMjBvdXRkb29yfGVufDF8fHx8MTc3MDg1OTE5Mnww&ixlib=rb-4.1.0&q=80&w=1080",
};

export function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bidAmount, setBidAmount] = useState("");

  const product = mockProducts.find((p) => p.id === id);
  const productBids = mockBids.filter((b) => b.productId === id);
  const highestBid = productBids.length > 0 
    ? Math.max(...productBids.map((b) => b.bidAmount))
    : null;

  if (!product) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>Product not found</p>
      </div>
    );
  }

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(bidAmount);
    
    if (amount <= product.askPrice) {
      toast.error(`Bid must be higher than ask price ($${product.askPrice})`);
      return;
    }

    if (highestBid && amount <= highestBid) {
      toast.error(`Bid must be higher than current highest bid ($${highestBid})`);
      return;
    }

    toast.success(`Bid of $${amount} placed successfully!`);
    setBidAmount("");
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <Toaster />
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl">Product Details</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Product Image */}
        <div className="aspect-video w-full overflow-hidden bg-gray-100">
          <img
            src={productImages[product.id]}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="px-6 py-6 space-y-6">
          {/* Title and Status */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-2xl flex-1">{product.title}</h2>
              <Badge
                variant={product.status === "open" ? "default" : "secondary"}
              >
                {product.status === "open" ? "Open" : "Closed"}
              </Badge>
            </div>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Ask Price Section - Prominent */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900 mb-2">
                  Seller's Ask Price
                </p>
                <p className="text-4xl font-bold text-blue-900">
                  ${product.askPrice}
                </p>
              </div>
              <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
                <DollarSign className="h-8 w-8 text-blue-900" />
              </div>
            </div>
            {highestBid && (
              <div className="mt-4 pt-4 border-t border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800">Highest Bid:</span>
                  <span className="text-xl font-semibold text-blue-900">
                    ${highestBid}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Time Remaining */}
          <div className="flex items-center gap-2 text-sm bg-gray-50 rounded-lg p-3">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700 font-medium">
              {product.status === "open" 
                ? `${product.timeToClose} remaining`
                : "Bidding ended"}
            </span>
          </div>

          {/* Current Bidders Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-gray-700" />
                <h3 className="text-lg font-semibold">
                  Current Bidders
                </h3>
              </div>
              <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {productBids.length} {productBids.length === 1 ? "bid" : "bids"}
              </span>
            </div>

            {productBids.length > 0 ? (
              <div className="space-y-3">
                {productBids
                  .sort((a, b) => b.bidAmount - a.bidAmount)
                  .map((bid, index) => (
                    <div
                      key={bid.id}
                      className={`border-2 rounded-xl p-4 transition-all ${
                        index === 0
                          ? "border-green-400 bg-green-50 shadow-sm"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Position Badge */}
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                              index === 0
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-base">
                              {bid.bidderName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {bid.timestamp.toLocaleString([], {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            ${bid.bidAmount}
                          </p>
                          {index === 0 && (
                            <Badge variant="default" className="mt-1 bg-green-600">
                              Highest Bid
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                <div className="text-gray-400 mb-3">
                  <TrendingUp className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-gray-600 font-medium">No bids yet</p>
                <p className="text-sm text-gray-500 mt-1">
                  Be the first to place a bid!
                </p>
              </div>
            )}
          </div>

          {/* Place Bid Form */}
          {product.status === "open" && (
            <form onSubmit={handlePlaceBid} className="space-y-3 pb-6">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm text-amber-900 font-medium">
                  💡 Minimum bid: ${highestBid ? highestBid + 1 : product.askPrice + 1}
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    type="number"
                    inputMode="decimal"
                    placeholder="Enter your bid amount"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    required
                    step="0.01"
                    min={highestBid ? highestBid + 1 : product.askPrice + 1}
                    className="h-12 text-base"
                  />
                </div>
                <Button type="submit" size="lg" className="rounded-full px-8 h-12">
                  Place Bid
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}