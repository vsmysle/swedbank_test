from app.core.shared_exceptions import DataFileNotFound
from datetime import datetime
from csv import reader
from os import path


class DataParser(object):

    def __init__(self, data_file_path, date_format):
        if path.isfile(data_file_path):
            self.data_file_path = data_file_path
            self.date_format = date_format
        else:
            raise DataFileNotFound("error: failed to locate data file")

    def parse_csv(self):
        with open(self.data_file_path) as df:
            csvr = reader(df, delimiter=',', quotechar='"')
            dates_lst = next(csvr)[1:]
            data_dict = {datetime.strptime(date, self.date_format): {} for date in dates_lst}
            for row in csvr:
                zip_code = row.pop(0)
                for s_ind in range(len(row)):
                    data_dict[datetime.strptime(dates_lst[s_ind], self.date_format)][zip_code] = row[s_ind]
            return data_dict
