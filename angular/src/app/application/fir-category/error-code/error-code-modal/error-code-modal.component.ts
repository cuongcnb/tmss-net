import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FirCategoryModel } from '../../../../core/models/fir-category/fir-category.model';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'error-code-modal',
  templateUrl: './error-code-modal.component.html',
  styleUrls: ['./error-code-modal.component.scss']
})
export class ErrorCodeModalComponent implements OnInit {
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  form: FormGroup;
  modalHeight: number;
  selectedData: FirCategoryModel;

  constructor(
    private modalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.onResize();
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
    this.modal.hide();
    this.close.emit(this.form.value);
  }

  resetForm() {
    this.form.reset();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      errorName: [undefined],
      errorField: [undefined],
      errorCause: [undefined],
      codeCause: [undefined],
      isSerial: [undefined],
      coreReason: [undefined],
      isStatus: [undefined],
      isDescribe: [undefined],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }
}
