import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {TcodeWarningApi} from '../../../../api/warranty/tcode-warning.api';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastService} from '../../../../shared/common-service/toast.service';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {ModalDirective} from 'ngx-bootstrap';

@Component({
  selector: 'update-t-code-warning-modal',
  templateUrl: './update-t-code-warning-modal.component.html',
  styleUrls: ['./update-t-code-warning-modal.component.scss']
})
export class UpdateTCodeWarningModalComponent implements OnInit {

  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  selectedData;
  @Input() currencyList;

  constructor(
    private loadingService: LoadingService,
    private tcodeWarningApi: TcodeWarningApi,
    private toastService: ToastService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.buildForm();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
  }

  hide() {
    this.modal.hide();
  }

  save() {
    console.log(this.form.getRawValue());
    if (this.form.invalid) {
      return;
    }
    const value = {
      dlrId: -1.0,
      updatecount: 0,
      deleteflag: 'N',
      createdBy: this.selectedData && this.selectedData.createdBy ? this.selectedData.createdBy : null,
      createDate: this.selectedData && this.selectedData.createDate ? this.selectedData.createDate : null,
      modifyDate: new Date()
    };

    const tCodeWarning = Object.assign({}, this.form.value, value);
    this.tcodeWarningApi.saveTCodeWarning(tCodeWarning).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.toastService.openSuccessModal();
      this.close.emit();
      this.modal.hide();
    });
  }
  private buildForm() {
    this.form = this.formBuilder.group({
      tcodeType: [this.selectedData ? this.selectedData.tcodeType : undefined, GlobalValidator.required],
      tcode: [this.selectedData ? this.selectedData.tcode : undefined, GlobalValidator.required],
      description: [this.selectedData ? this.selectedData.description : undefined],
      isInUse: [this.selectedData ? this.selectedData.isInUse : undefined, GlobalValidator.required],
    });
  }
}
