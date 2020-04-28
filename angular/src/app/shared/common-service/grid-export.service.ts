import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnvConfigService} from '../../env-config.service';
import {ToastrService} from 'ngx-toastr';
import {LoadingService} from '../loading/loading.service';
import {DecodeMessageNoData} from '../../core/constains/decode-export-file';

@Injectable()
export class GridExportService {

  resDataExport;
  baseUrl = this.envConfigService.getConfig().backEnd.replace('/service', '/tmss');

  constructor(
    private httpClient: HttpClient,
    private envConfigService: EnvConfigService,
    private toastrService: ToastrService,
    private loadingService: LoadingService
  ) {
  }

  export(params, fileName?: string, sheetName?: string) {
    const paramsExport = {
      fileName,
      sheetName: !sheetName ? fileName : sheetName,
      columnGroups: true,
      allColumns: true
    };
    params.api.exportDataAsExcel(paramsExport);
  }

  onExportFile(urlExportToExcel, dataObject, fileName) {
    this.loadingService.setDisplay(true);
    this.httpClient.post(`${this.baseUrl}${urlExportToExcel}`, dataObject, {responseType: 'arraybuffer'}).subscribe((data) => {
      this.loadingService.setDisplay(false);
      this.resDataExport = data;
      const decodeString = btoa(new Uint8Array(data).reduce((str, byte) => str + String.fromCharCode(byte), ''));
      if (decodeString.includes(DecodeMessageNoData) === true) {
        this.toastrService.warning('No data existed to export file', 'Cảnh báo');
      } else {
        const file = new Blob([data], {
          type: 'application/*'
        });
        const fileURL = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = fileURL;
        a.target = '_blank';
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
      }
    }, (error) => {
      console.log(error);
    });
  }

  onExportFileTemplate(urlExportTemplate, fileNameTemplate) {
    this.loadingService.setDisplay(true);
    this.httpClient.get(`${this.baseUrl}${urlExportTemplate}`, {responseType: 'arraybuffer'}).subscribe((data) => {
      this.loadingService.setDisplay(false);
      const file = new Blob([data], {
        type: 'application/*'
      });
      const fileURL = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = fileURL;
      a.target = '_blank';
      a.download = fileNameTemplate;
      document.body.appendChild(a);
      a.click();
    }, (error) => {
      console.log(error);
    });
  }


}
