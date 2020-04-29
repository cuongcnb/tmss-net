import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from '../../../shared/loading/loading.service';
import { DealerIpConfigService} from '../../../api/master-data/dealer-ip-config.service';
import { DealerListService} from '../../../api/master-data/dealer-list.service';
import { ToastService } from '../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dealer-ip-config',
  templateUrl: './dealer-ip-config.component.html',
  styleUrls: ['./dealer-ip-config.component.scss']
})
export class DealerIpConfigComponent implements OnInit {
  @ViewChild('dealerIpConfigModal', {static: false}) dealerIpConfigModal;
  dealers;
  selectedDealerId = '';
  fieldGrid;
  dealerIpConfigParam;
  selectedDealerIpConfig;

  constructor(
    private loadingService: LoadingService,
    private dealerListService: DealerListService,
    private dealerIpConfigService: DealerIpConfigService,
    private toastService: ToastService
  ) {
    this.fieldGrid = [
      {headerName: 'Dealer', field: 'abbreviation', minWidth: 100},
      {headerName: 'Ip Class', field: 'ipClass', minWidth: 200},
    ];
  }

  ngOnInit() {
    this.dealerListService.getDealers()
      .subscribe(dealers => {
        this.dealers = dealers;
      });
  }

  callbackGridDealerIpConfig(params) {
    params.api.setRowData();
    this.dealerIpConfigParam = params;
    this.getDealerIp();
  }

  search() {
    this.selectedDealerId
      ? this.getDealerIp(this.selectedDealerId)
      : this.getDealerIp();
  }

  getDealerIp(dealerIp?) {
    const apiCall = dealerIp
      ? this.dealerIpConfigService.getDealerIpByDealerIp(dealerIp)
      : this.dealerIpConfigService.getDealersIp();

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
      this.toastService.openWarningForceSelectData();
    }
  }
}

