import {Component, OnInit, ViewChild} from '@angular/core';
import { DealerVersionTypeService } from '../../../api/dealer-order/dealer-version-type.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { ToastService } from '../../../shared/common-service/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';
import {DataOrderConfigType} from '../../../core/constains/dataOrderConfigType';

@Component({
  selector: 'app-dealer-version-type',
  templateUrl: './dealer-version-type.component.html',
  styleUrls: ['./dealer-version-type.component.scss']
})
export class DealerVersionTypeComponent {

  @ViewChild('dealerVersionTypeModal', {static: false}) dealerVersionTypeModal;

  dealerVersionTypes: [];
  fieldGrid;
  dealerOrderConfigParams;
  selectedDealerVersionType: any;
  dataOrderConfigType = DataOrderConfigType;
  constructor(
    private dealerVersionTypeService: DealerVersionTypeService,
    private loadingService: LoadingService,
    private confirmationService: ConfirmService,
    private swalAlertService: ToastService,
  ) {
    this.fieldGrid = [
      {
        headerName: 'Data Type',
        field: 'dataType',
        cellRenderer: params => {
          return this.renderDataType(params.value);
        }
      },
      {headerName: 'Version Type', field: 'versionType'},
    ];
  }

  renderDataType(key) {
    for (const element of this.dataOrderConfigType) {
      if (element.key === key) {
        return element.name;
      }
    }
    return null;
  }

  callbackGridDealerVersionTypes(params) {
    this.loadingService.setDisplay(true);
    this.dealerVersionTypeService.getAll().subscribe(dealerVersionTypes => {
      this.dealerVersionTypes = dealerVersionTypes;
      params.api.setRowData(dealerVersionTypes);
      this.loadingService.setDisplay(false);
    });
    this.dealerOrderConfigParams = params;
  }

  refreshList() {
    this.callbackGridDealerVersionTypes(this.dealerOrderConfigParams);
    this.selectedDealerVersionType = undefined;
  }

  getParamsDealerVersionType() {
    const selectedDealerOrderConfig = this.dealerOrderConfigParams.api.getSelectedRows();
    if (selectedDealerOrderConfig) {
      this.selectedDealerVersionType = selectedDealerOrderConfig[0];
    }
  }

  updateDealerVersionType() {
    if (this.selectedDealerVersionType) {
      this.dealerVersionTypeModal.open(this.selectedDealerVersionType);
    } else {
      this.swalAlertService.openWarningForceSelectData();
    }
  }

  deleteDealerVersionType() {
    this.confirmationService.openConfirmModal('Are you sure?', 'Do you want to delete this data?')
      .subscribe(() => {
        this.loadingService.setDisplay(true);
        this.dealerVersionTypeService.deleteDealerVersionType(this.selectedDealerVersionType.id).subscribe(() => {
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
