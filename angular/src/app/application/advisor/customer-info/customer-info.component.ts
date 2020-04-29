import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {GlobalValidator} from '../../../shared/form-validation/validators';
import {LoadingService} from '../../../shared/loading/loading.service';
import {CustomerApi} from '../../../api/customer/customer.api';
import {ConfirmService} from '../../../shared/confirmation/confirm.service';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {EventBusService} from '../../../shared/common-service/event-bus.service';
import {TMSSTabs} from '../../../core/constains/tabs';
import {state} from '../../../core/constains/ro-state';
import {CampaignDlrApi} from '../../../api/campaign-dlr/campaign-dlr.api';
import {WebSocketService} from '../../../api/web-socket.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.scss']
})
export class CustomerInfoComponent implements AfterViewInit, OnChanges, OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('registerNo') registerNo;
  @ViewChild('customerReferComponent', {static: false}) customerReferComponent;
  @ViewChild('repairHistory', {static: false}) repairHistory;
  @ViewChild('vehicleSearch', {static: false}) vehicleSearch;
  @ViewChild('carQueuingTicket', {static: false}) carQueuingTicket;
  @ViewChild('campaignDlr', {static: false}) campaignDlr;
  @ViewChild('submitBtn', {static: false}) submitBtn;
  form: FormGroup;
  customerRef: FormGroup;
  historyForm: FormGroup;
  activeCrForm: FormGroup;
  isSubmit: boolean;
  isSubmitRef: boolean;
  customerD;
  isExistCampaign: boolean;
  cusDId;
  firstFocus = true;
  stompClient;
  screenHeight: number;
  private readonly registerNoMinLength: number = 6;
  private readonly registerNoMaxLength: number = 13;

  onResize() {
    this.screenHeight = window.innerHeight - 180;
  }

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private confirmService: ConfirmService,
    private swalAlertService: ToastService,
    private customerApi: CustomerApi,
    private eventBus: EventBusService,
    private campaignDlrApi: CampaignDlrApi,
    private webSocketService: WebSocketService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!!this.form && !!changes.registerNo && !!changes.registerNo.currentValue) {
      this.form.get('registerNo').patchValue(this.transformRegisterNo(changes.registerNo.currentValue));
      this.search(true);
    }
  }

  ngOnInit() {
    console.log('Version: 2.1 Time: 13-01-2020 12:00');
    this.buildForm();
    this.buildCusRefForm();
    this.onResize();
    this.isExistCampaign = false;
    // this.stompClient = this.webSocketService.connect();
    // this.stompClient.connect({}, () => {
    //
    //   // Subscribe to notification topic
    //   this.stompClient.subscribe('/topic/notification', notifications => {
    //
    //     // Update notifications attribute with the recent messsage sent from the server
    //     console.log(notifications);
    //   });
    // });
  }

  ngAfterViewInit(): void {
    if (!!this.registerNo) {
      this.form.get('registerNo').patchValue(this.transformRegisterNo(this.registerNo));
      this.search(true);
    }
  }

  onChange(val) {
    this.loadingService.setDisplay(true);
    this.customerApi.getCustomerDetail({
      cusId: val.customerId,
      roId: val.roId,
      vehiclesId: val.vehicleId,
      cusvsId: val.cusvsId ? val.cusvsId : this.form.get('cusvsId').value
    }).subscribe(res => {
      if (!!res.carModel && !!res.carModel.id) {
        this.campaignDlrApi.checkCarInDealerCampaign(res.carModel.id).subscribe(campaigns => this.isExistCampaign = (!!campaigns && campaigns.length));
      }
      this.clear(val);
      this.customerD = res;
      this.checkDisable(res);
      this.form.patchValue(Object.assign({}, val, res.customer, res.vehicle, res.carModel,
        {
          orgname: res.customer ? res.customer.orgname : undefined,
          taxcode: res.customer ? res.customer.taxcode : undefined,
          cusno: res.customer ? res.customer.cusno : undefined,
          vehiclesId: val.vehicleId,
          registerNo: this.transformRegisterNo(val.registerNo),
          cusvsId: val.cusvsId,
          meetcus: res.cusVisit ? res.cusVisit.meetcus : null,
          appointmentId: val.appId,
          campId: null,
          customerId: res.customer ? res.customer.id : undefined,
          cfType: res.carFamily ? res.carFamily.cfType : undefined,
          fullmodel: res.vehicle ? res.vehicle.fullmodel : undefined,
          type: res.customerD ? res.customerD.type : '1',
          vcId: res.vehicleColor ? res.vehicleColor.id : undefined,
          vccode: res.vehicleColor ? res.vehicleColor.vcCode : undefined,
          roId: val.roId,
          usedCarId: res.usedCarList ? res.usedCarList.id : undefined,
          km: res.usedCarList ? res.usedCarList.km : undefined,
          effectToDate: res.usedCarList ? res.usedCarList.effectToDate : undefined,
          enginetypeId: res.engineType ? res.engineType.id : undefined,
          enginecode: res.engineType ? res.engineType.engineCode : undefined,
          cusNote: res.cusNote ? res.cusNote : undefined,
          cusDId: res.customerD && res.customerD.id ? res.customerD.id : undefined,
          inGate: res.inGate ? res.inGate : undefined,
          pds: this.transformRegisterNo(val.registerNo).indexOf('PDS') === 0,
          listCampaignId: res.listCampaignId,
          hybrid: res.vehicle && res.vehicle.hybrid === '1'
        }
      ));
      this.customerRef.patchValue(res.customerD ? res.customerD : {type: '1'});
      this.form.get('pds').valueChanges.subscribe(it => {
        if (!!it) {
          let value = 'PDS';
          const vinno = this.form.get('vinno').value;
          // Lấy PDS + 6 số cuối số vinno
          value = vinno && vinno.length > 0 ? value + vinno.slice(vinno.length - 6, vinno.length) : value;
          this.form.get('registerNo').setValue(value);
          this.form.get('registerNo').disable();
        } else {
          this.form.get('registerNo').enable();
        }
      });
      // Tìm lịch sử sửa chữa gần nhất
      if (this.form.getRawValue().vinno && this.form.getRawValue().customerId) {
        this.customerApi.getCustomerRoData(this.form.getRawValue().customerId, this.form.getRawValue().vinno).subscribe(roData => {
          this.historyForm.patchValue(roData);
        });
      }

      setTimeout(() => {
        this.form.markAsUntouched();
        this.form.markAsPristine();
        this.customerRef.markAsUntouched();
        this.customerRef.markAsPristine();
        if (this.form.getRawValue().vinno && this.form.getRawValue().vinno.length === 17) {
          // this.campaignDlr.getCampaignByVinno(this.form.getRawValue().vinno);
        }
      });
      this.loadingService.setDisplay(false);
      if (!!this.form.getRawValue().vinno && !!this.form.getRawValue().customerId) {
        this.campaignDlr.getCampaignByVinno(this.form.getRawValue().vinno, this.form.getRawValue().listCampaignId);
      }
    });
  }

  setCustomerWaiting(val) {
    this.clear(val);
    this.form.get('registerNo').setValue(this.transformRegisterNo(val.registerNo));
    this.search();
  }

  search(exactRegisterNo?: boolean) {
    const registerNo = (this.customerD && this.customerD.vehicle) ? this.customerD.vehicle.registerno : undefined;
    // Tìm kiếm chính xác theo biển số đã nhập
    const dataSearch = !!exactRegisterNo
      ? Object.assign({}, this.form.value, {searchNoneLike: '1'})
      : Object.assign({}, this.form.value);

    this.vehicleSearch.open(dataSearch, registerNo);
    // if (!!this.form.getRawValue().vinno && !!this.form.getRawValue().customerId) {
    //   this.campaignDlr.getCampaignByVinno(this.form.getRawValue().vinno, this.form.getRawValue().listCampaignId);
    // }
  }

  selectedTabCustomerInfo() {
    const registerNo = this.form.value.registerNo;
    if (!registerNo) {
      return;
    }
    this.vehicleSearch.open(this.form.value);
    // if (this.form.getRawValue().vinno && this.form.getRawValue().vinno.length === 17) {
    //   this.campaignDlr.getCampaignByVinno(this.form.getRawValue().vinno, this.form.getRawValue().listCampaignId);
    // }
  }

  insertData() {
    const value = Object.assign({}, this.form.getRawValue(), this.customerRef.getRawValue(), {
      ckd: this.form.get('ckd').value ? 'Y' : 'N', hybrid: !this.form.get('hybrid').value || Number(this.form.get('hybrid').value) === 0  ? 0 : 1
    });
    const apiCall = value.customerId ? this.customerApi.updateData(value) : this.customerApi.insertNew(Object.assign(value, {cusno: 'TEL' + value.carownermobil}));
    this.loadingService.setDisplay(true);
    apiCall.subscribe(val => {
      localStorage.setItem('changeInfo' + this.form.value.registerNo, JSON.stringify(val));
      this.search();
      this.swalAlertService.openSuccessToast();
      this.loadingService.setDisplay(false);
      this.form.patchValue(val);
      this.customerRef.patchValue(Object.assign({}, val, {id: val.cusDId}));
      if (this.form.getRawValue().vinno && this.form.getRawValue().vinno.length === 17) {
        this.campaignDlr.getCampaignByVinno(this.form.getRawValue().vinno, this.form.value.vehiclesId);
      }
      this.form.markAsUntouched();
      this.form.markAsPristine();
      this.customerRef.markAsUntouched();
      this.customerRef.markAsPristine();
    });
  }

  save() {
    if (!!this.form.get('registerNo').value && !this.form.get('vinno').value && this.form.get('cfType').value === 0) {
      this.form.get('vinno').patchValue(this.form.get('registerNo').value);
    }
    if (this.customerRef.invalid || this.form.invalid) {
      this.setSubmitState();
      this.swalAlertService.openWarningToast('Bạn đã nhập thiếu trường dữ liệu bắt buộc hoặc sai dữ liệu');
      return;
    }

    const saving = () => {
      this.form.get('frameno').setValue(this.form.get('vinno').value.slice(-7));
      this.loadingService.setDisplay(true);
      this.customerApi.checkDuplicateVinno({
        vehicleId: this.form.getRawValue().vehiclesId,
        vinNo: this.form.getRawValue().vinno
      }).subscribe(res => {
        this.loadingService.setDisplay(false);
        if (res && res.length) {
          this.confirmService.openConfirmModal('Thông báo', 'Số VIN trùng nhau. Bạn có muốn lưu hay không?')
            .subscribe(() => {
              this.insertData();
            });
        } else {
          this.insertData();
        }
      });
    };
    if (!this.form.getRawValue().fullmodel) {
      this.confirmService.openConfirmModal('Cảnh báo', `Xe này không có thông tin fullmodel. Có tiếp tục lưu?`).subscribe(() => {
        saving();
      });
    } else {
      saving();
    }
  }

  repairHistoryOpenModal() {

    // if (!this.form.value.vehiclesId) {
    //   this.swalAlertService.openWarningToast('Thông tin xe chưa được lưu trong hệ thống');
    //   return;
    // }
    if (this.form.touched || this.customerRef.touched) {
      this.swalAlertService.openWarningToast('Bạn phải lưu lại thay đổi thông tin trước khi thực hiện');
      return;
    }
    // if (this.form.invalid) {
    //   this.setSubmitState();
    //   this.swalAlertService.openWarningToast('Dữ liệu chưa đúng');
    //   return;
    // }
    this.repairHistory.open(
      this.form.get('customerId').value, 
      null, 
      this.form.get('vehiclesId').value, 
      this.customerD,
    );
  }

  book() {
    if (this.form.touched || this.customerRef.touched) {
      this.swalAlertService.openWarningToast('Bạn phải lưu lại thay đổi thông tin trước khi thực hiện');
      return;
    }
    if (this.form.invalid || this.customerRef.invalid) {
      this.setSubmitState();
      this.swalAlertService.openWarningToast('Dữ liệu chưa đúng');
      return;
    }
    this.eventBus.emit({
      type: 'openComponent',
      functionCode: TMSSTabs.booking,
      customerInfo: {
        customer: this.form.getRawValue(),
        customerD: this.customerRef.getRawValue(),
        history: this.historyForm.getRawValue()
      }
    });
  }

  proposalEdit() {
    if (this.form.touched || this.customerRef.touched) {
      this.swalAlertService.openWarningToast('Bạn phải lưu lại thay đổi thông tin trước khi thực hiện');
      return;
    }
    if (!this.form.value.customerId) {
      this.swalAlertService.openWarningToast('Thông tin khách hàng chưa được lưu trong hệ thống');
      return;
    }
    if (this.form.invalid || this.customerRef.invalid) {
      this.setSubmitState();
      this.swalAlertService.openWarningToast('Dữ liệu chưa đúng');
      return;
    }
    const obj = {
      registerNo: this.form.get('registerNo').value,
      vinno: this.form.get('vinno').value
    };
    let roId = this.form.get('roId').value;
    this.customerApi.getCustomerData(obj).subscribe(res => {
      roId = (res.list && res.list.length > 0) ? res.list[0].roId : null;
    }, () => {
    }, () => {
      const customer = {
        cusDId: this.form.get('cusDId').value,
        cusId: this.form.get('customerId').value,
        roId,
        vehiclesId: this.form.get('vehiclesId').value,
        cusvsId: this.form.get('cusvsId').value
      };
      this.loadingService.setDisplay(true);
      this.customerApi.getCustomerDetail(customer).subscribe(val => {
        this.loadingService.setDisplay(false);
        const customerInfo = Object.assign({}, this.form.getRawValue(), val, {
          history: this.historyForm.getRawValue(),
          repairOrder: this.form.getRawValue().campId ? null : val.repairOrder,
          repairOrderDetails: this.form.getRawValue().campId ? null : val.repairOrderDetails
        });
        if (!customerInfo.cusVisit) {
          this.swalAlertService.openWarningToast('Không có phiếu khám xe. Thao tác lại');
          return;
        }
        this.eventBus.emit({
          type: 'openComponent',
          functionCode: TMSSTabs.proposal,
          customerInfo
        });
      });
    });
  }

  openCarQueuingTicket() {
    if (this.form.touched || this.customerRef.touched && (!this.customerD.cusVisit || (this.customerD.cusVisit && this.customerD.cusVisit.cusstate !== 1))) {
      this.swalAlertService.openWarningToast('Bạn phải lưu lại thay đổi thông tin trước khi thực hiện');
      return;
    }
    if (!this.form.value.customerId || !this.form.value.vehiclesId) {
      this.swalAlertService.openWarningToast('Thông tin khách hàng chưa được lưu trong hệ thống');
      return;
    }
    if (this.form.invalid || this.customerRef.invalid) {
      this.setSubmitState();
      this.swalAlertService.openWarningToast('Dữ liệu chưa đúng');
      return;
    }
    this.carQueuingTicket.open(this.form.get('customerId').value,
      this.form.get('vehiclesId').value,
      this.customerRef.getRawValue(),
      this.form.get('cusvsId').value,
      this.form.get('vhcType').value);
  }

  private buildCusRefForm() {
    this.customerRef = this.formBuilder.group({
      name: [{
        value: undefined,
        disabled: true
      }, this.requiredOnField('type')],
      type: ['1', GlobalValidator.required],
      tel: [{
        value: undefined,
        disabled: true
      }, Validators.compose([this.requiredOnField('type')])],
      address: [{value: undefined, disabled: true}],
      email: [{
        value: undefined,
        disabled: true
      }],
      id: [undefined]
    });
  }


  checkDisable(data) {
    // field customer && vehicle
    const fields = ['carownername', 'orgname', 'custypeId', 'cusType', 'carowneradd', 'provinceId', 'districtId', 'carownermobil',
      'carownertel', 'carownerfax', 'taxcode', 'carowneremail', 'cfId', 'cfType', 'cmType', 'ckd', 'cmName', 'cmCode',
      'cmId', 'frameno', 'enginetypeId', 'enginecode', 'engineno', 'vcId', 'vccode', 'ntCode', 'usedCarId', 'vhcType', 'pds', 'hybrid', 'pi'];
    const filedCustomerRefer = ['name', 'type', 'tel', 'address', 'email'];
    if (data && data.repairOrder && [state.lsc, state.working, state.stopWork, state.complete, state.settlement, state.cancel].includes(data.repairOrder.rostate)
      && (data.cusVisit && Number(data.cusVisit.cusstate) === 0)
      && (!this.customerD.repairOrder || (this.customerD.repairOrder && this.customerD.repairOrder.cusvsId === this.customerD.cusVisit.id))) {
      fields.forEach(field => this.form.get(field).disable());
      filedCustomerRefer.forEach(it => this.customerRef.get(it).disable());
    } else {
      fields.forEach(field => this.form.get(field) ? this.form.get(field).enable() : null);
      filedCustomerRefer.forEach(it => this.customerRef.get(it) ? this.customerRef.get(it).enable() : null);
    }
  }

  clear(val?) {
    this.customerD = {};
    this.form.reset();
    this.historyForm.reset();
    this.customerRef.reset();
    this.customerRef.get('type').setValue('1');
    this.form.get('vhcType').setValue('1');
    this.form.get('registerNo').setValue('');
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.customerRef.markAsUntouched();
    this.customerRef.markAsPristine();
    this.checkDisable(val ? val : null);
    this.firstFocus = true;
    this.isExistCampaign = false;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      campId: [undefined],
      registerNo: ['', GlobalValidator.required],
      vinno: [undefined, Validators.compose([GlobalValidator.required])],
      id: [undefined],
      customerId: [undefined],
      vehiclesId: [undefined],
      cusDId: [undefined],
      cusdesId: [undefined],

      // customer
      carownername: [undefined, GlobalValidator.required],
      cusno: [{value: undefined, disabled: true}],
      orgname: [undefined],
      custypeId: [undefined],
      cusType: [undefined],
      carowneradd: [undefined, GlobalValidator.required],
      provinceId: [undefined, GlobalValidator.required],
      districtId: [undefined, GlobalValidator.required],
      carownermobil: [undefined, Validators.compose([undefined, GlobalValidator.required])],
      carownertel: [undefined],
      carownerfax: [undefined],
      taxcode: [undefined],
      carowneremail: [undefined],
      cusNote: [undefined],
      inGate: [undefined],
      // vehicle
      pds: [undefined],
      hybrid: [undefined],
      pi: [undefined],
      cfId: [undefined, GlobalValidator.required],
      cfType: [undefined, GlobalValidator.required],
      cmType: [undefined],
      ckd: [undefined],
      cmName: [undefined],
      cmCode: [undefined, GlobalValidator.required],
      cmId: [undefined],
      fullmodel: [{value: undefined, disabled: true}],
      doixe: [{value: undefined, disabled: true}],
      frameno: [undefined],
      enginetypeId: [undefined],
      enginecode: [undefined],
      engineno: [undefined],
      vcId: [undefined],
      vccode: [undefined, GlobalValidator.required],
      ntCode: [undefined],
      vhcType: [1, GlobalValidator.required],
      deliveryDate: [{value: undefined, disabled: true}], // Ngày GX mới
      km: [{value: undefined, disabled: true}], // KM
      effectToDate: [{value: undefined, disabled: true}], // BH xe cũ
      usedCarId: [{value: undefined, disabled: true}],
      // cus refer
      roId: [undefined],

      meetcus: [undefined],
      cusvsId: [undefined],

      // Other
      cusvsStatus: [undefined],
      appointmentId: [undefined],
      listCampaignId: [undefined]
    });

    this.form.get('pds').valueChanges.subscribe(val => {
      if (!!val) {
        let value = 'PDS';
        const vinno = this.form.get('vinno').value;
        // Lấy PDS + 6 số cuối số vinno
        value = vinno && vinno.length > 0 ? value + vinno.slice(vinno.length - 6, vinno.length) : value;
        this.form.get('registerNo').setValue(value);
        this.form.get('registerNo').disable();
      } else {
        this.form.get('registerNo').enable();
      }
    });
    this.historyForm = this.formBuilder.group({
      advisorName: [{value: undefined, disabled: true}],
      firstRODate: [{value: undefined, disabled: true}],
      lastKm: [{value: undefined, disabled: true}],
      lastRODate: [{value: undefined, disabled: true}],
      notes: [{value: undefined, disabled: true}],
      repairOrderCount: [{value: undefined, disabled: true}],
      reqDesc: [{value: undefined, disabled: true}]
    });

    // activeCr
    this.activeCrForm = this.formBuilder.group({
      maintenanceDate: [{value: undefined, disabled: true}],
      contentCR: [{value: undefined, disabled: true}]
    });
  }

  requiredOnField(field) {
    return (control: FormControl) => {
      const group = control.parent as FormGroup;
      const fieldControl = group.controls[field];
      if (fieldControl && fieldControl.value && control && !control.value) {
        return {required: true};
      }
      return null;
    };
  }

  private setSubmitState() {
    this.submitBtn.nativeElement.click();
    this.isSubmit = true;
    this.isSubmitRef = true;
  }

  private transformRegisterNo(reg): string {
    return (typeof reg === 'string' || reg instanceof String) ?
      [].concat(reg.split(/[^A-Za-z0-9]/))
        .filter(item => item !== '')
        .map(item => item.toString().toUpperCase())
        .join('')
      : '';
  }

  verifyRegisterNo(f: FormGroup) {
    const control = f.get('registerNo');
    control.setValue(control.value.split(/[^A-Za-z0-9]/).join('').toUpperCase());
  }

  KeyUpEnter() {
    // if (!!this.registerNo) {
    //   this.form.get('registerNo').patchValue(this.transformRegisterNo(this.registerNo));
    //   this.search(true);
    // } else {
    //   this.search();
    // }

  }

  onFocus() {
    this.firstFocus = false;
  }
}
