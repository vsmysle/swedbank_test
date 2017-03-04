#!/usr/bin/env bash
cd /vagrant/vconf
source provision_helper.sh

install_package 'nodejs --version' 'nodejs' "
apt-get install -y nodejs &&
ln -s /usr/bin/nodejs /usr/bin/node
"