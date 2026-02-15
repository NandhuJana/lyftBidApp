import { Link } from "react-router";
import { ArrowLeft, TrendingUp, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

// Placeholder: This will be replaced with actual API call
const PLACEHOLDER_API_URL = "https://api.example.com/user/bids";

// Mock data for items the user has bid on
// TODO: Replace with actual API call to fetch user's bid history
interface UserBidItem {
  productId: string;
  productTitle: string;
  productImage: string;
  myBidAmount: number;
  currentHighestBid: number;
  isMyBidWinning: boolean;
  bidStatus: "active" | "won" | "outbid" | "ended";
  timeRemaining?: string;
  totalBids: number;
}

// Placeholder data - will be fetched from API
const mockUserBids: UserBidItem[] = [
  {
    productId: "1",
    productTitle: "Vintage Camera",
    productImage: "https://images.unsplash.com/photo-1588420635201-3a9e2a2a0a07?w=800",
    myBidAmount: 280,
    currentHighestBid: 300,
    isMyBidWinning: false,
    bidStatus: "outbid",
    timeRemaining: "2 days",
    totalBids: 5,
  },
  {
    productId: "2",
    productTitle: "Leather Jacket",
    productImage: "https://images.unsplash.com/photo-1639564879163-a2a85682410e?w=800",
    myBidAmount: 175,
    currentHighestBid: 175,
    isMyBidWinning: true,
    bidStatus: "active",
    timeRemaining: "5 days",
    totalBids: 3,
  },
  {
    productId: "3",
    productTitle: "Wooden Coffee Table",
    productImage: "https://images.unsplash.com/photo-1656480930913-dc35796ff5cc?w=800",
    myBidAmount: 220,
    currentHighestBid: 220,
    isMyBidWinning: true,
    bidStatus: "active",
    timeRemaining: "3 days",
    totalBids: 2,
  },
];

export function MyBids() {
  // TODO: Replace with actual API call
  // useEffect(() => {
  //   fetch(PLACEHOLDER_API_URL)
  //     .then(res => res.json())
  //     .then(data => setUserBids(data));
  // }, []);

  const userBids = mockUserBids; // Replace with state from API

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
        {userBids.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-6xl mb-4">📋</div>
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
              key={bid.productId}
              to={`/product/${bid.productId}`}
              className="block"
            >
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="flex gap-4 p-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={bid.productImage}
                      alt={bid.productTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-base mb-1 truncate">
                      {bid.productTitle}
                    </h3>

                    {/* Bid Status Badge */}
                    <div className="mb-3">
                      {bid.isMyBidWinning ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Winning
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          Outbid
                        </Badge>
                      )}
                    </div>

                    {/* Bid Amounts */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">My Bid:</span>
                        <span className="font-semibold text-gray-900">
                          ${bid.myBidAmount}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Highest Bid:</span>
                        <span
                          className={`font-semibold ${
                            bid.isMyBidWinning
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          ${bid.currentHighestBid}
                        </span>
                      </div>
                    </div>

                    {/* Time Remaining */}
                    {bid.timeRemaining && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                        <Clock className="h-3 w-3" />
                        <span>{bid.timeRemaining} remaining</span>
                        <span className="mx-1">•</span>
                        <span>{bid.totalBids} bids</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Hint */}
                {!bid.isMyBidWinning && (
                  <div className="bg-red-50 px-4 py-2 border-t border-red-100">
                    <p className="text-xs text-red-800">
                      Tap to place a higher bid
                    </p>
                  </div>
                )}
              </div>
            </Link>
          ))
        )}
      </div>

      {/* API Integration Note (for development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="px-6 py-3 bg-blue-50 border-t border-blue-100">
          <p className="text-xs text-blue-800">
            🔧 Dev: Replace mockUserBids with API call to: {PLACEHOLDER_API_URL}
          </p>
        </div>
      )}
    </div>
  );
}
