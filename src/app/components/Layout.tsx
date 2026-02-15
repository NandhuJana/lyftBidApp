import { Outlet } from "react-router";

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile-optimized container - works on both Android and iOS */}
      <div className="w-full min-h-screen bg-white mx-auto max-w-md">
        {/* Mobile status bar - generic for both platforms */}
        <div className="h-11 bg-white flex items-center justify-between px-6 border-b border-gray-100">
          <span className="text-sm font-medium">9:41</span>
          <div className="flex items-center gap-2">
            {/* Generic signal/battery icons */}
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 4h2v8H1V4zm3 2h2v6H4V6zm3-2h2v8H7V4zm3 3h2v5h-2V7z"/>
            </svg>
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 4h10a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm10 1a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1V5h-1z"/>
            </svg>
          </div>
        </div>
        
        {/* Content area */}
        <div className="h-[calc(100vh-44px)] overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}