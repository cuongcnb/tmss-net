import { Component, ViewChild } from '@angular/core';
import { DealerGroupService} from '../../../api/master-data/dealer-group.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { ToastService } from '../../../shared/common-service/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dealer-group',
  templateUrl: './dealer-group.component.html',
  styleUrls: ['./dealer-group.component.scss']
})
export class DealerGroupComponent {
  @ViewChild('dealerGroupModal', {static: false}) dealerGroupModal;

  fieldGrid;
  gridParamDealerGroup;
  selectedDealerGroup;

  constructor(
    private dealerGroupService: DealerGroupService,
    private confirmationService: ConfirmService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
  ) {
    this.fieldGrid = [
      {
        field: 'groupsName',
        minWidth: 170
      },
      {
        field: 'description',
        cellClass: ['cell-border', 'cell-wrap-text'],
        autoHeight: true,
        minWidth: 350
      },
      {
        field: 'status',
        cellRenderer: params => {
          return `${params.value === 'Y' ? 'Enable' : 'Disable'}`;
        }
      },
      {
        headerName: 'Order',
        field: 'ordering',
        cellClass: ['cell-border', 'text-right'],
        filter: 'agNumberColumnFilter'
      },
    ];
  }

  callbackGridDealerGroups(params) {
    this.loadingService.setDisplay(true);
    this.dealerGroupService.getDealerGroupTable().subscribe(dealerGroup => {
      params.api.setRowData(dealerGroup);
      this.loadingService.setDisplay(false);
    });
    this.gridParamDealerGroup = params;
  }

  refreshList() {
    this.callbackGridDealerGroups(this.gridParamDealerGroup);
    this.selectedDealerGroup = undefined;
  }

  getParamsDealerGroup() {
    const selectedDealerGroup = this.gridParamDealerGroup.api.getSelectedRows();
    if (selectedDealerGroup) {
      this.selectedDealerGroup = selectedDealerGroup[0];
    }
  }

  updateDealerGroup() {
    if (this.selectedDealerGroup) {
      this.dealerGroupModal.open(this.selectedDealerGroup);
    } else {
      this.swalAlertService.openWarningForceSelectData();
    }
  }

  deleteDealerGroup() {
    this.confirmationService.openConfirmModal('Are you sure?', 'Do you want to delete this data?').subscribe(() => {
      this.loadingService.setDisplay(true);
      this.dealerGroupService.deleteDealerGroup(this.selectedDealerGroup.id).subscribe(() => {
        this.refreshList();
        this.loadingService.setDisplay(false);
        this.swalAlertService.openSuccessModal();
      });
    });
  }
}
