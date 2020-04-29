import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SalesPersonService} from '../../../../../api/dlr-master-data/sales-person.service';
import { StorageKeys } from '../../../../../core/constains/storageKeys';
import { FormStoringService } from '../../../../../shared/common-service/form-storing.service';
import { SalesGroupService} from '../../../../../api/dlr-master-data/sales-group.service';
import { SalesTeamSevice} from '../../../../../api/dlr-master-data/sales-team.sevice';
import { LoadingService } from '../../../../../shared/loading/loading.service';
import { GlobalValidator } from '../../../../../shared/form-validation/validators';
import { SetModalHeightService } from '../../../../../shared/common-service/set-modal-height.service';
import {ToastService} from '../../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sales-person-detail',
  templateUrl: './sales-person-detail.component.html',
  styleUrls: ['./sales-person-detail.component.scss']
})
export class SalesPersonDetailComponent {
  @ViewChild('salesPersonModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  salesPersonData;
  salesGroupList;
  saleTeamByGroup;
  form: FormGroup;
  dealerId;
  modalHeight: number;

  constructor(
              private formBuilder: FormBuilder,
              private loadingService: LoadingService,
              private formStoringService: FormStoringService,
              private setModalHeightService: SetModalHeightService,
              private salesGroupService: SalesGroupService,
              private salesTeamService: SalesTeamSevice,
              private salesPersonService: SalesPersonService,
              private swalAlertService: ToastService) {
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open(salesPersonData?) {
    this.salesPersonData = salesPersonData;
    this.getSalesGroupData();
    this.onResize();
    this.modal.show();
    this.buildForm();
  }

  reset() {
    this.form = undefined;
    this.saleTeamByGroup = undefined;
  }

  private getSalesGroupData() {
    this.loadingService.setDisplay(true);
    const dealerId = this.formStoringService.get(StorageKeys.currentUser).dealerId;
    this.salesGroupService.getAvailableSaleGroup(dealerId).subscribe(salesGroupData => {
      this.salesGroupList = salesGroupData;
      this.loadingService.setDisplay(false);
    });
  }

  private getSalesTeamData(groupId) {
    this.loadingService.setDisplay(true);
    this.salesTeamService.getSalesTeam(groupId, 'y').subscribe(salesTeamData => {
      this.saleTeamByGroup = salesTeamData;
      this.loadingService.setDisplay(false);
    });
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    this.loadingService.setDisplay(true);
    const value = Object.assign({}, this.form.value, {
      dealerId: this.formStoringService.get(StorageKeys.currentUser).dealerId,
      // gender: +this.form.value.gender,
      // status: +this.form.value.status,
      // birthday: this.form.value.birthday
      //   ? new Date(this.form.value.birthday).getDay() + '/' + new Date(this.form.value.birthday).getMonth() + '/' + new Date(this.form.value.birthday).getFullYear()
      //   : ''
    });
    const apiCall = this.salesPersonData
      ? this.salesPersonService.updateSalesPerson(value)
      : this.salesPersonService.createSalesPerson(value);
    apiCall.subscribe(() => {
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessModal();
      this.close.emit();
      this.modal.hide();
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [undefined],
      salesGroupId: [undefined, GlobalValidator.required],
      saleTeamId: [undefined, GlobalValidator.required],
      fullName: [undefined,  Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(255)])],
      ordering: [undefined, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.maxLength(4)])],
      birthday: [undefined, GlobalValidator.futureDate],
      position: [undefined, GlobalValidator.maxLength(255)],
      abbreviation: [undefined, GlobalValidator.maxLength(255)],
      status: ['Y'],
      gender: [undefined],
      phone: [undefined, GlobalValidator.phoneFormat],
      email: [undefined, Validators.compose([GlobalValidator.emailFormat, GlobalValidator.maxLength(255)])],
      address: [undefined, GlobalValidator.maxLength(255)],
      description: [undefined, GlobalValidator.maxLength(2000)],
    });
    this.form.get('salesGroupId').valueChanges.subscribe(value => {
      if (value) {
        this.getSalesTeamData(value);
      }
      this.form.patchValue({
        saleTeamId: undefined
      });
    });
    // Patch old Value when update data
    if (this.salesPersonData) {
      this.form.patchValue(this.salesPersonData);
    }
  }
}
