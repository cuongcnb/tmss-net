import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap';
import {ToastService} from '../../../../shared/swal-alert/toast.service';
import {fieldMatch} from '../../../../shared/form-validation/fieldMatch';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {SysUserApi} from '../../../../api/system-admin/sys-user.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss'],
})
export class UpdatePasswordComponent {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  selectedData;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private sysUserApi: SysUserApi,
    private swalAlertService: ToastService,
  ) {
  }

  open(selectedData) {
    this.selectedData = selectedData;
    this.buildForm();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
  }

  hide() {
    this.modal.hide();
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    this.loadingService.setDisplay(true);
    this.sysUserApi.updatePassword(this.form.value).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessToast();
      this.close.emit();
      this.modal.hide();
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
        id: [this.selectedData.id],
        password: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.requiredPassword])],
        confirmPassword: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.requiredPassword])],
        status: ['Y'],
      },
      {validator: fieldMatch('password', 'confirmPassword')});
  }
}
