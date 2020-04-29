import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { MoneyDefineService} from '../../../../api/master-data/money-define.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'contract-color-edit-modal',
  templateUrl: './contract-color-edit-modal.component.html',
  styleUrls: ['./contract-color-edit-modal.component.scss']
})
export class ContractColorEditModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
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
  carPrice: number;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private moneyDefineService: MoneyDefineService
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

  reset() {
    this.form = undefined;
  }

  getMoney(productId, colorId, interiorColorId?) {
    const apiCall = interiorColorId ? this.moneyDefineService.getPrice(productId, colorId, interiorColorId) : this.moneyDefineService.getPrice(productId, colorId);
    this.loadingService.setDisplay(true);
    apiCall.subscribe(carPrice => {
      this.carPrice = carPrice;
      this.loadingService.setDisplay(false);
    });
  }

  confirm() {
    if (this.form.invalid) {
      return;
    }
    const valueForm = Object.values(this.form.value).filter(value => value)[0];
    if (!valueForm) {
      this.selectedRow[this.column.field] = '';
      if (this.column.cellEditModal.fieldToSet) {
        this.selectedRow[this.column.cellEditModal.fieldToSet] = '';
      }
    } else {
      const selected = this.selectList.find(select => {
        if (select.id === valueForm && this.selectList.length > 0) {
          return select[this.column.cellEditModal.select.keyField] = valueForm;
        }
      });
      if (this.column.cellEditModal.fieldToSet) {
        this.selectedRow[this.column.cellEditModal.fieldToSet] = selected[this.column.cellEditModal.select.keyField];
        this.selectedRow[this.column.field] = selected[this.column.cellEditModal.select.valueField];
        // this.selectedRow[this.column.cellEditModal.field] =
      } else {
        this.selectedRow[this.column.field] = selected[this.column.cellEditModal.select.keyField];
      }
      this.selectedRow.orderPrice = this.carPrice;
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

  private buildForm() {
    this.form = this.formBuilder.group({
      select: [undefined]
    });
    this.form.get('select').valueChanges.subscribe(val => {
      this.selectedRow.interiorColorId
        ? this.getMoney(this.selectedRow.gradeProductionId, val)
        : this.getMoney(this.selectedRow.gradeProductionId, val, this.selectedRow.interiorColorId);
    });
  }

}
