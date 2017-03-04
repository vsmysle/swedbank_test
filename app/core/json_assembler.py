# a little bit of Java syntactic sugar right here in python \(*-*)/
from app.core.data_object_handler import DataObjectHandler
from app.core.shared_exceptions import ConfigFileNotFound
from app.core.geo_data_object_handler import GeoDataObjectHandler
from os import path
import json


class JSONAssembler(object):

    def __init__(self, config_file_path):
        if path.isfile(config_file_path):
            with open(config_file_path) as cf:
                config = json.load(cf.readlines())
            self.doh = DataObjectHandler(config)
            self.gdoh = GeoDataObjectHandler(config)
        else:
            raise ConfigFileNotFound("error: failed to locate config file")

    def get_full_json(self):
        json_str = {'geo_data': self.gdoh.fetch_geo_date(), "stat_data": self.doh.prepare_data()}
        return json_str

    def get_date_range_json(self, start_date, end_date):
        return json.dumps(self.doh.get_filtered_data(start_date, end_date))
