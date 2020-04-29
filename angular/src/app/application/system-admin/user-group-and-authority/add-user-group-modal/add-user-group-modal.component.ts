import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { SystemUserGroupDefinitionApi } from '../../../../api/system-admin/system-user-group-definition.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'add-user-group-modal',
  templateUrl: './add-user-group-modal.component.html',
  styleUrls: ['./add-user-group-modal.component.scss'],
})
export class AddUserGroupModalComponent {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  selectedData;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private systemUserGroupDefinitionApi: SystemUserGroupDefinitionApi,
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

    const data = Object.assign({}, this.form.value, {status: this.form.value.isActive ? 'Y' : 'N' });

    const apiCall = !this.selectedData
      ? this.systemUserGroupDefinitionApi.addUserGroup(data)
      : this.systemUserGroupDefinitionApi.updateUserGroup(data);

    this.loadingService.setDisplay(true);
    apiCall.subscribe(() => {
      this.loadingService.setDisplay(false);
      this.close.emit();
      this.modal.hide();
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      groupName: [undefined, GlobalValidator.required],
      groupId: [undefined],
      tmv: [false],
      description: [undefined],
      active: [this.selectedData ? this.selectedData.active : false]
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }
}
