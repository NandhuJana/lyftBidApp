#!/bin/bash

# Mobile Bidding App - Quick Launch Script
# Usage: ./run-mobile-app.sh

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 Starting Mobile Bidding App..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start dev server in background
echo "🚀 Starting dev server..."
npm run dev &
DEV_SERVER_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 3

# Check if server is running
if curl -s http://localhost:5173/ > /dev/null; then
    echo "✅ Dev server is running!"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📱 MOBILE APP READY!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🌐 URL: http://localhost:5173/"
    echo ""
    echo "📱 TO VIEW IN MOBILE MODE:"
    echo "   Press: Cmd + Ctrl + R (in Safari)"
    echo "   Then select: iPhone 14 Pro"
    echo ""
    echo "🛑 TO STOP SERVER:"
    echo "   Press: Ctrl + C"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    # Open in Safari
    echo "🌐 Opening Safari..."
    open -a Safari "http://localhost:5173/"

    # Wait for user to stop server
    wait $DEV_SERVER_PID
else
    echo "❌ Failed to start dev server"
    echo "Check for errors above"
fi
