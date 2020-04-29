import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {ToastService} from '../../../../shared/swal-alert/toast.service';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {fieldMatch} from '../../../../shared/form-validation/fieldMatch';
import {SysUserApi} from '../../../../api/system-admin/sys-user.api';
import {AuthorizeApi} from '../../../../api/system-admin/authorize.api';
import {DealerApi} from '../../../../api/sales-api/dealer/dealer.api';
import {DealerModel} from '../../../../core/models/sales/dealer.model';
import {EmployeeCommonModel} from '../../../../core/models/common-models/employee-common.model';
import {forkJoin} from 'rxjs';
import {StorageKeys} from '../../../../core/constains/storageKeys';
import {FormStoringService} from '../../../../shared/common-service/form-storing.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'create-user-modal',
  templateUrl: './system-user-modal.component.html',
  styleUrls: ['./system-user-modal.component.scss']
})
export class SystemUserModalComponent {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();

  dealerList: DealerModel[];
  userData; // data from
  form: FormGroup;
  fieldGridEmployeeList;
  currentUser;
  employeeList: EmployeeCommonModel[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private authorizeApi: AuthorizeApi,
    private dealerApi: DealerApi,
    private sysUserApi: SysUserApi,
    private toastService: ToastService,
    private formStoringService: FormStoringService
  ) {
    this.currentUser = this.formStoringService.get(StorageKeys.currentUser);
    this.fieldGridEmployeeList = [
      {
        field: 'empCode',
        minWidth: 150
      },
      {
        field: 'empName',
        minWidth: 180
      },
      {
        field: 'titleCode',
        minWidth: 100
      },
      {
        field: 'titleName',
        minWidth: 150
      }
    ];
  }

  masterApi() {
    this.loadingService.setDisplay(true);
    if (this.userData) {
      // Update user
      forkJoin([
        this.dealerApi.getAllAvailableDealers(),
        this.sysUserApi.getEmployeeByDealer(this.userData.dealerId)
      ]).subscribe(res => {
        this.loadingService.setDisplay(false);
        this.dealerList = res[0];
        this.dealerList = this.dealerList.filter(dealer => dealer.id === this.userData.dealerId);
        this.employeeList = res[1];
        this.userData.password = '';
        this.buildForm();
        this.form.patchValue(this.userData);
        this.form.patchValue({status: this.userData.status === 'Y'});
      });
    } else {
      // Create new user
      this.dealerApi.getAllAvailableDealers().subscribe(res => {
        this.loadingService.setDisplay(false);
        this.dealerList = res;
        this.buildForm();
      });
    }
  }

  open(userData?) {
    this.userData = userData;
    this.masterApi();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
    this.dealerList = undefined;
    this.employeeList = [];
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const user = this.form.getRawValue();
    user.status = this.form.getRawValue().status ? 'Y' : 'N';
    const apiCall = !this.userData
      ? this.sysUserApi.createNewUser(user)
      : this.sysUserApi.updateUser(user);

    this.loadingService.setDisplay(true);
    apiCall.subscribe(() => {
      this.loadingService.setDisplay(false);
      this.toastService.openSuccessToast();
      this.close.emit();
      this.modal.hide();
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
        id: [undefined],
        dealerId: [undefined, GlobalValidator.required],
        userName: [
          {value: undefined, disabled: this.userData},
          Validators.compose([GlobalValidator.required])
        ],
        fullUserName: [undefined],
        password: [
          {value: undefined},
          Validators.compose([GlobalValidator.required, GlobalValidator.requiredPassword])
        ],
        confirmPassword: [
          {value: undefined},
          Validators.compose([GlobalValidator.required, GlobalValidator.requiredPassword])
        ],
        employeeId: [undefined]
      },
      {validator: fieldMatch('password', 'confirmPassword')});

    if (!this.userData) {
      this.form.get('dealerId').valueChanges.subscribe(val => {
        if (val) {
          this.loadingService.setDisplay(true);
          this.sysUserApi.getEmployeeByDealer(val).subscribe(res => {
            this.loadingService.setDisplay(false);
            this.employeeList = res;
          });
        } else {
          this.employeeList = [];
        }
      });
    }
    if (this.currentUser.dealerId && this.currentUser.dealerId > 0) {
      this.form.get('dealerId').setValue(this.currentUser.dealerId);
      this.form.get('dealerId').disable();
    }
  }
}
