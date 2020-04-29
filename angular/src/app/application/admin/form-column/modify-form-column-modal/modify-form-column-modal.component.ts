import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ListColumnService} from '../../../../api/admin/list-column.service';
import {FormColumnService} from '../../../../api/admin/form-column.service';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'modify-form-column-modal',
  templateUrl: './modify-form-column-modal.component.html',
  styleUrls: ['./modify-form-column-modal.component.scss']
})
export class ModifyFormColumnModalComponent {
  @ViewChild('modifyFormColumnModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData;
  form: FormGroup;
  formId: number;
  columns;
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

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private listColumnService: ListColumnService,
    private formColumnService: FormColumnService,
  ) {
  }

  getColumns(params) {
    params.api.setRowData();
    this.loadingService.setDisplay(true);
    this.listColumnService.getListAvailable()
      .subscribe(columns => {
        columns
          ? params.api.setRowData(columns)
          : params.api.setRowData();
        this.loadingService.setDisplay(false);
      });
  }

  open(formId?, selectedData?) {
    this.selectedData = selectedData;
    this.formId = formId;
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
      formId: this.formId,
      columnId: this.form.value.column ? this.form.value.column.id : this.selectedData.columnId
    });

    const apiCall = this.selectedData
      ? this.formColumnService.updateList(value)
      : this.formColumnService.createNewList(value);

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
      note: [undefined, GlobalValidator.maxLength(255)],
      status: ['Y', GlobalValidator.required],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
      this.form.patchValue({
        column: {
          id: this.selectedData.columnId,
          columnCode: this.selectedData.columnCode,
        },
      });
    }
  }
}

