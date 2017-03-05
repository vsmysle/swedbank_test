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
                self.config = json.load(cf)
                self.date_format = self.config["data_date_format"]
                self.data_dict = None
        else:
            raise ConfigFileNotFound("error: failed to locate config file")
        self.obj_dump_path = self.config["data_obj_dump_path"]
        if not rebuild and path.isfile(self.obj_dump_path):
            with open(self.obj_dump_path, 'rb') as odf:
                self.data_dict = pkl.load(odf)

    def prepare_data(self):
        if not self.data_dict:
            dp = DataParser(self.config["data_files_path"], self.config["data_date_format"])
            self.data_dict = dp.parse_csv()
            self.dump_data()
        date_boundaries = self.get_full_range_boundaries()
        return self.convert_to_repr(self.data_dict), date_boundaries[0], date_boundaries[1]

    def get_filtered_data(self, start_date_str, end_date_str):
        if self.data_dict:
            start_date = datetime.strptime(start_date_str, self.date_format)
            end_date = datetime.strptime(end_date_str, self.date_format)
            return self.convert_to_repr({k: v for k, v in self.data_dict.items() if start_date <= k <= end_date}), \
                start_date_str, end_date_str
        else:
            raise DataDictWasNotInitialized("error: data dictionary is None - not initialized")

    def get_full_range_boundaries(self):
        srt_keys = sorted(self.data_dict.keys())
        return datetime.strftime(srt_keys[0], self.date_format), datetime.strftime(srt_keys[-1], self.date_format)

    def convert_to_repr(self, data_dict):
        zip_centric_dict = {k: [] for k in data_dict[datetime.strptime('28.02.2011', self.date_format)]}
        periods = len(data_dict)
        for zip in zip_centric_dict.keys():
            total_sal = 0
            total_pop = 0
            total_mob = 0
            for v in data_dict.values():
                zip_sp_data = v[zip]
                total_sal += int(zip_sp_data[0])
                total_pop += int(zip_sp_data[1])
                total_mob += int(zip_sp_data[2])
            avg_pop = total_pop / periods
            avg_sal = total_sal / avg_pop
            avg_mob = total_mob / periods
            zip_centric_dict[zip] = [total_sal, avg_sal, avg_pop, avg_mob]
        return zip_centric_dict

    def dump_data(self):
        try:
            with open(self.obj_dump_path, "wb") as f:
                pkl.dump(self.data_dict, f, -1)
            return True
        except:  # TODO: narrow down possible exception types
            return False
