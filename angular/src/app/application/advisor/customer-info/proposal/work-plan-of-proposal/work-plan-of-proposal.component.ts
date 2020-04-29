import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MoneyStatusModel} from '../../../../../core/models/advisor/money-status.model';
import {DataFormatService} from '../../../../../shared/common-service/data-format.service';
import {EmployeeCommonApi} from '../../../../../api/common-api/employee-common.api';
import {Times} from '../../../../../core/constains/times';
import {ToastService} from '../../../../../shared/swal-alert/toast.service';
import {ProgressState} from '../../../../../core/constains/progress-state';
import {RoWshopApi} from '../../../../../api/ro-wshop/ro-wshop.api';
import {TMSSTabs} from '../../../../../core/constains/tabs';
import {RepairOrderApi} from '../../../../../api/quotation/repair-order.api';
import {EventBusService} from '../../../../../shared/common-service/event-bus.service';
import {ConfirmService} from '../../../../../shared/confirmation/confirm.service';
import {state} from '../../../../../core/constains/ro-state';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'work-plan-of-proposal',
  templateUrl: './work-plan-of-proposal.component.html',
  styleUrls: ['./work-plan-of-proposal.component.scss']
})
export class WorkPlanOfProposalComponent implements AfterViewInit, OnInit, OnChanges {
  @ViewChild('submitBtn', {static: false}) submitBtn;
  @Input() form: FormGroup;
  @Input() isSubmit: boolean;
  @Input() repairMoney: MoneyStatusModel;
  @Input() partMoney: MoneyStatusModel;
  @Input() timeStartComponent;
  @Input() campaign;
  @Input() customerInfo;
  @Output() reload = new EventEmitter() ;
  isCollapsedOther = false;
  advisors;
  isCollapsed = false;
  isCollapsedMoney = false;
  arrivalDate;
  campaignMoney = 0;
  enableBtnTGSC = [
    state.complete, state.completeSc, state.qc, state.washing, state.stopWork, state.stopWork,
    state.settlement,
    state.cancel,
    state.gateInOut
  ];

  mapCodeByName = {
    // cus refer
    name: 'Ng m/x',
    tel: 'ĐT',
    tel2: 'ĐT',
    address: 'Địa chỉ',
    email: 'Email',
    // cus
    carownername: 'Chủ xe',
    cusno: 'Chủ xe',
    orgname: 'Tên Cty',
    carownermobil: 'DĐ/CĐ',
    carownertel: 'DĐ/CĐ',
    carownerfax: 'Fax',
    carowneremail: 'Email',
    carowneradd: 'Đ/chỉ',
    cusNote: 'Ghi chú',
    vccode: 'Màu xe',
    reqdesc: 'Yêu cầu khách hàng',
    estimateTime: 'TGSC',
    carDeliveryTime: 'Dự kiến giao xe',
    km: 'Km vào'
  };

  stateCVDV = [null, state.quotationTmp, ''];
  stateAutoManualProgress = [state.quotation];

  moneyFormat(value) {
    return this.dataFormatSerervice.moneyFormat(value);
  }

  constructor(private formBuilder: FormBuilder,
              private dataFormatSerervice: DataFormatService,
              private employeeApi: EmployeeCommonApi,
              private dataFormatService: DataFormatService,
              private swalAlertService: ToastService,
              private roWshopApi: RoWshopApi,
              private repairOrderApi: RepairOrderApi,
              private eventBus: EventBusService,
              private confirmService: ConfirmService) {
  }

  ngOnChanges() {
    if (this.campaign) {
      this.campaignMoney = this.campaign.percentDiscount
        ? ((this.repairMoney ? this.repairMoney.total : 0) + (this.partMoney ? this.partMoney.total : 0)) * this.campaign.percentDiscount / 100
        : (this.campaign.priceDiscount || 0);
    }
    if (this.isSubmit && this.submitBtn) {
      this.submitBtn.nativeElement.click();
    }
  }

  ngOnInit() {
    const date = this.form.get('arrivalDate').value;
    this.arrivalDate = date ? this.dataFormatService.parseTimestampToFullDate(new Date(date)) : this.dataFormatService.parseTimestampToFullDate(new Date());
  }

  ngAfterViewInit() {

  }

  setValue(data) {
    this.form.patchValue(data);
  }

  dateFormat(val) {
    return this.dataFormatService.parseTimestampToFullDate(val);
  }

  findInvalidControls() {
    const listInvalid = [];
    const controls = this.form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        listInvalid.push(name);
      }
    }
    return listInvalid;
  }


  autoCheck(valueCode) {
    const fieldInvalid = this.findInvalidControls();
    if (fieldInvalid.length > 0) {
      let stringNotify = 'Bạn đã sai hoặc thiếu thông tin trường: ';
      if (fieldInvalid && fieldInvalid.length > 0) {
        // tslint:disable-next-line:forin
        for (const field in fieldInvalid) {
          stringNotify = stringNotify + this.mapCodeByName[`${fieldInvalid[field]}`] + ', ';
        }
        stringNotify = stringNotify.slice(0, stringNotify.length - 2);
      }
      this.swalAlertService.openWarningToast(stringNotify);
      return;
    }
    this.isSubmit = true;
    if (Number(this.form.value.estimateTime) === 0) {
      this.swalAlertService.openWarningToast('Bạn phải nhâp TGSC trong kế hoạch công việc');
      return;
    }
    // if (this.form.invalid) {
    //   this.swalAlertService.openWarningToast('Bạn phải nhập đủ thông tin trường bắt buộc');
    //   return;
    // }

    if (this.customerInfo) {
      const dataSave = {
        suggestRequestCode: valueCode,
        estimateTime: this.form.value.typeEstimateTime === 1
          ? Number(this.form.value.estimateTime) * Times.hourMin : this.form.value.typeEstimateTime === 2
            ? Number(this.form.value.estimateTime) * Times.dayMin : Number(this.form.value.estimateTime),
        appId: this.form.getRawValue().appointmentId,
        roIdDel: this.form.get('roId').value,
        campaignOpemDlrId: this.form.value.campaign ? this.form.value.campaign.campaignOpemDlrId : null,
        cusVsId: this.customerInfo.cusVisit ? this.customerInfo.cusVisit.id : null,
        custId: this.customerInfo.customer ? this.customerInfo.customer.id : null,
        vehicleId: this.customerInfo.vehicle ? this.customerInfo.vehicle.id : null,
        jobList: [],
        partList: this.form.getRawValue().partList
          ? this.form.getRawValue().partList.map(part => {
            return Object.assign({}, part,
              {quotationprintVersion: part.quotationprintVersion ? part.quotationprintVersion : part.version});
          })
          : [],
        srvBRecinr: {
          inrComId: this.form.get('inrComId').value,
          inrEmpId: this.form.get('inrEmpId').value
        },
        srvBCusVisit: {
          calltime: this.form.get('calltime').value
        },
        srvBRepairOrder: {
          attribute1: null,
          attribute2: null,
          checkTlccpt: null,
          closeroDate: null,
          createDate: this.form.get('date').value,
          createdBy: null,
          cusvsId: null,
          deleteflag: null,
          dlrId: null,
          freePm: this.form.get('rctypeId').value,
          gid: null,
          id: this.form.get('roId').value,
          inrstate: null,
          insertQversion: null,
          kcalc: null,
          km: this.form.get('km').value,
          modifiedBy: null,
          modifyDate: null,
          notes: null,
          openroDate: null,
          quotationprint: this.form.get('quotationprint').value,
          rctypeId: this.form.get('rctypeId').value,
          readjustFixnote: this.form.get('readjustFixnote').value,
          readjustReason: this.form.get('readjustReason').value,
          readjustRoid: this.form.get('readjustRoid').value,
          repairorderno: this.form.getRawValue().roNo,
          reqdesc: this.form.get('reqdesc').value,
          roChange: null,
          rostate: null,
          rotype: this.form.get('rotype').value,
          testpaperprint: null,
          carDeliveryTime: this.form.get('carDeliveryTime').value,
          totalAmount: this.form.get('beforeTaxTotal').value,
          totalDiscount: this.form.get('discountTotal').value,
          totalTaxAmount: this.form.get('totalTaxAmount').value,
          useprogress: null,
          isCarWash: this.form.get('isCarWash').value ? 'Y' : 'N',
          isCusWait: this.form.get('isCusWait').value ? 'Y' : 'N',
          isTakeParts: this.form.get('isTakeParts').value ? 'Y' : 'N',
          isPriority: this.form.get('isPriority').value ? 'Y' : 'N',
          qcLevel: this.form.get('qcLevel').value
        }
      };
      if (dataSave.srvBRepairOrder.rotype === '1') {
        dataSave.jobList = this.form.getRawValue().jobListDs
          ? this.form.getRawValue().jobListDs.map(job => {
            return Object.assign({}, job,
              {quotationprintVersion: job.quotationprintVersion ? job.quotationprintVersion : job.version});
          })
          : [];
      } else {
        dataSave.jobList = this.form.getRawValue().jobListScc
          ? this.form.getRawValue().jobListScc.map(job => {
            return Object.assign({}, job,
              {quotationprintVersion: job.quotationprintVersion ? job.quotationprintVersion : job.version});
          })
          : [];
      }
      if (!dataSave.jobList || !dataSave.jobList.length) {
        this.swalAlertService.openWarningToast('Bạn chưa có công việc sửa chữa');
        return;
      } else {
        dataSave.jobList.map(it => {
          it.amount = Number(it.costs);
          return it;
        });
      }
      const lastJob = dataSave.jobList[dataSave.jobList.length - 1];
      if (!lastJob.jobsname || !lastJob.costs) {
        this.swalAlertService.openWarningToast('Bạn chưa nhập đủ thông tin công việc sửa chữa');
        return;
      }
      if (dataSave.partList && dataSave.partList.length > 0 && dataSave.partList[dataSave.partList.length - 1].partsCode === '') {
        this.swalAlertService.openWarningToast('Bạn chưa chọn phụ tùng');
        return;
      }
      if (dataSave.partList && dataSave.partList.length > 0 && !dataSave.partList[dataSave.partList.length - 1].sellPrice) {
        this.swalAlertService.openWarningToast('Bạn phải chọn phụ tùng trong danh sách');
        return;
      }

      if (dataSave.partList) {
        dataSave.partList.map(it => {
          it.qty = Number(it.qty);
          return it;
        });
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < dataSave.partList.length; j++) {
          dataSave.partList[j].readjust = (dataSave.partList[j].readjust === true) ? 'Y' : 'N';
        }
      }

      this.repairOrderApi.suggestTime(dataSave).subscribe(val => {
        this.form.patchValue({
          roId: val.srvBRepairOrder ? val.srvBRepairOrder.id : null,
          rostate: val.srvBRepairOrder.rostate,
          date: val.srvBRepairOrder.createDate,
          quotationprint: val.srvBRepairOrder.quotationprint
        });
        this.reload.emit();
        this.openRepairProcess();
      }, error => {
        if (error.status === 6041 && valueCode === 2) {
          this.openRepairProcess();
        }
      });
    } else {
      this.swalAlertService.openFailToast('Không có thông tin khách hàng');
    }
  }

  cancelSuggest() {
    this.confirmService.openConfirmModal('Bạn có chắc muốn hủy kế hoạch')
      .subscribe(() => {
        this.roWshopApi.cancelAllSuggest(this.form.value.roId, false).subscribe(() => {
          this.swalAlertService.openSuccessToast();
        });
      });
  }

  openRepairProcess() {
    if (this.form.value.rotype === '2' || this.form.value.roTypeTemp === '2') {
      this.eventBus.emit({
        type: 'openComponent',
        functionCode: TMSSTabs.generalRepairProgress,
        data: {
          registerNo: this.form.value.registerno,
          toDate: new Date()
        }

      });
      return;
    }
    if (this.form.value.rotype === '1' || this.form.value.roTypeTemp === '1') {
      this.eventBus.emit({
        type: 'openComponent',
        functionCode: TMSSTabs.dongsonProgress
      });
      return;
    }
  }
}
