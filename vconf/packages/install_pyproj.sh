# cd to import directory
cd /vagrant/vconf
source provision_helper.sh

install_package "python3 -c 'from pyproj import *'" 'pyproj' "
pip3 install pyproj
"