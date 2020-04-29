import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { PartImportedModel } from '../../../../core/models/parts-management/parts-info-management.model';
import { DataFormatService } from '../../../../shared/common-service/data-format.service';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { PartsInfoManagementApi } from '../../../../api/parts-management/parts-info-management.api';
import { GridTableService } from '../../../../shared/common-service/grid-table.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'settlement-debt-modal',
  templateUrl: './settlement-debt-modal.component.html',
  styleUrls: ['./settlement-debt-modal.component.scss']
})
export class SettlementDebtModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  modalHeight: number;
  processingInfo: Array<string> = [];
  fieldGrid;
  params;
  form: FormGroup;
  uploadedData: Array<PartImportedModel>;


  constructor(
    private formBuilder: FormBuilder,
    private setModalHeightService: SetModalHeightService,
    private dataFormatService: DataFormatService,
    private swalAlertService: ToastService,
    private gridTableService: GridTableService,
    private partsInfoManagementApi: PartsInfoManagementApi,
  ) {
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open() {
    this.buildForm();
    this.onResize();
    this.modal.show();
  }

  closeModal() {
    this.modal.hide();
    this.close.emit();
  }

  reset() {
    this.processingInfo = [];
    this.params.api.setRowData([]);
  }

  apiCallUpload(val) {
    return this.partsInfoManagementApi.importPartsInfo(val);
  }

  uploadSuccess(response) {
    this.uploadedData = response.Success;
    this.params.api.setRowData(this.gridTableService.addSttToData(this.uploadedData));
    this.processingInfo = ['Import dữ liệu thành công'];
  }

  uploadFail(error) {
    this.processingInfo = error;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      sortAgency: [undefined],
      dateTime: [undefined],
    });
  }
}
