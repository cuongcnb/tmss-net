import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { AppoinmentApi } from '../../../../api/appoinment/appoinment.api';
import { EmployeeCommonModel } from '../../../../core/models/common-models/employee-common.model';
import { EmployeeCommonApi } from '../../../../api/common-api/employee-common.api';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { DataFormatService } from '../../../../shared/common-service/data-format.service';
import { CommonService } from '../../../../shared/common-service/common.service';
import { ConfirmService } from '../../../../shared/confirmation/confirm.service';
import { GridTableService } from '../../../../shared/common-service/grid-table.service';
import { BookingStatus } from '../../../../core/constains/booking-status';
import { Times } from '../../../../core/constains/times';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'searching-of-booking',
  templateUrl: './searching-of-booking.component.html',
  styleUrls: ['./searching-of-booking.component.scss'],
})
export class SearchingOfBookingComponent implements OnInit, OnChanges {
  @Output() chooseDetail = new EventEmitter();
  @Input() bookingForm;
  @Input() customerInfo;
  @Input() appointment;
  form: FormGroup;
  advisors: Array<EmployeeCommonModel>;

  fieldGrid;
  paramsSCC;
  paramsDS;
  rowClassRules;
  customer;
  vehicle;
  driver;
  cusdes;

  constructor(
    private formBuilder: FormBuilder,
    private appoinmentApi: AppoinmentApi,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private confirmService: ConfirmService,
    private commonService: CommonService,
    private dataFormatService: DataFormatService,
    private employeeApi: EmployeeCommonApi,
    private gridTableService: GridTableService,
  ) {}

  ngOnInit() {
    this.buildSearchForm();
    this.getAdvisors();
    if (!this.customerInfo) {
      this.submit();
    }
    this.fieldGrid = [
      {
        headerName: 'Ngày',
        headerTooltip: 'Ngày',
        field: 'cusarr',
        width: 120,
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
        cellClass: params => {
          return params.data.appStatus === BookingStatus.APP_CANCEL_TMP || params.data.appStatus === BookingStatus.APP_NOSHOW_ORDER ? ['cell-readonly', 'is-cancel-booking'] : ['cell-readonly'];
        },
      },
      {
        headerName: 'Phiếu hẹn',
        headerTooltip: 'Phiếu hẹn',
        field: 'appoinmentNo',
        cellClass: params => {
          return params.data.appStatus === BookingStatus.APP_CANCEL_TMP || params.data.appStatus === BookingStatus.APP_NOSHOW_ORDER ? ['cell-readonly', 'is-cancel-booking'] : ['cell-readonly'];
        },
      },
      {
        headerName: 'Biển số',
        headerTooltip: 'Biển số',
        field: 'vehicle.registerno',
        width: 120,
        cellClass: params => {
          return params.data.appStatus === BookingStatus.APP_CANCEL_TMP || params.data.appStatus === BookingStatus.APP_NOSHOW_ORDER ? ['cell-readonly', 'is-cancel-booking'] : ['cell-readonly'];
        },
      },
    ];
    this.setColorForBooking();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.appointment && this.appointment) {
      if (this.paramsSCC && this.appointment.apptype === '2') {
        this.paramsSCC.api.setRowData([this.appointment]);
      }
      if (this.paramsDS && this.appointment.apptype === '1') {
        this.paramsDS.api.setRowData([this.appointment]);
      }
    }
  }

  getAdvisors() {
    this.employeeApi.getEmpIsAdvisor().subscribe(advisors => {
      this.advisors = advisors || [];
    });
  }

  callbackGridSCC(params) {
    this.paramsSCC = params;
    if (this.appointment && this.appointment.apptype === '2') {
      params.api.setRowData([this.appointment]);
    }
  }

  callbackGridDS(params) {
    this.paramsDS = params;
    if (this.appointment && this.appointment.apptype === '1') {
      params.api.setRowData([this.appointment]);
    }
  }

  selectRow() {
    if (this.paramsSCC) {
      this.gridTableService.selectFirstRow(this.paramsSCC);
      return;
    }
    if (this.paramsDS) {
      this.gridTableService.selectFirstRow(this.paramsDS);
      return;
    }
  }

  prepareData() {
    const formValue = this.bookingForm.getRawValue();
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
      id: formValue.customerDId,
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

  getParams(params) {
    const selectedData = params.api.getSelectedRows()[0];
    if (selectedData) {
      const result = Object.assign({}, selectedData);
      if (this.bookingForm.touched) {
        this.confirmService.openConfirmModal('Thông báo', 'Dữ liệu đã có thay đổi, bạn có muốn ghi lại không?').subscribe(() => {
          const formValue = this.bookingForm.getRawValue();
          let appointmentId = formValue.appoinmentId;
          this.prepareData();
          let value = {
            appoinment: Object.assign({}, formValue, {
              dateconfirm: formValue.confirm ? this.dataFormatService.formatDate(formValue.dateconfirm) : null,
              id: appointmentId, 
              estimateTime: this.bookingForm.value.typeEstimateTime === 2
              ? Number(this.bookingForm.value.estimateTime) * Times.dayMin : this.bookingForm.value.typeEstimateTime === 1
                ? Number(this.bookingForm.value.estimateTime) * Times.hourMin : Number(this.bookingForm.value.estimateTime)
            }),
            vehicleId: this.customerInfo ? this.customerInfo.customer.vehiclesId : null,
            customerId: this.customerInfo ? this.customerInfo.customer.customerId : null,
            srvDCustomersD: this.customerInfo ? this.customerInfo.customerD : this.driver,
            srvDCustomers: this.customer,
            srvDVehicles: this.vehicle,
            srvBCusdes: this.cusdes,
            partList: formValue.partList || [],
          };
          this.loadingService.setDisplay(true);
          this.appoinmentApi.updateAppoinment(value).subscribe((res) => {
            result.repairType === '2' ? this.paramsDS.api.deselectAll() : this.paramsSCC.api.deselectAll();
            this.chooseDetail.emit(result);
            this.loadingService.setDisplay(false);           
          });
        }, () => {
          result.repairType === '2' ? this.paramsDS.api.deselectAll() : this.paramsSCC.api.deselectAll();
          this.chooseDetail.emit(result);
        });
      } else {
        result.repairType === '2' ? this.paramsDS.api.deselectAll() : this.paramsSCC.api.deselectAll();
        this.chooseDetail.emit(result);
      }
    }
  }

  submit() {
    const obj = this.form.value;
    obj.startDate = this.commonService.fromDate(obj.startDate);
    obj.endDate = this.commonService.toDate(obj.endDate);
    if (this.form.invalid) {
      this.swalAlertService.openFailToast('Phải nhập ngày bắt đầu và kết thúc');
      return;
    }

    if (obj.startDate > obj.endDate) {
      this.swalAlertService.openFailToast('Ngày bắt đầu phải sớm hơn ngày kết thúc');
      return;
    }

    this.loadingService.setDisplay(true);
    this.appoinmentApi.search(obj).subscribe(res => {
      this.loadingService.setDisplay(false);
      if (res) {
        this.chooseDetail.emit(null);
        if (this.paramsSCC) {
          this.paramsSCC.api.setRowData(res.srvBAppoinmentBasicRepairDTOList);
        }
        if (this.paramsDS) {
          this.paramsDS.api.setRowData(res.srvBAppoinmentBodyPaintDTOList);
        }
      }
    });
  }

  private buildSearchForm() {
    this.form = this.formBuilder.group({
      startDate: [new Date(), GlobalValidator.required],
      endDate: [new Date(), GlobalValidator.required],
      advisorId: [undefined],
    });
  }

  private setColorForBooking() {
    this.rowClassRules = {
      'is-cancel-booking': (params) => {
        return params.data.state === BookingStatus.APP_CANCEL;
      },
    };
  }
}
