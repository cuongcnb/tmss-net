import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {forkJoin} from 'rxjs';

import {GlobalValidator} from '../../../shared/form-validation/validators';
import {EventBusService} from '../../../shared/common-service/event-bus.service';
import {TMSSTabs} from '../../../core/constains/tabs';
import {LoadingService} from '../../../shared/loading/loading.service';
import {AppoinmentApi} from '../../../api/appoinment/appoinment.api';
import {DownloadService} from '../../../shared/common-service/download.service';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {CustomerApi} from '../../../api/customer/customer.api';
import {BookingStatus} from '../../../core/constains/booking-status';
import {Times} from '../../../core/constains/times';
import {ShortcutEventOutput, ShortcutInput} from 'ng-keyboard-shortcuts';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnChanges, OnDestroy, OnInit, AfterViewInit {
  @Output() clear = new EventEmitter();
  // tslint:disable-next-line:no-input-rename
  @Input('customerInfo') customerInfo;
  @ViewChild('carQueuingTicket', {static: false}) carQueuingTicket;
  @ViewChild('searchingOfBooking', {static: false}) searchingOfBooking;
  @ViewChild('reportTypeModal', {static: false}) reportTypeModal;
  @ViewChild('vehicleSearch', { static: false }) vehicleSearch;
  @Output() shortcuts = new EventEmitter<Array<ShortcutInput>>();
  form: FormGroup;
  isSubmit: boolean;
  formValue;
  selected;
  BookingStatus = BookingStatus;
  appointmentDetail;
  cusVisit;
  enableFields = ['apptype', 'reqdesc', 'jobsMoney', 'partsMoney', 'saId',
    'partBooking', 'sponsor', 'deposits', 'receiveceDate', 'lh1', 'lh1Note', 'lh2',
    'lh2Note', 'lh3', 'lh3Note', 'cardelivery', 'wshopto', 'wshopfrom',
    'confirm', 'notes', 'cancel', 'cancelreason', 'noShow', 'kqNoshow'];

  screenHeight: number;
  keyboardShortcuts: Array<ShortcutInput> = [];

  field = [
    'doixe', 
    'cmCode'
  ];
  customerD_fields = [
    'name',
    'tel',
    'email',
    'address'
  ]
  customer;
  vehicle;
  driver;
  cusdes;
  customerD;
  firstFocus;

  onResize() {
    this.screenHeight = window.innerHeight - 150;
  }

  constructor(
    private formBuilder: FormBuilder,
    private customerApi: CustomerApi,
    private eventBus: EventBusService,
    private appoinmentApi: AppoinmentApi,
    private dataFormatService: DataFormatService,
    private downloadService: DownloadService,
    private swalAlertService: ToastService,
    private loadingService: LoadingService) {
  }

  ngOnInit() {
    if (!this.form) {
      this.buildForm();
      this.patchFormValue();
    }
    this.checkDisable();
    this.onResize();
  }

  ngAfterViewInit(): void {
    this.keyboardShortcuts = [
      {
        key: ['ctrl + p', 'ctrl + P'],
        label: 'Phiếu hẹn',
        description: 'In phiếu hẹn',
        command: (e: ShortcutEventOutput) => this.reportTypeModal.open(1),
        preventDefault: true
      },
      {
        key: ['ctrl + k', 'ctrl + K'],
        label: 'Phiếu hẹn',
        description: 'Phiếu khám xe',
        command: (e: ShortcutEventOutput) => this.openCarQueuingTicket(),
        preventDefault: true
      }
    ];
    this.shortcuts.emit(this.keyboardShortcuts);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.customerInfo && this.searchingOfBooking) {
      this.searchingOfBooking.selectRow();
    }
    this.buildForm();
    this.patchFormValue();
  }

  ngOnDestroy() {
    this.clear.emit();
  }

  openCarQueuingTicket() {
    if(!this.validateAll()) {
      return;
    }
    this.isSubmit = true;
    if (!this.form.getRawValue().appoinmentId || this.form.touched) {
      this.swalAlertService.openWarningToast('Phiếu hẹn phải được lưu lại trước khi thực hiện');
      return;
    }
    this.prepareData();
    this.carQueuingTicket.open
    (
      this.form.get('customerId').value, 
      this.form.get('vehiclesId').value, 
      this.customerInfo && this.customerInfo.customerD ? this.customerInfo.customerD : this.driver
    );
    this.isSubmit = false;
  }

  openProposal() {
    if (!this.validateAll()) {
      return;
    }

    const customer = {
      cusDId: this.form.get('cusDId').value,
      cusId: this.form.get('customerId').value,
      roId: this.form.get('roId').value,
      vehiclesId: this.form.get('vehiclesId').value,
      cusvsId: this.form.get('cusvsId').value
    };

    if (!customer.cusvsId) {
      this.swalAlertService.openWarningToast('Không có phiếu khám xe. Thao tác lại');
      return;
    }
    this.loadingService.setDisplay(true);
    this.customerApi.getCustomerDetail(customer).subscribe(val => {
      this.loadingService.setDisplay(false);
      this.eventBus.emit({
        type: 'openComponent',
        functionCode: TMSSTabs.proposal,
        customerInfo: Object.assign({}, val, {booking: this.form.getRawValue()})
      });
    });
  }

  formatDate(val) {
    return this.dataFormatService.parseTimestampToDate(val);
  }

  openRepairProcess() {
    if (this.form.value.apptype === '2') {
      this.eventBus.emit({
        type: 'openComponent',
        functionCode: TMSSTabs.generalRepairProgress,
        data: {
          registerNo: this.form.getRawValue().registerno,
          toDate: this.form.getRawValue().cusarr
        }
      });
      return;
    }
    if (this.form.value.rotype === '1') {
      this.eventBus.emit({
        type: 'openComponent',
        functionCode: TMSSTabs.dongsonProgress
      });
      return;
    }
  }

  printAppoinment(params) {
    if (!this.form.value.appoinmentId) {
      this.swalAlertService.openFailToast('Không có thông tin phiếu hẹn hoặc phiếu hẹn chưa được lưu');
      return;
    }

    this.loadingService.setDisplay(true);
    this.appoinmentApi.printAppoinment({
      appoinmentId: this.form.value.appoinmentId,
      customerDId: this.form.value.customerDId,
      customerId: this.form.value.customerId,
      vehicleId: this.form.value.vehiclesId,
      extension: params.extension
    }).subscribe((data) => {
      this.loadingService.setDisplay(false);
      this.downloadService.downloadFile(data);
    });
  }

  onChooseDetail(val) {
    this.appointmentDetail = null;
    this.customerInfo = val;
    this.isSubmit = false;
    if (val) {
      this.form.reset();
      this.form.patchValue(Object.assign({},
        val.customerD,
        val.customer,
        val.vehicle,
        {
          appoinmentId: val.appoinmentId,
          customerDId: val.customerD ? val.customerD.id : null,
          customerId: val.customer ? val.customer.id : null,
          vehiclesId: val.vehicle ? val.vehicle.id : null,
          cusvsId: val.cusvsId ? val.cusvsId : null
        }
      ));
      this.patchFormValue();
      this.loadingService.setDisplay(true);
      this.getOne(val.appoinmentId, val.customer.id, val.vehicle.vinno);
    } else {
      this.form.patchValue({});
      this.checkDisable();
      this.form.markAsPristine();
    }
  }

  getOne(appointmentId, customerId, vinno, vehiclesId?) {
    const customer = {
      cusDId: this.form.get('cusDId').value,
      cusId: this.form.get('customerId').value,
      roId: this.form.get('roId').value,
      vehiclesId: this.form.get('vehiclesId').value ? this.form.get('vehiclesId').value : (vehiclesId ? vehiclesId : null),
      cusvsId: this.form.get('cusvsId').value
    };
    forkJoin([
      this.customerApi.getCustomerRoData(customerId, vinno),
      this.appoinmentApi.findOne(appointmentId || -1),
      this.customerApi.getCustomerDetail(customer)
    ]).subscribe(res => {
      this.customerInfo = res[2];
      this.form.patchValue(res[1].appoinment || {});
      const partsMoney = res[1].partList && res[1].partList.length
        ? res[1].partList.map(
          item => (item.quotationPart.sellPrice * item.quotationPart.qty)
            + (item.quotationPart.sellPrice * item.quotationPart.qty * ((item.part && item.part.rate) ? item.part.rate : 0) / 100))
        // tslint:disable-next-line:variable-name
          .reduce((partial_sum, a) => partial_sum + a)
        : 0;
      this.loadingService.setDisplay(false);
      if (res[1] && res[1].appoinment && this.customerInfo && this.customerInfo.customer
        && this.customerInfo.customer.appointmentId === res[1].appoinment.id) {
        this.appointmentDetail = Object.assign({}, res[2], res[1].appoinment, this.form.getRawValue(),
          {
            appoinmentNo: res[1].appoinment.appointmentno,
            apptype: res[1].appoinment.apptype ? res[1].appoinment.apptype : '2',
            cusarr: res[1].appoinment.cusarr,
            appoinmentId: res[1].appoinment.id
          });
      }
      const obj = Object.assign({}, res[0], res[1].appoinment, {
        //vehicle
        registerno: res[2].vehicle ? res[2].vehicle.registerno : null,
        registerNo: res[2].vehicle ? res[2].vehicle.registerno : null,
        vinno: res[2].vehicle.vinno,
        cfType: res[2].carFamily? res[2].carFamily.cfType : null,
        cfId: res[2].carModel ? res[2].carModel.cfId: null,
        doixe: res[2].carModel ? res[2].carModel.doixe : null,
        cmId: res[2].carModel ? res[2].carModel.id : null,
        cmCode: res[2].carModel? res[2].carModel.cmCode : null,
        cmName: res[2].carModel? res[2].carModel.cmName : null,
        vcId: res[2].vehicleColor ? res[2].vehicleColor.id : undefined,
        vccode: res[2].vehicleColor? res[2].vehicleColor.vcCode : null,
        enginetypeId: res[2].engineType ? res[2].engineType.id : undefined,
        enginecode: res[2].engineType? res[2].engineType.engineCode : null,
        deliveryDate: res[2].vehicle.deliveryDate? res[2].vehicle.deliveryDate : null,
        vehiclesId: res[2].vehicle ? res[2].vehicle.id: null,
        vhcType: res[2].vehicle ? res[2].vehicle.vhcType: null,
        //apointment
        appointmentno: res[1].appoinment ? res[1].appoinment.appointmentno : null,
        appoinmentId: res[1].appoinment ? res[1].appoinment.id : null,
        appstatus: res[1].appoinment ?  res[1].appoinment.appstatus : null,
        partList: res[1].partList,
        partBooking: res[1].partList && res[1].partList.length || 0,
        estimateTime: res[1].appoinment && res[1].appoinment.estimateTime ? res[1].appoinment.estimateTime : null,
        estimateMoney: res[1].appoinment ? res[1].appoinment.estimateMoney : 0,
        jobsMoney: res[1].appoinment ? res[1].appoinment.jobsMoney : 0,
        partsMoney: res[1].appoinment ? res[1].appoinment.partsMoney : 0,
        typeEstimateTime: 0,
        confirm: (res[1] && res[1].appoinment && res[1].appoinment.appstatus === BookingStatus.APP_CONFIRM),
        dateconfirm: (res[1] && res[1].appoinment && res[1].appoinment.dateconfirm) ? new Date(res[1].appoinment.dateconfirm) : null,
        noShow: (res[1] && res[1].appoinment && (res[1].appoinment.appstatus === BookingStatus.APP_NOSHOW || res[1].appoinment.appstatus === BookingStatus.APP_NOSHOW_ORDER)),
        cancel: (res[1] && res[1].appoinment && (res[1].appoinment.appstatus === BookingStatus.APP_CANCEL || res[1].appoinment.appstatus === BookingStatus.APP_CANCEL_TMP)),
        sponsor: res[1].appoinment ? res[1].appoinment.sponsor : null,
        saId: res[1].appoinment ? res[1].appoinment.saId : null,
        deposits: res[1].appoinment ? res[1].appoinment.deposits : null,
        cusarr: res[1].appoinment ? res[1].appoinment.cusarr : null,
        cusvsId: res[1].appoinment ? res[1].appoinment.cusvsId : null,
        cardelivery: res[1].appoinment ? res[1].appoinment.cardelivery : null,
        //customer
        customerId: res[2].customerInfor ? res[2].customerInfor.id : null,
        orgname: res[2].customerInfor ? res[2].customerInfor.orgname : null,
        carownername: res[2].customerInfor ? res[2].customerInfor.carownername : null,
        carownermobil: res[2].customerInfor ? res[2].customerInfor.carownermobil : null,
        carowneradd: res[2].customerInfor ? res[2].customerInfor.carowneradd : null,
        carowneremail: res[2].customerInfor ? res[2].customerInfor.carowneremail : null,
        cusno: res[2].customerInfor ? res[2].customerInfor.cusno : null, 
        custypeId: res[2].customerInfor && res[2].customerInfor.custypeId ? res[2].customer.custypeId : '1',
        provinceId: res[2].customerInfor ? res[2].customerInfor.provinceId : null,
        districtId: res[2].customerInfor ? res[2].customerInfor.districtId : null,
        cusNote: res[2].cusNote? res[2].cusNote : null,
        //cusD
        name: res[2].customerD ? res[2].customerD.name : null,
        type: res[2].customerD && res[2].customerD.type ? res[2].customerD.type : '1',
        tel: res[2].customerD ? res[2].customerD.tel : null,
        address: res[2].customerD ? res[2].customerD.address : null,
        email: res[2].customerD ? res[2].customerD.email : null,
        //cusvs
        reqdesc: res[1].appoinment ? res[1].appoinment.reqdesc : null,
      });
      this.form.patchValue(obj);
      this.onChangeType();
      this.cusVisit = res[2].cusVisit;
      this.checkDisable();
      this.form.patchValue({
        appstatus: res[1].appoinment ? res[1].appoinment.appstatus : null
      });
    });
  }

  checkDisable() {
    if (
      (this.form &&
        (this.form.getRawValue().appstatus === BookingStatus.APP_NOSHOW
          || this.form.getRawValue().appstatus === BookingStatus.APP_NOSHOW_ORDER
          || this.form.getRawValue().appstatus === BookingStatus.APP_CANCEL_TMP
          || this.form.getRawValue().appstatus === BookingStatus.APP_CANCEL
        ))
    ) {
      this.enableFields.forEach(field => this.form.get(field).disable());
      this.customerD_fields.forEach(field => this.form.get(field).disable());
    } else {
      this.enableFields.forEach(field => this.form.get(field).enable());
      this.customerD_fields.forEach(field => this.form.get(field).enable());
    }

    if (this.form && this.form.value.type == '1') {
      this.customerD_fields.forEach(field => this.form.get(field).disable());
    } else {
      this.customerD_fields.forEach(field => this.form.get(field).enable());
    }
  }

  validateBeforeSave() {
    const formValue = this.form.getRawValue();
    // check car is in campaign
    this.appoinmentApi.isInCampaign(formValue.registerNo).subscribe(res => {
      if (res.isInCampaign === 'Y') {
        this.swalAlertService.openSuccessToast('Xe đang nằm trong chiến dịch', 'Thông báo');
        return;
      }
    });

    if (
      !formValue.registerNo|| !formValue.name || !formValue.tel || 
      !formValue.carownername || !formValue.carownermobil || !formValue.apptype || 
      !formValue.reqdesc || !formValue.saId
    ) {
      this.swalAlertService.openWarningToast('Bạn đã nhập thiếu trường dữ liệu bắt buộc hoặc sai dữ liệu. Vui lòng nhập đầy đủ các trường dữ liệu bắt buộc, sau đó lưu thông tin và thử lại!');
      return false;
    }

    if (this.form.value.cusarr > this.form.value.cardelivery) {
      this.swalAlertService.openWarningToast('Thời gian giao xe không được nhỏ hơn thời gian hẹn');
    }

    if (Number(this.form.value.estimateTime) === 0) {
      this.swalAlertService.openWarningToast('Bạn phải nhâp TGSC trong kế hoạch công việc');
      return false;
    }

    if (this.form.value.cusarr < new Date().getTime()) {
      this.swalAlertService.openFailToast('Thời gian hẹn phải lớn hơn ngày hiện tại');
      return false;
    }

    if (formValue.partBooking && !formValue.sponsor && !formValue.deposits) {
      this.swalAlertService.openWarningToast('Phải có bảo lãnh hoặc đặt cọc để đặt hẹn có phụ tùng');
      return false;
    }
    return true;
  }

  validateAll() {
  const formValue = this.form.getRawValue();
  
    if (
      !formValue.registerNo || !formValue.name || !formValue.tel || !formValue.carownername || !formValue.carownermobil || formValue.cfType == null ||
      formValue.cfId == null || !formValue.vccode || !formValue.saId || !formValue.apptype || !formValue.reqdesc || !formValue.vinno || 
      !formValue.districtId || !formValue.provinceId || !formValue.vhcType
    ) {
      this.swalAlertService.openWarningToast('Bạn đã nhập thiếu trường dữ liệu bắt buộc hoặc sai dữ liệu. Vui lòng nhập đầy đủ các trường dữ liệu bắt buộc, sau đó lưu thông tin và thử lại!');
      return false;
    }

    if (Number(this.form.value.estimateTime) === 0) {
      this.swalAlertService.openWarningToast('Bạn phải nhâp TGSC trong kế hoạch công việc');
      return false;
    }
    return true;
  }

  prepareData() {
    const formValue = this.form.getRawValue();
    //preparing data
    this.vehicle = {
      id: formValue.vehiclesId,
      registerno: formValue.registerNo,
      cmId: formValue.cmId,
      cmName: formValue.cmName,
      vinno: formValue.vinno,
      vccode: formValue.vccode,
      vcId: formValue.vcId,
      enginetypeId: formValue.enginetypeId,
      engineno: formValue.engineno,
      fullmodel: formValue.doixe,
      ntCode: formValue.ntCode,
      enginecode: formValue.enginecode,
      deliveryDate: formValue.deliveryDate,
      vhcType: formValue.vhcType
    }
    this.customer = {
      id: formValue.customerId,
      carownername: formValue.carownername,
      carownermobil: formValue.carownermobil,
      carowneradd: formValue.carowneradd,
      carownerfax: formValue.carownerfax,
      carowneremail: formValue.carowneremail,
      custypeId: formValue.custypeId ? formValue.custypeId : '1',
      districtId: formValue.districtId,
      provinceId: formValue.provinceId,
      orgname: formValue.orgname
    }
    this.driver = {
      id: formValue.cusDId,
      name: formValue.name,
      type: formValue.type ? formValue.type : '1',
      tel: formValue.tel,
      address: formValue.address,
      email: formValue.email
    }
    this.cusdes = {
      cusNote: formValue.cusNote 
    }       
  }

  save() {
    this.checkIsCarowner();
    if (!this.validateBeforeSave()) {return}
    this.isSubmit = true;
    const formValue = this.form.getRawValue();
    this.prepareData();

    let value = {
      appoinment: Object.assign({}, formValue, {
        dateconfirm: formValue.confirm ? this.dataFormatService.formatDate(formValue.dateconfirm) : null
      }, {
        id: formValue.appoinmentId,
        estimateTime: this.form.value.typeEstimateTime === 2
          ? Number(this.form.value.estimateTime) * Times.dayMin : this.form.value.typeEstimateTime === 1
            ? Number(this.form.value.estimateTime) * Times.hourMin : Number(this.form.value.estimateTime),
        jobsMoney: Number(this.form.value.jobsMoney) ? Number(this.form.value.jobsMoney) : 0,
        partsMoney: Number(this.form.value.partsMoney) ? Number(this.form.value.partsMoney) : 0,
        estimateMoney: Number(this.form.value.estimateMoney) ? Number(this.form.value.estimateMoney) : 0
      }),
      vehicleId: this.vehicle ? this.vehicle.id : null,
      customerId: this.customer ? this.customer.id : null,
      srvDVehicles: this.vehicle,
      srvDCustomersD: this.driver,
      srvDCustomers: this.customer,
      srvBCusdes: this.cusdes,
      partList: formValue.partList || []
    };
    const afterSave = (res) => {
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessToast();
      this.form.patchValue({
        appoinmentId: res.appoinment.id,
        appointmentno: res.appoinment.appointmentno,
        cusvsId: res.appoinment.cusvsId,
        vehiclesId: res.vehicleId,
        customerId: res.customerId,
        customerDId: res.srvDCustomersD.id,
        saId: res.appoinment.saId
      });
      // this.form.patchValue(res.appoinment);
      this.form.markAsPristine();
      this.form.markAsUntouched();
    };

    this.loadingService.setDisplay(true);
    if (!this.form.getRawValue().appoinmentId) {
      this.appoinmentApi.insertNew(value).subscribe(res => {
        afterSave(res);
      });
    } else {
      this.appoinmentApi.updateAppoinment(value).subscribe(res => {     
        afterSave(res);
      });
    }
  }

  private patchFormValue() {
    if (this.customerInfo) {
      if (this.customerInfo.customer) {
        this.form.patchValue(this.customerInfo.customer);
        this.form.patchValue({
          registerno: this.customerInfo.customer.registerNo
        });
      }
      if (this.customerInfo.customerD && this.customerInfo.customerD.type && (this.customerInfo.customerD.type !== '1' || 1)) {
        this.form.patchValue(this.customerInfo.customerD);
      } else {
        this.form.patchValue({
          name: this.customerInfo.customer.carownername,
          tel: this.customerInfo.customer.carownermobil,
          address: this.customerInfo.customer.carowneradd,
          email: this.customerInfo.customer.carowneremail,
          type: '1'
        });
      }
      if (this.customerInfo.history) {
        this.form.patchValue(this.customerInfo.history);
      }
      if (this.customerInfo.vehicle) {
        this.form.patchValue(this.customerInfo.vehicle);
      }

      // Open booking from customer-info (without appointment)
      if (!this.customerInfo.customer.appointmentId && !this.customerInfo.appoinmentId) {
        this.customerApi.getCustomerDetail({
          cusDId: this.customerInfo.customerD.id,
          cusId: this.customerInfo.customer.customerId,
          roId: this.customerInfo.customer.roId,
          vehiclesId: this.customerInfo.customer.vehiclesId,
          cusvsId: this.customerInfo.customer.cusvsId
        }).subscribe(res => {
          this.form.patchValue(Object.assign({}, res.customer, res.vehicle, {
            name: res.customerD ? res.customerD.name : res.customer.carownername,
            type: res.customerD ? res.customerD.type : '1',
            tel: res.customerD ? res.customerD.tel : res.customer.carownermobil,
            address: res.customerD ? res.customerD.address : res.customer.carowneradd,
            email: res.customerD ? res.customerD.email : res.customer.carowneremail
          }));
          this.checkDisable();
          this.form.patchValue({
            estimateTime: res.repairOrder ? res.repairOrder.estimateTime : null
          });
        });
      }
      // Choose a appoinment from list (left side)
      if (this.customerInfo.customer && this.customerInfo.customer.appointmentId && this.customerInfo.customer.customerId && this.customerInfo.customer.vehiclesId) {
        this.getOne(this.customerInfo.customer.appointmentId, this.customerInfo.customer.customerId, this.customerInfo.customer.vinno);
      } else {
        this.form.patchValue({roId: null});
      }
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      registerNo: [{ value: undefined, disabled: false }, GlobalValidator.required],
      registerno: [{ value: undefined, disabled: false }],
      createDate: [{ value: undefined, disabled: true }],
      appointmentno: [{ value: undefined, disabled: true }],

      // customerD
      name: [{ value: undefined, disabled: false }, GlobalValidator.required],
      type: [{ value: undefined, disabled: false }],
      tel: [{ value: undefined, disabled: false }, GlobalValidator.required],
      address: [{ value: undefined, disabled: false }],
      email: [{ value: undefined, disabled: false }],
      // customer
      carownername: [{ value: undefined, disabled: false }, GlobalValidator.required],
      cusType: [{ value: undefined, disabled: false }],
      custypeId: [{ value: undefined, disabled: false }],
      orgname: [{ value: undefined, disabled: false }],
      carownermobil: [{ value: undefined, disabled: false }, GlobalValidator.required],
      carowneradd: [{ value: undefined, disabled: false }],
      carownerfax: [{ value: undefined, disabled: false }],
      carowneremail: [{ value: undefined, disabled: false }],
      cusNote: [{ value: undefined, disabled: false }],   
      provinceId: [undefined],
      districtId: [undefined],

      // vehicle
      cfType: [undefined],
      cfId: [undefined],
      cmId: [undefined],
      cmCode: [{ value: undefined, disabled: false }],
      cmName: [{ value: undefined, disabled: false }],
      vinno: [{ value: undefined, disabled: false }],
      vccode: [{ value: undefined, disabled: false }],
      vcId: [undefined],
      enginetypeId: [undefined],
      engineno: [{ value: undefined, disabled: false }],
      doixe: [{ value: undefined, disabled: false }],
      ntCode: [{ value: undefined, disabled: false }],
      enginecode: [{ value: undefined, disabled: false }],
      deliveryDate: [{ value: undefined, disabled: false }],
      lastKm: [{ value: undefined, disabled: false }],
      vhcType: [undefined],

      // thông tin yêu cầu
      customerDId: [undefined],
      customerId: [undefined],
      vehiclesId: [undefined],
      appoinmentId: [undefined], // apointment id
      appchangercount: [undefined],
      appstatus: [undefined],
      apptype: ['2', GlobalValidator.required],
      roId: [{ value: undefined, disabled: true }],
      reqdesc: [{ value: undefined, disabled: false }],
      estimateMoney: [0, Validators.compose([GlobalValidator.numberFormat])],
      jobsMoney: [0, Validators.compose([GlobalValidator.numberFormat])],
      partsMoney: [0, Validators.compose([GlobalValidator.numberFormat])],
      saId: [undefined, GlobalValidator.required],
      wshopName: [{ value: undefined, disabled: true }],
      technicalName: [{ value: undefined, disabled: true }],
      estimateTime: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.numberFormat])],
      typeEstimateTime: [0],
      partBooking: [false],
      sponsor: [undefined],
      deposits: [undefined, GlobalValidator.numberFormat],
      receiveceDate: [undefined],
      lh1: [undefined],
      lh1Note: [undefined],
      lh2: [undefined],
      lh2Note: [undefined],
      lh3: [undefined],
      lh3Note: [undefined],
      cusarr: [undefined, Validators.compose([GlobalValidator.required])],
      cardelivery: [undefined],
      wshopto: [undefined],
      wshopfrom: [undefined],

      // dời hẹn
      confirm: [false],
      dateconfirm: [{ value: undefined, disabled: true }],
      notes: [undefined],
      cancel: [false],
      cancelreason: [undefined],
      noShow: [false],
      kqNoshow: [undefined],
      partList: [[]],
      cusvsId: [undefined],
      isdone: [undefined],
      cusDId: [undefined],
      deleteflag: [undefined]
    }, {
      validator: this.compareDate()
    });
  }

  compareDate() {
    return (group: FormGroup) => {
      const carDelivery = group.get('cardelivery');
      const cusArr = group.get('cusarr');
      if (carDelivery && carDelivery.value && cusArr && cusArr.value && carDelivery.value < cusArr.value) {
        this.swalAlertService.openWarningToast('Bạn đã nhập thiếu trường dữ liệu bắt buộc hoặc sai dữ liệu. Vui lòng nhập đầy đủ các trường dữ liệu bắt buộc, sau đó lưu thông tin và thử lại!'); 
        return {compareDate: true};
      }
      return null;
    };
  }

  checkProgress() {
    const formValue = this.form.getRawValue();
    if (
      !formValue.appoinmentId || !formValue.vehiclesId || !formValue.cusvsId || !formValue.customerId
    ) {
      this.swalAlertService.openWarningToast('Bạn đã nhập thiếu trường dữ liệu bắt buộc hoặc sai dữ liệu. Vui lòng nhập đầy đủ các trường dữ liệu bắt buộc, sau đó lưu thông tin và thử lại!');
      return false;
    }

    if (Number(this.form.value.estimateTime) === 0) {
      this.swalAlertService.openWarningToast('Bạn phải nhâp TGSC trong kế hoạch công việc');
      return false;
    }
    return true;
  }

  autoCheck(valueCode) {   
    if (!this.checkProgress()) {
      return;
    }
    
    this.isSubmit = true;
    const formValue = this.form.getRawValue();
    this.prepareData();
    const value = {
      suggestRequestCode: valueCode,
      appoinment: Object.assign({}, formValue, {
        dateconfirm: formValue.confirm ? this.dataFormatService.formatDate(formValue.dateconfirm) : null
      }, {
        id: formValue.appoinmentId,
        estimateTime: this.form.value.typeEstimateTime === 2
          ? Number(this.form.value.estimateTime) * Times.dayMin : this.form.value.typeEstimateTime === 1
            ? Number(this.form.value.estimateTime) * Times.hourMin : Number(this.form.value.estimateTime),
        jobsMoney: Number(this.form.value.jobsMoney) ? Number(this.form.value.jobsMoney) : 0,
        partsMoney: Number(this.form.value.partsMoney) ? Number(this.form.value.partsMoney) : 0,
        estimateMoney: Number(this.form.value.estimateMoney) ? Number(this.form.value.estimateMoney) : 0
      }),
      vehicleId: this.vehicle ? this.vehicle.id : null,
      customerId: this.customer ? this.customer.id : null,
      srvDVehicles: this.vehicle,
      srvDCustomersD: this.driver,
      srvDCustomers: this.customer,
      srvBCusdes: this.cusdes,
      partList: formValue.partList || []
    };
    const afterSave = (res) => {
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessToast();
      this.form.patchValue(res.appoinment);
      this.form.patchValue({
        appoinmentId: res.appoinment.id,
        deleteflag: res.appoinment.deleteflag,
        appointmentno: res.appoinment.appointmentno,
        cusvsId: res.appoinment.cusvsId,
        vehiclesId: res.vehicleId,
        customerId: res.customerId,
        customerDId: res.srvDCustomersD.id
      });
      this.form.markAsPristine();
      this.form.markAsUntouched();
    };

    this.loadingService.setDisplay(true);
    if (!this.form.getRawValue().appoinmentId) {
      this.appoinmentApi.insertNew(value).subscribe(res => {
        afterSave(res);
        this.openRepairProcess();
      }, error => {
        if (error.message === 1042) {
          this.openRepairProcess();
        }
      });
    } else {
      this.appoinmentApi.updateAppoinment(value).subscribe(res => {
        afterSave(res);
        this.openRepairProcess();
      }, error => {
        if (error.message === 1042) {
          this.openRepairProcess();
        }
      });
    }
  }

  checkAppStatus() {
    if (!this.form.value.appoinmentId) {
      return;
    }
    this.appoinmentApi.getStatus(this.form.value.appoinmentId).subscribe(res => {
      this.form.patchValue({
        appstatus: res.appstatus,
        deleteflag: res.deleteflag,
        appoinmentId: res.deleteflag === 'Y' ? null : res.id
      });
    });
  }

  creatNewBooking() {
    const fieldDisable = ['appointmentno', 'roId', 'confirm', 'notes', 'cancelreason', 'noShow', 'kqNoshow', 'cancel'];
    this.form.reset();
    this.form.enable();
    fieldDisable.forEach(it => this.form.get(it).disable());
  }

  search(exactRegisterNo?) {
    const registerNo = this.form.value.registerNo;

    // Tìm kiếm chính xác theo biển số đã nhập
    const dataSearch = !!exactRegisterNo
      ? Object.assign({}, this.form.value, { searchNoneLike: '1' })
      : Object.assign({}, this.form.value);
    this.transformRegisterNo(registerNo);
    this.vehicleSearch.open({'registerNo': registerNo}, registerNo);
  }

  verifyRegisterNo(f: FormGroup) {
    const control = f.get('registerNo');
    control.setValue(control.value.split(/[^A-Za-z0-9]/).join('').toUpperCase());
  }

  onFocus() {
    this.firstFocus = false;
  }

  private transformRegisterNo(reg): string {
    return (typeof reg === 'string' || reg instanceof String) ?
      [].concat(reg.split(/[^A-Za-z0-9]/))
        .filter(item => item !== '')
        .map(item => item.toString().toUpperCase())
        .join('')
      : '';
  }
  
  clearForm() {
    this.customerInfo = null;
    this.customerD = null;
    this.form.reset();
    this.form.get('registerNo').setValue('');
    this.enableFields.forEach(field => this.form.get(field).enable());
    this.customerD_fields.forEach(it => {
      if (this.form.get(it))
        this.form.get(it).enable();
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.firstFocus = true;
    this.form.get('apptype').setValue('2');
  }

  onChange(val) {
    this.form.patchValue({
      roId: val.roId,
      customerId: val.customerId,
      vehiclesId: val.vehicleId,
      cusvsId: val.cusvsId
    });
    if (val.customerId && val.vehicleId) {
      this.getOne(val.appId, val.customerId, val.vinno, val.vehicleId);
    }
    this.field.forEach(it => {
      if(this.form.get(it) && this.form.get(it).value) this.form.get(it).disable();
    });
  }

  checkIsCarowner() {
    if (this.form.value.type && this.form.value.type == 1) {
      this.customerD_fields.forEach(it => {
        if (this.form.get(it)) {
          this.form.get(it).disable();        
        }
      })
      this.form.patchValue({
        name: this.form.get('carownername') && this.form.get('carownername').value ? this.form.get('carownername').value : null,
        tel: this.form.get('carownermobil') && this.form.get('carownermobil').value ? this.form.get('carownermobil').value : null,
        email: this.form.get('carowneremail') && this.form.get('carowneremail').value ? this.form.get('carowneremail').value : null,
        address: this.form.get('carowneradd') && this.form.get('carowneradd').value ? this.form.get('carowneradd').value : null
      })
    }
  }

  onChangeType() {
    this.checkIsCarowner();
    if (this.form.value.type && this.form.value.type != 1) {
      this.customerD_fields.forEach(it => {
        if (this.form.get(it)) this.form.get(it).enable();
      })
    }
  }

  openReportModal() {
    if(!this.validateAll()) {
      return;
    }
    this.reportTypeModal.open(1);
  }
}
