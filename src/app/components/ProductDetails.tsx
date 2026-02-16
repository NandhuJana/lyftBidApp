import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Clock, DollarSign, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { productsAPI, bidsAPI, type ProductResponse, type BidResponse } from "@/services/api";
import { getFallbackProduct, getFallbackBids } from "../data/fallbackData"; // TODO: Remove once API is live
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";

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

export function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bidAmount, setBidAmount] = useState("");
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [bids, setBids] = useState<BidResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      productsAPI.getById(id),
      bidsAPI.getByProduct(id),
    ])
      .then(([prod, bidList]) => {
        setProduct(prod);
        setBids(bidList);
      })
      .catch(() => {
        // TODO: Remove fallback once API is live
        const fb = getFallbackProduct(id);
        setProduct(fb ?? null);
        setBids(fb ? getFallbackBids(id) : []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>Product not found</p>
      </div>
    );
  }

  const highestBid = bids.length > 0
    ? Math.max(...bids.map((b) => b.amount))
    : null;

  const isOpen = product.status === "ACTIVE" || product.status === "open";

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(bidAmount);

    if (highestBid && amount <= highestBid) {
      toast.error(`Bid must be higher than current highest bid ($${highestBid})`);
      return;
    } else if (!highestBid && amount <= product.startingPrice) {
      toast.error(`Bid must be higher than starting price ($${product.startingPrice})`);
      return;
    }

    setSubmitting(true);
    try {
      const newBid = await bidsAPI.create({ productId: product.id, amount });
      setBids((prev) => [newBid, ...prev]);
      toast.success(`Bid of $${amount} placed successfully!`);
      setBidAmount("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to place bid");
    } finally {
      setSubmitting(false);
    }
  };

  const minBid = highestBid ? highestBid + 1 : product.startingPrice + 1;

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
            src={product.images?.[0] || "https://via.placeholder.com/800x400?text=No+Image"}
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
              <Badge variant={isOpen ? "default" : "secondary"}>
                {isOpen ? "Open" : "Closed"}
              </Badge>
            </div>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Price Section */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900 mb-2">
                  Starting Price
                </p>
                <p className="text-4xl font-bold text-blue-900">
                  ${product.startingPrice}
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
              {isOpen
                ? `${getTimeRemaining(product.endTime)} remaining`
                : "Bidding ended"}
            </span>
          </div>

          {/* Current Bidders Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-gray-700" />
                <h3 className="text-lg font-semibold">Current Bidders</h3>
              </div>
              <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {bids.length} {bids.length === 1 ? "bid" : "bids"}
              </span>
            </div>

            {bids.length > 0 ? (
              <div className="space-y-3">
                {[...bids]
                  .sort((a, b) => b.amount - a.amount)
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
                              {new Date(bid.createdAt).toLocaleString([], {
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
                            ${bid.amount}
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
          {isOpen && (
            <form onSubmit={handlePlaceBid} className="space-y-3 pb-6">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm text-amber-900 font-medium">
                  Minimum bid: ${minBid}
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
                    min={minBid}
                    className="h-12 text-base"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="rounded-full px-8 h-12"
                  disabled={submitting}
                >
                  {submitting ? "Placing..." : "Place Bid"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
