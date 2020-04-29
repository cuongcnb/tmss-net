import {Component, OnInit, ViewChild} from '@angular/core';
import {ConfirmService} from '../../../shared/confirmation/confirm.service';
import {GridTableService} from '../../../shared/common-service/grid-table.service';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {AgSelectRendererComponent} from '../../../shared/ag-select-renderer/ag-select-renderer.component';
import {AgCheckboxRendererComponent} from '../../../shared/ag-checkbox-renderer/ag-checkbox-renderer.component';
import {SubletTypeMaintenanceApi} from "../../../api/warranty/sublet-type-maintenance.api";
import {LoadingService} from "../../../shared/loading/loading.service";

@Component({
  selector: 'sublet-type-maintenance',
  templateUrl: './sublet-type-maintenance.component.html',
  styleUrls: ['./sublet-type-maintenance.component.scss']
})
export class SubletTypeMaintenanceComponent implements OnInit {

  @ViewChild('updateModal', {static: false}) updateModal;
  gridField;
  params;
  selectedData;
  data;
  paginationParams;
  paginationTotalsData: number;
  frameworkComponents;

  constructor(
    private confirmService: ConfirmService,
    private gridTableService: GridTableService,
    private swalAlertService: ToastService,
    private subletTypeMaintenanceApi: SubletTypeMaintenanceApi,
    private loadingService: LoadingService
  ) {
    this.frameworkComponents = {
      agSelectRendererComponent: AgSelectRendererComponent,
      agCheckboxRendererComponent: AgCheckboxRendererComponent
    };
    this.gridField = [
      {
        headerName: 'Sublet Type',
        headerTooltip: 'Sublet Type',
        field: 'sublettype',
        width: 100,
        editable: true,
        resizable: true,
        pinned: true
      },
      {
        headerName: 'Desc(ENG)',
        headerTooltip: 'Desc(ENG)',
        field: 'desceng',
        width: 400,
        editable: true,
        resizable: true,
        pinned: true
      },
      {
        headerName: 'Desc(VN)',
        headerTooltip: 'Desc(VN)',
        field: 'descvn',
        width: 100,
        editable: true,
        resizable: true,
        pinned: true
      }
    ];
  }

  ngOnInit() {

  }

  delete() {
    this.confirmService.openConfirmModal('Bạn có chắc muốn xóa bản ghi được chọn').subscribe(res => {
      this.loadingService.setDisplay(true);
      this.subletTypeMaintenanceApi.removeSubletType(this.selectedData.id).subscribe(() => {
        this.params.api.updateRowData({remove: [this.selectedData]});
        this.refreshData();
        this.loadingService.setDisplay(false);
        this.swalAlertService.openSuccessToast();
      });
    });
  }

  refreshData() {
    this.selectedData = undefined;
    this.callbackGrid(this.params);
  }

  callbackGrid(params) {
    params.api.setRowData([]);
    this.params = params;
    this.callApi();
  }

  callApi() {
    this.subletTypeMaintenanceApi.getSubletType().subscribe(res => {
      this.loadingService.setDisplay(false);
      this.data = res;
      this.params.api.setRowData(this.data);
    });
  }

  changePaginationParams(paginationParams) {
    if (!this.data) {
      return;
    }
    this.paginationParams = paginationParams;
    this.callbackGrid(this.params);
  }

  getParams() {
    this.selectedData = this.params.api.getSelectedRows()[0];
  }
}
