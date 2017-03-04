#!/usr/bin/env bash

install_package 'bower list | grep bootstrap-sass' 'bootstrap-sass' "
cd /vagrant &&
bower install bootstrap-sass
"