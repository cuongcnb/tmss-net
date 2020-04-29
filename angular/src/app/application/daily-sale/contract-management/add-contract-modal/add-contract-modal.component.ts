import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContractManagementService } from '../../../../api/daily-sale/contract-management.service';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { FormStoringService } from '../../../../shared/common-service/form-storing.service';
import { StorageKeys } from '../../../../core/constains/storageKeys';
import { LookupDataModel } from '../../../../core/models/base.model';
import { LookupService } from '../../../../api/lookup/lookup.service';
import { LookupCodes } from '../../../../core/constains/lookup-codes';
import { ProvincesService } from '../../../../api/master-data/provinces.service';
import { ProvincesModel } from '../../../../core/models/sales/provinces.model';
import { DistrictListService } from '../../../../api/master-data/district-list.service';
import { DistrictOfProvinceModel } from '../../../../core/models/sales/district-list.model';
import { GradeListService } from '../../../../api/master-data/grade-list.service';
import { GradeListModel } from '../../../../core/models/sales/model-list.model';
import { DealerListService } from '../../../../api/master-data/dealer-list.service';
import { GradeProductionService } from '../../../../api/master-data/grade-production.service';
import { ColorAssignmentService } from '../../../../api/master-data/color-assignment.service';
import { InteriorAssignmentService } from '../../../../api/master-data/interior-assignment.service';
import { MoneyDefineService } from '../../../../api/master-data/money-define.service';
import { SalesPersonService } from '../../../../api/dlr-master-data/sales-person.service';
import { DataFormatService } from '../../../../shared/common-service/data-format.service';
import { ToastService } from '../../../../shared/common-service/toast.service';
import { isObject } from 'util';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'add-contract-modal',
  templateUrl: './add-contract-modal.component.html',
  styleUrls: ['./add-contract-modal.component.scss']
})
export class AddContractModalComponent implements OnInit {
  @ViewChild('addContractModal', { static: false }) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  fleetData;
  form: FormGroup;
  gridField;
  selectedFollowUp;
  totalContract: number;
  modalHeight: number;

  paymentTypes: Array<LookupDataModel>;
  reasons: Array<LookupDataModel>;
  legalStatus: Array<LookupDataModel>;
  genders: Array<LookupDataModel>;
  ageGroups: Array<LookupDataModel>;
  purchasingTypes: Array<LookupDataModel>;
  purchasingPurposes: Array<LookupDataModel>;
  drivingTypes: Array<LookupDataModel>;
  legalStatusList: Array<LookupDataModel>;
  relationships: Array<string>;
  provinceList: Array<ProvincesModel>;
  districtsOfProvince: Array<DistrictOfProvinceModel> = [];
  gradeList: Array<GradeListModel>;
  dealerList;
  saleDealers: Array<LookupDataModel>;
  products;
  colorAssignments: Array<any> = [];
  interiorColorAssignments: Array<any> = [];
  salePersons;
  salesStaffGridField;
  myDateValue: Date = new Date();
  isSoldContract: boolean;
  vehicleTypeList = [
    { key: 'Y', value: 'CBU' },
    { key: 'N', value: 'CKD' },
    { key: 'L', value: 'Lexus' }
  ];
  disabledFields: Array<string> = [];

  constructor(
    private formBuilder: FormBuilder,
    private contractManagementService: ContractManagementService,
    private formStoringService: FormStoringService,
    private loadingService: LoadingService,
    private salesPersonService: SalesPersonService,
    private swalAlertService: ToastService,
    private gradeProductionService: GradeProductionService,
    private interiorColorListService: InteriorAssignmentService,
    private colorAssignmentService: ColorAssignmentService,
    private lookupService: LookupService,
    private moneyService: MoneyDefineService,
    private setModalHeightService: SetModalHeightService,
    private provincesService: ProvincesService,
    private districtListService: DistrictListService,
    private gradeListService: GradeListService,
    private dealerListService: DealerListService,
    private dataFormatService: DataFormatService
  ) {
    this.gridField = [
      { field: 'refNo', minWidth: 100 },
      { field: 'contactAddress', minWidth: 130 },
      { field: 'contactName', minWidth: 120 },
      { field: 'contactTel', minWidth: 120 },
      { field: 'customerAddress', minWidth: 130 },
      { field: 'customerName', minWidth: 130 },
      { field: 'fax', minWidth: 70 },
      { field: 'invoiceAddress', minWidth: 130 },
      { field: 'invoiceName', minWidth: 120 },
      { field: 'taxCode', minWidth: 80 },
      { field: 'tel', minWidth: 70 }
    ];

    this.salesStaffGridField = [
      { field: 'fullName', minWidth: 120 },
      { field: 'groupName', minWidth: 120 },
      { field: 'teamName', minWidth: 120 }
    ];
  }

  ngOnInit() {
    this.onResize();
    this.relationships = ['Father', 'Mother', 'Wife', 'Husband', 'Brother/Sister', 'Other'];
    this.lookupService.getDataByCode(LookupCodes.payment_type).subscribe(types => this.paymentTypes = types);
    this.lookupService.getDataByCode(LookupCodes.estimated_reason).subscribe(reasons => this.reasons = reasons);
    this.lookupService.getDataByCode(LookupCodes.legal_status).subscribe(legalStatus => this.legalStatus = legalStatus);
    this.lookupService.getDataByCode(LookupCodes.gender).subscribe(genders => this.genders = genders);
    this.lookupService.getDataByCode(LookupCodes.age_lead_time).subscribe(ageGroups => this.ageGroups = ageGroups);
    this.lookupService.getDataByCode(LookupCodes.purchasing_type).subscribe(purchasingTypes => this.purchasingTypes = purchasingTypes);
    this.lookupService.getDataByCode(LookupCodes.purchasing_purpose).subscribe(purchasingPurposes => this.purchasingPurposes = purchasingPurposes);
    this.lookupService.getDataByCode(LookupCodes.driving_type).subscribe(drivingTypes => this.drivingTypes = drivingTypes);
    this.lookupService.getDataByCode(LookupCodes.legal_status).subscribe(legalStatusList => this.legalStatusList = legalStatusList);
    this.provincesService.getAllAvailableProvinces().subscribe(provinceList => this.provinceList = provinceList);
    this.getGradeList();
    this.dealerListService.getParentDealerOnly().subscribe(dealerList => {
      this.dealerList = dealerList ? dealerList.filter(item => item.id !== this.currentUser.dealerId) : [];
    });
  }

  getGradeList() {
    const gradeApi = this.currentUser.isAdmin ? this.gradeListService.getGrades(true) : this.currentUser.isLexus
      ? this.gradeListService.getGrades(true, 'lexusOnly')
      : this.gradeListService.getGrades(true, 'notLexus');
    gradeApi.subscribe(grades => {
      this.gradeList = grades;
    });
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  reset() {
    this.form = undefined;
  }

  open(selectedFollowUpId?, isSoldContract?) {
    this.isSoldContract = isSoldContract;
    if (selectedFollowUpId) {
      this.contractManagementService.getModifyData(selectedFollowUpId).subscribe(selectedFollowUp => {
        this.selectedFollowUp = selectedFollowUp;
        this.dealerListService.getRelatedDealers(this.selectedFollowUp.dealerId).subscribe(saleDealers => this.saleDealers = saleDealers);
        this.salesPersonService.getAvailableSalesPerson(this.selectedFollowUp.dealerId).subscribe(salePersons => this.salePersons = salePersons);
        this.getCurrentContractNo();
      });
    } else {
      this.selectedFollowUp = null;
      this.dealerListService.getRelatedDealers(this.currentUser.dealerId).subscribe(saleDealers => this.saleDealers = saleDealers);
      this.salesPersonService.getAvailableSalesPerson(this.currentUser.dealerId).subscribe(salePersons => this.salePersons = salePersons);
      this.getCurrentContractNo();
    }
    this.modal.show();
  }

  getFleets(params) {
    this.loadingService.setDisplay(true);
    params.api.setRowData();
    this.contractManagementService.getContractFleet(this.currentUser.dealerId).subscribe(fleets => {
      this.loadingService.setDisplay(false);
      params.api.setRowData(fleets);
    });
  }

  getCurrentContractNo() {
    const dealerId = this.currentUser.dealerId;
    this.contractManagementService.getCurrentContractNo(dealerId).subscribe(totalContract => {
      this.totalContract = totalContract;
      this.buildForm();
    });
  }

  cancel() {
    this.formStoringService.clear(StorageKeys.contract);
    this.modal.hide();
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.getRawValue();
    let data = Object.assign({}, formValue, {
      amount: this.convertStringToInt(formValue.amount),
      otherPromotionValue: this.convertStringToInt(formValue.otherPromotionValue),
      discountPrice: this.convertStringToInt(formValue.discountPrice),
      commissionPrice: this.convertStringToInt(formValue.commissionPrice),
      orderPrice: this.convertStringToInt(formValue.orderPrice)
    });
    data.dealerId = this.currentUser.dealerId;
    if (this.selectedFollowUp) {
      data = Object.assign({}, this.selectedFollowUp, data);
    }
    if (formValue.contractType === 'F') {
      data = Object.assign({}, this.fleetData, data);
    }

    const apiCall = this.selectedFollowUp ?
      this.contractManagementService.updateContract(data) : this.contractManagementService.createNewContract(data);

    this.loadingService.setDisplay(true);
    apiCall.subscribe(() => {
      this.formStoringService.clear(StorageKeys.contract);
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessModal();
      this.close.emit();
      this.modal.hide();
    });
  }

  get currentUser() {
    return this.formStoringService.get(StorageKeys.currentUser);
  }

  get generateContractNo() {
    const thisYear = (new Date()).getFullYear() - 2000;
    const thisMonth = (new Date()).getMonth() + 1 < 10 ? `0${(new Date()).getMonth() + 1}` : (new Date()).getMonth() + 1;
    const dealName = this.formStoringService.get(StorageKeys.currentUser).dealerName;
    return `${dealName}-${thisYear}${thisMonth}${this.totalContract}`;
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

  private buildForm() {
    const storingData = this.selectedFollowUp ? this.selectedFollowUp : this.formStoringService.get(StorageKeys.contract);

    this.form = this.formBuilder.group({
      // Contract Info
      contractId: [undefined],
      contractNo: [`${this.generateContractNo}`, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(50)])],
      contractType: ['R', GlobalValidator.required],
      total: [{ value: undefined, disabled: true }],
      refNoControl: [{ value: undefined, disabled: storingData.contractType !== 'F' }, GlobalValidator.required],
      refNo: [undefined],
      wodDate: [new Date(), GlobalValidator.required],
      depositDate: [new Date(), Validators.compose([GlobalValidator.required])],
      amount: [undefined, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.maxLength(18)])],
      paymentTypeId: [undefined, GlobalValidator.required],
      salesStaffControl: [{ value: undefined, disabled: storingData.dealerId === -1 }],
      salesStaffId: [{ value: undefined, disabled: storingData.dealerId === -1 }],
      estimatedDate: [new Date(), Validators.compose([GlobalValidator.required])], // Bỏ điều kiện chặn theo YC KH
      // estimatedDate: [new Date()],
      newEstimatedDate: [{ value: undefined, disabled: storingData.newEstimatedDate }],
      estimatedReasonId: [{ value: undefined, disabled: true }, GlobalValidator.required],
      estimatedReasonText: [{ value: undefined, disabled: true }, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(500)])],
      orderPrice: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.numberFormat, GlobalValidator.maxLength(18)])],
      commissionPrice: [undefined, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.maxLength(18)])],
      discountPrice: [undefined, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.maxLength(18)])],
      otherPromotionValue: [undefined, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.maxLength(18)])],
      saleForDealer: [undefined],
      endDealerSalesId: [{ value: undefined, disabled: !storingData.saleForDealer }],
      dlrOutletId: [undefined, GlobalValidator.required],
      salesDealerId: [undefined],

      // Customer Info
      customerName: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(255)])],
      legalId: [undefined, GlobalValidator.required],
      // taxCode: [undefined, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.maxLength(13), GlobalValidator.minLength(9)])],
      taxCode: [undefined],
      contractRepresentative: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(255)])],
      email: [undefined, Validators.compose([GlobalValidator.emailFormat, GlobalValidator.maxLength(255)])],
      customerAddress: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(255)])],
      provinceId: [undefined, GlobalValidator.required],
      districtId: [{ value: undefined, disabled: !storingData.provinceId }],
      fax: [undefined, GlobalValidator.maxLength(50)],
      tel: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.telFormat, GlobalValidator.maxLength(50)])],

      // Contact Person
      contactName: [undefined, GlobalValidator.maxLength(255)],
      contactTel: [undefined, Validators.compose([GlobalValidator.telFormat, GlobalValidator.maxLength(50)])],
      contactAddress: [undefined, GlobalValidator.maxLength(255)],

      // Invoice Person
      invoiceName: [undefined, Validators.compose([GlobalValidator.maxLength(255)])],
      ageLeadTimeId: [undefined, GlobalValidator.required],
      genderId: [undefined, GlobalValidator.required],
      invoiceAddress: [undefined, Validators.compose([GlobalValidator.maxLength(255)])],

      // Customer Relationship Info
      relativesName: [undefined, GlobalValidator.maxLength(500)],
      relativesAddress: [undefined, GlobalValidator.maxLength(1000)],
      relativesPhone: [undefined, Validators.compose([GlobalValidator.phoneFormat, GlobalValidator.maxLength(50)])],
      relativesProvinceId: [undefined],
      relationship: [undefined],

      // Survey Info
      purchasingTypeId: [undefined, GlobalValidator.required],
      purchasingPurposeId: [undefined, GlobalValidator.required],
      driverSeftdriverId: [undefined, GlobalValidator.required],

      // Vehicle Info
      gradeId: [undefined, GlobalValidator.required],
      cbuCkd: [undefined, GlobalValidator.required],
      grade: [undefined],
      gradeProductionId: [undefined, GlobalValidator.required],
      gradeProduction: [undefined],
      colorId: [undefined, GlobalValidator.required],
      color: [undefined],
      interiorColorId: [undefined],
      interiorColor: [undefined],
      remark: [undefined, GlobalValidator.maxLength(500)],
      fleetApplicationId: [undefined]
    });
    this.watchFormValueChanges(storingData);

    if (storingData) {
      const salePerson = this.salePersons.find(item => item.id === storingData.salesStaffId);
      this.form.patchValue(Object.assign({}, storingData, {
        salesStaffControl: {
          id: storingData.salesStaffId,
          fullName: salePerson ? salePerson.fullName : ''
        },
        refNoControl: {
          refNo: storingData.refNo
        },
        saleForDealer: !!storingData.endDealerSalesId
      }));

      this.dataFormatService.formatMoneyForm(this.form, 'orderPrice');
      this.dataFormatService.formatMoneyForm(this.form, 'commissionPrice');
      this.dataFormatService.formatMoneyForm(this.form, 'otherPromotionValue');
      this.dataFormatService.formatMoneyForm(this.form, 'discountPrice');
    }

    this.form.valueChanges.subscribe(data => {
      if (data) {
        this.formStoringService.set(StorageKeys.contract, data);
      }
    });

    if (this.selectedFollowUp) {
      this.disabledFields = [
        'depositDate',
        'estimatedDate',
        'saleForDealer',
        'endDealerSalesId',
        'customerName',
        'contractRepresentative',
        'customerAddress',
        'contactName',
        'contactTel',
        'contactAddress',
        'gradeId'
      ];
      if (this.isSoldContract) {
        const disabledIfSold = [
          'amount',
          'newEstimatedDate',
          'estimatedReasonId',
          'estimatedReasonText',
          'invoiceName',
          'invoiceAddress',
          'cbuCkd',
          'gradeProductionId',
          'colorId',
          'interiorColorId'
        ];
        this.disabledFields = this.disabledFields.concat(disabledIfSold);
      }
      this.disabledFields.forEach(field => {
        this.form.get(field).disable();
      });

      if (this.selectedFollowUp.contractType === 'F') {
        this.form.get('contractType').disable();
        this.form.get('refNoControl').disable();
      }
    }
    // this.form.get('dlrOutletId').setValue(this.saleDealers[0].id);
    const invoiceName = this.form.get('invoiceName');
    const invoiceAddress = this.form.get('invoiceAddress');
    if (invoiceName !== null || invoiceAddress !== null) {
      this.form.get('invoiceName').enable();
      this.form.get('invoiceAddress').enable();
    } else {
      this.form.get('invoiceName').disable();
      this.form.get('invoiceAddress').disable();
    }
    if (this.isSoldContract) {
      this.form.get('invoiceName').disable();
      this.form.get('invoiceAddress').disable();
    }
  }

  private watchFormValueChanges(storingData?) {
    const orderPrice = this.form.get('orderPrice');
    const commissionPrice = this.form.get('commissionPrice');
    const discountPrice = this.form.get('discountPrice');
    const otherPromotionValue = this.form.get('otherPromotionValue');
    const refNoControl = this.form.get('refNoControl');
    const district = this.form.get('districtId');
    const estimatedDate = this.form.get('estimatedDate');
    const estimatedReasonId = this.form.get('estimatedReasonId');
    const estimatedReasonText = this.form.get('estimatedReasonText');
    const saleForDealer = this.form.get('saleForDealer');
    const endDealerSalesId = this.form.get('endDealerSalesId');
    const customerName = this.form.get('customerName');
    const contactName = this.form.get('contactName');
    const gradeId = this.form.get('gradeId');
    const cbuCkd = this.form.get('cbuCkd');
    const gradeProductionId = this.form.get('gradeProductionId');
    const colorId = this.form.get('colorId');
    const interiorColorId = this.form.get('interiorColorId');
    const salesStaffControl = this.form.get('salesStaffControl');
    this.form.get('contractType').valueChanges.subscribe(val => {
      if (val) {
        if (val === 'F') {
          orderPrice.disable();
          commissionPrice.disable();
          discountPrice.disable();
          otherPromotionValue.disable();
          contactName.disable();
          gradeId.disable();
          gradeProductionId.disable();
          colorId.disable();
          interiorColorId.disable();
          customerName.disable();
          if (!this.disabledFields || !this.disabledFields.includes('refNoControl')) {
            refNoControl.enable();
          }            
        } else {
          if (!this.disabledFields || !this.disabledFields.includes('orderPrice')) {
            orderPrice.enable();
          }
          if (!this.disabledFields || !this.disabledFields.includes('commissionPrice')) {
            commissionPrice.enable();
          }
          if (!this.disabledFields || !this.disabledFields.includes('discountPrice')) {
            discountPrice.enable();
          }
          if (!this.disabledFields || !this.disabledFields.includes('otherPromotionValue')) {
            otherPromotionValue.enable();
          }
          if (!this.disabledFields || !this.disabledFields.includes('contactName')) {
            contactName.enable();
          }
          if (!this.disabledFields || !this.disabledFields.includes('colorId')) {
            colorId.enable();
          }
          if (!this.disabledFields || !this.disabledFields.includes('gradeId')) {
            gradeId.enable();
          }          
          if (!this.disabledFields || !this.disabledFields.includes('gradeProductionId')) {
            gradeProductionId.enable();
          }          
          if (!this.disabledFields || !this.disabledFields.includes('interiorColorId')) {
            interiorColorId.enable();
          }          
          if (!this.disabledFields || !this.disabledFields.includes('customerName')) {
            customerName.enable();
          }          
          refNoControl.disable();
          this.form.patchValue({
            fleetApplicationId: null
          });
        }
      }
    });

    this.form.get('provinceId').valueChanges.subscribe(val => {
      if (val) {
        district.enable();
        this.districtListService.getDistrictOfProvince(val, true).subscribe(districtsOfProvince => {
          this.districtsOfProvince = districtsOfProvince;
        });
      } else {
        district.setValue(null);
        district.disable();
      }
    });

    gradeId.valueChanges.subscribe(val => {
      this.products = [];
      if (val && !isObject(val) && cbuCkd.value && !isObject(cbuCkd.value)) {
        if (this.isSoldContract) {
          this.gradeProductionService.getGradeProductByGradeAndVehicleType(gradeId.value, cbuCkd.value).subscribe(products => {
            this.products = products || [];
            gradeProductionId.setValue(this.products.find(item => item.id === gradeProductionId.value) ? gradeProductionId.value : null);
          });
        } else {
          this.gradeProductionService.getGradeProductByGradeAndVehicleType(gradeId.value, cbuCkd.value, 'Y').subscribe(products => {
            this.products = products || [];
            gradeProductionId.setValue(this.products.find(item => item.id === gradeProductionId.value) ? gradeProductionId.value : null);
          });
        }
      }
      else {
        gradeProductionId.setValue(null);
      };
    });

    cbuCkd.valueChanges.subscribe(val => {
      this.products = [];
      if (val && !isObject(val) && gradeId.value && !isObject(gradeId.value)) {
        if (this.isSoldContract) {
          this.gradeProductionService.getGradeProductByGradeAndVehicleType(gradeId.value, val).subscribe(products => {
            this.products = products || [];
            gradeProductionId.setValue(this.products.find(item => item.id === gradeProductionId.value) ? gradeProductionId.value : null);
          });
        } else {
          this.gradeProductionService.getGradeProductByGradeAndVehicleType(gradeId.value, val, 'Y').subscribe(products => {
            this.products = products || [];
            gradeProductionId.setValue(this.products.find(item => item.id === gradeProductionId.value) ? gradeProductionId.value : null);
          });
        }
      }
      else {
        gradeProductionId.setValue(null);
      };
    });

    gradeProductionId.valueChanges.subscribe(val => {
      this.colorAssignments = [];
      this.interiorColorAssignments = [];
      if (val && !isObject(val)) {
        if (this.isSoldContract) {
          this.colorAssignmentService.getColors(val, false).subscribe(assignments => {
            this.colorAssignments = assignments || [];
            colorId.setValue(this.colorAssignments.find(item => item.colorId === colorId.value) ? colorId.value : null);
          });
          this.interiorColorListService.getColors(val, false).subscribe(assignments => {
            this.interiorColorAssignments = assignments || [];
            interiorColorId.setValue(this.interiorColorAssignments.find(item => item.colorId === interiorColorId.value) ? interiorColorId.value : null);
          });
        } else {
          this.colorAssignmentService.getColors(val, true).subscribe(assignments => {
            this.colorAssignments = assignments || [];
            colorId.setValue(this.colorAssignments.find(item => item.colorId === colorId.value) ? colorId.value : null);
          });
          this.interiorColorListService.getColors(val, true).subscribe(assignments => {
            this.interiorColorAssignments = assignments || [];
            interiorColorId.setValue(this.interiorColorAssignments.find(item => item.colorId === interiorColorId.value) ? interiorColorId.value : null);
          });
        }
      }
      else {
        colorId.setValue(null);
        interiorColorId.setValue(null);
      }
    });

    colorId.valueChanges.subscribe(val => {
      if (!this.selectedFollowUp) {
        if (gradeProductionId.value && !isObject(gradeProductionId.value) && val && !isObject(val)) {
          this.moneyService.getPrice(gradeProductionId.value, val, interiorColorId.value).subscribe(price => {
            if (price) {
              orderPrice.setValue(price);
              this.dataFormatService.formatMoneyForm(this.form, 'orderPrice');
            } else {
              this.moneyService.getPrice(gradeProductionId.value, val).subscribe(oprice => {
                orderPrice.setValue(oprice);
                this.dataFormatService.formatMoneyForm(this.form, 'orderPrice');
              });
            }
          });
        } else {
          orderPrice.setValue(null);
        }
      }
    });

    interiorColorId.valueChanges.subscribe(val => {
      if (!this.selectedFollowUp) {
        if (gradeProductionId.value && !isObject(gradeProductionId.value) && colorId.value && !isObject(colorId.value)) {
          this.moneyService.getPrice(gradeProductionId.value, colorId.value, val).subscribe(price => {
            if (price) {
              orderPrice.setValue(price);
              this.dataFormatService.formatMoneyForm(this.form, 'orderPrice');
            } else {
              this.moneyService.getPrice(gradeProductionId.value, colorId.value).subscribe(oprice => {
                orderPrice.setValue(oprice);
                this.dataFormatService.formatMoneyForm(this.form, 'orderPrice');
              });
            }
          });
        } else {
          orderPrice.setValue(null);
        }
      }
    });

    salesStaffControl.valueChanges.subscribe(val => {
      this.form.patchValue({
        salesStaffId: val ? val.id : null
      });
    });

    this.form.get('newEstimatedDate').valueChanges.subscribe(val => {
      if (val) {
        if (new Date(val) <= new Date(estimatedDate.value) && !this.selectedFollowUp) {
          this.swalAlertService.openFailModal('New Est Date must greater than Original Est Date');
          this.form.patchValue({
            newEstimatedDate: null
          });
        } else {
          if (!storingData.newEstimatedDate) {
            estimatedReasonId.enable();
            estimatedReasonText.enable();
          }
        }
      } else {
        estimatedReasonId.disable();
        estimatedReasonText.disable();
      }
    });

    saleForDealer.valueChanges.subscribe(val => {
      if (val) {
        endDealerSalesId.enable();
      } else {
        endDealerSalesId.disable();
      }
    });

    if (!this.selectedFollowUp) {
      endDealerSalesId.valueChanges.subscribe(val => {
        if (val) {
          const dealer = this.dealerList.find(item => item.id === val);
          if (dealer) {
            this.form.patchValue({
              customerName: dealer.vnName,
              contractRepresentative: dealer.contactPerson,
              customerAddress: dealer.address,
              provinceId: dealer.provinceId,
              fax: dealer.fax,
              tel: dealer.phone
            });
          }
        }
      });
    }

    this.form.get('legalId').valueChanges.subscribe(val => {
      if (val) {
        if (this.legalStatus.find(item => item.name === 'ID').id === val) {
          this.form.patchValue({
            contractRepresentative: this.form.getRawValue().customerName
          });
        }
      }
    });

    this.form.get('refNoControl').valueChanges.subscribe(val => {
      if (val && !this.selectedFollowUp) {
        this.form.patchValue({
          fleetApplicationId: val.id,
          refNo: val.refNo
        });

        this.fleetData = {
          customerName: val.customerName,
          customerAddress: val.customerAddress,
          taxCode: val.taxCode,
          contactAddress: val.contactAddress,
          contactName: val.contactName,
          contactTel: val.contactTel,
          fax: val.fax,
          invoiceAddress: val.invoiceAddress,
          invoiceName: val.invoiceName,
          tel: val.tel,
          provinceId: val.provinceId,
          genderId: val.genderId,
          ageLeadTimeId: val.ageLeadTimeId,
          remark: val.remark
        };
        this.form.patchValue(this.fleetData);
      } else {
        this.form.patchValue({
          fleetApplicationId: undefined,
          refNo: undefined
        });
      }
    });
  }

}
