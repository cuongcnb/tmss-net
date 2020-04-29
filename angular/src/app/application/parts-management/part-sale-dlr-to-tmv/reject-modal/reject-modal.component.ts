import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'reject-modal',
  templateUrl: './reject-modal.component.html',
  styleUrls: ['./reject-modal.component.scss']
})
export class RejectModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Input() modalClass: string;
  @Input() headerText: string;

  form: FormGroup;
  modalHeight: number;
  param;

  constructor(
    private formBuilder: FormBuilder,
    private setModalHeightService: SetModalHeightService
  ) {
  }

  ngOnInit() {
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  confirm() {
    const obj = {
      id: this.param.data.id,
      note: this.form.value.note
    };
    this.close.emit(obj);
    this.modal.hide();
  }

  open(param) {
    this.buildForm();
    this.modal.show();
    this.param = param;
  }

  reset() {
    this.form = undefined;
  }

  onCancelBtn() {
    this.modal.hide();
    this.cancel.emit();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      note: [undefined]
    });
  }
}
