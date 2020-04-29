import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { LaborrateModel } from '../../../../core/models/common-models/laborrate-model';
import { LaborRateMaintenanceApi } from '../../../../api/common-api/labor-rate-maintenance.api';
import { BankApi } from '../../../../api/common-api/bank.api';
import { DealerModel } from '../../../../core/models/sales/dealer.model';
import { DealerApi } from '../../../../api/sales-api/dealer/dealer.api';

@Component({
  selector: 'app-labor-rate-maintenance-modal',
  templateUrl: './labor-rate-maintenance-modal.component.html',
  styleUrls: ['./labor-rate-maintenance-modal.component.scss']
})
export class LaborRateMaintenanceModalComponent {

  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  dealers: Array<DealerModel>;
  selectedData: LaborrateModel;
  form: FormGroup;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
    private loadingService: LoadingService,
    private modalHeightService: SetModalHeightService,
    private laborRateMaintenanceApi: LaborRateMaintenanceApi,
    private dealerApi: DealerApi
  ) {
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.onResize();
    this.buildForm();
    this.modal.show();
  }

  hide() {
    this.modal.hide();
  }

  reset() {
    this.form = undefined;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const apiCall = !this.selectedData ?
      this.laborRateMaintenanceApi.create(this.form.value) : this.laborRateMaintenanceApi.update(this.form.value);

    this.loadingService.setDisplay(true);
    apiCall.subscribe(() => {
      this.close.emit();
      this.modal.hide();
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessToast();
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      dealercode: [undefined,
        Validators.compose([GlobalValidator.required])],
      id: [undefined],
      laborRate: [undefined,
        Validators.compose([GlobalValidator.required, GlobalValidator.floatNumberFormat0])],
      descvn: [undefined, Validators.compose([GlobalValidator.maxLength(255), GlobalValidator.specialCharacter])],
      pwrdlr: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.floatNumberFormat0])],
      prr: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.floatNumberFormat0])],
      freePm: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.floatNumberFormat0])],
    });
    this.getDealers();
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }

  private getDealers() {
    this.loadingService.setDisplay(true);
    this.dealerApi.getAllAvailableDealers()
      .subscribe(dealers => {
        this.dealers = dealers.filter(dealer => dealer.code !== 'TOTAL') || [];
        this.loadingService.setDisplay(false);
      });
  }
}
