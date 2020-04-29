import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {ToastService} from '../../../../shared/common-service/toast.service';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {VendorMaintenanceApi} from '../../../../api/warranty/vendor-maintenance.api';

@Component({
  selector: 'update-vendor-maintenance-modal',
  templateUrl: './update-vendor-maintenance-modal.component.html',
  styleUrls: ['./update-vendor-maintenance-modal.component.scss']
})
export class UpdateVendorMaintenanceModalComponent implements OnInit {

  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  selectedData;
  @Input() currencyList;

  constructor(
    private loadingService: LoadingService,
    private vendorMaintenanceApi: VendorMaintenanceApi,
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
    this.vendorMaintenanceApi.saveVendorMaintenance(this.form.getRawValue()).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.toastService.openSuccessModal();
      this.close.emit();
      this.modal.hide();
    });
  }
  private buildForm() {
    this.form = this.formBuilder.group({
      venCode: [this.selectedData ? this.selectedData.venCode : null, GlobalValidator.required],
      venNameVn: [this.selectedData ? this.selectedData.venNameVn : null],
      venNameEng: [this.selectedData ? this.selectedData.venNameEng : null],
      pwr1: [this.selectedData ? this.selectedData.pwr1 : null, GlobalValidator.required],
      pwr2: [this.selectedData ? this.selectedData.pwr2 : null, GlobalValidator.required],
      pwr3: [this.selectedData ? this.selectedData.pwr3 : null],
      pwr1New: [this.selectedData ? this.selectedData.pwr1New : null, GlobalValidator.required],
      pwr2New: [this.selectedData ? this.selectedData.pwr2New : null, GlobalValidator.required],
      pwr3New: [this.selectedData ? this.selectedData.pwr3New : null],
      pwrChangeDate: [this.selectedData ? this.selectedData.pwrChangeDate : null],
      twcFlatRate: [this.selectedData ? this.selectedData.twcFlatRate : null, GlobalValidator.required],
      twcCurrencyCode: [this.selectedData ? this.selectedData.twcCurrencyCode : null, GlobalValidator.required],
      twcLaborCode: [this.selectedData ? this.selectedData.twcLaborCode : null, GlobalValidator.required],
      twcJudSystem: [this.selectedData ? this.selectedData.twcJudSystem : null, GlobalValidator.required],
      tactVenCode: [this.selectedData ? this.selectedData.tactVenCode : null],
      venNameAbbr: [this.selectedData ? this.selectedData.venNameAbbr : null],
      distCode: [this.selectedData ? this.selectedData.distCode : null],
      prr: [this.selectedData ? this.selectedData.prr : null, GlobalValidator.required]
    });
  }

}
