from app.core.shared_exceptions import DataFileNotFound, ConfigFileNotFound
from pyproj import Proj, transform
from os import path
import _pickle as pkl
import json


class GeoDataObjectHandler(object):

    def __init__(self, config_file_path, rebuild=False):
        if path.isfile(config_file_path):
            with open(config_file_path) as cf:
                self.config = json.load(cf)
                self.geo_data_file_path = self.config["zip_geo_date_file_path"]
                self.geo_data_dict = None
        else:
            raise ConfigFileNotFound("error: failed to locate config file")
        self.geo_obj_dump_path = self.config["geo_data_obj_dump_path"]
        if not rebuild and path.isfile(self.geo_obj_dump_path):
            with open(self.geo_obj_dump_path, 'rb') as odf:
                self.geo_data_dict = pkl.load(odf)

    def prepare_geo_date(self):
        if not self.geo_data_dict:
            if path.isfile(self.geo_data_file_path):
                with open(self.geo_data_file_path) as gdf:
                    raw_geo_data = json.load(gdf)
                in_proj = Proj(init='epsg:3857')
                out_proj = Proj(init='epsg:4326')
                for feature in raw_geo_data['features']:
                    converted_coords = []
                    if feature['geometry']['type'] == 'MultiPolygon':
                        for pol in feature['geometry']['coordinates'][0]:
                            tmp_lst = []
                            for coord_pair in pol:
                                tmp_lst.append(transform(in_proj, out_proj, coord_pair[0], coord_pair[1]))
                            converted_coords.append(tmp_lst)
                    else:
                        for coord_pair in feature['geometry']['coordinates'][0]:
                            converted_coords.append(transform(in_proj, out_proj, coord_pair[0], coord_pair[1]))
                        feature['geometry']['coordinates'][0] = converted_coords
                self.geo_data_dict = raw_geo_data
                self.dump_data()
            else:
                raise DataFileNotFound("error: failed to locate data file")
        return self.geo_data_dict

    def dump_data(self):
        try:
            with open(self.geo_obj_dump_path, "wb") as f:
                pkl.dump(self.geo_data_dict, f, -1)
            return True
        except:  # TODO: narrow down possible exception types
            return False