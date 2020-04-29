import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DealerGroupService} from '../../../../api/master-data/dealer-group.service';

import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dealer-group-modal',
  templateUrl: './dealer-group-modal.component.html',
  styleUrls: ['./dealer-group-modal.component.scss']
})
export class DealerGroupModalComponent {
  @ViewChild('dealerGroupModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData;
  form: FormGroup;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private modalHeightService: SetModalHeightService,
    private dealerGroupService: DealerGroupService,
    private swalAlertService: ToastService,
  ) {
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(selectedData?) {

    this.selectedData = selectedData;
    this.buildForm();
    this.onResize();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const value = this.form.value;
    const apiCall = this.selectedData ?
      this.dealerGroupService.updateDealerGroup(value) : this.dealerGroupService.createDealerGroup(value);

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
      groupsName: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(50)])],
      description: [undefined, GlobalValidator.maxLength(50)],
      status: ['Y'],
      ordering: [undefined, Validators.compose([GlobalValidator.numberFormat, Validators.min(0), GlobalValidator.maxLength(4)])],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }
}
