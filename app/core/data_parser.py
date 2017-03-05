from app.core.shared_exceptions import DataFileNotFound
from datetime import datetime
from csv import reader
from os import path


class DataParser(object):

    def __init__(self, data_files_path, date_format):
        if self.verify_files_presence(data_files_path):
            self.data_files_path = data_files_path
            self.date_format = date_format
        else:
            raise DataFileNotFound("error: failed to locate data file")

    def parse_csv(self):
        csvr_lst = []
        f_lst = []
        for file_path in self.data_files_path:
            t_f = open(file_path)
            csvr_lst.append(reader(t_f, delimiter=',', quotechar='"'))
            f_lst.append(t_f)
        dates_lst = next(csvr_lst[0])[1:]
        data_dict = {datetime.strptime(date, self.date_format): {} for date in dates_lst}
        for rdr in csvr_lst[1:]:
            next(rdr)
        for master_row in csvr_lst[0]:
            slave_rows = []
            zip_code = master_row.pop(0)
            for rdr in csvr_lst[1:]:
                slave_rows.append(next(rdr)[1:])
            for s_ind in range(len(master_row)):
                val_lst = [master_row[s_ind]]
                for sl_row in slave_rows:
                    val_lst.append(sl_row[s_ind])
                data_dict[datetime.strptime(dates_lst[s_ind], self.date_format)][zip_code] = val_lst
        for file_obj in f_lst:
            file_obj.close()
        return data_dict

    @staticmethod
    def verify_files_presence(data_files_path):
        present = True
        for file_path in data_files_path:
            if not path.isfile(file_path):
                present = False
                break
        return present
