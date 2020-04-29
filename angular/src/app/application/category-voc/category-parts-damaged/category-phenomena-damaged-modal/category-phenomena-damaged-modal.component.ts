import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { CategoryPhenomenaDamagedModel } from '../../../../core/models/category-voc/category-phenomena-damaged.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'category-phenomena-damaged-modal',
  templateUrl: './category-phenomena-damaged-modal.component.html',
  styleUrls: ['./category-phenomena-damaged-modal.component.scss'],
})
export class CategoryPhenomenaDamagedModalComponent implements OnInit {

  @ViewChild('modal', {static: false}) modal: ModalDirective;
  form: FormGroup;
  modalHeight: number;
  selectedRowData: CategoryPhenomenaDamagedModel;

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
    this.form.reset();
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
      namePartsDamaged: [undefined],
      codePhenomenaDamaged: [undefined],
      namePhenomenaDamagedVN: [undefined],
      namePhenomenaDamagedEN: [undefined],
      status: [undefined],
      stt: [undefined],
    });
  }
}
