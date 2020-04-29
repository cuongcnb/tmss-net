import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetModalHeightService } from '../../../../../shared/common-service/set-modal-height.service';
import { GlobalValidator } from '../../../../../shared/form-validation/validators';
import { LoadingService } from '../../../../../shared/loading/loading.service';
import { StandardizeCustomerApi } from '../../../../../api/customer/standardize-customer.api';
import { CusDetailModel } from '../../../../../core/models/advisor/standarize-customer-info.model';
import { ToastService } from '../../../../../shared/swal-alert/toast.service';
import { CustomerDetailType } from '../../../../../core/constains/customer-detail';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'standardize-cus-info-detail-modal',
  templateUrl: './standardize-cus-info-detail-modal.component.html',
  styleUrls: ['./standardize-cus-info-detail-modal.component.scss'],
})
export class StandardizeCusInfoDetailModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  modalHeight: number;
  selectedData: Array<CusDetailModel>;
  cusParentId: number;
  selectedTab: string;
  tabs: Array<string>;
  choosingData;
  listId;
  customerDetailType = CustomerDetailType;

  constructor(
    private setModalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
    private loading: LoadingService,
    private standardizeCustomerApi: StandardizeCustomerApi,
    private swalAlert: ToastService,
  ) {
  }

  ngOnInit() {
    this.initTabs();
    this.onResize();
  }

  reset() {
    this.cusParentId = undefined;
    this.selectedData = undefined;
    this.choosingData = undefined;
  }

  selectTab(tab) {
    this.selectedTab = tab;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const formValue = Object.assign({}, this.form.value, {
      cusDIdString: this.listId.toString(),
      cusId: this.cusParentId,
    });
    this.loading.setDisplay(true);
    this.standardizeCustomerApi.mergeCustomerDetailInfor(this.cusParentId, formValue).subscribe(() => {
      this.loading.setDisplay(false);
      this.swalAlert.openSuccessToast();
      this.close.emit(this.cusParentId);
      this.modal.hide();
    });
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  patchData(newData) {
    this.form.patchValue({
      [newData.fieldName]: newData.data,
    });
  }

  open(cusParentId, selectedData) {
    this.cusParentId = cusParentId;
    this.selectedData = selectedData;
    this.choosingData = Object.assign({}, {
      name: this.selectedData.map(cus => cus.name),
      address: this.selectedData.map(cus => cus.address),
      idnumber: this.selectedData.map(cus => cus.idnumber),
      email: this.selectedData.map(cus => cus.email),
      tel: this.selectedData.map(cus => cus.tel),
      mobil: this.selectedData.map(cus => cus.mobil),
    });
    this.listId = this.selectedData.map(cus => cus.id);
    this.buildForm();
    this.modal.show();
  }

  private initTabs() {
    this.tabs = ['Thông tin chi tiết KH', 'Thông tin LSC'];
    this.selectedTab = this.tabs[0];
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [undefined],
      name: [undefined, GlobalValidator.required],
      address: [undefined],
      idnumber: [undefined], // CMTND
      email: [undefined, GlobalValidator.emailFormat],
      tel: [undefined, GlobalValidator.phoneFormat], // sdt
      type: [undefined],
      mobil: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.phoneFormat])], // di dong
    });
  }
}
