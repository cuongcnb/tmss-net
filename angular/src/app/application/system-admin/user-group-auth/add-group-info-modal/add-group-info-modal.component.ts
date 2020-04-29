import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { omit } from 'lodash';
// import {ToastrService} from 'ngx-toastr';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { UserManagementApi } from '../../../../api/system-admin/user-management.api';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { ToastService } from '../../../../shared/swal-alert/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'add-group-info-modal',
  templateUrl: './add-group-info-modal.component.html',
  styleUrls: ['./add-group-info-modal.component.scss'],
})
export class AddGroupInfoModalComponent implements OnInit {
  @ViewChild('AddUpdateGroupModal', {static: false}) modal: ModalDirective;
  @ViewChild('partNo', {static: false}) partNo;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();

  selectedData;
  form: FormGroup;
  type: string;

  height = '200px';
  suppressRowClickSelection;
  listPartNo: Array<string>;
  modalHeight;

  constructor(
    private formBuilder: FormBuilder,
    private userManagementApi: UserManagementApi,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
  ) {
  }

  ngOnInit() {
    this.listPartNo = [];
    this.suppressRowClickSelection = true;
  }

  onResize() {
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      groupText: [undefined, Validators.compose([Validators.required, GlobalValidator.inputFormat])],
      disableAfterFailed: [null, GlobalValidator.numberFormat],
      noPasswordHistory: [null, GlobalValidator.numberFormat],
      sendEmail: [null, GlobalValidator.numberFormat],
      passwordChangeAfter: [null, GlobalValidator.numberFormat],
      groupId: null,
    });
    if (this.selectedData) {
      this.form.patchValue({
        groupText: this.selectedData.fullName,
        groupId: this.selectedData.groupId,
      });
    }
  }

  open(type?: string, selectedData?) {
    this.selectedData = selectedData;
    this.type = type;
    this.modal.show();
    this.buildForm();
    if (this.type === 'update') {
      const obj = {
        groupId: this.selectedData.id,
      };
      this.userManagementApi.getGroup(obj).subscribe(res => {
        if (res && res.length > 0) {
          this.form.patchValue(res[0]);
        }
      });
    }
  }

  hide() {
    this.modal.hide();
  }

  reset() {
    this.form = undefined;
  }

  submitData() {
    if (this.form.invalid) {
      return;
    } else {
      let data = this.form.value;
      if (this.type === 'add') {
        data = omit(data, 'groupId');
        this.loadingService.setDisplay(true);
        this.userManagementApi.addGroup(data).subscribe(() => {
          this.loadingService.setDisplay(false);
          this.swalAlertService.openSuccessToast();
          this.hide();
          this.close.emit();
        });
      } else {
        this.loadingService.setDisplay(true);
        this.userManagementApi.updateGroup(data).subscribe(() => {
          this.loadingService.setDisplay(false);
          this.swalAlertService.openSuccessToast();
          this.hide();
          this.close.emit();
        });
      }

    }
  }

}
