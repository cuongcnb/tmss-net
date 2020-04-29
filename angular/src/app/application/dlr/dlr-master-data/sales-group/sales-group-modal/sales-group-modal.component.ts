import {Component, EventEmitter, Output, ViewChild, OnInit} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SalesGroupService} from '../../../../../api/dlr-master-data/sales-group.service';
import {LoadingService} from '../../../../../shared/loading/loading.service';
import {StorageKeys} from '../../../../../core/constains/storageKeys';
import {FormStoringService} from '../../../../../shared/common-service/form-storing.service';
import {GlobalValidator} from '../../../../../shared/form-validation/validators';
import {SetModalHeightService} from '../../../../../shared/common-service/set-modal-height.service';
import {ToastService} from '../../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sales-group-modal',
  templateUrl: './sales-group-modal.component.html',
  styleUrls: ['./sales-group-modal.component.scss']
})
export class SalesGroupModalComponent implements OnInit {
  @ViewChild('salesGroupModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData;
  groupId: string;
  form: FormGroup;
  dealerId;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private formStoringService: FormStoringService,
    private setModalHeightService: SetModalHeightService,
    private salesGroupService: SalesGroupService,
    private swalAlertService: ToastService
  ) {
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open(groupId?: string, selectedData?) {
    this.selectedData = selectedData;
    this.groupId = groupId;
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
    this.loadingService.setDisplay(true);
    const value = Object.assign({}, this.form.value, {
      dealerId: this.formStoringService.get(StorageKeys.currentUser).dealerId
    });
    const apiCall = !this.selectedData ?
      this.salesGroupService.createSalesGroup(value) : this.salesGroupService.updateSalesGroup(value);
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
      groupName: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(100)])],
      reportName: [undefined, GlobalValidator.maxLength(100)],
      ordering: [undefined, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.maxLength(4)])],
      status: ['Y'],
      managerName: [undefined, GlobalValidator.maxLength(100)],
      description: [undefined, GlobalValidator.maxLength(255)],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }


}
