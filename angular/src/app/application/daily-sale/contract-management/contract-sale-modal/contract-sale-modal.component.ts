import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {ContractManagementService} from '../../../../api/daily-sale/contract-management.service';
import {LookupCodes} from '../../../../core/constains/lookup-codes';
import {LookupDataModel} from '../../../../core/models/base.model';
import {LookupService} from '../../../../api/lookup/lookup.service';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {BankManagementService} from '../../../../api/master-data/bank-management.service';
import {InsuranceCompanyService} from '../../../../api/master-data/insurance-company.service';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {ToastService} from '../../../../shared/common-service/toast.service';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'contract-sale-modal',
  templateUrl: './contract-sale-modal.component.html',
  styleUrls: ['./contract-sale-modal.component.scss']
})
export class ContractSaleModalComponent implements OnInit {
  @ViewChild('contractSaleModal', {static: false}) modal: ModalDirective;
  @ViewChild('confirmChangeCustomerInfo', {static: false}) confirmChangeCustomerInfo;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  banks;
  companies;
  paymentTypes: Array<LookupDataModel>;
  modalHeight: number;
  vehicles: Array<any>;
  salesData;
  // minDate;
  // maxDate;
  // daysDisabled = [0];

  constructor(
    private formBuilder: FormBuilder,
    private contractManagementService: ContractManagementService,
    private swalAlertService: ToastService,
    private bankService: BankManagementService,
    private loadingService: LoadingService,
    private insuranceCompanyService: InsuranceCompanyService,
    private lookupService: LookupService,
    private setModalHeightService: SetModalHeightService,
    private dataFormatService: DataFormatService
  ) {
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open(selectedFollowUpId) {
    this.lookupService.getDataByCode(LookupCodes.payment_type).subscribe(types => this.paymentTypes = types);
    this.bankService.getAvailableBanks().subscribe(banks => this.banks = banks);
    this.contractManagementService.getSalesData(selectedFollowUpId).subscribe(val => {
      this.vehicles = val.vehicleToSaleList;
      this.buildForm(val.salesResponseData);
    });
    this.modal.show();
  }

  salesVehicle() {
    const formValue = this.form.getRawValue();
    const data = Object.assign({}, formValue, {
      orderPrice: this.convertStringToInt(formValue.orderPrice),
      discountPrice: this.convertStringToInt(formValue.discountPrice)
    });
    this.loadingService.setDisplay(true);
    this.contractManagementService.saleContract(data).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.close.emit();
      this.modal.hide();
    });
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const formValue = this.form.value;
    if (formValue.paymentTypeId !== this.paymentTypes.find(item => item.name === 'Trả thẳng').id && !formValue.bankId) {
      this.swalAlertService.openFailModal('You must choose bank');
      return;
    }
    if (formValue.customerName !== this.salesData.customerName || formValue.customerAddress !== this.salesData.customerAddress) {
      this.confirmChangeCustomerInfo.show();
    } else {
      this.salesVehicle();
    }
  }

  private convertStringToInt(val) {
    if (val) {
      if (typeof val === 'string') {
        return parseInt(val.replace(/,/g, ''), 10);
      } else {
        return val;
      }
    }
    return null;
  }

  private buildForm(val) {
    this.salesData = val;
    this.form = this.formBuilder.group({
      id: [undefined],
      customerName: [undefined],
      customerAddress: [undefined, GlobalValidator.required],
      invoiceName: [undefined, GlobalValidator.required],
      invoiceAddress: [undefined, GlobalValidator.required],
      contractNo: [{value: undefined, disabled: true}],
      wodDate: [{value: undefined, disabled: true}],
      grade: [{value: undefined, disabled: true}],
      gradeProduction: [{value: undefined, disabled: true}],
      color: [{value: undefined, disabled: true}],
      interiorColor: [{value: undefined, disabled: true}],
      vehicleId: [undefined, GlobalValidator.required],
      salesDate: [undefined, Validators.compose([GlobalValidator.required])],
      orderPrice: [undefined, [GlobalValidator.required, GlobalValidator.numberFormat]],
      invoiceNo: [undefined],
      discountPrice: [undefined, GlobalValidator.numberFormat],
      commissionPrice: [undefined, GlobalValidator.numberFormat],
      otherPromotionValue: [undefined, GlobalValidator.numberFormat],
      paymentTypeId: [undefined],
      bankId: [undefined],
      dlrRemarkForCs: [undefined],
      buyInsurance: [undefined],
      insuranceCompanyName: [{value: undefined, disabled: true}]
    });
    // if (new Date().getHours() >= 12) {
    //   this.minDate = new Date();
    // } else {
    //   if (new Date().getDay() === 1) {
    //     this.minDate = new Date(new Date().setDate(new Date().getDate() - 2));
    //     return;
    //   }
    //   this.minDate = new Date(new Date().setDate(new Date().getDate() - 1));
    // }
    // this.maxDate = new Date();
    if (this.salesData) {
      this.form.patchValue(val);
      this.dataFormatService.formatMoneyForm(this.form, 'orderPrice');
      this.dataFormatService.formatMoneyForm(this.form, 'discountPrice');
    }
    this.watchFormValueChanges();
  }

  private watchFormValueChanges() {
    const insuranceName = this.form.get('insuranceCompanyName');
    this.form.get('buyInsurance').valueChanges.subscribe(val => {
      if (val && val === 'Y') {
        insuranceName.enable();
        this.insuranceCompanyService.getInsuranceCompanyTable().subscribe(companies => this.companies = companies);
      } else {
        insuranceName.disable();
      }
    });
  }
}
