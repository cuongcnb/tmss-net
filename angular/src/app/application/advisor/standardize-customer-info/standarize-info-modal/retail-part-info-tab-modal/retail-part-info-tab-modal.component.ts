import { Component, Input } from '@angular/core';
import { CustomerInfoModel } from '../../../../../core/models/advisor/standarize-customer-info.model';
import { StandardizeCustomerApi } from '../../../../../api/customer/standardize-customer.api';
import { ToastService } from '../../../../../shared/swal-alert/toast.service';
import { LoadingService } from '../../../../../shared/loading/loading.service';
import { DataFormatService } from '../../../../../shared/common-service/data-format.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'retail-part-info-tab-modal',
  templateUrl: './retail-part-info-tab-modal.component.html',
  styleUrls: ['./retail-part-info-tab-modal.component.scss'],
})
export class RetailPartInfoTabModalComponent {
  @Input() listCus: Array<CustomerInfoModel>;
  @Input() isShown: boolean;
  fieldRetailPartCustomerTab;
  fieldRetailPartTab;
  gridParamsCustomer;
  gridParamsPart;
  selectedRowDataCus: Array<CustomerInfoModel>;
  partsData;
  cusData: Array<CustomerInfoModel>;
  listCusId;

  constructor(
    private standardizeCustomerApi: StandardizeCustomerApi,
    private swalAlert: ToastService,
    private loading: LoadingService,
    private dataFormatService: DataFormatService,
  ) {
    this.fieldRetailPartCustomerTab = [
      {headerName: 'Số ĐH', headerTooltip: 'Số ĐH', field: 'ctno'},
      {headerName: 'Mã khách hàng', headerTooltip: 'Mã khách hàng', field: 'customerCode'},
      {headerName: 'Tên khách hàng', headerTooltip: 'Tên khách hàng', field: 'carownername'},
      {headerName: 'Địa chỉ', headerTooltip: 'Địa chỉ', field: 'carowneradd'},
      {headerName: 'SĐT', headerTooltip: 'Số điện thoại', field: 'carownertel'},
      {headerName: 'CK', headerTooltip: 'CK', field: 'discount'},
      {
        headerName: 'Ngày bán',
        headerTooltip: 'Ngày bán',
        field: 'salesdate',
        tooltip: params => this.dataFormatService.parseTimestampToDateBasic(params.value),
        valueFormatter: param => this.dataFormatService.parseTimestampToDateBasic(param.value),
      },
    ];

    this.fieldRetailPartTab = [
      {headerName: 'Mã phụ tùng', headerTooltip: 'Mã phụ tùng', field: 'partscode'},
      {headerName: 'Tên phụ tùng', headerTooltip: 'Tên phụ tùng', field: 'partsname'},
      {headerName: 'DVT', headerTooltip: 'Đơn vị tính', field: 'unitName'},
      {headerName: 'SL', headerTooltip: 'Số lượng', field: 'qty'},
      {headerName: 'Đơn giá', headerTooltip: 'Đơn giá', field: 'sellprice'},
      {headerName: 'Thành tiền', headerTooltip: 'Thành tiền', field: 'totalprice'},
    ];
  }

  callbackCustomer(params) {
    params.api.setRowData();
    this.listCusId = this.listCus.map(cus => cus.id);
    this.gridParamsCustomer = params;
    if (this.isShown && this.listCus && this.listCus.length) {
      this.loading.setDisplay(true);
      this.standardizeCustomerApi.getCounterSales(this.listCusId).subscribe(value => {
        this.loading.setDisplay(false);
        this.cusData = value || [];
        this.gridParamsCustomer.api.setRowData(this.cusData);
      });
    }
  }

  getParamsCustomer() {
    const selectedData = this.gridParamsCustomer.api.getSelectedRows();
    if (selectedData) {
      this.selectedRowDataCus = selectedData[0];
      this.getPartsData(this.selectedRowDataCus);
    }
  }

  private getPartsData(ctSales?) {
    if (ctSales) {
      this.loading.setDisplay(true);
      this.standardizeCustomerApi.getCounterSalesParts(ctSales.id).subscribe(value => {
        this.loading.setDisplay(false);
        this.partsData = value || [];
        this.gridParamsPart.api.setRowData(this.partsData);
      });
    }
  }

  callbackPart(params) {
    params.api.setRowData();
    this.gridParamsPart = params;
  }
  resize() {
    if (this.gridParamsPart) {
      this.gridParamsPart.api.sizeColumnsToFit(this.gridParamsPart);
    }
    if (this.gridParamsCustomer) {
      this.gridParamsCustomer.api.sizeColumnsToFit(this.gridParamsCustomer);
    }
  }
}
