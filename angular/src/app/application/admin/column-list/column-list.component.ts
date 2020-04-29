import {Component, ViewChild} from '@angular/core';
import {LoadingService} from '../../../shared/loading/loading.service';
import {ListColumnService} from '../../../api/admin/list-column.service';
import {ToastService} from '../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'column-list',
  templateUrl: './column-list.component.html',
  styleUrls: ['./column-list.component.scss']
})
export class ColumnListComponent {
  @ViewChild('modifyColumnListModal', {static: false}) modifyColumnListModal;
  gridField;
  gridParam;
  selectedData;

  constructor(
    private loadingService: LoadingService,
    private listColumnService: ListColumnService,
    private toastService: ToastService
  ) {
    this.gridField = [
      {
        headerName: 'Column Code',
        field: 'columnCode',
      },
      {
        headerName: 'Column Name',
        field: 'columnName',
      },
      {
        headerName: 'Column Width',
        field: 'columnWidth',
        cellClass: ['cell-border', 'text-right'],
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Description',
        field: 'columnDes',
      },
      {
        headerName: 'Is in Use',
        field: 'status',
        cellRenderer: params => {
          return `${params.value === 'Y' ? 'Enable' : 'Disable'}`;
        },
      }
    ];
  }

  callbackGrid(params) {
    this.gridParam = params;
    this.gridParam.api.setRowData();
    this.getData();
  }

  getData() {
    this.loadingService.setDisplay(true);
    this.listColumnService.getList().subscribe(columnList => {
      this.gridParam.api.setRowData(columnList);
      this.loadingService.setDisplay(false);
    });
  }

  refreshList() {
    this.getData();
    this.selectedData = undefined;
  }

  getParams() {
    const selected = this.gridParam.api.getSelectedRows();
    if (selected) {
      this.selectedData = selected[0];
    }
  }

  updateData() {
    this.selectedData
      ? this.modifyColumnListModal.open(this.selectedData)
      : this.toastService.openWarningForceSelectData();
  }
}
