import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';
import {ToastService} from '../../../../shared/common-service/toast.service';
import {StorageKeys} from '../../../../core/constains/storageKeys';
import {ImportService} from '../../../../api/import/import.service';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'dlr-rundown-upload',
  templateUrl: './dlr-rundown-upload.component.html',
  styleUrls: ['./dlr-rundown-upload.component.scss']
})
export class DlrRundownUploadComponent implements OnInit {

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
  dealerId: number;
  dealerName: string;
  currentDate: any;
  uploader: FileUploader;
  error: any;
  form: FormGroup;

  constructor(
    private toastService: ToastService,
    private importService: ImportService,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService
  ) {
  }

  open(dealerId, currentDate, dealers) {
    this.modal.show();
    this.dealerId = dealerId;
    this.currentDate = currentDate;
    let currentDealer = dealers.find(item => item.id === dealerId);
    if (currentDealer) {
      this.dealerName = currentDealer.abbreviation;
    }

    this.form = this.formBuilder.group({
      currentDate: this.currentDate
    });
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

  uploadFile() {
    this.loadingService.setDisplay(true);
    this.importService.uploadDlrRundown(this.uploader, this.dealerId, this.form.value.currentDate);

    this.uploader.onErrorItem = ((item: FileItem, res: string, status: number, heanders: ParsedResponseHeaders): any => {
      this.disableSave = true;
      this.loadingService.setDisplay(false);
      this.toastService.openFailModal('Tải lên thất bại!');
    });
    this.uploader.onSuccessItem = ((item: FileItem, res: string, status: number, heanders: ParsedResponseHeaders): any => {
      this.loadingService.setDisplay(false);
      this.toastService.openSuccessModal('Tải lên thành công!');
      this.modal.hide();
    });
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = fileInput.target.files as Array<File>;
    if (this.filesToUpload) {
      this.fileName = this.filesToUpload[0].name;
    }
    if (this.filesToUpload && this.filesToUpload[0].name.indexOf('.xls') < 0 && this.filesToUpload[0].name.indexOf('.xls') < 0  && this.filesToUpload[0].name.indexOf('.pdf') < 0) {
      this.toastService.openWarningModal('Chọn file excel hoặc pdf để tải lên!');
    } else {
    }
  }

  resetImportFile() {
    this.error = null;
    this.fileUpLoad.nativeElement.value = '';
    this.modal.hide();
  }

}