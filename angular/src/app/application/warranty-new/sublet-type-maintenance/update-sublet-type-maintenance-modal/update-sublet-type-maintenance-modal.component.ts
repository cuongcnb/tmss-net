import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {SubletTypeMaintenanceApi} from '../../../../api/warranty/sublet-type-maintenance.api';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {ToastService} from '../../../../shared/swal-alert/toast.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap';

@Component({
  selector: 'update-sublet-type-maintenance-modal',
  templateUrl: './update-sublet-type-maintenance-modal.component.html',
  styleUrls: ['./update-sublet-type-maintenance-modal.component.scss']
})
export class UpdateSubletTypeMaintenanceModalComponent implements OnInit {

  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  selectedData;
  @Input() currencyList;

  constructor(
    private loadingService: LoadingService,
    private subletTypeMaintenanceApi: SubletTypeMaintenanceApi,
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

    const subletType = Object.assign({}, this.form.value, value, {id: this.selectedData
        ? this.selectedData.id : null});
    this.subletTypeMaintenanceApi.saveSubletType(subletType).subscribe(() => {
      this.toastService.openSuccessToast();
      this.close.emit();
      this.modal.hide();
    });
  }
  private buildForm() {
    this.form = this.formBuilder.group({
      sublettype: [this.selectedData ? this.selectedData.sublettype : undefined, GlobalValidator.required],
      desceng: [this.selectedData ? this.selectedData.desceng : undefined],
      descvn: [this.selectedData ? this.selectedData.descvn : undefined],
    });
  }

}
