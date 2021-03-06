import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ToastService} from '../../../../shared/common-service/toast.service';
import {EnvConfigService} from '../../../../env-config.service';
import {CbuVehicleInfoService} from '../../../../api/daily-sale/cbu-vehicle-info.service';
import {StorageKeys} from '../../../../core/constains/storageKeys';
import {ImportService} from '../../../../api/import/import.service';
import {LoadingService} from '../../../../shared/loading/loading.service';

@Component({
  selector: 'sales-color-order-modal',
  templateUrl: './sales-color-order-modal.component.html',
  styleUrls: ['./sales-color-order-modal.component.scss']
})
export class SalesColorOrderModalComponent implements OnInit {

  @ViewChild('importModal', {static: false}) modal: ModalDirective;
  @ViewChild('fileUpLoad', {static: false}) fileUpLoad: ElementRef;

  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  filesToUpload = [];
  fileName;
  disable = true;
  file = [];
  disableSave = true;
  fieldGrid;
  gridApi;
  onHidden;
  uploader: FileUploader;
  error: any;

  constructor(
    private toastService: ToastService,
    private importService: ImportService,
    private loadingService: LoadingService
  ) {
    this.fieldGrid = [
      {
        headerName: 'Đại lý',
        field: 'dealer'
      },
      {
        headerName: 'Grade',
        field: 'grade'
      },
      {
        headerName: 'Interior color',
        field: 'interiorColor'
      },
      {
        headerName: 'Exterior Color',
        field: 'exteriorColor'
      },
      {
        headerName: 'Số lượng',
        field: 'quantity'
      },
      {
        headerName: 'Tháng',
        field: 'month'
      },
      {
        headerName: 'Status',
        field: 'status'
      }
    ];
  }

  open() {
    if (this.gridApi) {
      this.gridApi.api.sizeColumnsToFit();
    }
    this.modal.show();
  }

  ngOnInit() {
    this.initUploader();
  }

  initUploader() {
    this.uploader = new FileUploader({url: '/'});
    this.uploader.onBeforeUploadItem = item => item.withCredentials = false;
    const token = JSON.parse(localStorage.getItem(StorageKeys.currentUser)).token;
    this.uploader.setOptions({authToken: `Bearer ${token}`});
  }

  getParams() {
    const rowsSelection = this.gridApi.api.getSelectedRows();
  }

  callbackGrid(params) {
    this.gridApi = params;
    params.api.setRowData([]);
    this.gridApi.api.sizeColumnsToFit();
  }

  uploadFile() {
    this.loadingService.setDisplay(true);
    this.importService.loadDlrSalesOrderColor(this.uploader);

    this.uploader.onErrorItem = ((item: FileItem, res: string, status: number, heanders: ParsedResponseHeaders): any => {
      this.disableSave = true;
      this.loadingService.setDisplay(false);
      this.toastService.openFailModal('Load file Error');
    });
    this.uploader.onSuccessItem = ((item: FileItem, res: string, status: number, heanders: ParsedResponseHeaders): any => {
      const data = JSON.parse(res);
      if (data.data) {
        this.loadingService.setDisplay(false);
        this.gridApi.api.setRowData(data.data);
        this.error = null;
        this.disableSave = false;
        this.toastService.openSuccessModal('Load File Success');
      } else {
        this.loadingService.setDisplay(false);
        this.toastService.openFailModal(data.message);
      }
    });
  }

  saveFile() {
    this.loadingService.setDisplay(true);
    this.importService.saveFileSalesOrderColor().subscribe(res => {
      this.loadingService.setDisplay(false);
      if (res.data.status_code === 200) {
        this.toastService.openSuccessModal();
        this.modal.hide();
        this.close.emit();
        return;
      }
      this.gridApi.api.setRowData(res.data);
      this.toastService.openFailModal(res.message);
    });
  }

  fileChangeEvent(fileInput: any) {
    this.gridApi.api.setRowData([]);
    this.filesToUpload = fileInput.target.files as Array<File>;
    if (this.filesToUpload) {
      this.fileName = this.filesToUpload[0].name;
    }
    if (this.filesToUpload && this.filesToUpload[0].name.indexOf('.xls') < 0) {
      this.toastService.openWarningModal('Template file invalid. Please choose Excel file again');
    } else {
    }
  }

  resetImportFile() {
    this.error = null;
    this.gridApi.api.setRowData([]);
    this.fileUpLoad.nativeElement.value = '';
    this.modal.hide();
  }

}
