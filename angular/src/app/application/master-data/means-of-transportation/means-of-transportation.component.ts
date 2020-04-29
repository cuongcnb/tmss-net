import { Component, ViewChild } from '@angular/core';
import { MeansOfTransportationService} from '../../../api/master-data/means-of-transportation.service';
import { LoadingService} from '../../../shared/loading/loading.service';
import { TransportTypeService} from '../../../api/master-data/transport-type.service';
import { ToastService } from '../../../shared/common-service/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'means-of-transportation',
  templateUrl: './means-of-transportation.component.html',
  styleUrls: ['./means-of-transportation.component.scss']
})
export class MeansOfTransportationComponent {
  @ViewChild('transportationListModal', {static: false}) transportationListModal;
  @ViewChild('transportationTypeListModal', {static: false}) transportationTypeListModal;

  fieldGridTrans;
  fieldGridTransType;
  means;
  transTypes;
  selectedMeans;
  selectedTransType;
  transParams;
  transTypeParams;

  constructor(
    private meansOfTransportationService: MeansOfTransportationService,
    private transportTypeService: TransportTypeService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private confirmationService: ConfirmService,
  ) {
    this.fieldGridTrans = [
      {headerName: 'Transport Name', field: 'name', minWidth: 200},
      {
        field: 'description',
        cellClass: ['cell-border', 'cell-wrap-text'],
        autoHeight: true,
        minWidth: 300
      },
    ];
    this.fieldGridTransType = [
      {headerName: 'Transport Type', field: 'name', minWidth: 300},
      {
        field: 'status',
        valueFormatter: params => {
          return `${params.value === 'Y' ? 'Enable' : 'Disable'}`;
        }
      },
      {
        field: 'description',
        cellClass: ['cell-border', 'cell-wrap-text'],
        autoHeight: true,
        minWidth: 300
      }
    ];
  }

  callbackGridTrans(params) {
    this.loadingService.setDisplay(true);
    this.meansOfTransportationService.getTransportMean().subscribe(means => {
      this.means = means;
      params.api.setRowData(this.means);
      this.loadingService.setDisplay(false);
    });
    this.transParams = params;
  }

  getParamsTrans() {
    const selectedMeans = this.transParams.api.getSelectedRows();
    this.selectedTransType = undefined;
    if (selectedMeans) {
      this.selectedMeans = selectedMeans[0];
      this.refreshTransType();
    }
  }

  refreshTrans() {
    this.selectedMeans = undefined;
    this.selectedTransType = undefined;
    this.transTypeParams.api.setRowData();
    this.callbackGridTrans(this.transParams);
  }

  callbackGridTransType(params) {
    this.transTypeParams = params;
  }

  getParamsTransType() {
    const selectedTransType = this.transTypeParams.api.getSelectedRows();
    if (selectedTransType) {
      this.selectedTransType = selectedTransType[0];
    }
  }

  refreshTransType() {
    this.transportTypeService.getTransportType(this.selectedMeans.id).subscribe(transTypes => {
      this.transTypes = transTypes;
      this.transTypeParams.api.setRowData(this.transTypes);
    });
    this.selectedTransType = undefined;
  }

  updateTransportationData() {
    if (this.selectedMeans) {
      this.transportationListModal.open(this.selectedMeans);
    } else {
      this.swalAlertService.openWarningForceSelectData('You haven\'t selected any row, please select one', 'Select a Mean of Transport');
    }
  }

  deleteTransportation() {
    this.confirmationService.openConfirmModal('Are you sure?', 'Do you want to delete this data?')
      .subscribe(() => {
        this.loadingService.setDisplay(true);
        this.meansOfTransportationService.deleteTransportMean(this.selectedMeans.id).subscribe(() => {
          this.refreshTrans();
          this.loadingService.setDisplay(false);
          this.swalAlertService.openSuccessModal();
        });
      });
  }

  addTransportationTypeData() {
    if (this.selectedMeans) {
      this.transportationTypeListModal.open(this.selectedMeans.id);
    } else {
      this.swalAlertService.openWarningForceSelectData('You haven\'t selected any row, please select one', 'Select a Mean of Transport');

    }
  }

  updateTransportationTypeData() {
    if (this.selectedTransType) {
      this.transportationTypeListModal.open(this.selectedMeans.id, this.selectedTransType);
    } else {
      this.swalAlertService.openWarningForceSelectData('You haven\'t selected any row, please select one to update', 'Select a Transport Type');

    }
  }

  deleteTransportationType() {
    this.confirmationService.openConfirmModal('Are you sure?', 'Do you want to delete this data?')
      .subscribe(() => {
        this.loadingService.setDisplay(true);
        this.transportTypeService.deleteTransportType(this.selectedTransType.id).subscribe(() => {
          this.refreshTransType();
          this.loadingService.setDisplay(false);
          this.swalAlertService.openSuccessModal();
        });
      });
  }
}
