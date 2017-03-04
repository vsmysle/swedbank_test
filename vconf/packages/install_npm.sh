#!/usr/bin/env bash
cd /vagrant/vconf
source provision_helper.sh

install_package 'npm --version' 'npm' "
apt-get install -y npm
"