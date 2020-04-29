import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CommonService} from '../../../../shared/common-service/common.service';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {CusDetailModel} from '../../../../core/models/advisor/standarize-customer-info.model';
import {CustomerDetailApi} from '../../../../api/customer/customer-detail.api';
import {CustomerDetailType} from '../../../../core/constains/customer-detail';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'detail-cus-info',
  templateUrl: './detail-cus-info.component.html',
  styleUrls: ['./detail-cus-info.component.scss']
})
export class DetailCusInfoComponent implements OnInit, OnChanges {
  @Input() cusId: number;
  fieldGrid;
  params;
  cusDetailList: Array<CusDetailModel>;
  cusSelected: Array<CusDetailModel>;
  cusDetailType = CustomerDetailType;

  constructor(
    private loading: LoadingService,
    private common: CommonService,
    private customerDetailApi: CustomerDetailApi
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {
        headerName: '', headerTooltip: '', field: 'checked', width: 60,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true
      },
      {headerName: 'Tên người LH', headerTooltip: 'Tên người LH', field: 'name'},
      {headerName: 'CMTND', headerTooltip: 'Chứng minh thư nhân dân', field: 'idnumber'},
      {headerName: 'SĐT', headerTooltip: 'Số điện thoại', field: 'tel'},
      {headerName: 'Di động', headerTooltip: 'Di động', field: 'mobil'},
      {headerName: 'Địa chỉ', headerTooltip: 'Địa chỉ', field: 'address'},
      {headerName: 'Email', headerTooltip: 'Email', field: 'email'},
      {
        headerName: 'Loại', headerTooltip: 'Loại', field: 'type',
        valueFormatter: params => {
          const matchVal = this.cusDetailType.find(type => type.id === params.value);
          return matchVal ? matchVal.name : '';
        }
      }
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.cusId && !this.common.isEmpty(this.cusId)) {
      this.getVehicleOfCus(this.cusId);
    }
  }

  callbackGrid(params) {
    params.api.setRowData();
    this.params = params;
  }

  getParams() {
    const selected = this.params.api.getSelectedRows();
    if (selected) {
      this.cusSelected = selected;
    }
  }

  getVehicleOfCus(cusId) {
    this.loading.setDisplay(true);
    this.customerDetailApi.getCusDetail(cusId).subscribe(cus => {
      this.loading.setDisplay(false);
      this.cusDetailList = cus || [];
      if (this.params) {
        this.params.api.setRowData(this.cusDetailList);
        this.params.api.sizeColumnsToFit(this.params);
      }
    });
  }
}
