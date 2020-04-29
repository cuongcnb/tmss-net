import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, ViewRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { findLast } from 'lodash';

import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { EventBusService } from '../../../../shared/common-service/event-bus.service';
import { RoWshopApi } from '../../../../api/ro-wshop/ro-wshop.api';
import { ShopCommonApi } from '../../../../api/common-api/shop-common.api';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { RoWshopActApi } from '../../../../api/ro-wshop/ro-wshop-act.api';
import { TechWshopApi } from '../../../../api/tech-wshop/tech-wshop.api';
import { NameProgressByState, ProgressState, RoType } from '../../../../core/constains/progress-state';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { PendingReasonApi } from '../../../../api/pending-reason/pending-reason.api';
import { RepairOrderApi } from '../../../../api/quotation/repair-order.api';
import { DataFormatService } from '../../../../shared/common-service/data-format.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { forkJoin } from 'rxjs';
import { TitleApi } from '../../../../api/common-api/title.api';
import { ActionTypeEmployee } from '../../../../core/constains/repair-progress';
import { WorkShopModel } from '../../../../core/models/repair-progress/wshop.model';
import { ConfirmService } from '../../../../shared/confirmation/confirm.service';
declare var $: any;
declare var jQuery: any;


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'stopped-plan-modal',
  templateUrl: './stopped-plan-modal.component.html',
  styleUrls: ['./stopped-plan-modal.component.scss']
})
export class StoppedPlanModalComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() refreshList = new EventEmitter();
  @Output() refreshRoNoPlanList = new EventEmitter();
  @ViewChild('stoppedPlanModal', { static: false }) modal;
  @ViewChild('repairAriseModal', { static: false }) repairAriseModal;

  form: FormGroup;
  reasonForm: FormGroup;
  modalHeight: number;
  repairPlanData;
  employeeList = [];
  shops: Array<any> = [];
  shopsSelect: Array<any> = [];
  techWShop: Array<any> = [];
  reasons: Array<any> = [];
  isFromWaitingList: boolean;
  state = ProgressState.plan;
  ProgressState = ProgressState;
  NameProgressByState = NameProgressByState;
  subscription;
  stopPosition;
  changePlanToWorking;
  completeWorking;
  messeage_notification;

  isCollapsedOther = false;
  isCollapsedFollow = false;
  isCollapsedPlan = false;
  isCollapsedWS = false;
  disableStartAll = true;
  disableEndAll = true;
  jobFieldGrid;
  partFieldGrid;
  wshop: WorkShopModel;
  jobs = [];
  jobsDefault = [];
  information;
  id;
  data_time = {};
  actionTypeEmployee = ActionTypeEmployee;
  planId: any;
  actualId: any;
  disabled_form = false;
  employeeslist_in_ws = [];
  employeeArray: FormArray;
  finish_load_data = false;

  constructor(
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
    private pendingReasonApi: PendingReasonApi,
    private roWshopApi: RoWshopApi,
    private roWshopActApi: RoWshopActApi,
    private techWshopApi: TechWshopApi,
    private shopApi: ShopCommonApi,
    private loadingService: LoadingService,
    private setModalHeightService: SetModalHeightService,
    private eventBusService: EventBusService,
    private repairOrderApi: RepairOrderApi,
    public dataFormatService: DataFormatService,
    private cdr: ChangeDetectorRef,
    private titleApi: TitleApi,
    private confirmService: ConfirmService
  ) {
    this.jobFieldGrid = [
      { headerName: 'Mã công việc', headerTooltip: 'Mã công việc', field: 'jobcode' },
      { headerName: 'Tên công việc', headerTooltip: 'Tên công việc', field: 'jobsname' }
    ];
    this.partFieldGrid = [
      { headerName: 'Phụ tùng', headerTooltip: 'Phụ tùng', field: 'partsname' },
      { headerName: 'Số lượng', headerTooltip: 'Số lượng', field: 'qty' }
    ];
  }

  ngOnInit() {
    this.subscription = this.eventBusService.on('openStoppedPlanModal').subscribe(val => {
      this.initDataWhenOpenModal(val.planId, val.state, false, val.wshopId, val.id, val.actualId);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!(this.cdr as ViewRef).destroyed) {
        this.cdr.detectChanges();
      }
    }, 0);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  close() {
    if (this.isFromWaitingList) {
      this.loadingService.setDisplay(true);
      this.refreshRoNoPlanList.emit();
    }
    this.refreshList.emit();
    this.disabled_form = false;
    this.form.reset();
    this.employeeList = [];
    this.finish_load_data = false;
    this.modal.hide();
  }


  initDataWhenOpenModal(planId, state, isFromWaitingList, shopIndex?, id?, actualId?) {
    this.state = state;
    this.id = id;
    this.isFromWaitingList = isFromWaitingList;
    this.planId = planId;
    this.actualId = actualId;
    this.modal.show();
    this.onResize();
    // if ([ProgressState.performed, ProgressState.stopInside, ProgressState.stopOutside, ProgressState.complete].includes(state)) {
    //   this.disabled_form = true;
    // }
    this.techWshopApi.getTechWshopByDlr(RoType.SCC).subscribe(res => this.techWShop = res.filter(it => it)),
      forkJoin([
        this.shopApi.getAllSccShop(),
        this.techWshopApi.getTechWshopByDlr(RoType.SCC),
        this.roWshopApi.getRepairPlan(planId, this.id, this.state)
      ]).subscribe(res => {
        this.techWShop = res[1].filter(it => it) || [];

        this.shops = res[0].map(shop => {
          return {
            ...shop, ...{
              emps: res[1] && res[1].length ? res[1].filter(item => item && item.wshopId === shop.id) : []
            }
          };
        });

        this.information = res[2].information;
        this.jobs = res[2].information ? res[2].information.listPlans : [];
        this.employeeList = res[2].employeeList ? res[2].employeeList : [];
        this.wshop = res[2].wshop ? res[2].wshop : {};
        this.getEmploylistInWs();
        this.initDataEmployee();

        if (this.jobs) {
          const lastEl = findLast(this.jobs, el => {
            return el.roWshopId === id;
          });
          this.jobs.map(it => {
            const shop = this.shops.find(item => item.id === it.wshopId);
            it.empName = shop ? shop.emps.map(itt => itt.empName).join(',') : '';
            it.disabled = (lastEl && it.id === lastEl.id && it.roWshopId === lastEl.roWshopId);
            return it;
          });
          this.jobsDefault = this.jobs;
        }
        this.loadingService.setDisplay(false);
        this.modal.show();
        this.onResize();
        this.buildForm(res[2].information, shopIndex);
        this.repairPlanData = res[2];
      });
  }

  open(wpId, state, isFromWaitingList, shopIndex?, id?) {
    this.stopPosition = null;
    this.initDataWhenOpenModal(wpId, state, isFromWaitingList, shopIndex, id);
  }


  callbackGridJob(params) {
    if (this.repairPlanData.jobsList.length) {
      // const data = this.repairPlanData.jobsList.filter(it => it.status === 'Y');
      params.api.setRowData(this.repairPlanData.jobsList);
    }
  }

  callbackGridPart(params) {
    if (this.repairPlanData.partsList.length) {
      params.api.setRowData(this.repairPlanData.partsList);
    }
  }

  private buildForm(val, shopIndex?) {
    let formbuilder_array = [];
    this.employeeList.forEach(employ => {

      const employee = this.formBuilder.group({
        id: employ.id,
        empCode: employ.empCode,
        empId: employ.empId ? employ.empId : employ.id,
        empImg: employ.empImg,
        empName: employ.empName,
        empStatus: employ.empStatus,
        choosed: false,
        actionType: this.actionTypeEmployee.add_or_update,
        new_employ: true,
        planFromTime: [employ.planFromTime ? employ.planFromTime : this.wshop.planFromTime],
        planToTime: employ.planToTime ? employ.planToTime : this.wshop.planToTime,
        actualFromTime: employ.actualFromTime,
        actualToTime: employ.actualToTime,
        empState: employ.empState,
        uid: employ.uid,
        disable_start_button: employ.disable_start_button,
        disable_end_button: employ.disable_end_button
      });
      formbuilder_array.push(employee);
    });

    this.form = this.formBuilder.group({
      id: [{ value: undefined, disabled: this.disabled_form }],
      registerno: [{ value: undefined, disabled: this.disabled_form }],
      repairorderno: [{ value: undefined, disabled: this.disabled_form }],
      empName: [{ value: undefined, disabled: true }],
      cusName: [{ value: undefined, disabled: this.disabled_form }],
      mobil: [{ value: undefined, disabled: this.disabled_form }],
      tel: [{ value: undefined, disabled: this.disabled_form }],
      cmName: [{ value: undefined, disabled: this.disabled_form }],
      km: [{ value: undefined, disabled: this.disabled_form }],
      getInDate: [{ value: undefined, disabled: true }],
      printDate: [{ value: undefined, disabled: true }],
      gxDate: [{ value: undefined, disabled: true }],
      toDatetime: [{ value: undefined, disabled: true }],
      state: [{ value: undefined, disabled: true }],
      roWshopActId: [{ value: undefined, disabled: true }],
      roWshopId: [{ value: undefined, disabled: true }],
      ktv: [{ value: undefined, disabled: true }],
      isCusWait: [{ value: undefined, disabled: true }],

      isPriority: [{ value: undefined, disabled: true }],
      isCarWash: [{ value: undefined, disabled: true }],
      isTakeParts: [{ value: undefined, disabled: true }],
      qcLevel: [{ value: undefined, disabled: true }, GlobalValidator.required],
      planFromTime: [this.wshop.planFromTime ? this.wshop.planFromTime : null, GlobalValidator.required],
      planToTime: [this.wshop.planToTime ? this.wshop.planToTime : null, GlobalValidator.required],

      employees: this.formBuilder.array(formbuilder_array),
      fromDatetime: [this.dataFormatService.formatDate(new Date())],
      wshopId: [this.wshop ? this.wshop.wshopId : null],
    });
    this.form.patchValue({ val });
    this.form.patchValue(Object.assign({}, val, {
      isCusWait: val.isCusWait && val.isCusWait === 'Y',
      isPriority: val.isPriority && val.isPriority === 'Y',
      isTakeParts: val.isTakeParts && val.isTakeParts === 'Y',
      isCarWash: val.isCarWash && val.isCarWash === 'Y',
      empName: val.createdByAdvisor
    }));
    this.employeeArray = this.form.get('employees') as FormArray;
    this.finish_load_data = true;
  }


  changeWshop(wsName, idx) {
    for (let i = 0; i < this.jobs.length; i++) {
      if (Number(this.jobs[i].wsName) === Number(wsName) && i !== idx) {
        this.swalAlertService.openWarningToast('Khoang đã được lên kế hoạch');
        this.jobs[idx].wsName = null;
        return;
      }
    }
    const data = this.shops.find(it => Number(it.id) === Number(wsName));
    this.jobs[idx].wsName = Number(wsName);
    this.jobs[idx].empName = data ? data.emps.map(it => it.empName).join(',') : '';
  }

  initDataEmployee() {
    for (let i = 0; i < this.employeeList.length; i++) {
      this.employeeList[i].actionType = this.actionTypeEmployee.add_or_update;
      if (this.employeeList[i].actualFromTime || this.employeeList[i].actualToTime) {
        this.employeeList[i].disable_start_button = true;
      } else {
        this.disableStartAll = false;
        this.employeeList[i].disable_start_button = false;
      }

      if (this.employeeList[i].actualToTime) {
        this.employeeList[i].disable_end_button = true;
      } else {
        this.disableEndAll = false;
        this.employeeList[i].disable_end_button = false;
      }
    }
  }

  getEmployee(data) {
    for (let i = 0; i < data.length; i++) {
      let employ = data[i];
      const employee = this.formBuilder.group({
        id: employ.id,
        empCode: employ.empCode,
        empId: employ.empId ? employ.empId : employ.id,
        empImg: employ.empImg,
        empName: employ.empName,
        empStatus: employ.empStatus,
        choosed: false,
        actionType: this.actionTypeEmployee.add_or_update,
        new_employ: true,
        planFromTime: [employ.planFromTime ? employ.planFromTime : this.wshop.planFromTime],
        planToTime: employ.planToTime ? employ.planToTime : this.wshop.planToTime,
        actualFromTime: employ.actualFromTime,
        actualToTime: employ.actualToTime,
        empState: employ.empState,
        uid: employ.uid,
        disable_start_button: employ.disable_start_button,
        disable_end_button: employ.disable_end_button
      });
      this.employeeArray.push(employee);
      this.employeeList.push(employ);
    }
    this.initDataEmployee();
  }

  getDisabledChangeEmp() {
    return this.employeeArray.value.filter(item => item.actionType !== this.actionTypeEmployee.remove).length === 0;
  }

  removeEmployee(emp, index) {
    if (this.state == this.ProgressState.actual) {
      this.swalAlertService.openFailToast("Xe đang thực hiện, không thể thay đổi kế hoạch!");
    } else {
      if (emp.new_employ) this.employeeList.splice(index, 1);
      else {
        emp.value.actionType = this.actionTypeEmployee.remove;
      }
    }

  }

  reLoadPlanScc() {
    this.roWshopApi.getRepairPlan(this.planId).subscribe(res => {
      this.information = res.information;
      this.jobs = res.information ? res.information.listPlans : [];
      this.employeeList = res.employeeList ? res.employeeList : [];
      this.wshop = res.wshop ? res.wshop : {};
      this.initDataEmployee();
    });
  }

  changeEmployeePlan() {
    // let data = {
    //   planId: this.planId,
    //   employees: this.employeeList,
    // }
    // this.roWshopApi.changeEmployeePlan(data).subscribe(res => {
    //   this.swalAlertService.openSuccessToast("Thay đổi kỹ thuật viên thành công");
    //   this.reLoadPlanScc();
    // });
    this.employeeList = [];

    this.employeeArray.controls.forEach(emp => {
      const employee = {
        id: emp.value.id,
        empId: emp.value.empId,
        empCode: emp.value.empCode,
        empImg: emp.value.empImg,
        empName: emp.value.empName,
        planFromTime: emp.value.planFromTime,
        planToTime: emp.value.planToTime,
        actualFromTime: emp.value.actualFromTime,
        actualToTime: emp.value.actualToTime,
        empState: emp.value.empState,
        uid: emp.value.uid,
        actionType: emp.value.actionType,
        disable_start_button: emp.value.disable_start_button,
        disable_end_button: emp.value.disable_end_button
      };
      this.employeeList.push(employee);
    });

    if (this.employeeList.length == 0) {
      this.swalAlertService.openInfoToast("Chưa có kỹ thuật viên");
      return;
    }
    let data = {
      planId: this.planId,
      employees: this.employeeList,
    }
    // kiem tra xem co nhan viên nào bị xóa ko
    let check_remove = false;
    for (let i = 0; i < this.employeeList.length; i++) {
      if (this.employeeList[i].actionType == this.actionTypeEmployee) {
        check_remove = true;
      }
    }

    //kiem tra xem tat ca cac nhan vien chua bi xoa da ket thuc cong viec chua
    let finish_job = true;

    for (let i = 0; i < this.employeeList.length; i++) {
      if (this.employeeList[i].actionType != this.actionTypeEmployee.remove && !this.employeeList[i].actualToTime) {
        finish_job = false;
      }
    }
    // chi tra xem tat khi trang thai xe là đang thực hiện
    if (this.state != ProgressState.actual || this.employeeList.length == 0) {
      finish_job = false;
    }

    if (finish_job && check_remove) {
      this.confirmService.openConfirmModal('Công việc sẽ được chuyển trạng thái sang hoàn thành, bạn có chắc chắn thực hiện thao tác này?').subscribe(res => {
        this.roWshopApi.changeEmployeePlan(data).subscribe(res => {
          this.swalAlertService.openSuccessToast("Thay đổi kỹ thuật viên thành công");
          this.reLoadPlanScc();
        });
      });
    } else {
      this.roWshopApi.changeEmployeePlan(data).subscribe(res => {
        this.swalAlertService.openSuccessToast("Thay đổi kỹ thuật viên thành công");
        this.reLoadPlanScc();
      });
    }
  }

  getDateValue(time) {
    if (!time) return null;
    else return time;
  }

  getEmploylistInWs() {
    let current_wshopId = this.wshop.wshopId;
    if (this.form && this.form.value.wshopId) current_wshopId = this.form.value.wshopId;

    // this.employeeList = [];
    // for (let i = 0; i < this.techWShop.length; i++) {
    //   if (this.techWShop[i].wshopId == current_wshopId) {
    //     this.employeeList.push(this.techWShop[i]);
    //   }
    // }
    if (this.form) {

      let formbuilder_array = [];
      this.employeeList.forEach(employ => {

        const employee = this.formBuilder.group({
          id: employ.id,
          empCode: employ.empCode,
          empId: employ.empId ? employ.empId : employ.id,
          empImg: employ.empImg,
          empName: employ.empName,
          empStatus: employ.empStatus,
          choosed: false,
          actionType: this.actionTypeEmployee.add_or_update,
          new_employ: true,
          planFromTime: [employ.planFromTime ? employ.planFromTime : this.wshop.planFromTime],
          planToTime: employ.planToTime ? employ.planToTime : this.wshop.planToTime,
          actualFromTime: employ.actualFromTime,
          actualToTime: employ.actualToTime,
          empState: employ.empState,
          uid: employ.uid,
          disable_start_button: employ.disable_start_button,
          disable_end_button: employ.disable_end_button
        });
        formbuilder_array.push(employee);
      });
      const control = <FormArray>this.form.controls['employees'];

      for (let i = control.length - 1; i >= 0; i--) {
        control.removeAt(i)
      }

      for (let i = 0; i < formbuilder_array.length; i++) {
        this.employeeArray.push(formbuilder_array[i]);
      }
    }

  }
  // continueJobScc() {
  //   let data = {
  //     actualId: this.id,
  //     planId: this.planId,
  //     fromDateTime: this.form.value.fromDatetime,
  //     wshopId: this.form.value.wshopId,
  //     employees: this.form.value.employees,
  //   }

  //   this.roWshopActApi.continueJobScc(data).subscribe(res => {
  //     if (res.code == 300) {
  //       let messesges = "";
  //       for (let i = 0; i < res.data.length; i++) {
  //         if (i < res.data.length - 1) {
  //           messesges += `Kỹ thuật viên ${res.data[i].empName} đang thực hiện công việc ở xe ${res.data[i].registerno} \n`
  //         } else {
  //           messesges += `Kỹ thuật viên ${res.data[i].empName} đang thực hiện công việc ở xe ${res.data[i].registerno}. Bạn có muốn dừng việc sửa chữa của KTV ở khoang hiện tại để bắt đầu sửa chữa ở khoang ${this.wshop.wsCode} không?`
  //         }
  //       }
  //       this.confirmService.openConfirmModal(messesges).subscribe(res => {
  //         let data_save_employees = {
  //           actualId: this.id,
  //           planId: this.planId,
  //           fromDateTime: this.form.value.fromDatetime,
  //           wshopId: this.form.value.wshopId,
  //           employees: this.form.value.employees,
  //           acceptCheck: true
  //         }
  //         this.roWshopActApi.continueJobScc(data_save_employees).subscribe(res => {
  //           this.loadingService.setDisplay(false);
  //           this.swalAlertService.openSuccessToast("Tiếp tục sửa chữa thành công");
  //           this.refreshList.emit();
  //           this.close();
  //         });
  //       });
  //     } else if (res.code == 400) {
  //       this.messeage_notification = "";
  //       for (let i = 0; i < res.data.length; i++) {
  //         if (i < res.data.length - 1) {
  //           this.messeage_notification += `Kỹ thuật viên ${res.data[i].empName} đang thực hiện công việc ở xe ${res.data[i].registerno} \n`
  //         } else {
  //           this.messeage_notification += `Kỹ thuật viên ${res.data[i].empName} đang thực hiện công việc ở xe ${res.data[i].registerno}`
  //         }
  //       }
  //       jQuery('#warningEmployeeRepairModal').modal('show')
  //     } else {
  //       this.loadingService.setDisplay(false);
  //       this.swalAlertService.openSuccessToast("Tiếp tục sửa chữa thành công");
  //       this.refreshList.emit();
  //       this.close();
  //     }
  //   });
  // }

  continueJobScc(emp) {
    let employees = [];
    employees.push(emp.value);
    let data = {
      actualId: this.id,
      planId: this.planId,
      fromDateTime: this.form.value.fromDatetime,
      wshopId: this.form.value.wshopId,
      employees: employees,
    }

    this.roWshopActApi.continueJobScc(data).subscribe(res => {
      if (res.code == 300) {
        let messesges = "";
        for (let i = 0; i < res.data.length; i++) {
          if (i < res.data.length - 1) {
            messesges += `Kỹ thuật viên ${res.data[i].empName} đang thực hiện công việc ở xe ${res.data[i].registerno} \n`
          } else {
            messesges += `Kỹ thuật viên ${res.data[i].empName} đang thực hiện công việc ở xe ${res.data[i].registerno}. Bạn có muốn dừng việc sửa chữa của KTV ở khoang hiện tại để bắt đầu sửa chữa ở khoang ${this.wshop.wsCode} không?`
          }
        }
        this.confirmService.openConfirmModal(messesges).subscribe(res => {
          let data_save_employees = {
            actualId: this.id,
            planId: this.planId,
            fromDateTime: this.form.value.fromDatetime,
            wshopId: this.form.value.wshopId,
            employees: this.form.value.employees,
            acceptCheck: true
          }
          this.roWshopActApi.continueJobScc(data_save_employees).subscribe(res => {
            this.loadingService.setDisplay(false);
            this.swalAlertService.openSuccessToast("Tiếp tục sửa chữa thành công");
            this.refreshList.emit();
            this.close();
          });
        });
      } else if (res.code == 400) {
        this.messeage_notification = "";
        for (let i = 0; i < res.data.length; i++) {
          if (i < res.data.length - 1) {
            this.messeage_notification += `Kỹ thuật viên ${res.data[i].empName} đang thực hiện công việc ở xe ${res.data[i].registerno} \n`
          } else {
            this.messeage_notification += `Kỹ thuật viên ${res.data[i].empName} đang thực hiện công việc ở xe ${res.data[i].registerno}`
          }
        }
        jQuery('#warningEmployeeRepairModal').modal('show')
      } else {
        this.loadingService.setDisplay(false);
        this.swalAlertService.openSuccessToast("Tiếp tục sửa chữa thành công");
        this.refreshList.emit();
        this.close();
      }
    });
  }

  continueAllJobScc() {
    let employees = [];
    for (let i = 0; i < this.form.value.employees.length; i++) {
      if (!this.form.value.employees[i].actualFromTime) {
        employees.push(this.form.value.employees[i]);
      }
    }

    this.employeeList = [];

    this.employeeArray.controls.forEach(emp => {
      const employee = {
        id: emp.value.id,
        empId: emp.value.empId,
        empCode: emp.value.empCode,
        empImg: emp.value.empImg,
        empName: emp.value.empName,
        planFromTime: emp.value.planFromTime,
        planToTime: emp.value.planToTime,
        actualFromTime: emp.value.actualFromTime,
        actualToTime: emp.value.actualToTime,
        empState: emp.value.empState,
        uid: emp.value.uid,
        actionType: emp.value.actionType,
        disable_start_button: emp.value.disable_start_button,
        disable_end_button: emp.value.disable_end_button
      };
      this.employeeList.push(employee);
    });

    if (this.employeeList.length == 0) {
      this.swalAlertService.openInfoToast("Chưa có kỹ thuật viên");
      return;
    }

    let data = {
      planId: this.planId,
      employees: this.employeeList,
    }

    let data_save_employees = {
      actualId: this.id,
      planId: this.planId,
      fromDateTime: this.form.value.fromDatetime,
      wshopId: this.form.value.wshopId,
      employees: employees,
    }

    this.roWshopApi.changeEmployeePlan(data).subscribe(res => {
      this.roWshopActApi.continueJobScc(data_save_employees).subscribe(res => {
        if (res.code == 300) {
          let messesges = "";
          for (let i = 0; i < res.data.length; i++) {
            if (i < res.data.length - 1) {
              messesges += `Kỹ thuật viên ${res.data[i].empName} đang thực hiện công việc ở xe ${res.data[i].registerno} \n`
            } else {
              messesges += `Kỹ thuật viên ${res.data[i].empName} đang thực hiện công việc ở xe ${res.data[i].registerno}. Bạn có muốn dừng việc sửa chữa của KTV ở khoang hiện tại để bắt đầu sửa chữa ở khoang ${this.wshop.wsCode} không?`
            }
          }
          this.confirmService.openConfirmModal(messesges).subscribe(res => {
            let data_save_employees = {
              actualId: this.id,
              planId: this.planId,
              fromDateTime: this.form.value.fromDatetime,
              wshopId: this.form.value.wshopId,
              employees: employees,
              acceptCheck: true
            }
            this.roWshopActApi.continueJobScc(data_save_employees).subscribe(res => {
              this.loadingService.setDisplay(false);
              this.swalAlertService.openSuccessToast("Tiếp tục sửa chữa thành công");
              this.refreshList.emit();
              this.close();
            });
          });
        } else if (res.code == 400) {
          this.messeage_notification = "";
          for (let i = 0; i < res.data.length; i++) {
            if (i < res.data.length - 1) {
              this.messeage_notification += `Kỹ thuật viên ${res.data[i].empName} đang thực hiện công việc ở xe ${res.data[i].registerno} \n`
            } else {
              this.messeage_notification += `Kỹ thuật viên ${res.data[i].empName} đang thực hiện công việc ở xe ${res.data[i].registerno}`
            }
          }
          jQuery('#warningEmployeeRepairModal').modal('show')
        } else {
          this.loadingService.setDisplay(false);
          this.swalAlertService.openSuccessToast("Tiếp tục sửa chữa thành công");
          this.refreshList.emit();
          this.close();
        }
      });
    });
  }
}
