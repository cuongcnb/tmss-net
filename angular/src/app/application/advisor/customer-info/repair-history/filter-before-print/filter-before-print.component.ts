import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../../../shared/common-service/set-modal-height.service';
import { ToastService } from '../../../../../shared/swal-alert/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'filter-before-print',
  templateUrl: './filter-before-print.component.html',
  styleUrls: ['./filter-before-print.component.scss'],
})
export class FilterBeforePrintComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  modalHeight: number;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
    private modalHeightService: SetModalHeightService,
  ) {
  }

  ngOnInit() {
    this.onResize();
  }

  open() {
    this.buildForm();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
  }

  print() {
    if (new Date(this.form.value.fromDate) > new Date(this.form.value.toDate)) {
      this.swalAlertService.openFailToast('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
      return;
    }

    this.modal.hide();
    this.close.emit();
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      fromDate: [undefined],
      toDate: [undefined],
    });
  }
}
