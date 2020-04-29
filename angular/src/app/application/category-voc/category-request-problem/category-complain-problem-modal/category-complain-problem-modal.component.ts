import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { CategoryComplainProblemModel } from '../../../../core/models/category-voc/category-complain-problem.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'category-complain-problem-modal',
  templateUrl: './category-complain-problem-modal.component.html',
  styleUrls: ['./category-complain-problem-modal.component.scss'],
})
export class CategoryComplainProblemModalComponent implements OnInit {

  @ViewChild('modal', {static: false}) modal: ModalDirective;
  form: FormGroup;
  modalHeight: number;
  selectedRowData: CategoryComplainProblemModel;

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
      codeComplainProblem: [undefined],
      nameComplainProblemVN: [undefined],
      nameComplainProblemEN: [undefined],
      nameComplainField: [undefined],
      status: [undefined],
      stt: [undefined],
      description: [undefined],
    });
  }

}
