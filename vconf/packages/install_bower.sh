#!/usr/bin/env bash
cd /vagrant/vconf
source provision_helper.sh

install_package 'bower --version' 'bower' "
npm install -g bower
"