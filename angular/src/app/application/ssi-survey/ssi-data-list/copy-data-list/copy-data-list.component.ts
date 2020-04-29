import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { ModalDirective } from 'ngx-bootstrap';
import { SsiSurveyModel } from '../../../../core/models/ssi-survey/ssi-survey.model';
import { ConfirmService } from '../../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'copy-data-list',
  templateUrl: './copy-data-list.component.html',
  styleUrls: ['./copy-data-list.component.scss']
})
export class CopyDataListComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  selectedData: SsiSurveyModel;


  constructor(
    private formBuilder: FormBuilder,
    private swalAlert: ToastService,
    private confirm: ConfirmService,
  ) {
  }

  ngOnInit() {
    this.buildForm();
  }

  open(selectedData?) {
    if (selectedData) {
      this.selectedData = selectedData;
      this.buildForm();
      this.modal.show();
    } else {
      this.swalAlert.openWarningToast('Chưa chọn dữ liệu, hãy chọn ít nhất một dòng');
    }
  }

  reset() {
    this.form = undefined;
  }

  saveCopy() {
    if (this.selectedData) {
      this.confirm.openConfirmModal('Question', 'Bạn có muốn sao chép dòng này không ?').subscribe(() => {
        this.swalAlert.openSuccessToast();
        this.close.emit(this.form.value);
        this.modal.hide();
      });
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      surveyType: [undefined],
      colData: [undefined],
      dataType: [undefined],
      dataName: [undefined],
      status: [undefined],
      node: [undefined],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }
}
