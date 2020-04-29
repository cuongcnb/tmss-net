import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../loading/loading.service';
import { ModalDirective } from 'ngx-bootstrap';
import { GlobalValidator } from '../form-validation/validators';
import { Observable } from 'rxjs';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ag-cell-edit-modal',
  templateUrl: './ag-cell-edit-modal.component.html',
  styleUrls: ['./ag-cell-edit-modal.component.scss']
})
export class AgCellEditModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter<any>();
  // tslint:disable-next-line:ban-types
  @Input() apiCall: Function;
  form: FormGroup;
  column: {
    field: string,
    headerName?: string,
    cellEditModal: {
      sendMultipleRows: boolean,
      editable: boolean,
      fieldToSet?,
      type: string,
      select?: {
        list: any[],
        api: any,
        keyField?,
        valueField?
      },
      required?,
      maxLength?,
    }
  };
  selectedRow;
  selectList;

  constructor(private formBuilder: FormBuilder,
              private loadingService: LoadingService) {
  }

  ngOnInit() {
  }

  open(selectedRow, column) {
    this.selectedRow = selectedRow;
    this.column = column;
    this.buildForm();
    let controls;
    const validators = [];
    switch (this.column.cellEditModal.type) {
      case 'number':
        controls = this.form.get('number');
        validators.push(GlobalValidator.numberFormat);
        break;
      case 'text':
        controls = this.form.get('text');
        break;
      case 'textarea':
        controls = this.form.get('textarea');
        break;
      case 'date':
        controls = this.form.get('date');
        break;
      case 'select':
        controls = this.form.get('select');
        if (this.column.cellEditModal.select.api) {
          this.loadingService.setDisplay(true);
          this.column.cellEditModal.select.api.subscribe(val => {
            this.loadingService.setDisplay(false);
            this.selectList = val;
          });
        }
        if (this.column.cellEditModal.select.list) {
          this.selectList = this.column.cellEditModal.select.list;
        }
        break;

    }
    if (this.column.cellEditModal.required) {
      validators.push(GlobalValidator.required);
    }
    if (this.column.cellEditModal.maxLength) {
      validators.push(GlobalValidator.maxLength(this.column.cellEditModal.maxLength));
    }
    controls.setValidators(Validators.compose(validators));
    this.column.cellEditModal.fieldToSet ? controls.setValue(this.selectedRow[this.column.cellEditModal.fieldToSet]) : controls.setValue(this.selectedRow[this.column.field]);
    this.modal.show();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      number: [undefined],
      text: [undefined],
      textarea: [undefined],
      date: [undefined],
      select: [undefined]
    });
  }

  confirm() {
    if (this.form.invalid) {
      return;
    }
    const valueForm = Object.values(this.form.value).filter(value => value)[0];
    if (this.column.cellEditModal.type === 'select') {

      if (!valueForm) {
        this.selectedRow[this.column.field] = '';
        if (this.column.cellEditModal.fieldToSet) {
          this.selectedRow[this.column.cellEditModal.fieldToSet] = '';
        }
      } else {
        const selected = this.selectList.find(select => {
          return select[this.column.cellEditModal.select.keyField] === valueForm;
        });
        if (this.column.cellEditModal.fieldToSet) {
          this.selectedRow[this.column.cellEditModal.fieldToSet] = selected[this.column.cellEditModal.select.keyField];
          this.selectedRow[this.column.field] = selected[this.column.cellEditModal.select.valueField];
          // this.selectedRow[this.column.cellEditModal.field] =
        } else {
          this.selectedRow[this.column.field] = selected[this.column.cellEditModal.select.keyField];
        }
      }
    } else if (this.column.cellEditModal.type === 'number') {
      this.selectedRow[this.column.field] = Number(valueForm);
    } else {
      this.selectedRow[this.column.field] = valueForm;
    }
    this.confirmApiCall();
  }

  confirmApiCall() {
    this.loadingService.setDisplay(true);
    this.apiCall(this.column.cellEditModal.sendMultipleRows ? [this.selectedRow] : this.selectedRow).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.close.emit(this.selectedRow);
      this.modal.hide();
    });
  }

  reset() {
    this.form = undefined;
  }
}
