#!/usr/bin/env bash
cd /vagrant/vconf
source provision_helper.sh

install_package 'ruby --version' 'ruby' "
apt install -y ruby &&
apt install -y ruby-dev
"