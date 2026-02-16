import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { bidsAPI, type UserBidResponse } from "@/services/api";
import { FALLBACK_USER_BIDS } from "../data/fallbackData"; // TODO: Remove once API is live

export function MyBids() {
  const [userBids, setUserBids] = useState<UserBidResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bidsAPI
      .getMyBids()
      .then((data) => {
        // TODO: Remove fallback once API is live
        setUserBids(data.length > 0 ? data : FALLBACK_USER_BIDS);
      })
      .catch(() => {
        // TODO: Remove fallback once API is live
        setUserBids(FALLBACK_USER_BIDS);
      })
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "winning":
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case "outbid":
        return <Badge variant="destructive">Outbid</Badge>;
      case "won":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Won</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <Button asChild variant="ghost" size="icon">
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold">My Bids</h1>
        </div>
        <p className="text-sm text-gray-600">
          Items you're currently bidding on
        </p>
      </div>

      {/* Bids List */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">Loading your bids...</p>
          </div>
        ) : userBids.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No active bids
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Start bidding on items you're interested in
            </p>
            <Button asChild>
              <Link to="/">Browse Marketplace</Link>
            </Button>
          </div>
        ) : (
          userBids.map((bid) => (
            <Link
              key={bid.id}
              to={`/product/${bid.productId}`}
              className="block"
            >
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-base flex-1 truncate mr-2">
                      {bid.productTitle}
                    </h3>
                    {getStatusBadge(bid.status)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">My Bid:</span>
                      <span className="font-semibold text-gray-900">
                        ${bid.amount}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-3">
                    <Clock className="h-3 w-3" />
                    <span>
                      {new Date(bid.createdAt).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
