import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { CsiSurveyModel } from '../../../../core/models/csi-survey/csi.model';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastService } from '../../../../shared/swal-alert/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'remove-customer-modal',
  templateUrl: './remove-customer-modal.component.html',
  styleUrls: ['./remove-customer-modal.component.scss']
})
export class RemoveCustomerModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  form: FormGroup;
  modalHeight: number;
  selectedData: CsiSurveyModel;
  constructor(
    private formBuilder: FormBuilder,
    private setModalHeight: SetModalHeightService ,
    private swalAlert: ToastService,
  ) { }

  ngOnInit() {
    this.buildForm();
  }
  open(selectData?) {
    if (selectData) {
      this.selectedData = selectData;
      this.buildForm();
      this.modal.show();
    } else {
      this.swalAlert.openWarningToast('Chưa chọn dữ liệu, hãy chọn ít nhất một dòng');
    }
  }
  onResize() {
    this.modalHeight = this.setModalHeight.onResize();
  }
  reset() {
    this.form = undefined;
  }
  save() {
  }
  private buildForm() {
    this.form = this.formBuilder.group({
      revenue: [undefined],
      inBlackList: [undefined],
      illegalPhoneNumber: [undefined],
      suggestionsList: [undefined],
      overTimeService: [undefined],
      lexusCbuList: [undefined],
      phoneNumberRepeat: [undefined],
    });
  }

}
