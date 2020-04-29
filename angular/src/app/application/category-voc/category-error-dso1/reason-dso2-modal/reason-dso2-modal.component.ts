import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CategoryErrorDso1Model } from '../../../../core/models/category-voc/category-error-dso1.model';
import { ModalDirective } from 'ngx-bootstrap';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'reason-dso2-modal',
  templateUrl: './reason-dso2-modal.component.html',
  styleUrls: ['./reason-dso2-modal.component.scss'],
})
export class ReasonDso2ModalComponent implements OnInit {

  @ViewChild('modal', {static: false}) modal: ModalDirective;
  form: FormGroup;
  selectedRowData: CategoryErrorDso1Model;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private setModalHeight: SetModalHeightService,
  ) {
  }

  ngOnInit() {
  }

  onResize() {
    this.modalHeight = this.setModalHeight.onResize();
  }

  open(selectedData?) {
    this.selectedRowData = selectedData;
    this.buildForm();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
  }

  resetForm() {
    this.form.reset();
  }

  close() {
    this.modal.hide();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      nameDSO1: [undefined],
      nameDSO2: [undefined],
      nameReasonDSO1VN: [undefined],
      codeReasonDSO2: [undefined],
      nameReasonDSO2VN: [undefined],
      nameReasonDSO2EN: [undefined],
      status: [undefined],
      stt: [undefined],
    });
  }
}
