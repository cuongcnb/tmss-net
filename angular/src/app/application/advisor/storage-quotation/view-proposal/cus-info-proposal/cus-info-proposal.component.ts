import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProvinceApi } from '../../../../../api/sales-api/province/province.api';
import { DistrictApi } from '../../../../../api/sales-api/district/district.api';
import { CustomerTypeApi } from '../../../../../api/customer/customer-type.api';
import { CustomerTypeModel } from '../../../../../core/models/common-models/customer-type-model';
import { DistrictOfProvinceModel } from '../../../../../core/models/sales/district-list.model';
import { ProvincesModel } from '../../../../../core/models/sales/provinces.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cus-info-proposal',
  templateUrl: './cus-info-proposal.component.html',
  styleUrls: ['./cus-info-proposal.component.scss'],
})
export class CusInfoProposalComponent implements AfterViewInit, OnInit, OnChanges {
  @Input() form: FormGroup;
  districts: DistrictOfProvinceModel[] = [];
  provinces: ProvincesModel[] = [];
  customerTypes: Array<CustomerTypeModel> = [];
  @ViewChild('submitBtn', {static: false}) submitBtn;
  @Input() isSubmit: boolean;
  isCollapsed = true;

  constructor(private provinceApi: ProvinceApi,
              private districtApi: DistrictApi,
              private customerTypeApi: CustomerTypeApi) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isSubmit && this.submitBtn) {
      this.submitBtn.nativeElement.click();
    }
  }

  ngAfterViewInit(): void {

  }

  ngOnInit() {
    this.getProvinces();
    this.getCustomerType();
  }

  getProvinces() {
    this.provinceApi.getAllAvailableProvinceOrder().subscribe(provinces => {
      this.provinces = provinces;
    });
  }

  getDistricts(id) {
    if (id) {
      this.districtApi.getDistrictOfProvinceOrder(id).subscribe(districts => {
        this.districts = districts;
      });
    }
  }

  getCustomerType() {
    this.customerTypeApi.getByDlr().subscribe(customerTypes => {
      this.customerTypes = customerTypes || [];
    });
  }

}
