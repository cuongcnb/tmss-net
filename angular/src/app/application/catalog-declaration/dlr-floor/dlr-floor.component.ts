import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { DlrFloorModel } from '../../../core/models/catalog-declaration/dlr-floor.model';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { DlrFloorApi } from '../../../api/master-data/catalog-declaration/dlr-floor.api';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dlr-floor',
  templateUrl: './dlr-floor.component.html',
  styleUrls: ['./dlr-floor.component.scss'],
})
export class DlrFloorComponent extends AppComponentBase implements OnInit {
  @ViewChild('updateFloorModal', { static: false }) modal;
  // currentUser = CurrentUser;
  gridField;
  gridParams;
  floors: Array<DlrFloorModel>;
  selectedData: DlrFloorModel;
  constructor(
    injector: Injector,
    private swalAlertService: ToastService,
    private loadingService: LoadingService,
    private dlrFloorApi: DlrFloorApi,
    private confirm: ConfirmService,
  ) {
    super(injector);
    this.gridField = [
      { headerName: 'Tên tầng', headerTooltip: 'Tên tầng', field: 'floorName' },
      { headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'description' },
      {
        headerName: 'Trạng thái',
        headerTooltip: 'Trạng thái',
        field: 'status',
        cellRenderer: params => params.data.status === 'Y' ? `Còn hiệu lực` : 'Hết hiệu lực',
      },
      {
        headerName: 'Loại CV',
        headerTooltip: 'Loại công việc',
        field: 'type',
        cellRenderer: (params) => {
          if (params.data.type === '1') {
            return 'GJ + MA';
          }
          if (params.data.type === '2') {
            return 'BP';
          }
        },
      },
    ];
  }

  ngOnInit() {
  }

  refresh() {
    this.selectedData = undefined;
    this.callbackGrid(this.gridParams);
  }

  callbackGrid(params) {
    params.api.setRowData();
    this.gridParams = params;
    this.loadingService.setDisplay(true);
    this.dlrFloorApi.getByCurrentDealer(true).subscribe(res => {
      this.floors = res || [];
      params.api.setRowData(this.floors);
      this.loadingService.setDisplay(false);
    });
  }

  getParams() {
    const selected = this.gridParams.api.getSelectedRows();
    if (selected) {
      this.selectedData = selected[0];
    }
  }

  update() {
    this.selectedData
      ? this.modal.open(this.selectedData)
      : this.swalAlertService.openWarningToast('Chưa chọn dữ liệu, hãy chọn ít nhất một dòng');
  }

  delete() {
    this.selectedData
      ? this.confirm.openConfirmModal('Bạn có muốn xóa bản ghi này?').subscribe(() => {
        this.loadingService.setDisplay(true);
        this.dlrFloorApi.remove(this.selectedData.id).subscribe(() => {
          this.loadingService.setDisplay(false);
          this.refresh();
          this.swalAlertService.openSuccessToast();
        });
      })
      : this.swalAlertService.openWarningToast('Chưa chọn dữ liệu, hãy chọn ít nhất một dòng');
  }
}
