import {Component, OnInit, ViewChild} from '@angular/core';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {SalesGroupService} from '../../../../api/dlr-master-data/sales-group.service';
import {StorageKeys} from '../../../../core/constains/storageKeys';
import {FormStoringService} from '../../../../shared/common-service/form-storing.service';
import {SalesTeamSevice} from '../../../../api/dlr-master-data/sales-team.sevice';
import {ToastService} from '../../../../shared/common-service/toast.service';
import {ConfirmService} from '../../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sales-group',
  templateUrl: './sales-group.component.html',
  styleUrls: ['./sales-group.component.scss']
})
export class SalesGroupComponent implements OnInit {
  @ViewChild('salesGroupModal', {static: false}) salesGroupModal;
  @ViewChild('salesTeamModal', {static: false}) salesTeamModal;
  group;
  team;
  fieldGridGroup;
  fieldGridTeam;
  salesGroupParams;
  salesTeamParams;
  selectedGroup;
  selectedTeam;
  salesData;

  constructor(
    private salesGroupService: SalesGroupService,
    private salesTeamService: SalesTeamSevice,
    private formStoringService: FormStoringService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private confirmationService: ConfirmService,
  ) {
    this.fieldGridGroup = [
      {
        field: 'groupName'
      },
      {
        field: 'reportName'
      },
      {
        field: 'ordering',
        cellClass: ['cell-border', 'text-right']
      },
      {
        field: 'status',
        valueFormatter: params => {
          return `${params.value === 'Y' ? 'Enable' : 'Disable'}`;
        }
      },
      {
        field: 'managerName'
      },
      {
        field: 'description',
        autoHeight: true,
        minWidth: 300
      },
    ];
    this.fieldGridTeam = [
      {
        field: 'teamName'
      },
      {
        field: 'reportName'
      },
      {
        field: 'ordering',
        cellClass: ['cell-border', 'text-right']
      },
      {
        field: 'status',
        valueFormatter: params => {
          return `${params.value === 'Y' ? 'Enable' : 'Disable'}`;
        }
      },
      {
        field: 'managerName'
      },
      {
        field: 'description',
        autoHeight: true,
        minWidth: 300
      },
    ];
  }

  ngOnInit() {
  }

  callbackGridGroup(params) {
    this.salesGroupParams = params;
    this.getSalesGroupByDealerId();
  }

  getSalesGroupByDealerId() {
    this.loadingService.setDisplay(true);
    const dealerId = this.formStoringService.get(StorageKeys.currentUser).dealerId;
    this.salesGroupService.getSalesGroup(dealerId).subscribe(salesGroupData => {
      this.salesGroupParams.api.setRowData(salesGroupData);
      this.loadingService.setDisplay(false);
    });
  }

  getParamsGroup() {
    const selectedData = this.salesGroupParams.api.getSelectedRows();
    this.selectedTeam = undefined;
    if (selectedData) {
      this.selectedGroup = selectedData[0];
      this.getSalesTeamData();
    }
  }

  refreshGroupList() {
    this.selectedGroup = undefined;
    this.selectedTeam = undefined;
    this.salesTeamParams.api.setRowData();
    this.getSalesGroupByDealerId();
  }

  callbackGridTeam(params) {
    this.salesTeamParams = params;
  }

  getParamsTeam() {
    const selectedDistrict = this.salesTeamParams.api.getSelectedRows();
    if (selectedDistrict) {
      this.selectedTeam = selectedDistrict[0];
    }
  }

  getSalesTeamData() {
    this.salesTeamService.getSalesTeam(this.selectedGroup.id).subscribe(salesTeamData => {
      this.salesData = salesTeamData;
      this.salesTeamParams.api.setRowData(salesTeamData);
    });
  }

  refreshTeamList() {
    this.selectedTeam = undefined;
    this.getSalesTeamData();
  }

  updateGroup() {
    if (this.selectedGroup) {
      this.salesGroupModal.open(this.selectedGroup.id, this.selectedGroup);
    } else {
      this.swalAlertService.openWarningForceSelectData('You haven\'t selected any Sales Group, please select one row', 'Select a row');
    }
  }

  deleteGroup() {
    this.confirmationService.openConfirmModal('Are you sure', 'Do you want to delete this data?')
      .subscribe(() => {
        this.loadingService.setDisplay(true);
        this.salesGroupService.deleteSaleGroup(this.selectedGroup.id).subscribe(() => {
          this.refreshGroupList();
          this.loadingService.setDisplay(false);
          this.swalAlertService.openSuccessModal();
        });
      });
  }

  updateTeam() {
    if (this.selectedTeam) {
      this.salesTeamModal.open(this.selectedGroup.id, this.selectedTeam);
    } else {
      this.swalAlertService.openWarningForceSelectData('You haven\'t selected any Sales Team, please select one to Update', 'Select a row to update');

    }
  }

  addTeam() {
    if (this.selectedGroup) {
      this.salesTeamModal.open(this.selectedGroup.id);
    } else {
      this.swalAlertService.openWarningForceSelectData('You haven\'t selected any Sales Group, please select one row', 'Select a row');
    }
  }

  deleteTeam() {
    this.confirmationService.openConfirmModal('Are you sure', 'Do you want to delete this data?')
      .subscribe(() => {
        this.loadingService.setDisplay(true);
        this.salesTeamService.deleteSaleTeam(this.selectedTeam.id).subscribe(() => {
          this.refreshTeamList();
          this.loadingService.setDisplay(false);
          this.swalAlertService.openSuccessModal();
        });
      });
  }
}
