import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { CategoryRequestProblemModel } from '../../../../core/models/category-voc/category-request-problem.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'category-request-problem-modal',
  templateUrl: './category-request-problem-modal.component.html',
  styleUrls: ['./category-request-problem-modal.component.scss'],
})
export class CategoryRequestProblemModalComponent implements OnInit {

  @ViewChild('modal', {static: false}) modal: ModalDirective;
  form: FormGroup;
  modalHeight: number;
  selectedRowData: CategoryRequestProblemModel;

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

  reset() {
    this.form = undefined;
  }

  open(selectedData?) {
    this.buildForm();
    this.modal.show();
    this.selectedRowData = selectedData;
  }

  resetForm() {
    this.form.reset();
  }

  close() {
    this.modal.hide();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      codeRequestProblem: [undefined],
      nameRequestProblemVN: [undefined],
      nameRequestProblemEN: [undefined],
      nameRequestField: [undefined],
      status: [undefined],
      stt: [undefined],
      description: [undefined],
    });
  }
}
