import {Component, OnInit, ViewChild} from '@angular/core';
import { DealerOrderConfigModel } from '../../../core/models/master-data/dealer-order-config.model';
import { DealerOrderConfigService } from '../../../api/dealer-order/dealer-order-config.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { ToastService } from '../../../shared/common-service/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';
import {DataOrderConfigType} from '../../../core/constains/dataOrderConfigType';
import {moment} from 'ngx-bootstrap/chronos/test/chain';
import {FormStoringService} from '../../../shared/common-service/form-storing.service';
import {StorageKeys} from '../../../core/constains/storageKeys';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dealer-order-configs',
  templateUrl: './dealer-order-configs.component.html',
  styleUrls: ['./dealer-order-configs.component.scss']
})
export class DealerOrderConfigsComponent implements OnInit {
  @ViewChild('dealerOrderConfigModal', {static: false}) dealerOrderConfigModal;

  fieldGrid;
  selectedDate: Date;
  dealerOrderConfigParams;
  selectedDealerOrderConfig: DealerOrderConfigModel;
  dataOrderConfigType = DataOrderConfigType;
  constructor(
    private dealerOrderConfigService: DealerOrderConfigService,
    private loadingService: LoadingService,
    private confirmationService: ConfirmService,
    private formStoringService: FormStoringService,
    private swalAlertService: ToastService,
  ) {
  }

  ngOnInit() {
    this.generateDay();
  }

  renderDataType(key) {
    if (this.dataOrderConfigType) {
      for (const element of this.dataOrderConfigType) {
        if (element.key === key) {
          return element.name;
        }
      }
    }
    return null;
  }

  getDayFromLocalStorage() {
    const selectedDate = this.formStoringService.get(StorageKeys.orderDate);
    return selectedDate;
  }

  generateDay(dtChange?) {
    !dtChange ? this.selectedDate = this.getDayFromLocalStorage() ? new  Date(this.getDayFromLocalStorage()) : new Date()
      : this.selectedDate = new Date(dtChange);
    this.formStoringService.set(StorageKeys.orderDate, this.selectedDate);
  }

  search() {
    this.loadingService.setDisplay(true);
    this.fieldGrid = [
      {headerName: 'Dealer', field: 'dealer'},
      {
        headerName: 'Data Type',
        field: 'dataType',
        cellRenderer: params => {
          return this.renderDataType(params.value);
        }
      },
      {headerName: 'Version Type', field: 'versionType'},
      {headerName: 'Month', field: 'monthText'},
      {
        headerName: 'Deadline',
        field: 'deadlineText'
        // cellRenderer: (data) => {
        //   return moment(data.deadline).format('DD-MM-YYYY HH:mm');
        // }
      },
      {
        headerName: 'Import Package',
        field: 'importDate'
      }
    ];
    let dealerOrderConfig = {
      importDate: this.selectedDate
    }
    this.dealerOrderConfigService.search(dealerOrderConfig).subscribe(dealerOrderConfigs => {
      if(this.dealerOrderConfigParams) {
        this.dealerOrderConfigParams.api.setRowData(dealerOrderConfigs.data);
      }
      this.loadingService.setDisplay(false);
    });
  }

  callbackGridDealerOrderConfigs(params) {
    this.dealerOrderConfigParams = params;
    this.search();
  }

  refreshList() {
    this.search()
    this.selectedDealerOrderConfig = undefined;
  }

  getParamsDealerOrderConfig() {
    if (this.dealerOrderConfigParams) {
      const selectedDealerOrderConfig = this.dealerOrderConfigParams.api.getSelectedRows();
      if (selectedDealerOrderConfig) {
        this.selectedDealerOrderConfig = selectedDealerOrderConfig[0];
      }
    }
  }

  updateDealerOrderConfig() {
    if (this.selectedDealerOrderConfig) {
      this.dealerOrderConfigModal.open(this.selectedDealerOrderConfig);
    } else {
      this.swalAlertService.openWarningForceSelectData();
    }
  }

  deleteDealerOrderConfig() {
    this.confirmationService.openConfirmModal('Are you sure?', 'Do you want to delete this data?')
      .subscribe(() => {
        this.loadingService.setDisplay(true);
        this.dealerOrderConfigService.deleteDealerOrderConfig(this.selectedDealerOrderConfig.id).subscribe(() => {
          this.refreshList();
          this.loadingService.setDisplay(false);
          this.swalAlertService.openSuccessModal();
        });
      });
  }

  exportData() {
    this.dealerOrderConfigParams.api.exportDataAsExcel();
  }
}
