import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'new-promotion-detail',
  templateUrl: './new-promotion-detail.component.html',
  styleUrls: ['./new-promotion-detail.component.scss'],
})
export class NewPromotionDetailComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  modalHeight: number;
  fieldGrid;
  params;
  form: FormGroup;
  selectedData;

  constructor(
    private formBuilder: FormBuilder,
    private setModalHeightService: SetModalHeightService,
  ) {
  }

  ngOnInit() {
    this.onResize();
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.onResize();
    this.buildForm();
    this.modal.show();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  closeModal() {
    this.modal.hide();
    this.close.emit();
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    this.modal.hide();
    this.close.emit(this.form.value);
  }

  reset() {
    this.params.api.setRowData([]);
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      title: [undefined],
      NewsType: [undefined],
      content: [undefined],
      times: [undefined],
      enName: [undefined],
      newsStatus: ['Y'],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }
}
