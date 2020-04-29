import { Component, OnInit, ViewChild } from '@angular/core';

import { LoadingService } from '../../../shared/loading/loading.service';
import { DealerModel } from '../../../core/models/sales/dealer.model';
import { DealerIpConfigModel } from '../../../core/models/sales/dealer-ip-config.model';
import { DealerApi } from '../../../api/sales-api/dealer/dealer.api';
import { DealerIpConfigApi } from '../../../api/sales-api/dealer-ip-config/dealer-ip-config.api';
import { ToastService } from '../../../shared/swal-alert/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dealer-ip-config',
  templateUrl: './dealer-ip-config.component.html',
  styleUrls: ['./dealer-ip-config.component.scss']
})
export class DealerIpConfigComponent implements OnInit {
  @ViewChild('dealerIpConfigModal', {static: false}) dealerIpConfigModal;
  dealers: DealerModel;
  selectedDealerId = '';
  fieldGrid;
  dealerIpConfigParam;
  selectedDealerIpConfig: DealerIpConfigModel;

  constructor(
    private loadingService: LoadingService,
    private swalAlert: ToastService,
    private dealerApi: DealerApi,
    private dealerIpConfigApi: DealerIpConfigApi,
  ) {
    this.fieldGrid = [
      {headerName: 'Dealer', headerTooltip: 'Dealer', field: 'abbreviation'},
      {headerName: 'Ip Class', headerTooltip: 'Ip Class', field: 'ipClass'},
    ];
  }

  ngOnInit() {
    this.dealerApi.getDealers().subscribe(dealers => this.dealers = dealers);
  }

  callbackGridDealerIpConfig(params) {
    params.api.setRowData();
    this.dealerIpConfigParam = params;
    this.getDealerIp();
  }

  search() {
    this.selectedDealerId ? this.getDealerIp(this.selectedDealerId) : this.getDealerIp();
  }

  getDealerIp(dealerIp?) {
    const apiCall = dealerIp
      ? this.dealerIpConfigApi.getDealerIpByDealerIp(dealerIp)
      : this.dealerIpConfigApi.getDealersIp();

    this.loadingService.setDisplay(true);
    apiCall.subscribe(dealerIpConfig => {
      this.dealerIpConfigParam.api.setRowData(dealerIpConfig);
      this.loadingService.setDisplay(false);
    });
  }

  refreshList() {
    this.search();
    this.selectedDealerIpConfig = undefined;
  }

  refreshAfterUpdate(dealerId) {
    this.selectedDealerId = dealerId;
    this.search();
    this.selectedDealerIpConfig = undefined;
  }

  getParamsDealerIpConfig() {
    const selectedDealerIpConfig = this.dealerIpConfigParam.api.getSelectedRows();
    if (selectedDealerIpConfig) {
      this.selectedDealerIpConfig = selectedDealerIpConfig[0];
    }
  }

  updateDealerIpConfig() {
    if (this.selectedDealerIpConfig) {
      this.dealerIpConfigModal.open(this.selectedDealerIpConfig);
    } else {
      this.swalAlert.openWarningToast('Chưa chọn dữ liệu, hãy chọn ít nhất một dòng');
    }
  }
}

