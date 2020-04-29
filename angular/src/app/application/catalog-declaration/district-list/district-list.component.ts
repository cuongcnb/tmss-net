import { Component, ViewChild } from '@angular/core';
import { LoadingService } from '../../../shared/loading/loading.service';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { ProvincesModel } from '../../../core/models/sales/provinces.model';
import { DistrictOfProvinceModel } from '../../../core/models/sales/district-list.model';
import { DistrictApi } from '../../../api/sales-api/district/district.api';
import { ProvinceApi } from '../../../api/sales-api/province/province.api';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'district-list',
  templateUrl: './district-list.component.html',
  styleUrls: ['./district-list.component.scss'],
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
    private districtApi: DistrictApi,
    private provinceApi: ProvinceApi,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private confirmService: ConfirmService,
  ) {
    this.fieldGridProvince = [
      {field: 'code', maxWidth: 150},
      {field: 'name', minWidth: 250},
      {headerName: 'Region', headerTooltip: 'Region', field: 'region', minWidth: 100},
    ];
    this.fieldGridDistrict = [
      {field: 'code', maxWidth: 150},
      {field: 'name', minWidth: 200},
      {
        field: 'ordering',
        cellClass: ['cell-border', 'text-right'],
        filter: 'agNumberColumnFilter',
      },
      {field: 'description', minWidth: 250},
      {
        field: 'status',
        cellRenderer: params => `${params.value === 'Y' ? 'Enable' : 'Disable'}`,
      },
    ];
  }

  callbackGridProvince(params) {
    this.loadingService.setDisplay(true);
    this.provinceApi.getAllAvailableProvince().subscribe(provinces => {
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
      this.districtApi.getDistrictOfProvince(this.selectedProvince.id).subscribe(districts => {
        this.districts = districts;
        this.districtParams.api.setRowData(this.districts);
      });
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
    this.districtApi.getDistrictOfProvince(this.selectedProvince.id).subscribe(districts => {
      this.districts = districts;
      this.districtParams.api.setRowData(this.districts);
    });
    this.selectedDistrict = undefined;
  }

  updateDistrict() {
    if (this.selectedDistrict) {
      this.districtListModal.open(this.selectedProvince.id, this.selectedDistrict);
    } else {
      this.swalAlertService.openWarningToast('Chọn 1 dòng để cập nhật');
    }
  }

  addDistrict() {
    if (this.selectedProvince) {
      this.districtListModal.open(this.selectedProvince.id);
    } else {
      this.swalAlertService.openWarningToast('Bạn phải chọn 1 tỉnh thành để thêm mới quận huyện');
    }
  }
}
