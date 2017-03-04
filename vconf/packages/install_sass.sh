# cd to import directory
cd /vagrant/vconf
source provision_helper.sh

install_package 'sass' "
apt-get install -y ruby-sass
"
