import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CsiSurveyModel } from '../../../core/models/csi-survey/csi.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'csi-survey-list',
  templateUrl: './csi-survey-list.component.html',
  styleUrls: ['./csi-survey-list.component.scss']
})
export class CsiSurveyListComponent implements OnInit {
  @Input() webCsiList: boolean;
  form: FormGroup;
  fieldGridCsiList;
  gridParams;
  selectedRowData;
  selectedData: CsiSurveyModel;

  constructor(
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.fieldGridCsiList = [
      {
        headerName: 'Danh sách khách hàng CSI', children: [
          {headerName: 'STT', headerTooltip: 'Số thứ tự', field: 'stt'},
          {headerName: 'Tên người liên hệ', headerTooltip: 'Tên người liên hệ', field: 'contactName'},
          {headerName: 'Tên khách hàng', headerTooltip: 'Tên khách hàng', field: 'customerName'},
          {headerName: 'Tên công ty', headerTooltip: 'Tên công ty', field: 'companyName'},
          {headerName: 'Địa chỉ khách hàng', headerTooltip: 'Địa chỉ khách hàng', field: 'customerAdd'},
          {headerName: 'Điện thoại liên hệ', headerTooltip: 'Điện thoại liên hệ', field: 'contactPhoneNumber'},
          {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'node'},
          {headerName: 'Đại lý', headerTooltip: 'Đại lý', field: 'agency'},
          {headerName: 'Biển số xe', headerTooltip: 'Biển số xe', field: 'licensePlate'},
          {headerName: 'Model', headerTooltip: 'Model', field: 'model'},
          {headerName: 'Doanh thu', headerTooltip: 'Doanh thu', field: 'amount'},
          {headerName: 'Yêu cầu sửa chữa', headerTooltip: 'Yêu cầu sửa chữa', field: 'repairRequest'},
          {headerName: 'Km', headerTooltip: 'Km', field: 'km'},
          {headerName: 'Ngày mang xe đến', headerTooltip: 'Ngày mang xe đến', field: 'carComeDay'},
          {headerName: 'Ngày giao xe', headerTooltip: 'Ngày giao xe', field: 'deliveryDate'},
          {headerName: 'CVDV', headerTooltip: 'Cố vấn dịch vụ', field: 'serviceAdviser'},
        ]
      }
    ];
  }

  callBackGridCsiList(params) {
    this.gridParams = params;
    this.gridParams.api.setRowData();
  }

  getParamsCsiList() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      this.selectedRowData = selectedData[0];
    }
  }

  search() {
    if (this.form.value.deliveryDate && this.form.value.dayOut) {
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      deliveryDate: [undefined],
      dayOut: [undefined],
    });
  }

}
