import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap';
import {FormGroupService} from '../../../../api/admin/form-group.service';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'modify-form-group-modal',
  templateUrl: './modify-form-group-modal.component.html',
  styleUrls: ['./modify-form-group-modal.component.scss']
})
export class ModifyFormGroupModalComponent {
  @ViewChild('modifyFormGroupModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData;
  form: FormGroup;
  formId: number;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private formGroupService: FormGroupService,
  ) {
  }

  open(formId?, selectedData?) {
    this.selectedData = selectedData;
    this.formId = +formId;
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
    });

    const apiCall = this.selectedData
      ? this.formGroupService.updateGroup(value)
      : this.formGroupService.createNewGroup(value);

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
      groupCode: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(255)])],
      groupName: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(50)])],
      groupDes: [undefined, GlobalValidator.maxLength(255)],
      status: ['Y', GlobalValidator.required],
      ordering: [undefined, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.maxLength(18)])],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }
}
