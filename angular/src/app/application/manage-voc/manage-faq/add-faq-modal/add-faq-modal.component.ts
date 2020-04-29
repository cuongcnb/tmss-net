import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'add-faq-modal',
  templateUrl: './add-faq-modal.component.html',
  styleUrls: ['./add-faq-modal.component.scss'],
})
export class AddFaqModalComponent implements OnInit {

  @ViewChild('modal', {static: false}) modal: ModalDirective;
  modalHeight: number;
  form: FormGroup;
  selectedRowData;

  constructor(
    private formBuilder: FormBuilder,
    private setModalHeight: SetModalHeightService,
  ) {
  }

  ngOnInit() {
    this.onResize();
  }

  open(selectedRowData?) {
    this.buildForm();
    this.modal.show();
    if (selectedRowData) {
      this.selectedRowData = selectedRowData;
      this.form.patchValue(this.selectedRowData);
    }
  }

  onResize() {
    this.modalHeight = this.setModalHeight.onResize();
  }

  reset() {
    this.form = undefined;
  }

  close() {
    this.modal.hide();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      supplier: [undefined],
      question: [undefined],
      answer: [undefined],
      status: [true],
    });
  }
}
