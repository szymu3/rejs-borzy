#!/bin/bash
set -e

NODE=$(which node || which nodejs)
DIR=$(cd "$(dirname "$0")" && pwd)
USER=$(whoami)

SERVICE="rejs-borzy"
SERVICE_FILE="/etc/systemd/system/${SERVICE}.service"

echo "Creating systemd service..."
echo "  Node:    $NODE"
echo "  Dir:     $DIR"
echo "  User:    $USER"

sudo tee "$SERVICE_FILE" > /dev/null <<EOF
[Unit]
Description=Rejs Borzy - Joint Tracker
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$DIR
ExecStart=$NODE $DIR/server.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable "$SERVICE"
sudo systemctl restart "$SERVICE"

echo ""
echo "Done! Service is running and will auto-start on boot."
echo ""
sudo systemctl status "$SERVICE" --no-pager
