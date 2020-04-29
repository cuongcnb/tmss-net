import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap';
import {ListColumnService} from '../../../../api/admin/list-column.service';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'modify-column-list-modal',
  templateUrl: './modify-column-list-modal.component.html',
  styleUrls: ['./modify-column-list-modal.component.scss']
})
export class ModifyColumnListModalComponent {
  @ViewChild('modifyColumnListModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private listColumnService: ListColumnService,
  ) {
  }

  open(selectedData?) {
    this.selectedData = selectedData;
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

    const apiCall = this.selectedData
      ? this.listColumnService.updateList(this.form.value)
      : this.listColumnService.createNewList(this.form.value);

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
      columnCode: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(50)])],
      columnName: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(50)])],
      columnWidth: [undefined, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.maxLength(18)])],
      columnDes: [undefined, GlobalValidator.maxLength(50)],
      status: ['Y', GlobalValidator.required],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }
}
