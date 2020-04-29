import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { omit } from 'lodash';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { ModalDirective } from 'ngx-bootstrap';
import { UserManagementApi } from '../../../../api/system-admin/user-management.api';
import { DealerApi } from '../../../../api/sales-api/dealer/dealer.api';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'add-user-info-modal',
  templateUrl: './add-user-info-modal.component.html',
  styleUrls: ['./add-user-info-modal.component.scss'],
})
export class AddUserInfoModalComponent implements OnInit {
  @ViewChild('AddUpdateSetPassModal', {static: false}) modal: ModalDirective;
  @ViewChild('partNo', {static: false}) partNo;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  modalHeight;
  userData;
  form: FormGroup;
  type: string;

  height = '200px';
  suppressRowClickSelection;
  listPartNo: Array<string>;
  minDate = new Date();
  gridApiPartNo;
  dealerList;

  constructor(
    private formBuilder: FormBuilder,
    private userManagementApi: UserManagementApi,
    private dealerApi: DealerApi,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private toastrService: ToastrService,
  ) {
  }

  ngOnInit() {
    this.listPartNo = [];
    this.suppressRowClickSelection = true;
  }

  onResize() {
  }

  callbackGrid(params) {
    this.gridApiPartNo = params;
  }

  private getDealersAvalable() {
    this.dealerApi.getAllAvailableDealers().subscribe(dealerData => {
      this.dealerList = dealerData;
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      dealerId: [{value: null, disabled: this.type === 'setPass' || this.type === 'update'}, GlobalValidator.required],
      isLocked: [{value: false, disabled: this.type === 'setPass'}],
      userId: [null],
      userName: [{
        value: undefined,
        disabled: this.type === 'update' || this.type === 'setPass',
      }, Validators.compose([Validators.required, GlobalValidator.inputFormat])],
      fullName: [undefined, Validators.compose([Validators.required])],
      disableAfterFailed: [{
        value: 5,
        disabled: this.type === 'setPass',
      }, Validators.compose([Validators.required, GlobalValidator.numberFormat])],
      userPassword: [{
        value: null,
        disabled: this.type === 'update',
      }, Validators.compose([Validators.required, GlobalValidator.requiredPassword])],
      rePassword: [{value: null, disabled: this.type === 'update'}, Validators.compose([Validators.required])],
      isNextLogon: [false],
      noPasswordHistory: [{
        value: 6,
        disabled: this.type === 'setPass',
      }, Validators.compose([Validators.required, GlobalValidator.numberFormat])],
      sendEmail: [{
        value: 5,
        disabled: this.type === 'setPass',
      }, Validators.compose([Validators.required, GlobalValidator.numberFormat])],
      passwordChangeAfter: [{
        value: 60,
        disabled: this.type === 'setPass',
      }, Validators.compose([Validators.required, GlobalValidator.numberFormat])],
      effectiveDate: [{value: new Date(), disabled: this.type === 'setPass'}],
      exPriredDate: [{value: new Date(), disabled: this.type === 'setPass'}],
      updatePassword: [{value: null, disabled: true}],
      createdAt: [{value: new Date(), disabled: true}],
      passwordHistory: [null],
      isChangePassword: [0],
      noFailedLogin: [0],
      logoutAfter: [{
        value: 30,
        disabled: this.type === 'setPass',
      }, Validators.compose([Validators.required, GlobalValidator.numberFormat])],
    });
    if (this.userData) {
      this.form.patchValue(this.userData);
      this.form.patchValue({
        passwordHistory: this.form.get('userPassword').value,
        effectiveDate: new Date(this.userData.effectiveDate),
        exPriredDate: new Date(this.userData.exPriredDate),
      });
    }
    if (this.type === 'update') {
      this.form.patchValue({
        userPassword: 'Password1!',
        rePassword: 'Password1!',
      });
    }
  }

  open(type?: string, userData?) {
    this.userData = userData;
    this.getDealersAvalable();
    this.type = type;
    this.modal.show();
    this.buildForm();
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
      let data = this.form.getRawValue();
      data = omit(data, ['rePassword', 'createdAt', 'updatePassword']);
      if (data.effectiveDate) {
        data.effectiveDate = new Date(data.effectiveDate).getTime();
      }
      if (data.exPriredDate) {
        data.exPriredDate = new Date(data.exPriredDate).getTime();
      }
      data.isLocked = Number(data.isLocked);
      data.isNextLogon = Number(data.isNextLogon);
      if (this.type === 'add') {
        if (data.userPassword !== data.rePassword) {
        } else {
          if (data.userPassword === data.userName) {
          } else {
            this.loadingService.setDisplay(true);
            this.userManagementApi.addUser(data).subscribe(() => {
              this.loadingService.setDisplay(false);
              this.toastrService.success('Thêm mới thành công', 'Thông báo');
              this.hide();
              this.close.emit();
            });
          }
        }
      } else if (this.type === 'update') {
        this.loadingService.setDisplay(true);
        this.userManagementApi.updateUser(data).subscribe(() => {
          this.loadingService.setDisplay(false);
          this.toastrService.success('Lưu thành công', 'Thông báo');
          this.hide();
          this.close.emit();
        });
      } else {
        const formValue = this.form.value;
        if (formValue.userPassword !== formValue.rePassword) {
        } else {
          if (formValue.userPassword === formValue.userName) {
          } else {
            this.loadingService.setDisplay(true);
            this.userManagementApi.updateUser(data).subscribe(() => {
              this.loadingService.setDisplay(false);
              this.toastrService.success('Lưu thành công', 'Thông báo');
              this.hide();
              this.close.emit();
            });
          }
        }
      }
    }
  }

}
