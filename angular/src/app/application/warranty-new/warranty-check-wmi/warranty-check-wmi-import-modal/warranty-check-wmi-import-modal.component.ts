import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {HttpClient} from '@angular/common/http';
import {ToastService} from '../../../../shared/common-service/toast.service';
import {EnvConfigService} from '../../../../env-config.service';
import {WarrCheckWmiApi} from '../../../../api/warranty/warr-check-wmi.api';
import {LoadingService} from '../../../../shared/loading/loading.service';

@Component({
  selector: 'warranty-check-wmi-import-modal',
  templateUrl: './warranty-check-wmi-import-modal.component.html',
  styleUrls: ['./warranty-check-wmi-import-modal.component.scss']
})
export class WarrantyCheckWmiImportModalComponent implements OnInit {

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
  baseUrl = this.envConfigService.getConfig().backEnd;
  file = [];
  path: string;
  disableSave = true;
  fieldGrid;
  gridApi;
  selectedData;
  onHidden;
  list;

  constructor(
    private httpClient: HttpClient,
    private toastService: ToastService,
    private envConfigService: EnvConfigService,
    private warrCheckWmiApi: WarrCheckWmiApi,
    private loadingService: LoadingService,
  ) {
    this.fieldGrid = [
      {
        headerName: 'Dòng',
        headerTooltip: 'Dòng',
        field: 'stt',
        pinned: true,
        width: 50,
        resizable: true
      },
      {
        headerName: 'WMI',
        headerTooltip: 'WMI',
        field: 'wmi',
        pinned: true,
        resizable: true
      },
      {
        headerName: 'VDS',
        headerTooltip: 'VDS',
        field: 'vds',
        pinned: true,
        resizable: true
      },
      {
        headerName: 'Jobs Code',
        headerTooltip: 'Jobs Code',
        field: 'jobscode',
        pinned: true,
        resizable: true
      },
      {
        headerName: 'Work Rate',
        headerTooltip: 'Work Rate',
        field: 'workRate',
        pinned: true,
        resizable: true
      },
      {
        headerName: 'Nội dung lỗi',
        headerTooltip: 'Nội dung lỗi',
        field: 'status',
        pinned: true,
        resizable: true
      }
    ];
  }

  open(list) {
    this.list = list;
    if (this.gridApi) {
      this.callbackGrid(this.gridApi);
      this.gridApi.api.sizeColumnsToFit();
    }
    this.modal.show();
    this.callbackGrid(this.gridApi);
  }

  ngOnInit() {

  }

  getParams(params) {
    this.selectedData = params.api.getSelectedRows()[0];
  }

  callbackGrid(params) {
    this.gridApi = params;
    params.api.setRowData(this.list);
    this.gridApi.api.sizeColumnsToFit();
    if (this.list && this.list.length > 0) {
      this.disableSave = false;
    }
  }

  saveFile() {
    this.loadingService.setDisplay(true);
    this.warrCheckWmiApi.save(this.list).subscribe(res => {
     if (res.ERR && res.ERR !== null) {
       this.toastService.openFailModal('Dữ liệu không hợp lệ');
       this.list = res.ERR;
       this.disableSave = true;
     } else {
       this.toastService.openSuccessModal('Import thành công');
       this.loadingService.setDisplay(false);
       this.modal.hide();
     }
    }, () => {},
      () => {
        this.callbackGrid(this.gridApi);
        this.loadingService.setDisplay(false);
      });
  }

  resetImportFile() {
    this.fileUpLoad ? this.fileUpLoad.nativeElement.value = '' : this.fileUpLoad = null;
    this.disableSave = true;
    this.showFileName = true;
    if (this.gridApi) {
      this.gridApi.api.setRowData([]);
      this.filesToUpload = [];
      this.fileImportData = [];
    }
    this.modal.hide();
  }

}
