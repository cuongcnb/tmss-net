import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { GlobalValidator } from '../form-validation/validators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cell-table-edit-modal',
  templateUrl: './cell-table-edit-modal.component.html',
  styleUrls: ['./cell-table-edit-modal.component.scss'],
})
export class CellTableEditModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter<any>();
  form: FormGroup;
  column;
  callback;
  selectedRow;
  selectList;

  constructor(private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
  }

  open(selectedRow, column) {
    this.selectedRow = selectedRow;
    this.column = column;
    this.buildForm();
    let controls;
    const validators = [];
    switch (this.column.type) {
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
        if (this.column.select.api) {
          this.column.select.api().subscribe(val => {
            if (val) {
              this.selectList = val;
            }
          });
        }
        if (this.column.select.list) {
          this.selectList = this.column.select.list;
        }
        break;

    }
    if (this.column.required) {
      validators.push(GlobalValidator.required);
    }
    if (this.column.maxLength) {
      validators.push(GlobalValidator.maxLength(this.column.maxLength));
    }
    controls.setValidators(Validators.compose(validators));
    this.column.fieldToSet ? controls.setValue(this.selectedRow[this.column.fieldToSet]) : controls.setValue(this.selectedRow[this.column.field]);
    this.modal.show();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      number: [undefined],
      text: [undefined],
      textarea: [undefined],
      date: [undefined],
      select: [undefined],
    });
  }

  confirm() {
    if (this.form.invalid) {
      return;
    }
    const valueForm = Object.values(this.form.value).filter(value => value)[0];
    if (this.column.type === 'select') {

      if (!valueForm) {
        this.selectedRow[this.column.field] = '';
        if (this.column.fieldToSet) {
          this.selectedRow[this.column.fieldToSet] = '';
        }
      } else {
        const selected = this.selectList.find(select => {
          return select[this.column.select.keyField] === valueForm;
        });
        if (this.column.fieldToSet) {
          this.selectedRow[this.column.fieldToSet] = selected[this.column.select.keyField];
          this.selectedRow[this.column.field] = selected[this.column.select.valueField];
          // this.selectedRow[this.column.field] =
        } else {
          this.selectedRow[this.column.field] = selected[this.column.select.keyField];
        }
      }
    } else if (this.column.type === 'number') {
      this.selectedRow[this.column.field] = Number(valueForm);
    } else {
      this.selectedRow[this.column.field] = valueForm;
    }

    this.close.emit(this.selectedRow);
    this.modal.hide();
  }

  reset() {
    this.form = undefined;
  }
}
