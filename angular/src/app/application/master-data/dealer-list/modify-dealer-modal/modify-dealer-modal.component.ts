import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DealerListService} from '../../../../api/master-data/dealer-list.service';
import { DealerGroupService} from '../../../../api/master-data/dealer-group.service';
import { ProvincesService} from '../../../../api/master-data/provinces.service';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { FormStoringService } from '../../../../shared/common-service/form-storing.service';
import { StorageKeys } from '../../../../core/constains/storageKeys';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { LookupService} from '../../../../api/lookup/lookup.service';
import { LookupCodes } from '../../../../core/constains/lookup-codes';
import { LookupDataModel } from '../../../../core/models/base.model';
import { BankManagementService} from '../../../../api/master-data/bank-management.service';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'modify-dealer-modal',
  templateUrl: './modify-dealer-modal.component.html',
  styleUrls: ['./modify-dealer-modal.component.scss']
})
export class ModifyDealerModalComponent {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @Input() isDeliveryAddressRoute: boolean;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData;
  form: FormGroup;
  dealerTypes: Array<LookupDataModel>;
  dealerGroups;
  provinces;
  modalHeight: number;
  dealerList;
  bankArr;

  constructor(
    private formBuilder: FormBuilder,
    private modalHeightService: SetModalHeightService,
    private loadingService: LoadingService,
    private dealerListService: DealerListService,
    private dealerGroupService: DealerGroupService,
    private provincesService: ProvincesService,
    private formStoringService: FormStoringService,
    private lookupService: LookupService,
    private swalAlertService: ToastService,
    private bankManagementService: BankManagementService,
  ) {
  }

  private getBankList() {
    this.loadingService.setDisplay(true);
    this.bankManagementService.getAvailableBanks().subscribe(bankArr => {
      this.bankArr = bankArr;
      this.loadingService.setDisplay(false);
    });
  }

  private getDealerTypes() {
    this.loadingService.setDisplay(true);
    this.lookupService.getDataByCode(LookupCodes.dealer_type).subscribe(dealerTypes => {
      this.dealerTypes = dealerTypes;
      this.loadingService.setDisplay(false);
    });
  }

  private getDealerGroups() {
    this.loadingService.setDisplay(true);
    this.dealerGroupService.getAvailableDealers().subscribe(dealerGroups => {
      this.dealerGroups = dealerGroups;
      this.loadingService.setDisplay(false);
    });
  }

  private getProvinces() {
    this.loadingService.setDisplay(true);
    this.provincesService.getAllAvailableProvinces().subscribe(provinces => {
      this.provinces = provinces;
      this.loadingService.setDisplay(false);
    });
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(dealerList, selectedData?) {
    this.dealerList = dealerList;
    if (selectedData) {
      selectedData.formLexus = selectedData.isLexus === 'Y';
      this.selectedData = selectedData;
    }
    this.getDealerGroups();
    this.getDealerTypes();
    this.getProvinces();
    this.getBankList();
    this.buildForm();
    this.onResize();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
    this.selectedData = undefined;
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 && c1 === c2;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const val = this.form.value;
    val.isLexus = this.form.value.formLexus ? 'Y' : 'N';

    const apiCall = this.selectedData
      ? this.dealerListService.updateDealer(this.form.value)
      : this.dealerListService.createNewDealer(this.form.value);

    this.loadingService.setDisplay(true);
    apiCall.subscribe(() => {
      this.formStoringService.clear(StorageKeys.dealer);
      this.close.emit();
      this.modal.hide();
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessModal();
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [undefined],
      dealerId: [undefined],
      status: ['Y'],
      code: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(50)])],
      abbreviation: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(50)])],
      dealerTypeId: [undefined, GlobalValidator.required],
      dealerGroupId: [undefined],
      formLexus: [undefined],
      vnName: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(50)])],
      enName: [undefined, GlobalValidator.maxLength(50)],
      taxCode: [undefined, GlobalValidator.taxFormat],
      accountNo: [undefined, GlobalValidator.maxLength(50)],
      ordering: [undefined, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.maxLength(10)])],
      contactPerson: [undefined, GlobalValidator.maxLength(50)],
      phone: [undefined, GlobalValidator.phoneFormat],
      fax: [undefined, GlobalValidator.phoneFormat],
      address: [undefined, GlobalValidator.maxLength(2000)],
      receivingAddress: [undefined, GlobalValidator.maxLength(2000)],
      provinceId: [undefined, GlobalValidator.required],
      bank: [undefined],
      bankAddress: [undefined, GlobalValidator.maxLength(2000)],
      description: [undefined, GlobalValidator.maxLength(2000)]
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    } else {
      const val = this.formStoringService.get(StorageKeys.dealer);
      if (val) {
        this.form.patchValue(val);
      }
    }
    this.form.valueChanges.subscribe(data => {
      if (data) {
        this.formStoringService.set(StorageKeys.dealer, data);
      }
    });
    this.form.get('bank').valueChanges.subscribe(val => {
      if (val) {
        const matchBank = this.bankArr.find(bank => bank.id === val);
        this.form.patchValue({
          bankAddress: matchBank.address
        });
      } else {
        this.form.patchValue({
          bankAddress: ''
        });
      }
    });
  }
}
