import { Component, OnInit } from '@angular/core';
import { MipImportApi } from '../../../api/parts-management/mip-import.api';
import { LoadingService } from '../../../shared/loading/loading.service';
import { ToastService } from '../../../shared/swal-alert/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mip-import',
  templateUrl: './mip-import.component.html',
  styleUrls: ['./mip-import.component.scss']
})
export class MipImportComponent implements OnInit {
  fieldParts;
  partsParams;
  partsList;

  processingInfo;

  constructor(
    private mipImportApi: MipImportApi,
    private loadingService: LoadingService,
    private swalAlertSerivce: ToastService
  ) {
    this.fieldParts = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        field: 'stt',
        width: 60,
        cellRenderer: params => params.rowIndex + 1,
      },
      {
        headerName: 'Mã PT',
        headerTooltip: 'Mã phụ tùng',
        field: 'partsCode',
      },
      {
        headerName: 'MIP',
        headerTooltip: 'MIP',
        field: 'mip',
      },
      {
        headerName: 'In Stock',
        headerTooltip: 'In Stock',
        field: 'instockType'
      }
    ];
  }

  ngOnInit() {
  }

  getPartsParams() {

  }

  callbackParts(params) {
    this.partsParams = params;
  }

  apiCallUpload(val) {
    return this.mipImportApi.import(val);
  }

  uploadSuccess(data) {
    this.processingInfo = undefined;
    this.partsList = data.Success;
    this.partsParams.api.setRowData(this.partsList);
  }

  uploadFail(data) {
    this.partsParams.api.setRowData([]);
    this.processingInfo = data;
  }

  save() {
    this.loadingService.setDisplay(true);
    this.mipImportApi.save(this.partsList).subscribe(() => {
      this.swalAlertSerivce.openSuccessToast('Import thành công');
      this.loadingService.setDisplay(false);
    });
  }

}
