#!/usr/bin/env bash

set -e -o pipefail

apt update
apt install -y sshfs

mkdir -p ~/.ssh
echo "$SSH_VOLUME_KEY" > ~/.ssh/ssh_volume_key
chmod 600 ~/.ssh/ssh_volume_key

cat << EOF > ~/.ssh/config
Host twix
  HostName $SSH_VOLUME_HOST
  User $SSH_VOLUME_USER
  IdentityFile $HOME/.ssh/ssh_volume_key
  StrictHostKeyChecking accept-new
EOF

mkdir -p ./volume
sshfs "twix:$SSH_VOLUME_DIR" ./volume

node ./dist/index.js
