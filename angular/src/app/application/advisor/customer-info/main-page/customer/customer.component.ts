import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {ProvinceApi} from '../../../../../api/sales-api/province/province.api';
import {DistrictApi} from '../../../../../api/sales-api/district/district.api';
import {CustomerTypeApi} from '../../../../../api/customer/customer-type.api';
import {CustomerTypeModel} from '../../../../../core/models/common-models/customer-type-model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements AfterViewInit, OnInit, OnChanges {
  @ViewChild('submitBtn', {static: false}) submitBtn;
  @Input() isOrder: boolean;
  @Input() form: FormGroup;
  @Input() isSubmit: boolean;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onSearch = new EventEmitter();
  customerTypes: Array<CustomerTypeModel>;
  districts = [];
  provinces = [];

  constructor(private provinceApi: ProvinceApi,
              private districtApi: DistrictApi,
              private customerTypeApi: CustomerTypeApi) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isSubmit && this.submitBtn) {
      this.submitBtn.nativeElement.click();
    }
  }

  ngOnInit() {
    this.checkForm();
    this.getProvinces();
    this.getCustomerType();
  }

  ngAfterViewInit(): void {

  }

  getProvinces() {
    this.provinceApi.getAllAvailableProvinceOrder().subscribe(provinces => {
      this.provinces = provinces;
    });
  }

  getDistrictsByProvinceId(provinceId) {
    this.districtApi.getDistrictOfProvinceOrder(provinceId).subscribe(districts => {
      this.districts = districts;
    });
  }

  getCustomerType() {
    this.customerTypeApi.getByDlr().subscribe(customerTypes => {
      this.customerTypes = customerTypes || [];
    });
  }

  removeCustomerInfo() {
    this.form.patchValue({
      carownername: null,
      cusno: null,
      orgname: null,
      custypeId: null,
      cusType: null,
      carowneradd: null,
      provinceId: null,
      districtId: null,
      carownermobil: null,
      carownertel: null,
      carownerfax: null,
      taxcode: null,
      carowneremail: null,
      note: null
    });

  }

  searchCus() {
    this.onSearch.emit();
  }

  private checkForm() {
    this.form.get('provinceId').valueChanges.subscribe(val => {
      if (val) {
        this.getDistrictsByProvinceId(val);
      } else {
        this.districts = [];
      }
    });
  }

}
