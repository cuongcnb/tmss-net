import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, ViewRef} from '@angular/core';
import {FormBuilder} from '@angular/forms';

import {SetModalHeightService} from '../../../shared/common-service/set-modal-height.service';
import {EventBusService} from '../../../shared/common-service/event-bus.service';
import {RoWshopApi} from '../../../api/ro-wshop/ro-wshop.api';
import {ShopCommonApi} from '../../../api/common-api/shop-common.api';
import {LoadingService} from '../../../shared/loading/loading.service';
import {RoWshopActApi} from '../../../api/ro-wshop/ro-wshop-act.api';
import {TechWshopApi} from '../../../api/tech-wshop/tech-wshop.api';
import {NameProgressByState, ProgressState} from '../../../core/constains/progress-state';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {PendingReasonApi} from '../../../api/pending-reason/pending-reason.api';
import {RepairOrderApi} from '../../../api/quotation/repair-order.api';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {forkJoin} from 'rxjs';
import {TitleApi} from '../../../api/common-api/title.api';
import {ConfirmService} from '../../../shared/confirmation/confirm.service';
import { ActionTypeEmployee } from '../../../core/constains/repair-progress';
declare var $ :any;
declare var jQuery: any;


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'emp',
  templateUrl: './emp.component.html',
  styleUrls: ['./emp.component.scss']
})
export class EmpComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() refreshList = new EventEmitter();
  @Output() refreshRoNoPlanList = new EventEmitter();
  @ViewChild('modal', {static: false}) modal;
  @ViewChild('repairAriseModal', {static: false}) repairAriseModal;

  modalHeight: number;
  shops: Array<any> = [];
  isFromWaitingList: boolean;
  state = ProgressState.plan;
  ProgressState = ProgressState;
  NameProgressByState = NameProgressByState;
  actionTypeEmployee = ActionTypeEmployee;
  subscription;
  stopPosition;
  information;
  id;
  jobs;
  params;
  selectedRow;
  frameworkComponents;
  techWShop;
  fieldGrid;
  employeeList = [];
  empName: any;
  roType = 2;
  messeage_notification = "";

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
    private confirmService: ConfirmService,
  ) {
  }

  ngOnInit() {
    this.patchData();
  }
  patchData() {
    this.loadingService.setDisplay(true);
    this.roWshopApi.getEmpPlan(this.empName, this.roType).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.employeeList = res;
      this.inItDataEmployees();
    })
  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!(this.cdr as ViewRef).destroyed) {
        this.cdr.detectChanges();
      }
    }, 0);
  }

  ngOnDestroy() {
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
    this.modal.hide();
  }


  startJob(emp) {
    let employees = [];
    emp.actionType = this.actionTypeEmployee.add_or_update;
    employees.push(emp);
    let data = {
      planId: emp.planId,
      employees: employees,
    }
    this.roWshopActApi.startJobScc(data).subscribe(res => {
      if (res.code == 300) {
        let messesges = "";
        for (let i = 0; i < res.data.length; i++) {
          if (i < res.data.length - 1) {
            messesges += `Kỹ thuật viên ${res.data[i].empName} đang thực hiện công việc ở xe ${res.data[i].registerno} \n`
          } else {
            messesges += `Kỹ thuật viên ${res.data[i].empName} đang thực hiện công việc ở xe ${res.data[i].registerno}. Bạn có muốn dừng việc sửa chữa của KTV ở khoang hiện tại để bắt đầu sửa chữa ở khoang ${emp.wsCode} không?`
          }
        }
        this.confirmService.openConfirmModal(messesges).subscribe(res => {
          let employees = [];
          employees.push(emp);
          let data = {
            planId: emp.planId,
            employees: employees,
            acceptCheck: true
          }
          this.roWshopActApi.startJobScc(data).subscribe(res => {
            this.swalAlertService.openSuccessToast("Bắt đầu thành công");
            this.patchData();
          });
        });
        
      } else if (res.code == 400){
        this.messeage_notification = "";
        for (let i = 0; i < res.data.length; i++) {
          if (i < res.data.length - 1) {
            this.messeage_notification += `Kỹ thuật viên ${res.data[i].empName} đang thực hiện công việc ở xe ${res.data[i].registerno} \n`
          } else {
            this.messeage_notification += `Kỹ thuật viên ${res.data[i].empName} đang thực hiện công việc ở xe ${res.data[i].registerno}`
          }
        }
        jQuery('#warningEmployeeModal').modal('show')
      } else {
        this.swalAlertService.openSuccessToast("Bắt đầu thành công");
        this.patchData();
      }
      
      
    });
  }

  finishJob(emp) {
    let employees = [];
    employees.push(emp);
    let data = {
      actualId: emp.actualId,
      employees: employees,
    }
    this.roWshopActApi.finishJobScc(data).subscribe(res => {
      this.swalAlertService.openSuccessToast("Kết thúc thành công");
      this.patchData();
    });
  }

  getDisableStartButton(emp) {
    if (emp.actualFromTime) return true;
    if (!emp.actualFromTime) return false;
    if (!emp.actualFromTime && !emp.actualToTime) return false;
  }

  getDisableEndButton(emp) {
    if (emp.actualToTime) return true;
    if (!emp.actualFromTime && !emp.actualToTime) return true;
    if (!emp.actualToTime) return false;
  }

  inItDataEmployees() {
    for (let i = 0; i < this.employeeList.length; i++) {
      this.employeeList[i].disable_start_button = this.getDisableStartButton(this.employeeList[i])
      this.employeeList[i].disable_end_button = this.getDisableEndButton(this.employeeList[i]);
    }
  }

  getDateValue(time) {
    if(!time) return null;
    else return time;
  }
}
