import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';

import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { BaseModel } from '../../../../core/models/base.model';
import { SendClaimModel } from '../../../../core/models/parts-management/send-claim.model';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { SendClaimApi } from '../../../../api/parts-management/send-claim.api';
import { AgInCellButtonComponent } from '../../../../shared/ag-in-cell-button/ag-in-cell-button.component';
import { DownloadService } from '../../../../shared/common-service/download.service';
import { ToastService } from '../../../../shared/swal-alert/toast.service';

export interface UploadedFile extends BaseModel {
  name: string;
  size: any;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'send-claim-attached-file-modal',
  templateUrl: './send-claim-attached-file-modal.component.html',
  styleUrls: ['./send-claim-attached-file-modal.component.scss']
})

export class SendClaimAttachedFileModalComponent implements OnInit {
  @ViewChild('modal', { static: false }) modal: ModalDirective;
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  @Output() listFile = new EventEmitter();
  @Output() search = new EventEmitter();
  @Output() save = new EventEmitter();

  modalHeight: number;
  selectedInvoice: SendClaimModel;
  uploadedFiles: UploadedFile[] = [];
  fieldGrid;
  params;
  frameworkComponents;
  fileUploadForm: FormGroup;
  attachFiles = [];
  maximumFileSize = 5 * 1000000; // 2MB
  claimId;
  dlr_id;

  constructor(
    private formBuilder: FormBuilder,
    private setModalHeightService: SetModalHeightService,
    private swalAlertService: ToastService,
    private loadingService: LoadingService,
    private sendClaimApi: SendClaimApi,
    private downloadService: DownloadService,
    private toastrService: ToastService
  ) { }

  ngOnInit() {
    this.dlr_id = JSON.parse(localStorage.getItem('TMSS_Service_Current_User')).dealerId;
    console.log(this.dlr_id);
    this.fieldGrid = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        field: 'stt',
        cellRenderer: params => params.rowIndex + 1,
        width: 15
      },
      {
        headerName: 'Tên',
        headerTooltip: 'Tên',
        field: 'attachName'
      },
      {
        headerName: 'Kích thước',
        headerTooltip: 'Kích thước',
        field: 'attachSize',
        cellRenderer: params => this.bytesToSize(params.value),
        width: 40,
      },
      {
        headerName: '',
        headerTooltip: '',
        cellRenderer: 'agInCellButtonComponent',
        width: 40,
        cellClass: 'p-0',
        buttonDef: {
          text: 'Tải xuống',
          useRowData: true,
          function: this.downloadFile.bind(this),
        },
      },
      {
        headerName: '',
        headerTooltip: '',
        cellRenderer: 'agInCellButtonComponent',
        width: 40,
        cellClass: 'p-0',
        buttonDef: {
          text: 'Xoá',
          useRowData: true,
          disabled: this.dlr_id == -1,
          function: this.deleteFile.bind(this),
        },
      }
    ];
    this.frameworkComponents = {
      agInCellButtonComponent: AgInCellButtonComponent,
    };

    this.fileUploadForm = this.formBuilder.group({
      fileNames: [''],
      files: [undefined]
    });
  }

  bytesToSize(bytes) {
    if (bytes === 0) { return 'n/a'; }

    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    if (i === 0) { return `${bytes} ${sizes[i]})`; }

    return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`;
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResizeWithoutFooter();
  }

  apiCallUpload(val) {
    return this.sendClaimApi.importFile(val);
  }

  open(claimId) {
   //this.selectedInvoice = selectedInvoice ? selectedInvoice : null;
    this.claimId = claimId;
    this.fileUploadForm.reset();
    this.modal.show();
  }

  reset() {
    this.uploadedFiles = [];
    this.selectedInvoice = undefined;
    this.claimId = null;
  }

  callbackGrid(params) {
    this.params = params;
    this.getUploadedFiles();
  }

  getUploadedFiles() {
    let claim_id = this.claimId;
    this.sendClaimApi.getSendingClaimAttachlist(claim_id ? claim_id : -1)
      .subscribe(attachFiles => {
        this.attachFiles = attachFiles;
        this.params.api.setRowData(this.attachFiles);
      });
  }

  uploadSuccess(event) {
    this.getUploadedFiles();
  }

  // uploadFail(event) {
  // }

  downloadFile(params) {
    this.loadingService.setDisplay(true);
    this.sendClaimApi.downloadFile(params.data.attachName.trim()).subscribe(res => {
      this.downloadService.downloadFile(res);
      this.loadingService.setDisplay(false);
    });
  }

  deleteFile(params) {
    this.loadingService.setDisplay(true);
    this.sendClaimApi.deleteFile(params.data.claimId).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.getUploadedFiles();
    });
  }

  importFile() {
    this.fileInput.nativeElement.click();
  }

  onFilesAdded() {
    let fileNames = '';
    const uploadedFiles: FileList = this.fileInput.nativeElement.files;
    if (!uploadedFiles.length) { return; }
    if (uploadedFiles.item(0).size > this.maximumFileSize) {
      this.swalAlertService.openWarningToast('Kích thước file tối đa cho phép là 2MB');
      return;
    }
    if (uploadedFiles.length > 1) {
      for (let i = 0; i < uploadedFiles.length; i++) {
        fileNames += (i !== uploadedFiles.length - 1) ? `${uploadedFiles[i].name} , ` : uploadedFiles[i].name;
      }
    } else {
      fileNames = uploadedFiles.item(0).name;
    }
    this.fileUploadForm.get('fileNames').patchValue(fileNames);
  }

  uploadFile() {
    const formData: FormData = new FormData();
    const uploadedFiles: FileList = this.fileInput.nativeElement.files;
    if (!uploadedFiles.length) {
      this.swalAlertService.openWarningToast('Không có file tải lên.');
      return;
    }
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < uploadedFiles.length; i++) {
      formData.append('file', uploadedFiles.item(i), uploadedFiles.item(i).name.trim());
    }
    this.sendClaimApi.upLoadFile(formData)
      .subscribe(file => {
        this.attachFiles.push({
          attachName: file.fileName,
          attachSize: file.size,
        });
        this.params.api.setRowData(this.attachFiles);
        this.fileUploadForm.reset();
        const rowData = [];
        this.params.api.forEachNode(node => rowData.push(node.data));
        this.listFile.emit(rowData);
    }
      , error => {
      this.toastrService.openWarningToast(error);
    },
    () => {
      this.save.emit();
      this.search.emit();
      this.listFile.emit();
    });
  }
}
