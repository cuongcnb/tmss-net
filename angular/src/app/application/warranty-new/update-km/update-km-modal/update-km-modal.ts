import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {RepairOrderApi} from '../../../../api/quotation/repair-order.api';
import {SwalAlertService} from '../../../../shared/swal-alert/swal-alert.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'update-km-modal',
  templateUrl: './update-km-modal.html',
  styleUrls: ['./update-km-modal.scss']
})
export class UpdateKmModalComponent implements OnInit {

  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  selectedData;
  roToUpdate;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private swalAlertService: SwalAlertService,
    private repairOrderApi: RepairOrderApi
  ) { }

  ngOnInit() {
  }

  open(selectedData) {
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
    this.repairOrderApi.findOne(this.selectedData.id).subscribe(res => {
        this.roToUpdate = res;
      }, () => this.swalAlertService.openWarningModal('Không tìm thấy dữ liệu'),
      () => this.afterSave());
  }

  afterSave() {
    if (this.form.invalid) {
      return;
    }

    this.roToUpdate.km = this.form.getRawValue().newKm ? this.form.getRawValue().newKm : this.roToUpdate.km;

    this.repairOrderApi.saveUpdateKm(this.roToUpdate).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.close.emit();
      this.modal.hide();
    }, () => this.swalAlertService.openWarningModal('Có lỗi xảy ra.'));
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      registerNo: [this.selectedData.registerNo ? this.selectedData.registerNo : undefined],
      roNo: [this.selectedData.roNo ? this.selectedData.roNo : undefined],
      km: [this.selectedData ? this.selectedData.km : undefined],
      newKm: [this.selectedData.newKm],
    });
  }
}
