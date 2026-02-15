import { useNavigate } from "react-router";
import { Home } from "lucide-react";
import { Button } from "./ui/button";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col items-center justify-center px-6 bg-white">
      <div className="text-center space-y-4">
        <div className="text-6xl font-bold text-gray-300">404</div>
        <h2 className="text-2xl">Page Not Found</h2>
        <p className="text-gray-600">
          The page you're looking for doesn't exist.
        </p>
        <Button
          onClick={() => navigate("/")}
          className="rounded-full mt-6"
          size="lg"
        >
          <Home className="h-5 w-5 mr-2" />
          Go Home
        </Button>
      </div>
    </div>
  );
}
