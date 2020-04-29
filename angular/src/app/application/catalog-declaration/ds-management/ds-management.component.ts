import {Component, OnInit, ViewChild} from '@angular/core';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {LoadingService} from '../../../shared/loading/loading.service';
import {ConfirmService} from '../../../shared/confirmation/confirm.service';
import {McopperPaintApi} from '../../../api/common-api/mcopper-paint.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ds-management',
  templateUrl: './ds-management.component.html',
  styleUrls: ['./ds-management.component.scss']
})
export class DsManagementComponent implements OnInit {

  @ViewChild('dsModal', {static: false}) dsModal;
  fieldGrid;
  dsParams;
  selected;

  constructor(
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private confirmService: ConfirmService,
    private mcopperPaintApi: McopperPaintApi
  ) {
    this.fieldGrid = [
      {headerName: 'Tên', headerTooltip: 'Tên', field: 'name'},
      {headerName: 'Mã màu', headerTooltip: 'Mã màu', field: 'color',
      cellRenderer: params => `<input disabled type="color" value="${params.value}"  /> ${params.value}`
      },
      {
        headerName: 'Hiệu lực', headerTooltip: 'Hiệu lực', field: 'status',
        cellRenderer: params => (params && params.value === 'Y') ? 'Còn hiệu lực' : 'Hết hiệu lực'
      },
      {headerName: 'Thứ tự', headerTooltip: 'Thứ tự', field: 'ordering'},
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'description'},
    ];
  }

  ngOnInit() {

  }

  callbackGrid(params) {
    this.dsParams = params;
    this.getListDs();
  }

  refreshList() {
    this.selected = undefined;
    this.getListDs();
  }

  getParams() {
    const selected = this.dsParams.api.getSelectedRows();
    if (selected) {
      this.selected = selected[0];
    }
  }

  updateDs() {
    this.selected
      ? this.dsModal.open(this.selected)
      : this.swalAlertService.openWarningToast('Chưa chọn dữ liệu, hãy chọn ít nhất một dòng');
  }

  private getListDs() {
    this.loadingService.setDisplay(true);
    this.mcopperPaintApi.getListByDealer().subscribe(res => {
      this.dsParams.api.setRowData(res);
      this.loadingService.setDisplay(false);
    });
  }
}
