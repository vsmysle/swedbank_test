#!/usr/bin/env bash

install_package 'nodejs --version' 'nodejs' "
apt-get install -y nodejs &&
ln -s /usr/bin/nodejs /usr/bin/node
"