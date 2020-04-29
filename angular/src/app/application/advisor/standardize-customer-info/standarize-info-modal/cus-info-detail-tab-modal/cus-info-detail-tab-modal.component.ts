import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  CusDetailModel,
  CustomerInfoModel,
} from '../../../../../core/models/advisor/standarize-customer-info.model';
import { CommonService } from '../../../../../shared/common-service/common.service';
import { LoadingService } from '../../../../../shared/loading/loading.service';
import { CustomerDetailApi } from '../../../../../api/customer/customer-detail.api';
import { CustomerDetailType } from '../../../../../core/constains/customer-detail';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cus-info-detail-tab-modal',
  templateUrl: './cus-info-detail-tab-modal.component.html',
  styleUrls: ['./cus-info-detail-tab-modal.component.scss'],
})
export class CusInfoDetailTabModalComponent implements OnInit, OnChanges {
  @Input() listCus: Array<CustomerInfoModel>;
  @Input() isCusDetail: boolean;
  @Input() isShown: boolean;
  fieldGrid;
  params;
  cusDetailList: Array<CusDetailModel>;
  cusSelected: Array<CusDetailModel>;
  listCusId;
  cusDetailType = CustomerDetailType;

  constructor(
    private loading: LoadingService,
    private common: CommonService,
    private customerDetailApi: CustomerDetailApi,
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {headerName: 'Tên', headerTooltip: 'Tên', field: 'carownername'},
      {headerName: 'CMTND', headerTooltip: 'Chứng minh thư nhân dân', field: 'carowneridnum'},
      {headerName: 'SĐT', headerTooltip: 'Số điện thoại', field: 'carownertel'},
      {headerName: 'Di động', headerTooltip: 'Di động', field: 'carownermobil'},
      {headerName: 'Địa chỉ', headerTooltip: 'Địa chỉ', field: 'carowneradd'},
      {headerName: 'Email', headerTooltip: 'Email', field: 'carowneremail'},
      {
        headerName: 'Loại', headerTooltip: 'Loại', field: 'cusTypeName',
        valueFormatter: params => {
          const matchVal = this.cusDetailType.find(type => type.id === params.value);
          return matchVal ? matchVal.name : '';
        },
      },
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.listCusId = this.listCus.map(cus => cus.id);
    if (this.isShown && this.listCus && this.listCus.length) {

      // this.loading.setDisplay(true)
      // this.customerDetailApi.getMoreCusDetail(this.listCusId).subscribe(value => {
      //   this.loading.setDisplay(false)
      //   this.moreCusData = value || []
      //   this.params.api.setRowData(this.moreCusData)
      // })
      if (this.params) {
        this.params.api.setRowData(this.listCus);
      }

      // if (this.isCusDetail) {
      //   this.cusDetailList = Object.assign({}, this.listCus);
      //   this.params.api.setRowData(this.cusDetailList)
      // } else {
      //   this.getVehicleOfCus(this.listCus.map(cus => cus.id))
      // }
    } else {
      this.getVehicleOfCus(this.listCusId);
    }
  }

  callbackGrid(params) {
    params.api.setRowData();
    this.params = params;
    if (this.isShown && this.listCus && this.listCus.length) {

      // this.loading.setDisplay(true)
      // this.customerDetailApi.getMoreCusDetail(this.listCusId).subscribe(value => {
      //   this.loading.setDisplay(false)
      //   this.moreCusData = value || []
      //   this.params.api.setRowData(this.moreCusData)
      // })
      if (this.params) {
        this.params.api.setRowData(this.listCus);
      }

      // if (this.isCusDetail) {
      //   this.cusDetailList = Object.assign({}, this.listCus);
      //   this.params.api.setRowData(this.cusDetailList)
      // } else {
      //   this.getVehicleOfCus(this.listCus.map(cus => cus.id))
      // }
    } else {
      this.getVehicleOfCus(this.listCusId);
    }
  }

  getParams() {
    const selected = this.params.api.getSelectedRows();
    if (selected) {
      this.cusSelected = selected;
    }
  }

  private getVehicleOfCus(cusId) {
    this.loading.setDisplay(true);
    this.customerDetailApi.getCusDetail(cusId).subscribe(cus => {
      this.loading.setDisplay(false);
      this.cusDetailList = cus || [];
      if (this.params) {
        this.params.api.setRowData(this.cusDetailList);
      }
    });
  }
  resize() {
    if (this.params) {
      this.params.api.sizeColumnsToFit(this.params);
    }
  }
}
