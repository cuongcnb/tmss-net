import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ToastService } from '../../../shared/swal-alert/toast.service';
import { CustomerTypeApi } from '../../../api/customer/customer-type.api';
import { ProvinceApi } from '../../../api/sales-api/province/province.api';
import { DistrictApi } from '../../../api/sales-api/district/district.api';
import { GlobalValidator } from '../../../shared/form-validation/validators';
import { LoadingService } from '../../../shared/loading/loading.service';
import { CustomerApi } from '../../../api/customer/customer.api';
import { CustomerTypeModel } from '../../../core/models/common-models/customer-type-model';
import { CustomerModel } from '../../../core/models/advisor/customer';
import { CustomerDetailApi } from '../../../api/customer/customer-detail.api';
import { AgSelectRendererComponent } from '../../../shared/ag-select-renderer/ag-select-renderer.component';
import { BankApi } from '../../../api/common-api/bank.api';
import { BankModel } from '../../../core/models/common-models/bank-model';
import { GridTableService } from '../../../shared/common-service/grid-table.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'change-customer-information',
  templateUrl: './change-customer-information.component.html',
  styleUrls: ['./change-customer-information.component.scss'],
})
export class ChangeCustomerInformationComponent implements OnInit {
  @ViewChild('searchDataGridModal', {static: false}) searchDataGridModal;
  form: FormGroup;
  fieldGrid;
  fieldGridSearchDataGrid;
  params;
  selectedCustomer: CustomerModel;
  customerTypes: Array<CustomerTypeModel>;
  banks: Array<BankModel> = [];
  districts = [];
  provinces = [];
  frameworkComponents;
  disableBtn: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private provinceApi: ProvinceApi,
    private districtApi: DistrictApi,
    private customerDetailApi: CustomerDetailApi,
    private loadingService: LoadingService,
    private gridTableService: GridTableService,
    private customerApi: CustomerApi,
    private bankApi: BankApi,
    private swalAlertService: ToastService,
    private customerTypeApi: CustomerTypeApi,
  ) {
    this.fieldGrid = [
      {headerName: 'Họ và tên', headerTooltip: 'Họ và tên', field: 'name', editable: true},
      {headerName: 'Số CMTND', headerTooltip: 'Số CMTND', field: 'idnumber', editable: true, validators: ['peopleId']},
      {headerName: 'Điện thoại 1', headerTooltip: 'Điện thoại 1', field: 'tel', editable: true, validators: ['phone']},
      {headerName: 'Điện thoại 2', headerTooltip: 'Điện thoại 2', field: 'mobil', editable: true, validators: ['phone']},
      {headerName: 'Địa chỉ', headerTooltip: 'Địa chỉ', field: 'address', editable: true},
      {headerName: 'Email', headerTooltip: 'Email', field: 'email', editable: true, validators: ['email']},
      {
        headerName: 'Loại', headerTooltip: 'Loại', field: 'type', cellRenderer: 'agSelectRendererComponent',
        list: [
          {key: 'M', value: 'Quản lý xe'},
          {key: 'D', value: 'Lái xe'},
          {key: 'O', value: 'Khác'},
        ],
      },
    ];
    this.fieldGridSearchDataGrid = [
      {headerName: 'Mã KH', headerTooltip: 'Mã Khách hàng', field: 'cusno'},
      {headerName: 'Tên KH', headerTooltip: 'Tên Khách hàng', field: 'carownername'},
      {headerName: 'Địa chỉ', headerTooltip: 'Địa chỉ', field: 'carowneradd'},
      {headerName: 'Điện thoại', headerTooltip: 'Điện thoại', field: 'carownertel'},
      {headerName: 'Di động', headerTooltip: 'Di động', field: 'carownermobil'},
      {headerName: 'Fax', headerTooltip: 'Fax', field: 'carownerfax'},
      {headerName: 'Tên Cty', headerTooltip: 'Tên Cty', field: 'orgname'},
    ];
    this.frameworkComponents = {
      agSelectRendererComponent: AgSelectRendererComponent,
    };
  }

  ngOnInit() {
    this.getCustomerType();
    this.getProvinces();
    this.getBanks();
    this.buildForm();
  }

  getBanks() {
    this.bankApi.getBanksByDealer().subscribe(banks => this.banks = banks);
  }

  getProvinces() {
    this.provinceApi.getAllAvailableProvince().subscribe(provinces => {
      this.provinces = provinces;
    });
  }

  getDistrictsByProvinceId(provinceId) {
    this.districtApi.getDistrictOfProvince(provinceId).subscribe(districts => {
      this.districts = districts;
    });
  }

  getCustomerType() {
    this.customerTypeApi.getByDlr().subscribe(customerTypes => {
      this.customerTypes = customerTypes;
    });
  }

  callbackGrid(params) {
    this.params = params;
  }

  getCustomers(val) {
    return this.customerApi.searchForEditing({registerno: val.registerno});
  }

  search() {
    if (this.form.value.registerno.length >= 4) {
      this.searchDataGridModal.open({registerno: this.form.value.registerno});
    } else {
      this.swalAlertService.openWarningToast('Bạn nhập tối thiểu 4 ký tự để tìm kiếm!', 'Nhập lại dữ liệu tìm kiếm');
    }
  }

  chooseCustomer(customer) {
    this.selectedCustomer = customer;
    // this.customerDetailApi.getDriverList(customer.id).subscribe(list => {
    //   this.params.api.setRowData(list || [])
    // })
    this.form.patchValue(customer);
    this.disableBtn = true;
    const fields = [
      'carownername',
      'cusno',
      'orgname',
      'cusTypeId',
      'carowneradd',
      'provinceId',
      'districtId',
      'carownermobil',
      'carownertel',
      'carownerfax',
      'taxcode',
      'carowneremail',
      'accno',
      'bankId',
      'carowneridnum'];
    fields.forEach(field => this.form.get(field).enable());
  }

  update() {
    if (this.form.invalid) {
      return;
    }

    const value = {
      customer: Object.assign({}, this.selectedCustomer, this.form.value, {
        id: this.selectedCustomer.id,
      }),
      driverList: [],
    };

    this.loadingService.setDisplay(true);
    this.customerApi.updateCustomerInfo(value).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessToast('Cập nhật thành công');
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      registerno: [''],
      carownername: [{
        value: undefined,
        disabled: true,
      }, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(180)])],
      cusno: [{value: undefined, disabled: true}],
      orgname: [{value: undefined, disabled: true}, GlobalValidator.maxLength(2000)],
      cusTypeId: [{value: undefined, disabled: true}],
      carowneradd: [{
        value: undefined,
        disabled: true,
      }, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(180)])],
      provinceId: [{value: undefined, disabled: true}, GlobalValidator.required],
      districtId: [{value: undefined, disabled: true}, GlobalValidator.required],
      carownermobil: [{
        value: undefined,
        disabled: true,
      }, Validators.compose([GlobalValidator.required, GlobalValidator.phoneFormat])],
      carownertel: [{value: undefined, disabled: true}, GlobalValidator.phoneFormat],
      carownerfax: [{value: undefined, disabled: true}, GlobalValidator.phoneFormat],
      taxcode: [{value: undefined, disabled: true}, GlobalValidator.taxFormat],
      carowneremail: [{
        value: undefined,
        disabled: true,
      }, Validators.compose([GlobalValidator.emailFormat, GlobalValidator.maxLength(50)])],
      accno: [{value: undefined, disabled: true}, GlobalValidator.maxLength(30)],
      bankId: [{value: undefined, disabled: true}],
      carowneridnum: [{
        value: undefined,
        disabled: true,
      }, Validators.compose([GlobalValidator.peopleIdFormat, GlobalValidator.maxLength(50)])],
    });

    this.form.get('provinceId').valueChanges.subscribe(val => {
      if (val) {
        this.getDistrictsByProvinceId(val);
      } else {
        this.districts = [];
      }
    });
  }

}
