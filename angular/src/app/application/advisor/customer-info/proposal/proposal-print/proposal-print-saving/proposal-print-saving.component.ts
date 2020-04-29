import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../../../../shared/common-service/set-modal-height.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'proposal-print-saving',
  templateUrl: './proposal-print-saving.component.html',
  styleUrls: ['./proposal-print-saving.component.scss'],
})
export class ProposalPrintSavingComponent {
  @ViewChild('modal', {static: false}) modal;
  form: FormGroup;
  modalHeight: number;
  selectedData;

  constructor(
    private formBuilder: FormBuilder,
    private setModalHeightService: SetModalHeightService,
  ) {
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  reset() {
    this.form = undefined;
  }

  open() {
    this.buildForm();
    this.modal.show();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      registerno: [{value: undefined, disabled: true}],
      ro: [{value: undefined, disabled: true}],
      note: [undefined],
    });
  }
}
