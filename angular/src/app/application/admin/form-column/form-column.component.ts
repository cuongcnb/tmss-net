import {Component, OnInit, ViewChild} from '@angular/core';
import {LoadingService} from '../../../shared/loading/loading.service';
import {FormColumnService} from '../../../api/admin/form-column.service';
import {FormService} from '../../../api/admin/form.service';
import {ToastService} from '../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'form-column',
  templateUrl: './form-column.component.html',
  styleUrls: ['./form-column.component.scss']
})
export class FormColumnComponent implements OnInit {
  @ViewChild('modifyFormColumnModal', {static: false}) modifyFormColumnModal;
  gridField;
  gridParam;
  selectedData;
  forms: Array<any>;
  selectedFormId: string;

  constructor(
    private loadingService: LoadingService,
    private formColumnService: FormColumnService,
    private formService: FormService,
    private toastService: ToastService
  ) {
    this.gridField = [
      {headerName: 'Column Code', field: 'columnCode'},
      {headerName: 'Column Name', field: 'columnName'},
      {headerName: 'Column Des', field: 'columnDes'},
      {
        headerName: 'Is In Use', field: 'status',
        cellRenderer: params => {
          return `${params.value === 'Y' ? 'Enable' : 'Disable'}`;
        },
      },
      {field: 'note'},
    ];
  }

  ngOnInit() {
    this.loadingService.setDisplay(true);
    this.formService.getList().subscribe(forms => {
      this.forms = forms;
      this.loadingService.setDisplay(false);
    });
  }

  callbackGrid(params) {
    this.gridParam = params;
    this.gridParam.api.setRowData();
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

  onChangeForm() {
    this.getData();
  }

  getData() {
    if (this.selectedFormId) {
      this.loadingService.setDisplay(true);
      this.formColumnService.getList(this.selectedFormId).subscribe(columnList => {
        columnList
          ? this.gridParam.api.setRowData(columnList)
          : this.gridParam.api.setRowData();
        this.loadingService.setDisplay(false);
      });
    } else {
      this.gridParam.api.setRowData();
    }
  }

  updateData() {
    this.selectedData
      ? this.modifyFormColumnModal.open(this.selectedFormId, this.selectedData)
      : this.toastService.openWarningForceSelectData();
  }

  addData() {
    this.selectedFormId
      ? this.modifyFormColumnModal.open(this.selectedFormId)
      : this.toastService.openWarningForceSelectData('You haven\'t selected any form, please select one to add', 'Select a form to add');
  }
}
