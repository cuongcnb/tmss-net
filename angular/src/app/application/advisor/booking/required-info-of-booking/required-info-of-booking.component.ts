import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {EmployeeCommonApi} from '../../../../api/common-api/employee-common.api';
import {EmployeeCommonModel} from '../../../../core/models/common-models/employee-common.model';
import {AppoinmentApi} from '../../../../api/appoinment/appoinment.api';
import {ConfirmService} from '../../../../shared/confirmation/confirm.service';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {ToastService} from '../../../../shared/swal-alert/toast.service';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {BookingStatus} from '../../../../core/constains/booking-status';
import {RepairOrderApi} from '../../../../api/quotation/repair-order.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'required-info-of-booking',
  templateUrl: './required-info-of-booking.component.html',
  styleUrls: ['./required-info-of-booking.component.scss']
})
export class RequiredInfoOfBookingComponent implements OnChanges, OnInit, OnChanges {
  @ViewChild('partBookingDetail', {static: false}) partBookingDetail;
  @ViewChild('submitBtn', {static: false}) submitBtn;
  @Input() form: FormGroup;
  @Input() isSubmit: boolean;
  @Input() cusvsId;
  @Input() appoinmentId;
  @Output() cancel = new EventEmitter();
  advisors: Array<EmployeeCommonModel>;
  moneyPart;
  roList;
  current_saId;

  constructor(
    private appoinmentApi: AppoinmentApi,
    private repairOrderApi: RepairOrderApi,
    private confirmService: ConfirmService,
    private swalAlertService: ToastService,
    private dataFormatService: DataFormatService,
    private loadingService: LoadingService,
    private employeeApi: EmployeeCommonApi
  ) {
  }

  ngOnInit() {
    this.getAdvisors();
    if (this.appoinmentId && this.cusvsId) {
      this.repairOrderApi.searchByCusvs({custVsId: this.cusvsId, states: ['0', '1']}).subscribe(roList => {
        this.roList = roList;
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isSubmit && this.submitBtn) {
      this.submitBtn.nativeElement.click();
    }

    if (this.form) {
      this.checkForm();
      if (this.current_saId) {
        this.form.get('saId').setValue(this.current_saId);
      }
    }
  }

  formatDate(val) {
    return this.dataFormatService.parseTimestampToFullDate(val);
  }

  getAdvisors() {
    this.employeeApi.getServiceAdvisor().subscribe(advisor => {
      if (advisor) {
        this.advisors = advisor || [];
      }
      this.employeeApi.getEmployeeByCurrentUser().subscribe(res => {
        if (res.titleId == 144) {
          this.form.get('saId').setValue(res.id);
          this.current_saId = res.id;
        }
      })
    });
  }

  getOne() {
    this.appoinmentApi.getOne(this.form.value.appoinmentId).subscribe(appointment => {
      this.form.patchValue(appointment);
      this.cancel.emit();
    });
  }

  change() {
    const formValue = this.form.getRawValue();
    if (formValue.cardelivery && formValue.cusarr && new Date(formValue.cardelivery).getTime() < new Date(formValue.cusarr).getTime()) {
      this.swalAlertService.openFailToast('Thời gian giao xe không được nhỏ hơn thời gian hẹn');
      return;
    }
    this.loadingService.setDisplay(true);
    this.appoinmentApi.change(Object.assign({}, formValue, {
      dateconfirm: formValue.confirm ? this.dataFormatService.formatDate(formValue.dateconfirm) : null,
      id: formValue.appoinmentId
    })).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessToast();
      this.form.patchValue(res.appoinment);
      this.form.patchValue({
        confirm: (res && res.appoinment && res.appoinment.appstatus === BookingStatus.APP_CONFIRM),
        dateconfirm: (res && res.appoinment && res.appoinment.dateconfirm) ? new Date(res.appoinment.dateconfirm) : null,
        noShow: (res && res.appoinment && (res.appoinment.appstatus === BookingStatus.APP_NOSHOW || res.appoinment.appstatus === BookingStatus.APP_NOSHOW_ORDER)),
        cancel: (res && res.appoinment && (res.appoinment.appstatus === BookingStatus.APP_CANCEL || res.appoinment.appstatus === BookingStatus.APP_CANCEL_TMP)),
        appoinmentId: Number(res.appoinment.id)
      });
    });
  }

  compareDate() {
    return (group: FormGroup) => {
      const carDelivery = group.get('cardelivery');
      const cusArr = group.get('cusarr');
      if (carDelivery && carDelivery.value && cusArr && cusArr.value && carDelivery.value < cusArr.value) {
        return {compareDate: true};
      }
      return null;
    };
  }

  private checkForm() {
    this.form.get('confirm').valueChanges.subscribe(val => {
      if (!this.form.getRawValue().dateconfirm && val) {
        this.form.get('appstatus').setValue(val ? BookingStatus.APP_CONFIRM : null);
        if (val && this.form.get('confirm').enabled) {
          this.form.get('dateconfirm').setValue(val ? new Date() : null);
          this.form.get('cusarr').setValue(val ? new Date() : null);
          this.form.get('cardelivery').setValue(val ? new Date() : null);
        }
      }
    });

    this.form.get('dateconfirm').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('confirm').disable();
      } else {
        this.form.get('confirm').enable();
      }
    });
    this.form.get('cancel').valueChanges.subscribe(val => {
      if (val && !this.form.getRawValue().appoinmentId) {
        this.swalAlertService.openFailToast('Phiếu hẹn chưa được lưu');
        setTimeout(() => {
          this.form.get('cancel').setValue(false);
          this.form.get('appstatus').setValue(null);
        });
        return;
      }
      if (val === true) {
        if (this.form.value.appstatus && (this.form.value.appstatus === BookingStatus.APP_CANCEL || this.form.value.appstatus === BookingStatus.APP_CANCEL_TMP)) {
          return;
        }
        // HỦY HẸN
        this.confirmService.openConfirmModal('Bạn có chắc chắn muốn hủy hẹn không?').subscribe(() => {
          this.form.get('appstatus').setValue(val ? BookingStatus.APP_CANCEL : null);
          const cancelApp = (isConfirm) => {
            this.loadingService.setDisplay(true);
            this.appoinmentApi.hideOrCancelAppoinment(Object.assign({}, this.form.value, {id: this.form.value.appoinmentId}), 1).subscribe(() => { // 2 la huy hen
              this.swalAlertService.openSuccessToast();
              this.loadingService.setDisplay(false);
              this.getOne();
            }, error => {
              // Hủy hẹn có phụ tùng yêu cầu lên TMV
              if (error.status === 1022) {
                this.confirmService.openConfirmModal('Cảnh báo', 'Phiếu hẹn đã đặt phụ tùng lên TMV. Bạn có chắc muốn hủy hẹn?')
                  .subscribe(() => {
                    cancelApp(true);
                  }, () => {
                    this.form.get('cancel').setValue(false);
                    this.form.get('appstatus').setValue(null);
                  });
              }
              // Hủy hẹn có phụ tùng nhưng chưa yêu cầu lên TMV
              if (error.status === 1021) {
                this.swalAlertService.openWarningToast('Bạn phải xóa hết phụ tùng và lưu lại phiếu hẹn', 'Cảnh báo');
                this.form.get('cancel').setValue(false);
                this.form.get('appstatus').setValue(null);
              }
            });
          };
          cancelApp(false);
        }, () => {
          this.form.get('cancel').setValue(false);
          this.form.get('appstatus').setValue(null);
        });
        // }
      }
    });

    this.form.get('jobsMoney').valueChanges.subscribe(val => {
      if (val && !this.form.getRawValue().appoinmentId) {
        this.form.patchValue({
          estimateMoney: Number(val) + Number(this.form.get('partsMoney').value)
        });
      }
    });

    this.form.get('partBooking').valueChanges.subscribe(val => {
      if (val && !this.form.getRawValue().appoinmentId) {
        this.form.patchValue({
          partsMoney: (val) ? (this.moneyPart || 0) : 0,
          estimateMoney: Number(this.form.get('jobsMoney').value) + Number((val) ? (this.moneyPart || 0) : 0)
        });
      }
    });

    this.form.get('partsMoney').valueChanges
      .subscribe(val => {
        if (val && !this.form.getRawValue().appoinmentId) {
          this.form.patchValue({
            estimateMoney: Number(val) + Number(this.form.get('jobsMoney').value)
          });
        }
      });

    this.form.get('noShow').valueChanges.subscribe(val => {
      // this.form.get('appstatus').setValue(val ? BookingStatus.APP_NOSHOW : this.form.value.appstatus);
      if (val && !this.form.getRawValue().appoinmentId) {
        this.swalAlertService.openFailToast('Phiếu hẹn chưa được lưu');
        setTimeout(() => {
          this.form.get('noShow').setValue(false);
          this.form.get('appstatus').setValue(null);
        });
        return;
      }
      if (val) {
        if (this.form.value.appstatus && (this.form.value.appstatus === BookingStatus.APP_NOSHOW || this.form.value.appstatus === BookingStatus.APP_NOSHOW_ORDER)) {
          return;
        }
        this.confirmService.openConfirmModal('Bạn có chắc chắn muốn no-show không?').subscribe(() => {
          this.loadingService.setDisplay(true);
          this.appoinmentApi.hideOrCancelAppoinment(Object.assign({}, this.form.value, {id: this.form.value.appoinmentId}), 0).subscribe(() => { // 0 la no show
            this.loadingService.setDisplay(false);
            this.getOne();
          }, () => {
            this.form.get('noShow').setValue(false);
            this.form.get('appstatus').setValue(null);
          });
        }, () => {
          this.form.get('noShow').setValue(false);
          this.form.get('appstatus').setValue(null);
        });
      }
    });
  }

  openPartsBooking() {
    const partList = this.form.get('partList').value;
    if (partList && partList.length) {
      this.partBookingDetail.open(partList.map((item: { part: any, quotationPart: any }) =>
        Object.assign({}, item.part, item.quotationPart, {price: item.quotationPart ? item.quotationPart.sellPrice : null})), this.form.getRawValue().appoinmentId);
    } else {
      this.partBookingDetail.open([]);
    }
  }

  saveParts(data) {
    this.form.get('partList').setValue(data);
  }

  patchAccessory(data) {
    this.moneyPart = Math.round(data);
    this.form.patchValue({
      partsMoney: this.moneyPart,
      estimateMoney: Number(this.form.get('jobsMoney').value) + this.moneyPart ? this.moneyPart : 0
    });
  }
}
