import { Component, ViewChild } from '@angular/core';
import { YardLocationService} from '../../../api/master-data/yard-location.service';
import { YardManagementService} from '../../../api/master-data/yard-management.service';
import { YardAreaService} from '../../../api/master-data/yard-area.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { ToastService } from '../../../shared/common-service/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'yard-location',
  templateUrl: './yard-location.component.html',
  styleUrls: ['./yard-location.component.scss']
})
export class YardLocationComponent {
  @ViewChild('yardLocationModal', {static: false}) yardLocationModal;
  fieldGridYard;
  fieldGridLocation;
  yardParams;
  locationParams;
  selectedYard;
  selectedLocation;
  yards;
  yardLocations;

  constructor(
    private yardManagementService: YardManagementService,
    private yardLocationService: YardLocationService,
    private yardAreaService: YardAreaService,
    private confirmationService: ConfirmService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
  ) {
    this.fieldGridYard = [
      {field: 'code'},
      {field: 'name'}
    ];

    this.fieldGridLocation = [
      {field: 'code'},
      {
        headerName: 'Row',
        field: 'locationRow'
      },
      {
        field: 'status', cellRenderer: params => {
          return `${params.value === 'Y' ? 'Enable' : 'Disable'}`;
        }
      },
      {
        headerName: 'Column',
        field: 'locationColumn'
      },
      {
        headerName: 'Priority',
        field: 'priority'
      },
      {
        headerName: 'Area',
        field: 'area',
        minWidth: 120
      },
      {field: 'description'},
    ];
  }

  callbackGridYard(params) {
    this.yardParams = params;
    this.yardManagementService.getAvailableYards().subscribe(yards => {
      this.yards = yards;
      this.yardParams.api.setRowData(yards);
    });
  }

  getParamsYard() {
    const selectedYard = this.yardParams.api.getSelectedRows();
    this.selectedLocation = undefined;
    if (selectedYard) {
      this.selectedYard = selectedYard[0];
      this.refreshLocationList();
    }
  }

  refreshYardList() {
    this.selectedYard = undefined;
    this.selectedLocation = undefined;
    this.locationParams.api.setRowData();
    this.callbackGridYard(this.yardParams);
  }

  callbackGridLocation(params) {
    this.locationParams = params;
    if (this.selectedYard) {
      this.loadingService.setDisplay(true);
      this.yardLocationService.getYardLocationTable(this.selectedYard.id).subscribe(yardLocations => {
        this.yardLocations = yardLocations;
        this.locationParams.api.setRowData(yardLocations);
        this.loadingService.setDisplay(false);
      });
    }
  }

  getParamsLocation() {
    const selectedLocation = this.locationParams.api.getSelectedRows();
    if (selectedLocation) {
      this.selectedLocation = selectedLocation[0];
    }
  }

  refreshLocationList() {
    if (this.selectedYard) {
      this.yardLocationService.getYardLocationTable(this.selectedYard.id).subscribe(yardLocations => {
        this.yardLocations = yardLocations;
        this.locationParams.api.setRowData(this.yardLocations);
      });
    }
    this.selectedLocation = undefined;
  }

  updateLocationData() {
    this.selectedLocation ?
      this.yardLocationModal.open(this.selectedYard.id, this.selectedLocation)
      : this.swalAlertService.openWarningForceSelectData('You haven\'t selected any Location, please select one to update', 'Select a Location');
  }

  addLocation() {
    this.selectedYard ?
      this.yardLocationModal.open(this.selectedYard.id)
      : this.swalAlertService.openWarningForceSelectData('You haven\'t selected any Yard, please select one to add Location to it', 'Select a Yard');
  }

  deleteLocation() {
    this.confirmationService.openConfirmModal('Are you sure?', 'Do you want to delete this data?')
      .subscribe(() => {
        this.loadingService.setDisplay(true);
        this.yardLocationService.deleteLocation(this.selectedLocation.id).subscribe(() => {
          this.refreshLocationList();
          this.loadingService.setDisplay(false);
          this.swalAlertService.openSuccessModal();
        });
      });
  }
}
