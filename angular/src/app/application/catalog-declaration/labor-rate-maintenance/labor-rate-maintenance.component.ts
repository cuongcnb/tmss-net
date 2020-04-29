import { Component, ViewChild, OnInit } from '@angular/core';

import { LoadingService } from '../../../shared/loading/loading.service';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';
import { LaborRateMaintenanceApi } from '../../../api/common-api/labor-rate-maintenance.api';
import { LaborrateModel } from '../../../core/models/common-models/laborrate-model';
import { DealerModel } from '../../../core/models/sales/dealer.model';
import { DealerApi } from '../../../api/sales-api/dealer/dealer.api';

@Component({
  selector: 'app-labor-rate-maintenance',
  templateUrl: './labor-rate-maintenance.component.html',
  styleUrls: ['./labor-rate-maintenance.component.scss']
})
export class LaborRateMaintenanceComponent implements OnInit {

  @ViewChild('laborRateMaintenanceModal', {static: false}) laborRateMaintenanceModal;
  fieldGrid;
  laborrateParams;
    dealers: Array<DealerModel>;
  selectedLaborrate: LaborrateModel;

  constructor(
    private laborRateMaintenanceApi: LaborRateMaintenanceApi,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private confirmService: ConfirmService,
    private dealerApi: DealerApi
  ) {
    this.fieldGrid = [
      {headerName: 'Dealer Code', headerTooltip: 'Dealer Code', field: 'dealercode'},
      {headerName: 'VN Name', headerTooltip: 'VN Name', field: 'vnName'},
      {headerName: 'Labor Rate', headerTooltip: 'Labor Rate', field: 'laborRate', cellClass: ['cell-border', 'text-right', 'cell-readonly']},
      {headerName: 'Description', headerTooltip: 'Description', field: 'descvn'},
      {headerName: 'PWRDLR', headerTooltip: 'PWRDLR', field: 'pwrdlr', cellClass: ['cell-border', 'text-right', 'cell-readonly']},
      {headerName: 'PRRDLR', headerTooltip: 'PRRDLR', field: 'prr', cellClass: ['cell-border', 'text-right', 'cell-readonly']},
      {headerName: 'FREEPM', headerTooltip: 'FREEPM', field: 'freePm', cellClass: ['cell-border', 'text-right', 'cell-readonly']},
    ];
  }

  ngOnInit() {
    this.getDealers();
  }

  callbackGridBank(params) {
    this.laborrateParams = params;
    this.getBanks();
  }

  refreshList() {
    this.selectedLaborrate = undefined;
    this.getBanks();
  }

  getParamsBank() {
    const selectedLaborrate = this.laborrateParams.api.getSelectedRows();
    if (selectedLaborrate) {
      this.selectedLaborrate = selectedLaborrate[0];
    }
  }

  updateLaborRate() {
    this.selectedLaborrate
      ? this.laborRateMaintenanceModal.open(this.selectedLaborrate)
      : this.swalAlertService.openWarningToast('Chưa chọn dữ liệu, hãy chọn ít nhất một dòng');
  }

  deleteLaborRate() {
    if (this.selectedLaborrate) {
      this.confirmService.openConfirmModal('Bạn có muốn xóa bản ghi này?')
        .subscribe(() => {
          this.loadingService.setDisplay(true);
          this.laborRateMaintenanceApi.remove(this.selectedLaborrate.id).subscribe(() => {
            this.loadingService.setDisplay(false);
            this.refreshList();
            this.swalAlertService.openSuccessToast();
          });
        });
    } else {
      this.swalAlertService.openWarningToast('Chưa chọn dữ liệu, hãy chọn ít nhất một dòng');
    }
  }

  get btnDeleteState() {
    return this.selectedLaborrate ? null : true;
  }

  private getBanks() {
    this.loadingService.setDisplay(true);
    this.laborRateMaintenanceApi.getAll().subscribe(laborRateMaintenance => {
      this.laborrateParams.api.setRowData(laborRateMaintenance);
      this.loadingService.setDisplay(false);
    });
  }

  private getDealers() {
    this.loadingService.setDisplay(true);
    this.dealerApi.getAllAvailableDealers()
      .subscribe(dealers => {
        this.dealers = dealers.filter(dealer => dealer.code !== 'TOTAL') || [];
        this.loadingService.setDisplay(false);
      });
  }

}
