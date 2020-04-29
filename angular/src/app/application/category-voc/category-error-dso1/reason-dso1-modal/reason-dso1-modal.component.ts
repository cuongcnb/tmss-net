import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { CategoryErrorDso1Model } from '../../../../core/models/category-voc/category-error-dso1.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'reason-dso1-modal',
  templateUrl: './reason-dso1-modal.component.html',
  styleUrls: ['./reason-dso1-modal.component.scss'],
})
export class ReasonDso1ModalComponent implements OnInit {

  @ViewChild('modal', {static: false}) modal: ModalDirective;
  form: FormGroup;
  modalHeight: number;
  selectedRowData: CategoryErrorDso1Model;

  constructor(
    private formBuilder: FormBuilder,
    private setModalHeight: SetModalHeightService,
  ) {
  }

  ngOnInit() {
    this.onResize();
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
      codeReasonDSO1: [undefined],
      nameReasonDSO1EN: [undefined],
      nameReasonDSO1VN: [undefined],
      status: [undefined],
      stt: [undefined],
    });
  }
}
