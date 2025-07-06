#!/bin/bash

# Function to cleanup background processes on script exit
cleanup() {
    echo "Shutting down servers..."
    kill $(jobs -p) 2>/dev/null
    exit
}

# Set up cleanup on script exit
trap cleanup EXIT

# Start the backend server
echo "Starting backend server..."
node backend/server.js &
backend_pid=$!

# Wait briefly to ensure backend starts
sleep 2

# Check if backend server is running
if ! kill -0 $backend_pid 2>/dev/null; then
    echo "Failed to start backend server"
    exit 1
fi

# Start the frontend dev server
echo "Starting frontend development server..."
npm run dev &
frontend_pid=$!

# Wait briefly to ensure frontend starts
sleep 2

# Check if frontend server is running
if ! kill -0 $frontend_pid 2>/dev/null; then
    echo "Failed to start frontend server"
    exit 1
fi

echo "Both servers are running!"
echo "Backend server: http://localhost:3000"
echo "Frontend server: http://localhost:8081"

# Keep the script running
wait