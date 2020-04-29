import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'report-modal',
  templateUrl: './report-modal.component.html',
  styleUrls: ['./report-modal.component.scss']
})
export class ReportModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Input() modalClass: string;
  @Input() headerText: string;

  form: FormGroup;
  modalHeight: number;
  type;

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
    const data = {
      ...this.form.value,
      type: this.type
    };
    this.close.emit(data);
    this.modal.hide();
  }

  open(type?) {
    this.buildForm();
    this.modal.show();
    this.type = type;
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
      fromDate: [new Date()],
      toDate: [new Date()],
      region: ['N'],
      extension: ['doc']
    });
  }
}
