import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'regis-test-drive-detail',
  templateUrl: './regis-test-drive-detail.component.html',
  styleUrls: ['./regis-test-drive-detail.component.scss'],
})
export class RegisTestDriveDetailComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  modalHeight: number;
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

  private buildForm() {
    this.form = this.formBuilder.group({
      makh: [undefined],
      tenkh: [undefined],
      birthday: [undefined],
      sex: [undefined],
      sdt: [undefined],
      email: [undefined],
      date: [undefined],
      manv: [undefined],
      tennv: [undefined],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }
}
