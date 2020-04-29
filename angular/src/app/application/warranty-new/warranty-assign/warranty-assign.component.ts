import {Component, OnInit, ViewChild} from '@angular/core';
import {WarrantyAssignModel} from '../../../core/models/warranty/warranty-assign.model';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {WarrantyAssignApi} from '../../../api/warranty/warranty-assign.api';
import {LoadingService} from '../../../shared/loading/loading.service';
import {ConfirmService} from '../../../shared/confirmation/confirm.service';
import {AgDateEditorComponent} from '../../../shared/ag-grid-table/ag-datepicker-editor/ag-date-editor.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'warranty-assign',
  templateUrl: './warranty-assign.component.html',
  styleUrls: ['./warranty-assign.component.scss']
})
export class WarrantyAssignComponent implements OnInit {

  @ViewChild('updateModal', {static: false}) updateModal;
  fieldGrid;
  frameworkComponents;
  params;
  selectedData;
  selectedPart: WarrantyAssignModel;
  data: Array<WarrantyAssignModel>;

  constructor(
    private swalAlertService: ToastService,
    private warrantyAssignApi: WarrantyAssignApi,
    private loadingService: LoadingService,
    private confirmService: ConfirmService
  ) { }

  ngOnInit() {
    this.fieldGrid = [
      {
        headerName: 'Model',
        headerTooltip: 'Model',
        field: 'modelName',
        pinned: true,
        width: 100,
        cellClass: ['cell-border'],
        resizable: true,
        textAlign: 'center'
      },
      {
        headerName: 'PIC',
        headerTooltip: 'PIC',
        field: 'pic',
        pinned: true,
        width: 200,
        cellClass: ['cell-border'],
        resizable: true,
      },
      {
        headerName: 'Region',
        headerTooltip: 'Region',
        field: 'regionName',
        pinned: true,
        width: 80,
        cellClass: ['cell-border'],
        resizable: true,
        textAlign: 'center'
      },
      {
        headerName: 'Email',
        headerTooltip: 'Email',
        field: 'email',
        pinned: true,
        width: 200,
        resizable: true,
      },
      {
        headerName: 'Bcc',
        headerTooltip: 'Bcc',
        field: 'bcc',
        pinned: true,
        width: 200,
        resizable: true,
      },
      {
        headerName: 'Note',
        headerTooltip: 'Note',
        field: 'note',
        pinned: true,
        width: 200,
        resizable: true,
      },
    ];
  }

  callbackGrid(params) {
    params.api.setRowData([]);
    this.params = params;
    this.callApi();
  }

  callApi() {
    this.warrantyAssignApi.getWarrantyAssign().subscribe(
      val => {
        this.data = val;
        this.params.api.setRowData(this.data);
      }
    );
  }

  refreshData() {
    this.selectedData = undefined;
    this.callbackGrid(this.params);
  }

  getParams() {
    this.selectedData = this.params.api.getSelectedRows()[0];
  }

  delete() {
    this.confirmService.openConfirmModal('Bạn có chắc muốn xóa bản ghi được chọn').subscribe(res => {
      this.warrantyAssignApi.removeWarrantyAssign(this.selectedData.id).subscribe(() => {
        this.params.api.updateRowData({remove: [this.selectedData]});
        this.refreshData();
        this.loadingService.setDisplay(false);
        this.swalAlertService.openSuccessToast();
      });
    });
  }
}
