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
import {DlrOrderService} from '../../../../api/dealer-order/dlr-order.service';

@Component({
  selector: 'dlr-rundown-export',
  templateUrl: './dlr-rundown-export.component.html',
  styleUrls: ['./dlr-rundown-export.component.scss']
})
export class DlrRundownExportComponent implements OnInit {

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
  fromDate: any;
  toDate: any;
  importDate: any;
  groupRegion: any;

  constructor(
    private toastService: ToastService,
    private importService: ImportService,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private dlrOrderService: DlrOrderService
  ) {
  }

  open(dealerId, currentDate, dealers, fromDate, toDate, groupRegion) {
    this.modal.show();
    this.dealerId = dealerId;
    this.dealers = dealers;
    this.currentDate = currentDate;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.groupRegion = groupRegion;
    this.form = this.formBuilder.group({
      currentDate: this.currentDate
    });
  }

  closeModal() {
    this.modal.hide();
  }

  downloadFile() {
    this.loadingService.setDisplay(true);
    this.importDate = this.form.value.currentDate;

    const dlrOrderParam = {
      dlrId: this.dealerId,
      fromDate: this.fromDate,
      toDate: this.toDate,
      importDate: this.importDate,
      groupRegion: this.groupRegion
    };

    this.dlrOrderService.getDealerRundownTemplate(dlrOrderParam).subscribe((data) => {
      this.loadingService.setDisplay(false);
      if(data.status === 204) {
        this.toastService.openFailModal("Không có file template trong tháng");
      } else {
        this.importService.downloadFile(data);
      }
    });
  }

  ngOnInit() {
  }
}

