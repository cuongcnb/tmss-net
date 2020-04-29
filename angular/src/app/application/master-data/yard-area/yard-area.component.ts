import { Component, OnInit, ViewChild } from '@angular/core';
import { YardManagementService} from '../../../api/master-data/yard-management.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { YardAreaService} from '../../../api/master-data/yard-area.service';
import { ToastService } from '../../../shared/common-service/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'yard-area',
  templateUrl: './yard-area.component.html',
  styleUrls: ['./yard-area.component.scss']
})
export class YardAreaComponent implements OnInit {
  @ViewChild('yardRegionModal', {static: false}) yardRegionModal;
  fieldGridYard;
  fieldGridRegion;
  yards;
  yardAreas;
  yardParams;
  regionParams;
  selectedYard;
  selectedRegion;

  constructor(
    private yardAreaService: YardAreaService,
    private yardManagementService: YardManagementService,
    private loadingService: LoadingService,
    private confirmationService: ConfirmService,
    private swalAlertService: ToastService,
  ) {
    this.fieldGridYard = [
      {field: 'code'},
      {field: 'name'}
    ];
    this.fieldGridRegion = [
      {field: 'name', minWidth: 160},
      {
        field: 'status',
        cellRenderer: params => {
          return `${params.value === 'Y' ? 'Enable' : 'Disable'}`;
        }
      },
      {field: 'description', minWidth: 180}
    ];
  }

  ngOnInit() {
  }

  callbackGridYard(params) {
    this.loadingService.setDisplay(true);
    this.yardManagementService.getAvailableYards().subscribe(yards => {
      this.yards = yards;
      params.api.setRowData(this.yards);
      this.loadingService.setDisplay(false);
    });
    this.yardParams = params;
  }

  getParamsYard() {
    const selectedYard = this.yardParams.api.getSelectedRows();
    this.selectedRegion = undefined;
    if (selectedYard) {
      this.selectedYard = selectedYard[0];
      this.refreshRegion();
    }
  }

  refreshYard() {
    this.selectedYard = undefined;
    this.selectedRegion = undefined;
    this.regionParams.api.setRowData();
    this.callbackGridYard(this.yardParams);
  }

  callbackGridRegion(params) {
    this.regionParams = params;
  }

  getParamsRegion() {
    const selectedRegion = this.regionParams.api.getSelectedRows();
    if (selectedRegion) {
      this.selectedRegion = selectedRegion[0];
    }
  }

  refreshRegion() {
    this.yardAreaService.getYardArea(this.selectedYard.id).subscribe(yardAreas => {
      this.yardAreas = yardAreas;
      this.regionParams.api.setRowData(this.yardAreas);
    });
    this.selectedRegion = undefined;
  }

  updateRegionData() {
    this.selectedRegion ?
      this.yardRegionModal.open(this.selectedYard.id, this.selectedRegion)
      : this.swalAlertService.openWarningModal('You haven\'t selected any Region, please select one to update', 'Select a Region');

  }

  addRegion() {
    this.selectedYard ?
      this.yardRegionModal.open(this.selectedYard.id)
      : this.swalAlertService.openWarningModal('You haven\'t selected any Yard, please select one to add Region to it', 'Select a Yard');

  }

  deleteRegionData() {
    this.confirmationService.openConfirmModal('Are you sure?', 'Do you want to delete this data?')
      .subscribe(() => {
        this.loadingService.setDisplay(true);
        this.yardAreaService.deleteYardArea(this.selectedRegion.id).subscribe(() => {
          this.refreshRegion();
          this.loadingService.setDisplay(false);
          this.swalAlertService.openSuccessModal();
        });
      });
  }
}
