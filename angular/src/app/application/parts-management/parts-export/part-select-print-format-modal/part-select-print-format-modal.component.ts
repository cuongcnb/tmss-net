import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PartsExportApi } from '../../../../api/parts-management/parts-export.api';
import {
  PartsExportCustomerInfo, PartsExportPartOfRo
} from '../../../../core/models/parts-management/parts-export.model';
import { DownloadService } from '../../../../shared/common-service/download.service';
import { LoadingService } from '../../../../shared/loading/loading.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'part-select-print-format-modal',
  templateUrl: './part-select-print-format-modal.component.html',
  styleUrls: ['./part-select-print-format-modal.component.scss']
})
export class PartSelectPrintFormatModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @Output() selectFileType = new EventEmitter();
  form: FormGroup;

  partList: Array<PartsExportPartOfRo> = [];
  customerInfo: PartsExportCustomerInfo;
  exportTime: number;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private partsExportApi: PartsExportApi,
    private downloadService: DownloadService,
  ) {
  }

  ngOnInit() {
  }

  open(customerInfo, partList, exportTime?) {
    this.customerInfo = customerInfo;
    this.partList = partList;
    this.exportTime = exportTime ? exportTime : 0;
    this.modal.show();
    this.buildForm();
  }

  reset() {
    this.form = undefined;
    this.partList = [];
    this.customerInfo = undefined;
  }

  confirmPrint() {
    const printData = Object.assign({}, {
      customer: this.customerInfo,
      parts: this.partList,
      gship: this.exportTime,
      fileType: this.form.value.type
    });
    this.loadingService.setDisplay(true);
    this.partsExportApi.printExportSlip(printData).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.downloadService.downloadFile(res);
      this.modal.hide();
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      type: ['doc']
    });
  }

}
