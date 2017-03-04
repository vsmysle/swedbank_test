#!/usr/bin/env bash
cd /vagrant/vconf
source provision_helper.sh

install_package 'cd /vagrant/app/static/fonts/bootstrap/' 'bootstrap-sass' "
cd /vagrant &&
gem install bootstrap-sass
"