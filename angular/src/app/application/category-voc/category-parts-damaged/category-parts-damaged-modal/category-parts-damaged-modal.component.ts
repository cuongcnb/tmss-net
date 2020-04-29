import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { CategoryPartsDamagedModel } from '../../../../core/models/category-voc/category-parts-damaged.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'category-parts-damaged-modal',
  templateUrl: './category-parts-damaged-modal.component.html',
  styleUrls: ['./category-parts-damaged-modal.component.scss'],
})
export class CategoryPartsDamagedModalComponent implements OnInit {

  @ViewChild('modal', {static: false}) modal: ModalDirective;
  form: FormGroup;
  modalHeight: number;
  selectedRowData: CategoryPartsDamagedModel;

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
      nameComplainField: [undefined],
      nameComplainProblem: [undefined],
      codePartsDamaged: [undefined],
      namePartsDamagedVN: [undefined],
      namePartsDamagedEN: [undefined],
      status: [undefined],
      stt: [undefined],
    });
  }
}
