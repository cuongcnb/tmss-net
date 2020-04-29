import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CustomerInfoModel, LscOfCusModel } from '../../../../../core/models/advisor/standarize-customer-info.model';
import { CommonService } from '../../../../../shared/common-service/common.service';
import { LoadingService } from '../../../../../shared/loading/loading.service';
import { StandardizeCustomerApi } from '../../../../../api/customer/standardize-customer.api';
import { RoState } from '../../../../../core/constains/ro-state';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lsc-info-tab-modal',
  templateUrl: './lsc-info-tab-modal.component.html',
  styleUrls: ['./lsc-info-tab-modal.component.scss']
})
export class LSCInfoTabModalComponent implements OnInit, OnChanges {
  @Input() listCus: Array<CustomerInfoModel>;
  @Input() isCusDetail: boolean;
  @Input() isShown: boolean;
  fieldGrid;
  params;
  vehicleList: Array<LscOfCusModel>;
  roState = RoState;

  constructor(
    private loading: LoadingService,
    private common: CommonService,
    private standardizeCustomerApi: StandardizeCustomerApi,
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {headerName: 'Biển số xe', headerTooltip: 'Biển số xe', field: 'registerNo'},
      {headerName: 'Số LSC', headerTooltip: 'Số LSC', field: 'repairOrderNo'},
      {
        headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'roState',
        valueFormatter: params => {
          const matchVal = this.roState.find(status => status.id === params.value);
          return matchVal ? matchVal.name : '';
        },
      },
      {headerName: 'Tên KH', headerTooltip: 'Tên khách hàng', field: 'carownername'},
      {headerName: 'Địa chỉ', headerTooltip: 'Địa chỉ', field: 'carowneradd'},
      {headerName: 'SĐT', headerTooltip: 'Số điện thoại', field: 'carownertel'},
      {headerName: 'Di động', headerTooltip: 'Di động', field: 'carownermobil'},
      {headerName: 'Yêu cầu', headerTooltip: 'Yêu cầu', field: 'reqdesc'}
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isShown && this.listCus && this.listCus.length) {
      this.isCusDetail
        ? this.getLscOfCusDetails(this.listCus.map(cus => cus.id))
        : this.getLscOfCus(this.listCus.map(cus => cus.id));
    }
  }

  callbackGrid(params) {
    params.api.setRowData();
    this.params = params;
    if (this.isShown && this.listCus && this.listCus.length) {
      if (this.isCusDetail) {
        this.getLscOfCusDetails(this.listCus.map(cus => cus.id));
      } else {
        this.getLscOfCus(this.listCus.map(cus => cus.id));
      }
    }
  }

  private getLscOfCus(listCusId) {
    this.loading.setDisplay(true);
    this.standardizeCustomerApi.getLscOfCustomers(listCusId).subscribe(vehicles => {
      this.loading.setDisplay(false);
      this.vehicleList = vehicles || [];
      if (this.params) {
        this.params.api.setRowData(this.vehicleList);
      }
    });
  }

  private getLscOfCusDetails(listCusDId) {
    this.loading.setDisplay(true);
    this.standardizeCustomerApi.getLscOfCusDetails(listCusDId).subscribe(vehicles => {
      this.loading.setDisplay(false);
      this.vehicleList = vehicles || [];
      if (this.params) {
        this.params.api.setRowData(this.vehicleList);
      }
    });
  }

  resize() {
    if (this.params) {
      this.params.api.sizeColumnsToFit(this.params);
    }
  }
}
