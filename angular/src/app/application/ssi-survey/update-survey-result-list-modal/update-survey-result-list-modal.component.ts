import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SsiSurveyModel } from '../../../core/models/ssi-survey/ssi-survey.model';
import { ToastService } from '../../../shared/swal-alert/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'update-survey-result-list-modal',
  templateUrl: './update-survey-result-list-modal.component.html',
  styleUrls: ['./update-survey-result-list-modal.component.scss']
})
export class UpdateSurveyResultListModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) moda1: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  @Output() dataOutput;
  form: FormGroup;
  selectedData: SsiSurveyModel;
  data;
  constructor(
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
  ) {
  }

  ngOnInit() {
    this.buildForm();
  }

  reset() {
    this.form = undefined;
  }

  open(selectedData?) {
    if (selectedData) {
      this.selectedData = selectedData;
      this.buildForm();
      this.moda1.show();
    } else {
      this.swalAlertService.openWarningToast('Chưa chọn dữ liệu, hãy chọn ít nhất một dòng');
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      customerName: [undefined],
      customerAdd: [undefined],
      phoneNumber: [undefined],
      contactName: [undefined],
      contactPhoneNumber: [undefined],
      agency: [undefined],
      dayCreateQuestion: [undefined],
      daySurvey: [undefined]
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }
  save() {
    this.close.emit(this.form.value);
    this.moda1.hide();
    this.form = undefined;
  }
}
