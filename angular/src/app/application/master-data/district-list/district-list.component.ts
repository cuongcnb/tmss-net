import { Component, ViewChild } from '@angular/core';
import { DistrictListService} from '../../../api/master-data/district-list.service';
import { DistrictOfProvinceModel} from '../../../core/models/sales/district-list.model';
import { ProvincesModel} from '../../../core/models/sales/provinces.model';
import { ProvincesService} from '../../../api/master-data/provinces.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { ToastService } from '../../../shared/common-service/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'district-list',
  templateUrl: './district-list.component.html',
  styleUrls: ['./district-list.component.scss']
})
export class DistrictListComponent {
  @ViewChild('districtListModal', {static: false}) districtListModal;
  provinces: Array<ProvincesModel>;
  districts: Array<DistrictOfProvinceModel>;
  fieldGridProvince;
  fieldGridDistrict;
  provinceParams;
  districtParams;
  selectedProvince: ProvincesModel;
  selectedDistrict: DistrictOfProvinceModel;

  constructor(
    private districtListService: DistrictListService,
    private provincesService: ProvincesService,
    private loadingService: LoadingService,
    private confirmationService: ConfirmService,
    private swalAlertService: ToastService,
  ) {
    this.fieldGridProvince = [
      {field: 'code', resizable: true},
      {field: 'name', resizable: true},
      {headerName: 'Region', field: 'region', resizable: true},
    ];
    this.fieldGridDistrict = [
      {field: 'code', resizable: true},
      {field: 'name', resizable: true},
      {
        field: 'ordering',
        cellClass: ['cell-border', 'text-right'],
        filter: 'agNumberColumnFilter',
        resizable: true
      },
      {field: 'description', resizable: true},
      {
        field: 'status',
        cellRenderer: params => {
          return `${params.value === 'Y' ? 'Enable' : 'Disable'}`;
        },
        resizable: true
      },
    ];
  }

  callbackGridProvince(params) {
    this.loadingService.setDisplay(true);
    this.provincesService.getAllAvailableProvinces().subscribe(provinces => {
      this.provinces = provinces;
      params.api.setRowData(provinces);
      this.loadingService.setDisplay(false);
    });
    this.provinceParams = params;
  }

  getParamsProvince() {
    const selectedProvince = this.provinceParams.api.getSelectedRows();
    this.selectedDistrict = undefined;
    this.loadingService.setDisplay(true);
    if (selectedProvince) {
      this.selectedProvince = selectedProvince[0];
      this.districtListService.getDistrictOfProvince(this.selectedProvince.id).subscribe(districts => {
        this.districts = districts;
        this.districtParams.api.setRowData(this.districts);
      });
      // this.refreshDistrictList();
      this.loadingService.setDisplay(false);
    }
  }

  refreshProvinceList() {
    this.selectedProvince = undefined;
    this.selectedDistrict = undefined;
    this.districtParams.api.setRowData();
    this.callbackGridProvince(this.provinceParams);
  }

  getParamsDistrict() {
    const selectedDistrict = this.districtParams.api.getSelectedRows();
    if (selectedDistrict) {
      this.selectedDistrict = selectedDistrict[0];
    }
  }

  callbackGridDistrict(params) {
    this.districtParams = params;
  }

  refreshDistrictList() {
    this.districtListService.getDistrictOfProvince(this.selectedProvince.id).subscribe(districts => {
      this.districts = districts;
      this.districtParams.api.setRowData(this.districts);
    });
    this.selectedDistrict = undefined;
  }

  updateDistrict() {
    if (this.selectedDistrict) {
      this.districtListModal.open(this.selectedProvince.id, this.selectedDistrict);
    } else {
      this.swalAlertService.openWarningForceSelectData('You haven\'t selected any District, please select one to update', 'Select a District to update');
    }
  }

  addDistrict() {
    if (this.selectedProvince) {
      this.districtListModal.open(this.selectedProvince.id);
    } else {
      this.swalAlertService.openWarningForceSelectData('You haven\'t selected any Province, please select one to add District to it', 'Select a row to update');
    }
  }

  deleteDistrict() {
    this.confirmationService.openConfirmModal('Are you sure?', 'Do you want to delete this data?')
      .subscribe(() => {
        this.loadingService.setDisplay(true);
        this.districtListService.deleteDistrict(this.selectedDistrict.id).subscribe(() => {
          this.refreshDistrictList();
          this.loadingService.setDisplay(false);
          this.swalAlertService.openSuccessModal();
        });
      });
  }
}
