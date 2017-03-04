#!/usr/bin/env bash
cd /vagrant/vconf
source provision_helper.sh

install_package 'bower list | grep bootstrap-sass' 'bootstrap-sass' "
cd /vagrant &&
bower install bootstrap-sass
"