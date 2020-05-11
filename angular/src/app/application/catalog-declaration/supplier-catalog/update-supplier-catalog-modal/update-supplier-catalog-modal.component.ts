import { Component, EventEmitter, OnInit, Output, ViewChild, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { SuppliersCommonApi } from '../../../../api/common-api/suppliers-common.api';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { CountryModel } from '../../../../core/models/common-models/country-model';
import { BankModel } from '../../../../core/models/common-models/bank-model';
import { BankApi } from '../../../../api/common-api/bank.api';
import { CountryApi } from '../../../../api/common-api/country.api';
import { SupplierCatalogModel } from '../../../../core/models/catalog-declaration/supplier-catalog.model';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'update-supplier-catalog-modal',
  templateUrl: './update-supplier-catalog-modal.component.html',
  styleUrls: ['./update-supplier-catalog-modal.component.scss']
})
export class UpdateSupplierCatalogModalComponent extends AppComponentBase implements OnInit {
  @ViewChild('supplierModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData: SupplierCatalogModel;
  form: FormGroup;
  modalHeight: number;
  countryList: Array<CountryModel>;
  bankList: Array<BankModel>;

  constructor(
    injector: Injector,
    private formBuilder: FormBuilder,
    private setModalHeightService: SetModalHeightService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private suppliersApi: SuppliersCommonApi,
    private bankApi: BankApi,
    private countryApi: CountryApi,
  ) {
    super(injector);
  }

  ngOnInit() {
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.buildForm();
    this.modal.show();
    this.onResize();
    this.getBanks();
    this.getCountries();
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    const apiCall = this.selectedData
      ? this.suppliersApi.update(this.form.value)
      : this.suppliersApi.create(this.form.value);

    this.loadingService.setDisplay(true);
    apiCall.subscribe(() => {
      this.swalAlertService.openSuccessToast();
      this.close.emit();
      this.modal.hide();
    });
  }

  reset() {
    this.form = undefined;
  }

  buildForm() {
    this.form = this.formBuilder.group({
      supplierCode: [undefined, [GlobalValidator.required, GlobalValidator.maxLength(20), GlobalValidator.specialCharacter]],
      id: [undefined],
      dlrId: [this.currentUser.dealerId],
      status: ['Y'],
      supplierName: [undefined, [GlobalValidator.maxLength(50), GlobalValidator.specialCharacter]],
      address: [undefined, GlobalValidator.maxLength(50)],
      tel: [undefined, GlobalValidator.phoneFormat],
      fax: [undefined, GlobalValidator.phoneFormat],
      leadTime: [undefined,
        Validators.compose([GlobalValidator.required, GlobalValidator.floatNumberFormat, GlobalValidator.maxLength(19)])],
      taxcode: [undefined, GlobalValidator.taxFormat],
      contryId: [undefined], // lấy id từ danh sách
      email: [undefined, Validators.compose([GlobalValidator.emailFormat, GlobalValidator.maxLength(50)])],
      accNo: [undefined, GlobalValidator.maxLength(30)],
      bankId: [undefined], // lấy id từ danh sách
      pic: [undefined, GlobalValidator.maxLength(100)],
      picTel: [undefined, GlobalValidator.phoneFormat],
      picMobi: [undefined, GlobalValidator.phoneFormat],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
      this.form.patchValue({
        contryId: this.selectedData.ctId,
        taxcode: this.selectedData.taxCode,
        picTel: this.selectedData.pic_tel,
        picMobi: this.selectedData.pic_mobi,
      });
    }
  }

  private getBanks() {
    this.loadingService.setDisplay(true);
    this.bankApi.getBanksByDealer().subscribe(banks => {
      this.bankList = banks || [];
      this.loadingService.setDisplay(false);
    });
  }

  private getCountries() {
    this.loadingService.setDisplay(true);
    this.countryApi.getAll().subscribe(countries => {
      this.countryList = countries || [];
      this.loadingService.setDisplay(false);
    });
  }
}
