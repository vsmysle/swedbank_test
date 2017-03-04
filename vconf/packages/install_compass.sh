#!/usr/bin/env bash
cd /vagrant/vconf
source provision_helper.sh

install_package 'compass --version' 'compass' "
gem install compass
"