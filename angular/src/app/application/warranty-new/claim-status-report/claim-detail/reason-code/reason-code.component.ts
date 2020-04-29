import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorCodeApi } from '../../../../../api/common-api/error-code.api';
import { ModalDirective } from 'ngx-bootstrap';
import { SetModalHeightService } from '../../../../../shared/common-service/set-modal-height.service';
import { GlobalValidator } from '../../../../../shared/form-validation/validators';
import { LoadingService } from '../../../../../shared/loading/loading.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'reason-code',
  templateUrl: './reason-code.component.html',
  styleUrls: ['./reason-code.component.scss', '../claim-detail.component.scss'],
})
export class ReasonCodeComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('findReasonCodeModal', {static: false}) findReasonCodeModal;
  form: FormGroup;

  fieldErrorCode;
  modalHeight;
  action;
  reasonCodes: Array<any>;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter<any>();
  @Input() sourceTable: string;

  constructor(
    private loadingService: LoadingService,
    private errorCodeApi: ErrorCodeApi,
    private formBuilder: FormBuilder,
    private setModalHeightService: SetModalHeightService
  ) {
    this.fieldErrorCode = [
      {
        headerName: 'Error Code',
        headerTooltip: 'Error Code',
        field: 'errcode',
        width: 50,
      },
      {
        headerName: 'Desc English',
        headerTooltip: 'Desc English',
        field: 'errdesceng',
      },
    ];
  }

  ngOnInit() {
  }

  open(action) {
    this.action = action;
    this.getAllReasonCode();
    this.buildForm();
    this.modal.show();
  }

  getAllReasonCode() {
    this.loadingService.setDisplay(true);
    this.errorCodeApi.searchErrorCode().subscribe(val => {
      this.loadingService.setDisplay(false);
      this.reasonCodes = val;
    });
  }

  validateResonCode() {
    return (control: FormControl) => {
      if (control.value == null || control.value === '') {
        return null;
      }
      const map = this.reasonCodes.filter(item => item.errcode === control.value);
      return !map.length ? { reasonCode: true } : null;
    };
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResizeWithoutFooter();
  }

  apiResonCodeCall(val) {
    return this.errorCodeApi.searchErrorCode({ errCode: val.errCode || null });
  }

  setReasonCodeDataToRow(data) {
    this.form.get('reasonCode').setValue(data.errcode);
  }

  searchErrorCode(event) {
    this.findReasonCodeModal.open({ errCode: event.target.value });
  }

  confirm() {
    if (this.form.invalid) {
      return;
    }
    this.close.emit({ errcode: this.form.get('reasonCode').value, action: this.action });
    this.modal.hide();
  }

  reset() {
    this.form = undefined;
  }

  buildForm() {
    this.form = this.formBuilder.group({
      reasonCode: [undefined, Validators.compose([GlobalValidator.required, this.validateResonCode()])],
    });
  }
}
