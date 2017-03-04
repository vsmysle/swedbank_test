from app.core.shared_exceptions import DataFileNotFound, ConfigFileNotFound
from os import path
import json


class GeoDataObjectHandler(object):

    def __init__(self, config_file_path):
        if path.isfile(config_file_path):
            with open(config_file_path) as cf:
                self.geo_data_file_path = json.load(cf.readlines())["zip_geo_date_file_path"]
        else:
            raise ConfigFileNotFound("error: failed to locate config file")

    def fetch_geo_date(self):
        if path.isfile(self.geo_data_file_path):
            with open(self.geo_data_file_path) as gdf:
                return gdf.readlines()
        else:
            raise DataFileNotFound("error: failed to locate data file")
