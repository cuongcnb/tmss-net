import { Component, ViewChild } from '@angular/core';
import { LoadingService } from '../../../shared/loading/loading.service';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { ProvincesModel } from '../../../core/models/sales/provinces.model';
import { ProvinceApi } from '../../../api/sales-api/province/province.api';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'provinces',
  templateUrl: './provinces.component.html',
  styleUrls: ['./provinces.component.scss']
})
export class ProvincesComponent {
  @ViewChild('provincesModal', {static: false}) provincesModal;

  provinces: Array<ProvincesModel>;
  fieldGrid;
  provinceParams;
  selectedProvince: ProvincesModel;

  constructor(
    private provinceApi: ProvinceApi,
    private loadingService: LoadingService,
    private swalAlertService: ToastService
  ) {
    this.fieldGrid = [
      {headerName: 'Mã', headerTooltip: 'Mã', field: 'code'},
      {headerName: 'Tên', headerTooltip: 'Tên', field: 'name'},
      {headerName: 'Số dân', headerTooltip: 'Số dân', field: 'populationAmount', cellClass: ['cell-border', 'cell-readonly', 'text-right']},
      {headerName: 'Diện tích', headerTooltip: 'Diện tích', field: 'squareAmount', cellClass: ['cell-border', 'cell-readonly', 'text-right']},
      {headerName: 'Thứ tự', headerTooltip: 'Thứ tự', field: 'ordering', cellClass: ['cell-border', 'cell-readonly', 'text-right']},
      {
        headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'status',
        cellRenderer: params => `${params.value === 'Y' ? 'Còn hiệu lực' : 'Hết hiệu lực'}`
      },
      {headerName: 'Khu vực', headerTooltip: 'Khu vực', field: 'region'},
    ];
  }

  callbackGridProvinces(params) {
    this.loadingService.setDisplay(true);
    this.provinceApi.getAllProvinces().subscribe(provinces => {
      this.provinces = provinces;
      params.api.setRowData(provinces);
      this.loadingService.setDisplay(false);
    });
    this.provinceParams = params;
  }

  refreshList() {
    this.callbackGridProvinces(this.provinceParams);
    this.selectedProvince = undefined;
  }

  getParamsProvince() {
    const selectedProvince = this.provinceParams.api.getSelectedRows();
    if (selectedProvince) {
      this.selectedProvince = selectedProvince[0];
    }
  }

  updateProvince() {
    if (this.selectedProvince) {
      this.provincesModal.open(this.selectedProvince);
    } else {
      this.swalAlertService.openWarningToast('Chọn 1 dòng để cập nhật');
    }
  }

}
