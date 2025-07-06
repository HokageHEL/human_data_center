#!/bin/bash

# Colors for output
GREEN="\033[0;32m"
RED="\033[0;31m"
NC="\033[0m" # No Color

# Function to check if a process is running on a port
check_port() {
    local port=$1
    if lsof -i :$port > /dev/null 2>&1; then
        return 0 # Port is in use
    else
        return 1 # Port is free
    fi
}

# Function to log messages
log() {
    local type=$1
    local message=$2
    if [ "$type" == "error" ]; then
        echo -e "${RED}[ERROR]${NC} $message"
    else
        echo -e "${GREEN}[INFO]${NC} $message"
    fi
}

# Create database directory if it doesn't exist
if [ ! -d "database" ]; then
    mkdir database
    log "info" "Created database directory"
fi

# Start backend server
log "info" "Starting backend server..."
if check_port 3000; then
    log "error" "Port 3000 is already in use. Please stop any running servers first."
    exit 1
fi

node backend/server.js & 
BACKEND_PID=$!

# Wait for backend to start
sleep 2
if ! ps -p $BACKEND_PID > /dev/null; then
    log "error" "Backend server failed to start"
    exit 1
fi
log "info" "Backend server started successfully on port 3000"

# Start frontend dev server
log "info" "Starting frontend development server..."
if check_port 5173; then
    log "error" "Port 5173 is already in use. Please stop any running servers first."
    kill $BACKEND_PID
    exit 1
fi

npm run dev & 
FRONTEND_PID=$!

# Wait for frontend to start
sleep 5
if ! ps -p $FRONTEND_PID > /dev/null; then
    log "error" "Frontend server failed to start"
    kill $BACKEND_PID
    exit 1
fi
log "info" "Frontend development server started successfully on port 5173"

# Save PIDs to file for cleanup
echo "$BACKEND_PID $FRONTEND_PID" > .dev-pids

# Trap Ctrl+C and cleanup
trap 'kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; rm .dev-pids 2>/dev/null; log "info" "Servers stopped"; exit 0' INT

# Keep script running
wait