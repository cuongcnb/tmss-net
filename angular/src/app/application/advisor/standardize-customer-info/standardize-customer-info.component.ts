import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomerInfoModel } from '../../../core/models/advisor/standarize-customer-info.model';
import { GlobalValidator } from '../../../shared/form-validation/validators';
import { LoadingService } from '../../../shared/loading/loading.service';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { StandardizeCustomerApi } from '../../../api/customer/standardize-customer.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'standardize-customer-info',
  templateUrl: './standardize-customer-info.component.html',
  styleUrls: ['./standardize-customer-info.component.scss']
})
export class StandardizeCustomerInfoComponent implements OnInit {
  form: FormGroup;
  fieldGrid;
  params;

  tabs: Array<string>;
  selectedTab: string;

  customerList: Array<CustomerInfoModel>;
  customerSelected: Array<CustomerInfoModel>;
  customerClicked: CustomerInfoModel;

  constructor(
    private formBuilder: FormBuilder,
    private loading: LoadingService,
    private swalAlert: ToastService,
    private standardizeCustomerApi: StandardizeCustomerApi,
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {
        headerName: '', headerTooltip: '', field: 'checked', pinned: true,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        minWidth: 50
      },
      {headerName: 'Mã KH', headerTooltip: 'Mã khách hàng', field: 'cusno', pinned: true, minWidth: 100},
      {headerName: 'Tên KH', headerTooltip: 'Tên khách hàng', field: 'carownername', pinned: true, minWidth: 150},
      {
        headerName: 'Thông tin chung',
        headerTooltip: 'Thông tin chung',
        children: [
          {headerName: 'Tên Cty', headerTooltip: 'Tên Cty', field: 'orgname', minWidth: 100},
          {headerName: 'Địa chỉ', headerTooltip: 'Địa chỉ', field: 'carowneradd', minWidth: 100},
          {headerName: 'Quận huyện', headerTooltip: 'Quận huyện', field: 'districtName', minWidth: 100},
          {headerName: 'Tỉnh thành', headerTooltip: 'Tỉnh thành', field: 'provinceName', minWidth: 100}
        ]
      },
      {
        headerName: 'Thông tin liên hệ',
        headerTooltip: 'Thông tin liên hệ',
        children: [
          {headerName: 'SĐT', headerTooltip: 'Số điện thoại', field: 'carownertel', minWidth: 100, cellClass: ['cell-border', 'cell-readonly', 'text-right']},
          {headerName: 'Di động', headerTooltip: 'Di động', field: 'carownermobil', minWidth: 100, cellClass: ['cell-border', 'cell-readonly', 'text-right']},
          {headerName: 'FAX', headerTooltip: 'FAX', field: 'carownerfax', minWidth: 70},
          {headerName: 'Email', headerTooltip: 'Email', field: 'carowneremail', minWidth: 100}
        ]
      },
      {
        headerName: 'Thông tin chi tiết',
        headerTooltip: 'Thông tin chi tiết',
        children: [
          {headerName: 'CMTND', headerTooltip: 'Chứng minh thư nhân dân', field: 'carowneridnum', minWidth: 70},
          {headerName: 'Loại KH', headerTooltip: 'Loại khách hàng', field: 'cusTypeName', minWidth: 100},
          {headerName: 'MST', headerTooltip: 'Mã số thuế', field: 'taxcode', minWidth: 70},
          {headerName: 'Số TK', headerTooltip: 'Số tài khoản', field: 'accno', minWidth: 150},
          {headerName: 'Tên NH', headerTooltip: 'Tên ngân hàng', field: 'bankName', minWidth: 100},
        ]
      },
    ];
    this.buildForm();
    this.initTabs();
  }

  callbackGrid(params) {
    params.api.setRowData(this.customerList);
    this.params = params;
  }

  getParams() {
    const selected = this.params.api.getSelectedRows();
    if (selected) {
      this.customerSelected = selected;
    }
  }

  getRowClicked(params) {
    this.customerClicked = params.data;
  }

  search() {
    if (this.form.invalid) {
      return;
    }
    this.reset();
    this.loading.setDisplay(true);
    this.standardizeCustomerApi.search(this.form.value.registerno)
      .subscribe(cusList => {
        this.loading.setDisplay(false);
        this.customerList = cusList || [];
        this.params.api.setRowData(this.customerList);
      });
  }

  private reset() {
    this.selectedTab = this.tabs[0];
    this.customerList = undefined;
    this.customerSelected = undefined;
    this.customerClicked = undefined;
  }

  private initTabs() {
    this.tabs = ['Thông tin xe', 'Thông tin chi tiết khách hàng'];
    this.selectedTab = this.tabs[0];
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      registerno: [undefined, GlobalValidator.required],
    });
  }
}
