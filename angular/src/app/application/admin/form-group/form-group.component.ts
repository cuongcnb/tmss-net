import {Component, OnInit, ViewChild} from '@angular/core';
import {LoadingService} from '../../../shared/loading/loading.service';
import {FormService} from '../../../api/admin/form.service';
import {FormGroupService} from '../../../api/admin/form-group.service';
import {GroupColumnService} from '../../../api/admin/group-column.service';
import {ToastService} from '../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'form-group',
  templateUrl: './form-group.component.html',
  styleUrls: ['./form-group.component.scss']
})
export class FormGroupComponent implements OnInit {
  @ViewChild('modifyFormGroupModal', {static: false}) modifyFormGroupModal;
  @ViewChild('modifyColumnOfGroupModal', {static: false}) modifyColumnOfGroupModal;
  groupGridField;
  columnGridField;

  gridParamGroup;
  gridParamColumn;

  selectedGroup;
  selectedColumn;

  forms: Array<any>;
  selectedFormId: number;

  constructor(
    private loadingService: LoadingService,
    private formService: FormService,
    private formGroupService: FormGroupService,
    private groupColumnService: GroupColumnService,
    private toastService: ToastService
  ) {
    this.groupGridField = [
      {
        headerName: 'Group Code',
        field: 'groupCode',
      },
      {
        headerName: 'Group Name',
        field: 'groupName',
      },
      {
        headerName: 'Group Des',
        field: 'groupDes',
      },
      {
        headerName: 'Is In Use',
        field: 'status',
        cellRenderer: params => `${params.value === 'Y' ? 'Enable' : 'Disable'}`,
      },
      {
        headerName: 'Order',
        field: 'ordering',
        cellClass: ['cell-border', 'text-right']
      }
    ];
    this.columnGridField = [
      {
        headerName: 'Column Code',
        field: 'columnCode'
      },
      {
        headerName: 'Column Name',
        field: 'columnName'
      },
      {
        headerName: 'Description',
        field: 'columnDes'
      },
      {
        headerName: 'Is In Use',
        field: 'status',
        cellRenderer: params => `${params.value === 'Y' ? 'Enable' : 'Disable'}`,
      },
      {
        headerName: 'Order',
        field: 'ordering',
        cellClass: ['cell-border', 'text-right']
      },
    ];
  }

  ngOnInit() {
    this.loadingService.setDisplay(true);
    this.formService.getList().subscribe(forms => {
      this.forms = forms;
      this.loadingService.setDisplay(false);
    });
  }

  onchangeForm() {
    this.selectedGroup = undefined;
    this.gridParamGroup.api.setRowData();
    this.getGroupData();
  }

  getGroupData() {
    this.selectedColumn = undefined;
    this.gridParamColumn.api.setRowData();
    if (this.selectedFormId) {
      this.loadingService.setDisplay(true);
      this.formGroupService.getGroups(this.selectedFormId)
        .subscribe(groups => {
          this.gridParamGroup.api.setRowData(groups);
          this.loadingService.setDisplay(false);
        });
    } else {
      this.gridParamGroup.api.setRowData();
      this.loadingService.setDisplay(false);
    }
  }

  getColumnData() {
    this.selectedColumn = undefined;
    if (this.selectedGroup) {
      this.loadingService.setDisplay(true);
      this.groupColumnService.getColumns(this.selectedGroup.id)
        .subscribe(data => {
          data
            ? this.gridParamColumn.api.setRowData(data[0].columns)
            : this.gridParamColumn.api.setRowData();
          this.loadingService.setDisplay(false);
        });
    } else {
      this.gridParamColumn.api.setRowData();
      this.loadingService.setDisplay(false);
    }
  }

  callbackGroupGrid(params) {
    this.gridParamGroup = params;
    this.gridParamGroup.api.setRowData();
  }

  callbackColumnGrid(params) {
    this.gridParamColumn = params;
    this.gridParamColumn.api.setRowData();
  }

  getParamsGroup() {
    const selected = this.gridParamGroup.api.getSelectedRows();
    if (selected) {
      this.selectedGroup = selected[0];
      this.getColumnData();
    }
  }

  getParamsColumn() {
    const selected = this.gridParamColumn.api.getSelectedRows();
    if (selected) {
      this.selectedColumn = selected[0];
    }
  }

  refreshListGroup() {
    this.getGroupData();
    this.selectedGroup = undefined;
    this.selectedColumn = undefined;
  }

  refreshListColumn() {
    this.getColumnData();
    this.selectedColumn = undefined;
  }

  addGroup() {
    this.selectedFormId
      ? this.modifyFormGroupModal.open(this.selectedFormId)
      : this.toastService.openWarningForceSelectData('You haven\'t selected any Form, please select one to do', 'Select a form');
  }

  updateGroup() {
    this.selectedGroup
      ? this.modifyFormGroupModal.open(this.selectedFormId, this.selectedGroup)
      : this.toastService.openWarningForceSelectData('You haven\'t selected any form group, please select one to do', 'Select a form group');
  }

  addColumn() {
    this.selectedGroup
      ? this.modifyColumnOfGroupModal.open(this.selectedFormId, this.selectedGroup.id)
      : this.toastService.openWarningForceSelectData('You haven\'t selected any form group, please select one to do', 'Select a form group');
  }

  updateColumn() {
    this.selectedColumn
      ? this.modifyColumnOfGroupModal.open(this.selectedFormId, this.selectedGroup.id, this.selectedColumn)
      : this.toastService.openWarningForceSelectData('You haven\'t selected any column, please select one to do', 'Select a column');
  }
}

