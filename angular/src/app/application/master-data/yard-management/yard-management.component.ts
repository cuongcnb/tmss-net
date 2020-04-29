import { Component, OnInit, ViewChild } from '@angular/core';
import { YardManagementService} from '../../../api/master-data/yard-management.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { ToastService } from '../../../shared/common-service/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'yard-management',
  templateUrl: './yard-management.component.html',
  styleUrls: ['./yard-management.component.scss']
})
export class YardManagementComponent implements OnInit {
  @ViewChild('yardModifyModal', {static: false}) yardModifyModal;

  fieldGrid;
  gridParamsYard;
  selectedYard;
  yards;

  constructor(
    private yardManagementService: YardManagementService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private confirmationService: ConfirmService,
  ) {
    this.fieldGrid = [
      {field: 'code', minWidth: 100},
      {field: 'name', minWidth: 120},
      {
        field: 'address', cellClass: ['cell-border', 'cell-wrap-text'],
        autoHeight: true, minWidth: 200
      },
      {
        field: 'ordering', minWidth: 70,
        cellClass: ['cell-border', 'text-right'],
        filter: 'agNumberColumnFilter',
      },
      {headerName: 'Yard-Location', field: 'yardLocation', minWidth: 100},
      {
        field: 'status', minWidth: 100, cellRenderer: params => {
          return `${params.value === 'Y' ? 'Enable' : 'Disable'}`;
        },
      },
      {
        field: 'description', minWidth: 200,
        cellClass: ['cell-border', 'cell-wrap-text'],
        autoHeight: true,
      },
    ];
  }

  ngOnInit() {
  }

  callbackGridYard(params) {
    this.loadingService.setDisplay(true);
    this.yardManagementService.getYards().subscribe(yards => {
      this.yards = yards;
      params.api.setRowData(this.yards);
      this.loadingService.setDisplay(false);
    });
    this.gridParamsYard = params;
  }

  refreshList() {
    this.selectedYard = undefined;
    this.callbackGridYard(this.gridParamsYard);
  }

  getParamsYard() {
    const selectedYard = this.gridParamsYard.api.getSelectedRows();
    if (selectedYard) {
      this.selectedYard = selectedYard[0];
    }
  }

  updateYard() {
    if (this.selectedYard) {
      this.yardModifyModal.open(this.selectedYard);
    } else {
      this.swalAlertService.openWarningForceSelectData();
    }
  }

  deleteYard() {
    this.confirmationService.openConfirmModal('Are you sure?', 'Do you want to delete this data?')
      .subscribe(() => {
        this.loadingService.setDisplay(true);
        this.yardManagementService.deleteYard(this.selectedYard.id).subscribe(() => {
          this.refreshList();
          this.loadingService.setDisplay(false);
          this.swalAlertService.openSuccessModal();
        });
      });
  }
}
