import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SystemFunctionListApi } from '../../../../api/system-admin/system-function-list.api';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { ToastService } from '../../../../shared/swal-alert/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'modify-menu-modal',
  templateUrl: './modify-menu-modal.component.html',
  styleUrls: ['./modify-menu-modal.component.scss'],
})
export class ModifyMenuModalComponent {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  functions: Array<any>;
  selectedMenu;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private systemFunctionListApi: SystemFunctionListApi,
  ) {
  }

  open(functions, selectedMenu?) {
    this.functions = functions;
    this.selectedMenu = selectedMenu;
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

    const data = Object.assign({}, this.form.value, {
      functions: this.functions.map(item => item.functionId),
    });

    const apiCall = this.selectedMenu ? this.systemFunctionListApi.updateMenu(data) : this.systemFunctionListApi.createNewMenu(data);
    this.loadingService.setDisplay(true);
    apiCall.subscribe(() => {
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessToast();
      this.close.emit();
      this.modal.hide();
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      menuId: [undefined],
      menuCode: [undefined, Validators.required],
      menuName: [undefined, Validators.required],
      menuDescription: [undefined],
    });
    if (this.selectedMenu) {
      this.form.patchValue(this.selectedMenu);
    }
  }

}
