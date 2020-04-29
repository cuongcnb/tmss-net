import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {CustomerInfoModel} from '../../../../core/models/advisor/standarize-customer-info.model';
import {ProvincesModel} from '../../../../core/models/sales/provinces.model';
import {DistrictOfProvinceModel} from '../../../../core/models/sales/district-list.model';
import {CustomerTypeModel} from '../../../../core/models/common-models/customer-type-model';
import {BankModel} from '../../../../core/models/common-models/bank-model';
import {ProvinceApi} from '../../../../api/sales-api/province/province.api';
import {DistrictApi} from '../../../../api/sales-api/district/district.api';
import {CustomerTypeApi} from '../../../../api/customer/customer-type.api';
import {BankApi} from '../../../../api/common-api/bank.api';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {StandardizeCustomerApi} from '../../../../api/customer/standardize-customer.api';
import {ToastService} from '../../../../shared/swal-alert/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'standardize-info-modal',
  templateUrl: './standardize-info-modal.component.html',
  styleUrls: ['./standardize-info-modal.component.scss']
})
export class StandardizeInfoModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('vehicleInfoTabModalComponent', {static: false}) vehicleInfoTabModalComponent;
  @ViewChild('lscInfoTabModalComponent', {static: false}) lscInfoTabModalComponent;
  @ViewChild('retailPartInfoTabModalComponent', {static: false}) retailPartInfoTabModalComponent;
  @ViewChild('cusInfoDetailTabModalComponent', {static: false}) cusInfoDetailTabModalComponent;
  @Output() saved = new EventEmitter();
  selectedData: Array<CustomerInfoModel>;
  form: FormGroup;
  modalHeight: number;
  selectedTab: string;
  tabs: Array<string>;
  provinceList: Array<ProvincesModel>;
  districtList: Array<DistrictOfProvinceModel>;
  cusTypes: Array<CustomerTypeModel>;
  bankList: Array<BankModel>;
  choosingData;

  constructor(
    private setModalHeightService: SetModalHeightService,
    private swalAlert: ToastService,
    private formBuilder: FormBuilder,
    private loading: LoadingService,
    private standardizeCustomerApi: StandardizeCustomerApi,
    private bankApi: BankApi,
    private provinceApi: ProvinceApi,
    private districtApi: DistrictApi,
    private customerTypeApi: CustomerTypeApi
  ) {
  }

  ngOnInit() {
    this.initTabs();
  }

  selectTab(tab) {
    this.selectedTab = tab;
    switch (tab) {
      case this.tabs[0]:
        this.vehicleInfoTabModalComponent.resize();
        break;
      case this.tabs[1]:
        this.lscInfoTabModalComponent.resize();
        break;
      case this.tabs[2]:
        this.retailPartInfoTabModalComponent.resize();
        break;
      case this.tabs[3]:
        this.cusInfoDetailTabModalComponent.resize();
        break;
    }
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open(selectedData) {
    this.selectedData = selectedData;
    this.choosingData = Object.assign({}, {
      cusno: this.selectedData.map(cus => cus.cusno),
      carownername: this.selectedData.map(cus => cus.carownername),
      carowneremail: this.selectedData.map(cus => cus.carowneremail),
      carowneradd: this.selectedData.map(cus => cus.carowneradd),
      taxcode: this.selectedData.map(cus => cus.taxcode),
      carownertel: this.selectedData.map(cus => cus.carownertel),
      orgname: this.selectedData.map(cus => cus.orgname),
      accno: this.selectedData.map(cus => cus.accno),
      carownermobil: this.selectedData.map(cus => cus.carownermobil),
      carownerfax: this.selectedData.map(cus => cus.carownerfax),
      carowneridnum: this.selectedData.map(cus => cus.carowneridnum)
    });
    this.onResize();
    this.buildForm();
    this.getProvinces();
    this.getBanks();
    this.getCustomerType();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
    this.selectedData = undefined;
    this.provinceList = undefined;
    this.choosingData = undefined;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const value = Object.assign({}, this.form.value, {
      cusIdString: this.selectedData.map(data => data.id).toString()
    });
    this.loading.setDisplay(true);
    this.standardizeCustomerApi.mergeCustomerInfor(value).subscribe(() => {
      this.loading.setDisplay(false);
      this.swalAlert.openSuccessToast();
      this.modal.hide();
      this.saved.emit();
    });
  }

  patchData(newData) {
    this.form.patchValue({
      [newData.fieldName]: newData.data
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      cusno: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(20)])],
      carownername: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(180)])],
      orgname: [undefined, GlobalValidator.maxLength(2000)],
      custypeId: [undefined],
      carowneradd: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(180)])],
      provinceId: [undefined, GlobalValidator.required],
      districtId: [undefined, GlobalValidator.required],
      carownermobil: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.phoneFormat])],
      carownertel: [undefined, GlobalValidator.phoneFormat],
      carownerfax: [undefined, GlobalValidator.phoneFormat],
      taxcode: [undefined, GlobalValidator.taxFormat],
      carowneremail: [undefined, Validators.compose([GlobalValidator.emailFormat, GlobalValidator.maxLength(50)])],
      accno: [undefined, GlobalValidator.maxLength(30)],
      bankId: [undefined],
      carowneridnum: [undefined, GlobalValidator.maxLength(50)]
    });
    this.form.get('provinceId').valueChanges.subscribe(val => {
      if (val || val === 0) {
        this.getProvinceByDistrict(val);
      } else {
        this.districtList = undefined;
      }
    });
    if (this.selectedData.length === 1) {
      setTimeout(() => {
        this.form.patchValue(Object.assign({}, this.selectedData[0],
          {custypeId: this.selectedData[0].cusTypeId}));
      });
    }
  }

  private initTabs() {
    this.tabs = ['Thông tin xe', 'Thông tin LSC', 'Thông tin bán lẻ phụ tùng', 'Thông tin chi tiết KH'];
    this.selectedTab = this.tabs[0];
  }

  private getProvinces() {
    this.loading.setDisplay(true);
    this.provinceApi.getAllAvailableProvince().subscribe(provinces => {
      this.provinceList = provinces || [];
      this.loading.setDisplay(false);
    });
  }

  private getBanks() {
    this.loading.setDisplay(true);
    this.bankApi.getBanksByDealer().subscribe(banks => {
      this.bankList = banks || [];
      this.loading.setDisplay(false);
    });
  }

  private getCustomerType() {
    this.loading.setDisplay(true);
    this.customerTypeApi.getByDlr().subscribe(cusType => {
      this.cusTypes = cusType || [];
      this.loading.setDisplay(false);
    });
  }

  private getProvinceByDistrict(provinceId) {
    this.loading.setDisplay(true);
    this.districtApi.getDistrictOfProvince(provinceId).subscribe(districts => {
      this.districtList = districts;
      this.loading.setDisplay(false);
    });
  }
}
