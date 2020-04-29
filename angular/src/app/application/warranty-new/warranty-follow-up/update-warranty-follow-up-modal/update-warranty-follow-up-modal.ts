import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {WarrantyFollowUpApi} from '../../../../api/warranty/warranty-follow-up.api';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'update-warranty-follow-up',
  templateUrl: './update-warranty-follow-up-modal.html',
  styleUrls: ['./update-warranty-follow-up-modal.scss']
})
export class UpdateWarrantyFollowUpModalComponent implements OnInit {

  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  selectedData;
  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private warrantyFollowUpApi: WarrantyFollowUpApi
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
    const data = this.selectedData;
    if (this.form.invalid) {
      return;
    }

    data.tsdJudgeDate = this.form.getRawValue().tsdJudgeDate;
    data.appForRepair = this.form.getRawValue().appForRepair;
    data.reqTSDDate = this.form.getRawValue().reqTSDDate;
    data.appForGemba = this.form.getRawValue().appForGemba;

    this.warrantyFollowUpApi.saveWarrFollowUp(data).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.close.emit();
      this.modal.hide();
    }, () => this.swalAlertService.openWarningModal('Có lỗi xảy ra.'));
  }
  private buildForm() {
    this.form = this.formBuilder.group({
      tsdJudgeDate: [this.selectedData ? this.selectedData.tsdJudgeDate : null],
      appForRepair: [this.selectedData ? this.selectedData.appForRepair : null],
      reqTSDDate:  [this.selectedData ? this.selectedData.reqTSDDate : null],
      appForGemba: [this.selectedData ? this.selectedData.appForGemba : null],
      remark: [this.selectedData ? this.selectedData.remark : null],
    });
  }

}
