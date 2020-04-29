import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { SsiSurveyModel } from '../../../../core/models/ssi-survey/ssi-survey.model';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { ConfirmService } from '../../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'copy-black-list',
  templateUrl: './copy-black-list.component.html',
  styleUrls: ['./copy-black-list.component.scss']
})
export class CopyBlackListComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  selectedData: SsiSurveyModel;

  constructor(
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
    private confirm: ConfirmService,
  ) {
  }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      customerType: [undefined],
      customerName: [undefined],
      phoneNumber: [undefined],
      idNumber: [undefined],
      node: [undefined],

    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }

  reset() {
    this.form = undefined;
  }

  open(selectedData?) {
    if (selectedData) {
      this.selectedData = selectedData;
      this.buildForm();
      this.modal.show();
    } else {
      this.swalAlertService.openWarningToast('Chưa chọn dữ liệu, hãy chọn ít nhất một dòng');
    }
  }

  saveCopy() {
    if (this.selectedData) {
      this.confirm.openConfirmModal('Question', 'Bạn có muốn sao chép dòng này không ?').subscribe(() => {
        this.swalAlertService.openSuccessToast();
        this.close.emit(this.form.value);
        this.modal.hide();
      });
    }
  }

}
