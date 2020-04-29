import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ToastService} from '../../../../shared/common-service/toast.service';
import {EnvConfigService} from '../../../../env-config.service';
import {CbuVehicleInfoService} from '../../../../api/daily-sale/cbu-vehicle-info.service';
import {FileItem, FileUploader, ParsedResponseHeaders} from "ng2-file-upload";
import {StorageKeys} from "../../../../core/constains/storageKeys";
import {LoadingService} from '../../../../shared/loading/loading.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'vehicle-arrival-import-modal',
  templateUrl: './vehicle-arrival-import-modal.component.html',
  styleUrls: ['./vehicle-arrival-import-modal.component.scss']
})
export class VehicleArrivalImportModalComponent implements OnInit {
  @ViewChild('folderInput', {static: false}) myInputVariable: ElementRef;
  @ViewChild('importModal', {static: false}) modal: ModalDirective;
  @ViewChild('fileUpLoad', {static: false}) fileUpLoad: ElementRef;

  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  filesToUpload = [];
  fileInput;
  fileName;
  fileImportData;
  showFileName = true;
  disable = true;
  baseUrl = this.envConfigService.getConfig().backEnd.replace('service', 'tmss');
  file = [];
  path: string;
  private fileText;
  disableSave = true;
  fieldGrid;
  gridApi;
  selectedData;
  detailCellRendererParams;
  detailRowHeight;
  masterDetail;
  onHidden;
  uploader: FileUploader;

  constructor(
    private httpClient: HttpClient,
    private toastService: ToastService,
    private envConfigService: EnvConfigService,
    private cbuVehicleInfoService: CbuVehicleInfoService,
    private loadingService: LoadingService
  ) {
    this.fieldGrid = [
      {
        field: 'tmssNo',
      },
      {
        field: 'colorCode',
      },
      {
        field: 'status',
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

  getParams() {
    const rowsSelection = this.gridApi.api.getSelectedRows();
  }

  callbackGrid(params) {
    this.gridApi = params;
    params.api.setRowData([]);
    this.gridApi.api.sizeColumnsToFit();
  }

  fileUpload(event) {
    const reader = new FileReader();
    reader.readAsText(event.srcElement.files[0]);
    const me = this;
    reader.onload = () => {
      me.fileText = reader.result;
    };
  }

  initUploader() {
    this.uploader = new FileUploader({url: '/'});
    this.uploader.onBeforeUploadItem = item => item.withCredentials = false;
    const token = JSON.parse(localStorage.getItem(StorageKeys.currentUser)).token;
    this.uploader.setOptions({authToken: `Bearer ${token}`});
  }

  uploadFile() {
    this.loadingService.setDisplay(true);
    this.cbuVehicleInfoService.importColorRequest(this.uploader);

    this.uploader.onErrorItem = ((item: FileItem, res: string, status: number, heanders: ParsedResponseHeaders): any => {
      this.loadingService.setDisplay(false);
      this.toastService.openFailModal(res);
    });
    this.uploader.onSuccessItem = ((item: FileItem, res: string, status: number, heanders: ParsedResponseHeaders): any => {
      this.disableSave = true;
      const resp = JSON.parse(res);
      if (resp.data.status_code === 405) {
        this.toastService.openFailModal(resp.data.message);
      }
      if (resp.data.length > 0) {
        this.toastService.openSuccessModal();
        this.disableSave = false;
        this.gridApi.api.setRowData(resp.data);
      }
      this.loadingService.setDisplay(false);
    });

    // const formData: any = new FormData();
    // const files: Array<File> = this.filesToUpload;
    // // tslint:disable-next-line:prefer-for-of
    // for (let i = 0; i < files.length; i++) {
    //   formData.append('file', files[i], files[i][name]);
    // }
    // const headers = new HttpHeaders();
    // headers.append('Content-Type', 'multipart/form-data');
    // headers.append('Accept', 'application/json');
    // this.httpClient.post(`${this.baseUrl}/vehicle/import/load`, formData, {
    //   headers
    // }).subscribe(
    //   (res: any) => {
    //     this.disableSave = true;
    //     const resp = res;
    //     if (resp.data.status_code === 405) {
    //       this.toastService.openFailModal(resp.data.message);
    //     }
    //     if (resp.data.length > 0) {
    //       this.toastService.openSuccessModal();
    //       this.disableSave = false;
    //       this.gridApi.api.setRowData(resp.data);
    //     }
    //   }, () => {
    //   }
    // );
  }

  saveFile() {
    this.cbuVehicleInfoService.saveFile().subscribe(res => {
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
    this.fileUpLoad.nativeElement.value = '';
    this.disableSave = true;
    this.showFileName = true;
    if (this.gridApi) {
      this.gridApi.api.setRowData([]);
      this.filesToUpload = [];
      this.fileImportData = [];
    }
    this.modal.hide();
  }

  getParamsUpload() {
  }

  onSaveImportFile() {
    // this.hikiateService.saveImportFile().subscribe(res => {
    //   if (res.meta.status_code === StatusCode.success) {
    //     this.toastService.openSuccessModal();
    //     this.modal.hide();
    //     this.close.emit();
    //   }
    // }, () => {
    //   if (!localStorage.getItem('Access_Token')) {
    //     return;
    //   } else {
    //     this.toastService.openWarningModal(MessageDetail.serverOff, TypeMessage.err);
    //   }
    // });
  }
}
