import {EventEmitter, AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, Output} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CustomerTypeApi } from '../../../../api/customer/customer-type.api';
import { ProvinceApi } from '../../../../api/sales-api/province/province.api';
import { DistrictApi } from '../../../../api/sales-api/district/district.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'customer-info-of-booking',
  templateUrl: './customer-info-of-booking.component.html',
  styleUrls: ['./customer-info-of-booking.component.scss'],
})
export class CustomerInfoOfBookingComponent implements AfterViewInit, OnInit, OnChanges {
  @ViewChild('submitBtn', {static: false}) submitBtn;
  @Input() form: FormGroup;
  @Input() isSubmit: boolean;
  @Output() onChangeType = new EventEmitter();
  customerTypes;
  districts = [];
  provinces = [];

  constructor(
    private customerTypeApi: CustomerTypeApi,
    private districtApi: DistrictApi,
    private provinceApi: ProvinceApi
  ) {}

  ngOnInit() {
    this.checkFormProvinces();
    this.getProvinces();
    this.getCustomerType();
  }

  getCustomerType() {
    this.customerTypeApi.getByDlr().subscribe(customerTypes => {
      this.customerTypes = customerTypes || [];
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isSubmit && this.submitBtn) {
      this.submitBtn.nativeElement.click();
    }
  }

  ngAfterViewInit(): void {}

  changedType() {
    this.onChangeType.emit();
  }

  getDistrictsByProvinceId(provinceId) {
    this.districtApi.getDistrictOfProvinceOrder(provinceId).subscribe(districts => {
      this.districts = districts;
    });
  }

  getProvinces() {
    this.provinceApi.getAllAvailableProvinceOrder().subscribe(provinces => {
      this.provinces = provinces;
    });
  }

  private checkFormProvinces() {
    this.form.get('provinceId').valueChanges.subscribe(val => {
      if (val) {
        this.getDistrictsByProvinceId(val);
      } else {
        this.districts = [];
      }
    });
  }
}
