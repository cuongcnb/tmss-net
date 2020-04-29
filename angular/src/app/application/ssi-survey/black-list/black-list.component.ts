import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'black-list',
  templateUrl: './black-list.component.html',
  styleUrls: ['./black-list.component.scss']
})
export class BlackListComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal;
  @Input() blackList: boolean;
  fieldGridBlackList;
  form: FormGroup;
  gridParams;
  dataSsi: Array<any>;
  dataCsi: Array<any>;
  selectedRowData;

  constructor(
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.fieldGridBlackList = [
      {headerName: 'Loại khách hàng', headerTooltip: 'Loại khách hàng', field: 'customerType'},
      {headerName: 'Tên khách hàng', headerTooltip: 'Tên khách hàng', field: 'customerName'},
      {headerName: 'Địa chỉ', headerTooltip: 'Địa chỉ', field: 'customerAdd'},
      {headerName: 'Số điện thoại', headerTooltip: 'Số điện thoại', field: 'phoneNumber'},
      {headerName: 'Chứng minh thư', headerTooltip: 'Chứng minh thư', field: 'idNumber'},
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'node'},
    ];
    this.dataSsi = [
      {
        customerType: 'SSI',
        customerName: 'Hoàng Văn Hoa',
        customerAdd: 'Hà Nội',
        idNumber: '1748859658',
        phoneNumber: '0123654789',
        node: '',
      }
    ];
    this.dataCsi = [
      {
        customerType: 'CSI',
        customerName: 'Nguyễn Trãi',
        customerAdd: 'Tiên giới',
        idNumber: '1748859658',
        phoneNumber: '0123654789',
        node: '',
      }
    ];
  }

  callBackGrid(params) {
    this.gridParams = params;
    this.gridParams.api.setRowData();
  }

  getParams() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      this.selectedRowData = selectedData[0];
    }
  }

  search() {
    if (this.form.value.customerType === '1') {
      this.gridParams.api.setRowData(this.dataSsi);
    } else if (this.form.value.customerType === '2') {
      this.gridParams.api.setRowData(this.dataCsi);
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      customerType: [undefined],
    });
  }

  copyData(data) {
    this.gridParams.api.updateRowData({add: [data]});
  }

}
