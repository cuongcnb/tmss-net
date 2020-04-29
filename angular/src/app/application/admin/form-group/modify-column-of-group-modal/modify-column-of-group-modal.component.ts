import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap';
import {GroupColumnService} from '../../../../api/admin/group-column.service';
import {FormColumnService} from '../../../../api/admin/form-column.service';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'modify-column-of-group-modal',
  templateUrl: './modify-column-of-group-modal.component.html',
  styleUrls: ['./modify-column-of-group-modal.component.scss']
})
export class ModifyColumnOfGroupModalComponent {
  @ViewChild('modifyColumnOfGroupModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData;
  form: FormGroup;
  formId: number;
  groupId: number;
  columnGridField = [
    {headerName: 'Column Code', field: 'columnCode'},
    {headerName: 'Column Name', field: 'columnName'},
    {
      headerName: 'Is In Use', field: 'status',
      cellRenderer: params => {
        return `${params.value === 'Y' ? 'Enable' : 'Disable'}`;
      },
    },
  ];
  errMessage;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private formColumnService: FormColumnService,
    private groupColumnService: GroupColumnService,
  ) {
  }

  getColumn(params) {
    params.api.setRowData();
    if (this.formId) {
      this.loadingService.setDisplay(true);
      this.formColumnService.getListAvailable(this.formId)
        .subscribe(columns => {
          columns
            ? params.api.setRowData(columns)
            : params.api.setRowData();
          this.loadingService.setDisplay(false);
        });
    }
  }

  open(formId?, groupId?, selectedData?) {
    this.selectedData = selectedData;
    this.formId = +formId;
    this.groupId = +groupId;
    this.buildForm();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const value = Object.assign({}, this.form.value, {
      groupId: this.groupId,
      columnId: this.form.value.column ? this.form.value.column.columnId : this.selectedData.columns.id
    });

    const apiCall = this.selectedData
      ? this.groupColumnService.updateColumn(value)
      : this.groupColumnService.createNewColumn(value);

    this.loadingService.setDisplay(true);
    apiCall.subscribe(() => {
      this.close.emit();
      this.modal.hide();
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessModal();
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [undefined],
      column: [undefined, GlobalValidator.required],
      columnId: [undefined],
      status: ['Y', GlobalValidator.required],
      ordering: [undefined, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.maxLength(18)])],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
      this.form.patchValue({
        column: {
          columnId: this.selectedData.columnId,
          columnCode: this.selectedData.columnCode,
        },
      });
    }
  }
}
