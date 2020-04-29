import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {LoadingService} from '../../../shared/loading/loading.service';
import {FleetSaleApplicationService} from '../../../api/fleet-sale/fleet-sale-application.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DealerListService} from '../../../api/master-data/dealer-list.service';
import {GradeListService} from '../../../api/master-data/grade-list.service';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {ProvincesService} from '../../../api/master-data/provinces.service';
import {ProvincesModel} from '../../../core/models/sales/provinces.model';
import {ColorListService} from '../../../api/master-data/color-list.service';
import {FormStoringService} from '../../../shared/common-service/form-storing.service';
import {StorageKeys} from '../../../core/constains/storageKeys';
import {isEqual, pick} from 'lodash';
import {LookupService} from '../../../api/lookup/lookup.service';
import {LookupCodes} from '../../../core/constains/lookup-codes';
import {EventBusService} from '../../../shared/common-service/event-bus.service';
import {EventBusType} from '../../../core/constains/eventBusType';
import {FleetCustomerService} from '../../../api/fleet-sale/fleet-customer.service';
import {GlobalValidator} from '../../../shared/form-validation/validators';
import {map} from 'rxjs/operators';
import {combineLatest} from 'rxjs';
import {FirefoxDate} from '../../../core/firefoxDate/firefoxDate';
import {ToastService} from '../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'fleet-sale-application',
  templateUrl: './fleet-sale-application.component.html',
  styleUrls: ['./fleet-sale-application.component.scss']
})
export class FleetSaleApplicationComponent implements OnInit {
  @ViewChild('historyModal', {static: false}) historyModal;
  @ViewChild('changePurchasingDelivery', {static: false}) changePurchasingDelivery;
  @ViewChild('newFleetAppModal', {static: false}) newFleetAppModal;
  @ViewChild('fleetAppApprovalModal', {static: false}) fleetAppApprovalModal;
  @ViewChild('fleetCustomerSelectModal', {static: false}) fleetCustomerSelectModal;

  @ViewChild('confirmCancelFleet', {static: false}) confirmCancelFleet;
  @ViewChild('switchFleetAppWhileEditing', {static: false}) switchFleetAppWhileEditing;

  @ViewChild('submitCustomerFormBtn', {static: false}) submitCustomerFormBtn: ElementRef;
  isDlr: boolean;
  fleetHeaderForm: FormGroup;
  fleetFooterForm: FormGroup;
  customerForm: FormGroup;
  fieldGridFleetApp;
  fleetAppParams;

  fleetApplications;
  dataOfFleetApplication: {
    fleetAppCustomerDTO
    appDTLSList
    appDeliveriesList
    inContract
  };
  fleetDeliveries;
  fleetIntentions;

  displayedIntentionData;
  displayedDeliveryData;

  selectedFleetApp;

  dealers;
  gradeList;
  colorList;
  provinces: Array<ProvincesModel>;
  businessFields;
  ageLeadTimeArr;
  genderList;
  fleetCustomers;
  currentUser;

  constructor(
    private loadingService: LoadingService,
    private fleetSaleApplicationService: FleetSaleApplicationService,
    private dealerListService: DealerListService,
    private formBuilder: FormBuilder,
    private gradeListService: GradeListService,
    private colorListService: ColorListService,
    private provincesService: ProvincesService,
    private dataFormatService: DataFormatService,
    private formStoringService: FormStoringService,
    private swalAlertService: ToastService,
    private lookupService: LookupService,
    private eventBusService: EventBusService,
    private fleetCustomerService: FleetCustomerService
  ) {
    this.fieldGridFleetApp = [
      {
        field: 'name',
        maxWidth: 100
      },
      {
        field: 'address',
        maxWidth: 150
      },
      {
        headerName: 'DLR Ref No',
        field: 'refNo',
        maxWidth: 150
      },
      {
        headerName: 'TMV Ref No',
        field: 'refNoTmv',
        maxWidth: 150
      },
      {
        headerName: 'Date',
        field: 'fleetAppDate',
        cellClass: ['cell-border'],
        maxWidth: 150
      },
      {
        field: 'available',
        maxWidth: 130
      },
      {
        field: 'expiryDate',
        cellClass: ['cell-border'],
        maxWidth: 130
      }
    ];
  }

  ngOnInit() {
    this.currentUser = this.formStoringService.get(StorageKeys.currentUser);
    this.isDlr = !this.currentUser.isAdmin;
    this.masterDataApi();
    this.buildForm();
    this.buildCustomerForm();
  }

  masterDataApi() {
    this.loadingService.setDisplay(true);
    combineLatest([
      this.dealerListService.getDealers(),
      this.gradeListApi,
      this.colorListService.getColors(),
      this.provincesService.getAllProvinces(),
      this.lookupService.getDataByCode(LookupCodes.businessField),
      this.lookupService.getDataByCode(LookupCodes.age_lead_time),
      this.lookupService.getDataByCode(LookupCodes.gender),
      this.fleetCustomerService.getAllFleetCustomer()
    ]).pipe(
      map(([dealers, grades, colorList, provinces, businessFields, ageLeadTimeArr, genderList, fleetCustomers]) => {
        this.dealers = dealers.filter(dlr => dlr.abbreviation !== 'TMV');
        this.gradeList = grades;
        this.colorList = colorList;
        this.provinces = provinces;
        this.businessFields = businessFields;
        this.ageLeadTimeArr = ageLeadTimeArr;
        this.genderList = genderList;
        this.fleetCustomers = fleetCustomers;
      })
    ).subscribe(() => {
      this.loadingService.setDisplay(false);
    });
  }

  get gradeListApi() {
    return !this.isDlr ? this.gradeListService.getGrades(true) : this.currentUser.isLexus
      ? this.gradeListService.getGrades(true, 'lexusOnly')
      : this.gradeListService.getGrades(true, 'notLexus');
  }

  // ===** FLEET APPLICATION AG GRID **=== //
  callbackGridFleetApp(params) {
    this.fleetAppParams = params;
    this.fleetAppParams.api.sizeColumnsToFit();
    this.fleetHeaderForm.patchValue({
      dealerId: this.currentUser.dealerId
    });
    this.onBtnSearch();
  }

  getParamsFleetApp() {
    let changed = false;
    if (this.dataOfFleetApplication) {
      const fleetCustomerData = pick(this.dataOfFleetApplication.fleetAppCustomerDTO, Object.keys(this.customerForm.value));
      const customerFormValue = this.customerForm.value;
      // for (const key of customerFormValue) {
      //   customerFormValue[key] = customerFormValue[key] === '' ? null : customerFormValue[key];
      // }

      if (this.selectedFleetApp && (this.selectedFleetApp.status === 'PENDING' || this.selectedFleetApp.status === 'REQUEST')) {
        if (!isEqual(customerFormValue, fleetCustomerData)) {
          this.switchFleetAppWhileEditing.show();
          this.fleetAppParams.api.forEachNode(node => {
            if (node.childIndex === this.fleetApplications.indexOf(this.selectedFleetApp)) {
              node.setSelected(true);
            }
          });
          changed = true;
        } else if (!isEqual(this.fleetIntentions, this.displayedIntentionData) || !isEqual(this.fleetDeliveries, this.displayedDeliveryData)) {
          this.switchFleetAppWhileEditing.show();
          this.fleetAppParams.api.forEachNode(node => {
            if (node.childIndex === this.fleetApplications.indexOf(this.selectedFleetApp)) {
              node.setSelected(true);
            }
          });
          changed = true;
        }
      }
    }
    if (!changed) {
      this.forceSwitchFleetApp();
    }
  }

  forceSwitchFleetApp() {
    const selectedFleetApp = this.fleetAppParams.api.getSelectedRows();
    if (selectedFleetApp) {
      this.selectedFleetApp = selectedFleetApp[0];
      this.setFleetApplicationData();
    }
  }

  setFleetApplicationData() {
    this.loadingService.setDisplay(true);
    this.fleetSaleApplicationService.getFleetData(this.selectedFleetApp.id).subscribe(dataOfFleetApplication => {
      this.dataOfFleetApplication = dataOfFleetApplication;

      if (dataOfFleetApplication) {
        this.fleetIntentions = dataOfFleetApplication.appDTLSList && dataOfFleetApplication.appDTLSList.length ?
          dataOfFleetApplication.appDTLSList.map(item => ({...item})) : [];
        this.fleetDeliveries = dataOfFleetApplication.appDeliveriesList && dataOfFleetApplication.appDeliveriesList.length ?
          dataOfFleetApplication.appDeliveriesList.map(item => ({...item})) : [];
      }
      this.setCustomerFormData(this.dataOfFleetApplication.fleetAppCustomerDTO ? this.dataOfFleetApplication.fleetAppCustomerDTO : {});
      this.eventBusService.emit({
        type: EventBusType.onSelectFleetApp,
        value: dataOfFleetApplication
      });

      this.loadingService.setDisplay(false);
    });
  }

  private setCustomerFormData(customerInfo) {
    this.customerForm.patchValue(customerInfo);
    this.fleetFooterForm.patchValue({
      status: [this.selectedFleetApp.status === 'PENDING' ? 'WAIT CONFIRM' : this.selectedFleetApp.status],
      inContract: [this.dataOfFleetApplication.inContract ? 'Fleet App này đang được theo dõi trong Contract Management' : '']
    });
    this.selectedFleetApp.status === 'PENDING' || (!this.isDlr && this.selectedFleetApp.status === 'REQUEST')
      ? this.customerForm.enable() : this.customerForm.disable();
    if (this.isDlr) {
      this.customerForm.get('fleetCustomerName').disable();
    }
  }

  refreshFleetApp() {
    this.selectedFleetApp = undefined;
    this.onBtnSearch();
  }

  onBtnSearch() {
    const fromDate = new FirefoxDate(this.fleetHeaderForm.value.fromDate).newDate();
    const toDate = new FirefoxDate(this.fleetHeaderForm.value.toDate).newDate();
    if ((this.fleetHeaderForm.value.fromDate && this.fleetHeaderForm.value.toDate) && fromDate >= toDate) {
      this.swalAlertService.openFailModal('From Date" must be a day before "To Date". Change those before Search');
      return;
    } else {
      this.loadingService.setDisplay(true);
      setTimeout(() => {
        this.fleetSaleApplicationService.searchFleetApp(this.fleetHeaderForm.value).subscribe(fleetApplications => {
          this.fleetApplications = fleetApplications;
          this.fleetAppParams.api.setRowData(this.fleetApplications);
          if (!this.fleetApplications || this.fleetApplications.length === 0) {
            this.clearDisplayData();
          }
          this.fleetAppParams.api.forEachNode(node => {
            if (node.childIndex === 0) {
              node.setSelected(true);
            }
          });
          this.fleetFooterForm.patchValue({
            total: fleetApplications ? fleetApplications.length : 0,
            approved: fleetApplications ? fleetApplications.filter(fleetApp => fleetApp.status === 'APPROVE').length : 0,
            reject: fleetApplications ? fleetApplications.filter(fleetApp => fleetApp.status === 'REJECT').length : 0,
            pending: fleetApplications ? fleetApplications.filter(fleetApp => fleetApp.status === 'PENDING').length : 0
          });
          this.fleetAppParams.api.sizeColumnsToFit();
          this.loadingService.setDisplay(false);
        });
      }, 500);
    }
  }

  clearDisplayData() {
    this.selectedFleetApp = undefined;
    this.dataOfFleetApplication = {
      fleetAppCustomerDTO: {},
      appDTLSList: [],
      appDeliveriesList: [],
      inContract: undefined
    };
    this.fleetIntentions = [];
    this.fleetDeliveries = [];
    this.buildCustomerForm();
    this.eventBusService.emit({
      type: EventBusType.onSelectFleetApp,
      value: this.dataOfFleetApplication
    });
  }

  tmvConfirmCancel() {
    this.loadingService.setDisplay(true);
    this.fleetSaleApplicationService.cancelFleetApp(this.selectedFleetApp.id).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessModal();
      this.refreshFleetApp();
    });
  }

  openApproveModal() {
    let forceCheckData = false;
    if (!this.displayedIntentionData || !this.displayedDeliveryData) {
      this.swalAlertService.openFailModal('Bạn hãy nhập kế hoạch mua xe');
      return;
    }
    this.displayedDeliveryData.forEach(data => {
      if (!data.monthTmv || (!data.yearTmv || !data.quantityTmv)) {
        this.swalAlertService.openFailModal('Bạn hãy nhập đủ thông tin vào bảng Delivery trước khi Approve', 'Empty field!');
        forceCheckData = true;
        return;
      }
      if (data.quantity) {
        const matchData = this.displayedDeliveryData.filter(it => it.id === data.id);
        let qtyTmv = 0;
        matchData.forEach(item => {
          qtyTmv += parseFloat(item.quantityTmv);
        });
        if (parseFloat(data.quantity) !== qtyTmv) {
          this.swalAlertService.openFailModal('Số TMV Qty không khớp với Dealer Qty, bạn hãy kiểm tra trước khi Approve', 'Unmatch Quantity!');
          forceCheckData = true;
          return;
        }
      }
    });

    this.displayedIntentionData.forEach(data => {
      if (!data.frsp || !data.fwsp) {
        this.swalAlertService.openFailModal('Intention table still missing some data, please fill in all before approve', 'Empty field!');
        forceCheckData = true;
        return;
      }
    });
    if (!this.customerForm.value.fleetCustomerId) {
      this.swalAlertService.openFailModal('Name(TMV) field in "Customer Form" must be filled before Approve', 'Empty field!');
      forceCheckData = true;
      return;
    }
    if (!forceCheckData) {
      this.fleetAppApprovalModal.open('', this.selectedFleetApp, this.dataToApprove);
    }
  }

  get dataToApprove() {
    return Object.assign({}, this.customerForm.value, {
      fleetAppDtlsList: this.displayedIntentionData,
      fleetAppDeliveriesList: this.displayedDeliveryData
    });
  }

  get validateGridData() {
    // Check if Grade in Delivery and Grade in Intention are match
    const intentionTotal = {};
    const deliveryTotal = {};
    let isBlankIntentionRow: boolean;
    let isBlankDeliveryRow: boolean;
    const blankIntention = {
      id: null,
      fleetAppHistoryId: null,
      grade: null,
      gradeId: null,
      gradeProduction: null,
      gradeProductionId: null,
      color: null,
      colorId: null,
      quantity: null,
      frsp: null,
      fwsp: null,
      discount: null
    };
    const blankDelivery = {
      id: null,
      fleetAppHistoryId: null,
      grade: undefined,
      gradeId: undefined,
      gradeProduction: undefined,
      gradeProductionId: undefined,
      quantity: undefined,
      month: undefined,
      year: undefined,

      quantityTmv: undefined,
      monthTmv: undefined,
      yearTmv: undefined
    };
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.displayedIntentionData.length; i++) {
      isBlankIntentionRow = isEqual(this.displayedIntentionData[i], blankIntention);
      const currentGradeId = this.displayedIntentionData[i].gradeId;
      intentionTotal[currentGradeId] > 0
        ? intentionTotal[currentGradeId] += parseFloat(this.displayedIntentionData[i].quantity)
        : intentionTotal[currentGradeId] = parseFloat(this.displayedIntentionData[i].quantity);
    }
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.displayedDeliveryData.length; i++) {
      isBlankDeliveryRow = isEqual(this.displayedDeliveryData[i], blankDelivery);
      const currentGradeId = this.displayedDeliveryData[i].gradeId;
      deliveryTotal[currentGradeId] > 0
        ? deliveryTotal[currentGradeId] += parseFloat(this.displayedDeliveryData[i].quantity)
        : deliveryTotal[currentGradeId] = parseFloat(this.displayedDeliveryData[i].quantity);
    }

    if ((!this.displayedIntentionData.length || !this.displayedDeliveryData.length) || (isBlankIntentionRow || isBlankDeliveryRow)) {
      return 'Blank table';
    } else if (!isEqual(Object.entries(intentionTotal).sort(), Object.entries(deliveryTotal).sort())) {
      return 'Unmatch';
    } else {
      return true;
    }
  }

  dlrSendFleetApp() {
    this.submitCustomerFormBtn.nativeElement.click();
    if (this.validateGridData === 'Unmatch') {
      this.swalAlertService.openFailModal('Dữ liệu ở bảng Intention và Delivery không khớp nhau, kiểm tra lại trước khi gửi đi', 'Thông báo');
      return;
    } else if (this.validateGridData === 'Blank table') {
      this.swalAlertService.openFailModal('Bạn hãy nhập kế hoạch mua xe', 'Thông báo');
      return;
    } else if (this.customerForm.invalid) {
      this.swalAlertService.openFailModal('Bạn hãy điền đầy đủ các trường bắt buộc trong form Customer Information', 'Thông báo');
      this.loadingService.setDisplay(false);
      return;
    } else {
      this.loadingService.setDisplay(true);
      this.fleetSaleApplicationService.updateFleetApp(this.selectedFleetApp.id, this.dataToRequest, true).subscribe(() => {
        this.loadingService.setDisplay(false);
        this.refreshFleetApp();
        this.swalAlertService.openSuccessModal();
      });
    }
  }

  get dataToRequest() {
    return Object.assign({}, this.customerForm.value, {
      dealerAppDTLSList: this.displayedIntentionData,
      dealerAppDeliveriesList: this.displayedDeliveryData
    });
  }

  saveDraft() {
    if (this.customerForm.invalid) {
      this.swalAlertService.openFailModal('Bạn hãy điền đầy đủ các trường bắt buộc trong form Customer Information', 'Thông báo');
      this.loadingService.setDisplay(false);
      return;
    }
    const apiCall = this.isDlr ?
      this.fleetSaleApplicationService.updateFleetApp(this.selectedFleetApp.id, this.dataToRequest) :
      this.fleetSaleApplicationService.approveFleetApp(this.selectedFleetApp.id, this.dataToApprove);

    this.loadingService.setDisplay(true);
    apiCall.subscribe(() => {
      this.clearDisplayData();
      this.onBtnSearch();
      if (this.selectedFleetApp && this.fleetApplications.indexOf(this.selectedFleetApp)) {
        this.fleetAppParams.api.forEachNode(node => {
          if (node.childIndex === this.fleetApplications.indexOf(this.selectedFleetApp)) {
            node.setSelected(true);
          }
        });
      }
      this.swalAlertService.openSuccessModal();
      this.loadingService.setDisplay(false);
    });
  }

  openTmvCustomerModal(isFleetCustomerId: boolean) {
    if (isFleetCustomerId && !this.isDlr) {
      this.fleetCustomerSelectModal.open(isFleetCustomerId);
    } else if (!isFleetCustomerId) {
      this.fleetCustomerSelectModal.open(isFleetCustomerId);
    }
  }

  setTmvCustomerInfo(data) {
    if (data.isFleetCustomerId) {
      this.customerForm.patchValue({
        fleetCustomerName: data.value.name,
        fleetCustomerId: data.value.id
      });
    } else {
      this.customerForm.patchValue({
        customerName: data.value.name
      });
    }
  }

  private buildForm() {
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    this.fleetFooterForm = this.formBuilder.group({
      total: [{value: undefined, disabled: true}],
      approved: [{value: undefined, disabled: true}],
      reject: [{value: undefined, disabled: true}],
      pending: [{value: undefined, disabled: true}],
      status: [{value: undefined, disabled: true}],
      inContract: [{value: undefined, disabled: true}]
    });
    this.fleetHeaderForm = this.formBuilder.group({
      dealerId: [undefined],
      refNo: [undefined],
      fromDate: [new Date(year, month - 1, 1)],
      toDate: [new Date(year, month + 2, 0)],
      status: [undefined]
    });
  }

  private buildCustomerForm() {
    this.customerForm = this.formBuilder.group({
      customerName: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(100)])],
      fleetCustomerId: [undefined],
      fleetCustomerName: [{value: undefined, disabled: true}],
      tel: [undefined, GlobalValidator.phoneFormat],
      fax: [undefined, GlobalValidator.phoneFormat],
      taxCode: [undefined, GlobalValidator.taxFormat],
      businessField: [undefined, GlobalValidator.required],
      customerAddress: [undefined, GlobalValidator.maxLength(2000)],
      provinceId: [undefined, GlobalValidator.required],
      contactName: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(1020)])],
      genderId: [undefined],
      ageLeadTimeId: [undefined],
      contactAddress: [undefined, GlobalValidator.maxLength(255)],
      contactTel: [undefined, GlobalValidator.phoneFormat],
      invoiceName: [undefined, GlobalValidator.maxLength(255)],
      invoiceAddress: [undefined, GlobalValidator.maxLength(512)],
      remark: [undefined]
    });
    if (!this.selectedFleetApp) {
      // tslint:disable-next-line:forin
      for (const key in this.customerForm.controls) {
        this.customerForm.controls[key].disable();
      }
    }
    if (!this.isDlr) {
      this.customerForm.get('fleetCustomerName').setValidators([GlobalValidator.required]);
    }
  }

  // Disable/Enable button
  get disableChangeBtn() {
    return !this.selectedFleetApp || (this.selectedFleetApp && this.selectedFleetApp.status === 'PENDING') ? true : null;
  }

  get disableSendBtn() {
    return !this.selectedFleetApp || (this.selectedFleetApp && this.selectedFleetApp.status !== 'PENDING') ? true : null;
  }

  get disableApproveRejectBtn() {
    return !this.selectedFleetApp || (this.selectedFleetApp && this.selectedFleetApp.status !== 'REQUEST') ? true : null;
  }
}
