import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { Capacitor } from "@capacitor/core";

export function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [debugLog, setDebugLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setDebugLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // Show platform info on mount
  useEffect(() => {
    const platform = Capacitor.getPlatform();
    const isNative = Capacitor.isNativePlatform();
    const ua = navigator.userAgent.substring(0, 80);
    const envUrl = import.meta.env.VITE_API_URL || "(not set)";
    const apiUrl = platform === "android"
      ? "http://10.0.2.2:8080/api"
      : "http://localhost:8080/api";
    addLog(`Platform: ${platform}`);
    addLog(`isNative: ${isNative}`);
    addLog(`VITE_API_URL: ${envUrl}`);
    addLog(`Resolved API URL: ${apiUrl}`);
    addLog(`UA: ${ua}`);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    addLog(`--- Login attempt ---`);
    addLog(`Email: ${email}`);

    try {
      addLog("Calling authAPI.login()...");
      await login(email, password);
      addLog("Login SUCCESS!");
      // Pull API-level debug logs
      const apiLogs = (window as any).__apiDebugLogs || [];
      apiLogs.forEach((l: string) => addLog(`[API] ${l}`));
      toast.success("Logged in successfully!");
      navigate("/home");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      addLog(`Login FAILED: ${msg}`);
      // Pull API-level debug logs
      const apiLogs = (window as any).__apiDebugLogs || [];
      apiLogs.forEach((l: string) => addLog(`[API] ${l}`));
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl">Login</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-base h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={1}
              className="text-base h-12"
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-full h-14 text-lg"
            size="lg"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 font-medium">
            Register
          </Link>
        </p>

        {/* Debug panel - remove after fixing */}
        <div className="mt-6 p-3 bg-gray-100 rounded-lg border border-gray-300 text-xs font-mono">
          <p className="font-bold text-red-600 mb-1">DEBUG LOG:</p>
          {debugLog.map((line, i) => (
            <p key={i} className="text-gray-700 break-all">{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
