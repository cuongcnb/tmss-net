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
import {FormBuilder, FormGroup} from '@angular/forms';
import {UploadService} from '../../../../api/dealer-order/upload.service';

@Component({
  selector: 'dlr-rundown-download',
  templateUrl: './dlr-rundown-download.component.html',
  styleUrls: ['./dlr-rundown-download.component.scss']
})
export class DlrRundownDownloadComponent implements OnInit {

  @ViewChild('importModal', {static: false}) modal: ModalDirective;
  @ViewChild('fileUpLoad', {static: false}) fileUpLoad: ElementRef;

  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  filesToUpload = [];
  fileName;
  disable = true;
  file = [];
  dealers = [];
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
    private loadingService: LoadingService,
    private uploadService: UploadService
  ) {
  }

  open(dealerId, currentDate, dealers) {
    this.modal.show();
    this.dealerId = dealerId;
    this.dealers = dealers;
    this.currentDate = currentDate;
    this.form = this.formBuilder.group({
      currentDate: this.currentDate,
      dealerId: this.dealerId
    });
  }

  closeModal() {
    this.modal.hide();
  }

  downloadFile() {
    this.loadingService.setDisplay(true);
    this.dealerId = (this.form && this.form.value.dealerId) ? this.form.value.dealerId : this.dealerId;
    const currentDate = this.form.value.currentDate;

    const dlrOrderParam = {
      currentDate: currentDate,
      dlrId: this.dealerId
    };
    this.uploadService.downloadFileRundown(dlrOrderParam).subscribe((data) => {
      this.loadingService.setDisplay(false);
      if(data.status === 204) {
        this.toastService.openFailModal("Không có dữ liệu");
      } else {
        this.importService.downloadFile(data);
      }
    });
  }

  ngOnInit() {
  }
}
