import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalValidator} from '../../form-validation/validators';
import {StorageKeys} from '../../../core/constains/storageKeys';
import {FormStoringService} from '../../common-service/form-storing.service';
import {isEqual} from 'lodash';
import {ToastService} from '../../common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'edit-filter-row-modal',
  templateUrl: './edit-filter-row-modal.component.html',
  styleUrls: ['./edit-filter-row-modal.component.scss']
})
export class EditFilterRowModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  conditionArr = ['=', '>=', '>', '<=', '<', '<>', 'Like', 'Is Blank', 'Is Not Blank'];
  connectiveArr = ['AND', 'OR'];
  selectedFilter;
  currentUser;
  filterFieldArr;
  isDateField: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private formStoringService: FormStoringService,
    private swalAlertService: ToastService
  ) {
    this.currentUser = this.formStoringService.get(StorageKeys.currentUser);
  }

  ngOnInit() {
  }

  open(filterFieldArr, selectedFilter?) {
    this.selectedFilter = selectedFilter ? selectedFilter : undefined;
    this.filterFieldArr = filterFieldArr;
    this.buildForm();
    this.modal.show();
  }

  reset() {
    this.selectedFilter = undefined;
    this.form = undefined;
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    if (isEqual(this.form.value, this.selectedFilter)) {
      this.swalAlertService.openFailModal('Your input is not changed. If you do not want to change value, click "Cancel"', 'Same Input');
      return;
    }
    const emmitValue = {
      value: Object.assign({}, this.form.value, {
        field: undefined,
        fieldName: this.form.value.field.fieldName,
        filterId: this.form.value.field ? this.form.value.field.id : this.form.value.filterId,
      }),
      isUpdate: !!this.selectedFilter
    };
    this.close.emit(emmitValue);
    this.modal.hide();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      filterId: [undefined],
      field: [undefined, GlobalValidator.required],
      condition: [undefined, GlobalValidator.required],
      value: [undefined, Validators.compose([GlobalValidator.maxLength(50)])],
      connective: [undefined],
      typeValue: [0]
    });
    if (this.selectedFilter) {
      this.form.patchValue(this.selectedFilter);
      const matchField = this.filterFieldArr.find(field => field.id === this.selectedFilter.filterId);
      if (matchField) {
        this.form.patchValue({field: matchField});
      }
    }
    // Switch date field
    this.form.get('field').valueChanges.subscribe(val => {
      if (val) {
        const matchField = this.filterFieldArr.find(field => field === val);
        if (matchField) {
          this.form.patchValue({value: undefined});
          // this.isDateField = matchField.dateField;
        }
      }
    });
    this.form.get('typeValue').valueChanges.subscribe(val => {
      this.form.patchValue({
        value: undefined
      });
    });
  }

}
