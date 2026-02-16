import { useNavigate } from "react-router";
import { Plus, List, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

export function SellerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/home")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl">Seller Dashboard</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        <div className="w-full max-w-sm space-y-4">
          <Button
            onClick={() => navigate("/create")}
            className="w-full h-32 rounded-2xl text-lg flex flex-col gap-3"
            size="lg"
          >
            <Plus className="h-10 w-10" />
            <span>Create New Listing</span>
          </Button>

          <Button
            onClick={() => navigate("/seller/existing")}
            variant="outline"
            className="w-full h-32 rounded-2xl text-lg flex flex-col gap-3"
            size="lg"
          >
            <List className="h-10 w-10" />
            <span>See Existing Listings</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
