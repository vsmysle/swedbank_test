# a little bit of Java syntactic sugar right here in python \(*-*)/
from app.core.data_object_handler import DataObjectHandler
from app.core.shared_exceptions import ConfigFileNotFound
from app.core.geo_data_object_handler import GeoDataObjectHandler
from os import path
import json


class JSONAssembler(object):

    def __init__(self, config_file_path):
        if path.isfile(config_file_path):
            self.doh = DataObjectHandler(config_file_path, rebuild=False)
            self.gdoh = GeoDataObjectHandler(config_file_path, rebuild=False)
        else:
            raise ConfigFileNotFound("error: failed to locate config file")

    def get_full_json(self):
        stat_data = self.doh.prepare_data()
        json_str = {'geo_data': self.gdoh.prepare_geo_date(), "stat_data": stat_data[0], "date_range": stat_data[1:]}
        return json.dumps(json_str)

    def get_date_range_json(self, start_date, end_date):
        f_data = self.doh.get_filtered_data(start_date, end_date)
        return json.dumps({"stat_data": f_data[0], "date_range": f_data[1:]})
