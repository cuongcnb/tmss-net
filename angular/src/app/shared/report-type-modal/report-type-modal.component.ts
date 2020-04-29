import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { SetModalHeightService } from '../common-service/set-modal-height.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'report-type-modal',
  templateUrl: './report-type-modal.component.html',
  styleUrls: ['./report-type-modal.component.scss'],
})
export class ReportTypeModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('btn', {static: false}) btn: ElementRef;
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
    private setModalHeightService: SetModalHeightService,
  ) {}

  ngOnInit() {}

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  confirm() {
    const data = {
      extension: this.form.value.extension,
      type: this.type,
    };
    this.close.emit(data);
    this.modal.hide();
  }

  open(type?) {
    this.buildForm();
    this.modal.show();
    this.type = type;
    setTimeout(() => {
      this.btn.nativeElement.focus();
    }, 200);
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
      // report type
      extension: ['doc'],
    });
  }
}
