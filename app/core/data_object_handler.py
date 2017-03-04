from app.core.data_parser import DataParser
from app.core.shared_exceptions import ConfigFileNotFound, DataDictWasNotInitialized
from datetime import datetime
from os import path
import _pickle as pkl
import json


class DataObjectHandler(object):

    def __init__(self, config_file_path, rebuild=False):
        if path.isfile(config_file_path):
            with open(config_file_path) as cf:
                self.config = json.load(cf.readlines())
                self.data_dict = None
        else:
            raise ConfigFileNotFound("error: failed to locate config file")
        self.obj_dump_path = self.config["data_obj_dump_path"]
        if not rebuild and path.isfile(self.obj_dump_path):
            with open(self.obj_dump_path, 'rb') as odf:
                self.data_dict = pkl.load(odf)

    def prepare_data(self):
        if not self.data_dict:
            dp = DataParser(self.config["data_file_path"], self.config["data_date_format"])
            self.data_dict = dp.parse_csv()
        return self.data_dict

    def get_filtered_data(self, start_date_str, end_date_str):
        if self.data_dict:
            date_format = self.config["data_date_format"]
            start_date = datetime.strptime(start_date_str, date_format)
            end_date = datetime.strptime(end_date_str, date_format)
            return {k: v for k, v in self.data_dict.items() if start_date <= k <= end_date}
        else:
            raise DataDictWasNotInitialized("error: data dictionary is None - not initialized")

    def dump_data(self):
        try:
            with open(self.obj_dump_path, "wb") as f:
                pkl.dump(self.data_dict, f, -1)
            return True
        except:  # TODO: narrow down possible exception types
            return False
