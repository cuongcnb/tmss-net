import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { PartImportedModel } from '../../../../core/models/parts-management/parts-info-management.model';
import { FormBuilder } from '@angular/forms';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { DataFormatService } from '../../../../shared/common-service/data-format.service';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { PartsInfoManagementApi } from '../../../../api/parts-management/parts-info-management.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'import-invoice-modal',
  templateUrl: './import-invoice-modal.component.html',
  styleUrls: ['./import-invoice-modal.component.scss'],
})
export class ImportInvoiceModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  modalHeight: number;
  processingInfo: Array<string> = [];
  fieldGrid;
  params;
  uploadedData: Array<PartImportedModel>;


  constructor(
    private formBuilder: FormBuilder,
    private setModalHeightService: SetModalHeightService,
    private dataFormatService: DataFormatService,
    private swalAlertService: ToastService,
    private partsInfoManagementApi: PartsInfoManagementApi,
  ) {
    this.fieldGrid = [
      {headerName: 'Trạng thái Import', headerTooltip: 'Trạng thái Import', field: 'importStatus'},
      {headerName: 'Lệnh sửa chữa', headerTooltip: 'Lệnh sửa chữa', field: 'isRepair'},
      {headerName: 'Số hóa đơn', headerTooltip: 'Số hóa đơn', field: 'invoiceNumber'},
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'isNote'},
    ];
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open() {
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
    this.params.api.setRowData(this.addStt(this.uploadedData));
    this.processingInfo = ['Import dữ liệu thành công'];
  }

  uploadFail(error) {
    this.processingInfo = error;
  }

  addStt(dataList: Array<PartImportedModel>) {
    const returnList: Array<PartImportedModel> = [];
    for (let i = 0; i < dataList.length; i++) {
      dataList[i] = Object.assign({}, dataList[i], {stt: i + 1});
      returnList.push(dataList[i]);
    }
    return returnList;
  }

  callBackGrid(params) {
    this.params = params;
  }
}
