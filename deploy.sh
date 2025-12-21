# --- Configuration ---
# Replace these with your server details
SERVER_USER="chat"
SERVER_IP="5.39.221.56"
SERVER_PATH="/home/igstart-chat/htdocs/chat.igstart.com"
SERVER_PASS="ZAk5sx685G4TNvcg8jsJ" # Optional: set this and install 'sshpass' for automation

echo "🚀 Starting Deployment (Git Pull on Server) to $SERVER_IP..."

# Command to run on server
REMOTE_SCRIPT="
  cd \"$SERVER_PATH\" || exit
  echo \"📂 Navigate to $SERVER_PATH (Pwd: \$(pwd))\"
  
  echo \"⬇️ Git Pull...\"
  git pull origin main
  
  echo \"📦 Installing Dependencies...\"
  npm install
  
  echo \"🏗️ Building Project...\"
  npm run build
"

# 1. SSH into server and pull latest code
if [ -n "$SERVER_PASS" ] && command -v sshpass &> /dev/null; then
    echo "🔑 Using sshpass for authentication..."
    sshpass -p "$SERVER_PASS" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" "$REMOTE_SCRIPT"
else
    echo "🔑 Connecting via SSH (Please enter password if prompted)..."
    ssh "$SERVER_USER@$SERVER_IP" "$REMOTE_SCRIPT"
fi

echo "✅ Deployment Command Sent!"
