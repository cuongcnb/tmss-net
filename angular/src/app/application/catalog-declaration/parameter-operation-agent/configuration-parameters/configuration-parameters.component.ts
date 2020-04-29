import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ParameterOperationAgentModel } from '../../../../core/models/catalog-declaration/parameter-operation-agent.model';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { DlrConfigApi } from '../../../../api/common-api/dlr-config.api';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { ConfirmService } from '../../../../shared/confirmation/confirm.service';
import { FormStoringService } from '../../../../shared/common-service/form-storing.service';
import { StorageKeys } from '../../../../core/constains/storageKeys';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'configuration-parameters',
  templateUrl: './configuration-parameters.component.html',
  styleUrls: ['./configuration-parameters.component.scss']
})
export class ConfigurationParametersComponent implements OnInit, OnChanges {
  @ViewChild('btnSubmit', { static: false }) btnSubmit: ElementRef;
  @Input() detailData: ParameterOperationAgentModel;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  imgUrl: string;
  errorRangeBreakAMTime = false;
  errorRangeBreakPMTime = false;

  isCallGetImg: boolean;
  arrTime = ['wkAmFrom',
    'wkAmTo',
    'wkPmFrom',
    'wkPmTo',
    'restAmFrom',
    'restAmTo',
    'restPmFrom',
    'restPmTo'];

  constructor(
    private formBuilder: FormBuilder,
    private loading: LoadingService,
    private swalAlert: ToastService,
    private confirmService: ConfirmService,
    private dlrConfigApi: DlrConfigApi,
    private formStoringService: FormStoringService,
  ) {
  }

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.patchValue();
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    if (!moment(this.form.value.effDateTo).isSameOrAfter(this.form.value.effDateFrom, 'day')) {
      this.swalAlert.openWarningToast('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
      return;
    }
    const data = {
      wkAmFrom: 0,
      wkAmTo: 0,
      wkPmFrom: 0,
      wkPmTo: 0,
      restAmFrom: 0,
      restAmTo: 0,
      restPmFrom: 0,
      restPmTo: 0
    };
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.arrTime.length; i++) {
      data[`${this.arrTime[i]}`] = this.convertTimeToTimeStamp(this.form.get(this.arrTime[i]).value);
    }

    if (data.wkAmFrom > data.wkAmTo || data.wkAmTo > data.wkPmFrom || data.wkPmFrom > data.wkPmTo) {
      this.swalAlert.openWarningToast('Thời gian không hợp lệ. Vui lòng kiểm tra lại các khoảng thời gian làm việc');
      return;
    }
    if (!!this.form.value.breakBetween && (data.wkAmFrom > data.restAmFrom || data.wkAmTo < data.restAmTo || data.wkPmTo < data.restPmTo
      || data.wkPmFrom > data.restPmFrom || data.restAmFrom > data.wkAmTo || data.restPmFrom > data.wkPmTo || data.restPmFrom > data.restPmTo ||
      data.restAmFrom > data.restAmTo)) {
      if (data.wkAmFrom > data.restAmFrom || data.wkAmTo < data.restAmTo || data.restAmFrom > data.wkAmTo || data.restAmFrom > data.restAmTo) {
        this.errorRangeBreakAMTime = true;
      }

      if (data.wkPmTo < data.restPmTo || data.wkPmFrom > data.restPmFrom || data.restPmFrom > data.wkPmTo || data.restPmFrom > data.restPmTo) {
        this.errorRangeBreakPMTime = true;
      }
      
      this.swalAlert.openWarningToast('Thời gian không hợp lệ. Vui lòng kiểm tra lại các khoảng thời gian nghỉ');
      return;
    }
    const value = Object.assign({}, this.form.value, {
      useprogress: this.form.value.useprogress ? 'Y' : 'N',
      useprogressDs: this.form.value.useprogressDs ? 'Y' : 'N',
      breakBetween: !!this.form.value.breakBetween ? 'Y' : 'N',
      guessReceptionOrder: this.form.value.guessReceptionOrder ? 'Y' : 'N',
      logoUrl: this.imgUrl
    }, data);
    if (!this.form.value.breakBetween) {
      value.restAmFrom = null;
      value.restAmTo = null;
      value.restPmFrom = null;
      value.restPmTo = null;
    }
    this.loading.setDisplay(true);
    this.dlrConfigApi.save(value).subscribe(res => {
      // Xóa và lưu lại dlrConfig trên localstorage
      if (StorageKeys.dlrConfig) {
        this.formStoringService.clear(StorageKeys.dlrConfig);
      } else { return; }
      this.formStoringService.set(StorageKeys.dlrConfig, value);
      //
      this.close.emit(res);
      this.loading.setDisplay(false);
      this.imgUrl = null;
      this.errorRangeBreakAMTime = false;
      this.errorRangeBreakPMTime = false;
      this.swalAlert.openSuccessToast();
    });
  }

  submit() {
    this.btnSubmit.nativeElement.click();
  }

  apiCallUpload(file) {
    return this.dlrConfigApi.uploadNewImage(file);
  }

  apiCallGetImg() {
    return this.dlrConfigApi.getImg(this.detailData.id);
  }

  patchImgUrl(imgUrl) {
    this.imgUrl = imgUrl;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      effDateFrom: [undefined, GlobalValidator.required],
      effDateTo: [undefined, GlobalValidator.required],
      logo: [undefined],
      id: [undefined],

      coefficientJg: [undefined, Validators.compose([GlobalValidator.numberFormat, Validators.max(100)])],
      coefficientP: [undefined, Validators.compose([GlobalValidator.numberFormat, Validators.max(100)])],
      coefficientB: [undefined, Validators.compose([GlobalValidator.numberFormat, Validators.max(100)])],
      cost: [undefined, Validators.compose([GlobalValidator.floatNumberFormat, Validators.max(9999999999.99)])],
      footerDoc: [undefined, GlobalValidator.maxLength(2000)],
      logLv: [undefined],
      taxJobs: [undefined, Validators.compose([GlobalValidator.numberFormat, Validators.max(101)])],
      useprogress: [false],
      useprogressDs: [false],
      guessReceptionOrder: [false],

      wkAmFrom: [undefined, GlobalValidator.required],
      wkAmTo: [undefined, GlobalValidator.required],
      wkPmFrom: [undefined, GlobalValidator.required],
      wkPmTo: [undefined, GlobalValidator.required],

      breakBetween: [false],

      restAmFrom: [undefined, GlobalValidator.required],
      restAmTo: [undefined, GlobalValidator.required],
      restPmFrom: [undefined, GlobalValidator.required],
      restPmTo: [undefined, GlobalValidator.required],

      washTime: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.floatNumberFormat, GlobalValidator.maxLength(7)])],
      warningTime: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.floatNumberFormat, GlobalValidator.maxLength(7)])],
      waitTime: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.floatNumberFormat, GlobalValidator.maxLength(7)])],
      receptionTimeScc: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.floatNumberFormat, GlobalValidator.maxLength(7)])],
      receptionTimeBp: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.floatNumberFormat, GlobalValidator.maxLength(7)])],

      holidayDate: [null, GlobalValidator.required],
      haveDayOff: [false],
      wshopGjChangeTime: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.floatNumberFormat, GlobalValidator.maxLength(7)])],
      wshopBpChangeTime: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.floatNumberFormat, GlobalValidator.maxLength(7)])],
      lateAppointmentTime: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.floatNumberFormat, GlobalValidator.maxLength(7)])],
      lateSuggested: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.floatNumberFormat, GlobalValidator.maxLength(7)])],
      reservePartsPct: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.floatNumberFormat, GlobalValidator.maxLength(7)])],
      reception: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.floatNumberFormat, GlobalValidator.maxLength(7)])],
      splitTimeScc: [15],
      splitTimeDs: [15, Validators.compose([GlobalValidator.required, GlobalValidator.numberFormat])],
      splitTimeRx: [15, Validators.compose([GlobalValidator.required, GlobalValidator.numberFormat])],
    });
    this.form.get('breakBetween').valueChanges.subscribe(val => {
      this.takeARest(val);
    });
    this.form.get('haveDayOff').valueChanges.subscribe(val => {
      this.takeDayOff(val);
    });
  }

  private takeARest(isTake) {
    // Nếu nghỉ giữa giờ thì cho phép nhập rest..
    // Nếu KHÔNG nghỉ giữa giờ thì KHÔNG cho phép nhập rest..
    if (isTake) {
      this.form.get('restAmFrom').enable();
      this.form.get('restAmTo').enable();
      this.form.get('restPmFrom').enable();
      this.form.get('restPmTo').enable();
    } else {
      this.form.get('restAmFrom').disable();
      this.form.get('restAmTo').disable();
      this.form.get('restPmFrom').disable();
      this.form.get('restPmTo').disable();
    }
  }

  private takeDayOff(val) {
    if (val) {
      this.form.controls.holidayDate.enable();
    } else {
      this.form.controls.holidayDate.disable();
      this.form.controls.holidayDate.patchValue(null);
    }
  }

  private convertTimeToHourSecond(data): number {
    const date = new Date(data);
    const hour = date.getHours();
    const minute = date.getMinutes();
    return hour * 3600 + minute * 60;
  }

  private validateTimeArray(fieldArray: Array<number>) {
    const compareHourSecond = (field1, field2) => {
      return this.convertTimeToHourSecond(field1) - this.convertTimeToHourSecond(field2);
    };
    for (let i = 0; i < fieldArray.length - 1; i++) {
      if (compareHourSecond(fieldArray[i], fieldArray[i + 1]) > 0) {
        return false;
      }
    }
    return true;
  }

  private patchValue() {
    this.isCallGetImg = false;
    if (this.form) {
      this.form.reset();
      if (this.detailData) {
        this.form.patchValue(this.detailData);
        this.form.patchValue({
          useprogress: (this.detailData.useprogress === 'Y'),
          useprogressDs: (this.detailData.useprogressDs === 'Y'),
          guessReceptionOrder: (this.detailData.guessReceptionOrder === 'Y')
        });
        // if (this.detailData.useprogress) {
        //   this.form.get('useprogress').disable();
        // } else {
        //   this.form.get('useprogress').enable();
        // }
        if (this.detailData.restAmFrom) {
          this.form.patchValue({ breakBetween: true });
        }
        if (this.detailData.holidayDate) {
          this.form.patchValue({ haveDayOff: true });
        }
        // tslint:disable-next-line:forin
        for (const i in this.arrTime) {
          this.form.get(`${this.arrTime[i]}`).setValue(this.detailData[`${this.arrTime[i]}`] ? this.convertTimeStampToTime(this.detailData[`${this.arrTime[i]}`]) : null);
        }
      }

      if (!this.form.value.splitTimeDs) this.form.patchValue({ splitTimeDs: 10 });
      if (!this.form.value.splitTimeScc) this.form.patchValue({ splitTimeScc: 10 });
      if (!this.form.value.splitTimeRx) this.form.patchValue({ splitTimeRx: 2 });
      console.log(this.form.value)
    }

    setTimeout(() => {
      if (this.detailData) {
        this.isCallGetImg = true;
      }
    });
  }

  convertTimeToTimeStamp(data) {
    return data ? new Date(moment(data.toString(), 'HH:mm').format('DD-MMM-YYYY HH:mm')).getTime() : null;
  }

  convertTimeStampToTime(timeStamp) {
    return timeStamp ? moment(new Date(timeStamp)).format('HH:mm') : null;
  }
}
