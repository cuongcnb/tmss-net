import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../shared/common-service/set-modal-height.service';
import { ServiceKpiDataModel } from '../../../core/models/service-kpi-data/service-kpi-data.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'settlement-debt-accessory',
  templateUrl: './settlement-debt-accessory.component.html',
  styleUrls: ['./settlement-debt-accessory.component.scss']
})
export class SettlementDebtAccessoryComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('settlementDebtModal', {static: false}) settlementDebtModal;
  fieldGrid;
  form: FormGroup;
  gridParams;
  selectedRowGrid: ServiceKpiDataModel;

  constructor(
    private modalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {headerName: 'RO', headerTooltip: 'RO', field: 'licensePlates'},
      {headerName: 'Biển số', headerTooltip: 'Biển số', field: 'licensePlates'},
      {headerName: 'Ngày vào', headerTooltip: 'Ngày vào', field: 'customertype'},
      {headerName: 'Cố vấn dịch vụ', headerTooltip: 'Cố vấn dịch vụ', field: 'expecteddate'},
      {headerName: 'Vin', headerTooltip: 'Vin', field: 'expecteddate'},
      {headerName: 'Tên khách hàng', headerTooltip: 'Tên khách hàng', field: 'expecteddate'},
      {headerName: 'Địa chỉ khách hàng', headerTooltip: 'Địa chỉ khách hàng', field: 'expecteddate'},
      {headerName: 'Tên liên hệ', headerTooltip: 'Tên liên hệ', field: 'expecteddate'},
      {headerName: 'Số điện thoại liên hệ', headerTooltip: 'Số điện thoại liên hệ', field: 'expecteddate'},
      {headerName: 'Yêu cầu sửa chữa', headerTooltip: 'Yêu cầu sửa chữa', field: 'expecteddate'},
    ];
    this.buildForm();
  }

  callbackGrid(params) {
    this.gridParams = params;
    this.gridParams.api.setRowData();
  }

  getParams() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      this.selectedRowGrid = selectedData[0];
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      sortAgency: [undefined],
      dateTime: [undefined],
    });
  }
}
