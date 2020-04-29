import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, ViewRef} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {EventBusService} from '../../../../shared/common-service/event-bus.service';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {RoWshopActApi} from '../../../../api/ro-wshop/ro-wshop-act.api';
import {NameProgressByState, ProgressState} from '../../../../core/constains/progress-state';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import { ActionTypeEmployee } from '../../../../core/constains/repair-progress';
import { WorkShopModel} from '../../../../core/models/repair-progress/wshop.model';
import { ToastService } from '../../../../shared/swal-alert/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'continue-plan-modal',
  templateUrl: './continue-plan-modal.component.html',
  styleUrls: ['./continue-plan-modal.component.scss']
})
export class ContinuePlanModalComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() refreshList = new EventEmitter();
  @Output() refreshRoNoPlanList = new EventEmitter();
  @ViewChild('continueModal', {static: false}) modal;

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
  changePlanToWorking;
  completeWorking;

  isCollapsedOther = false;
  isCollapsedFollow = false;
  isCollapsedPlan = false;
  isCollapsedWS = false;
  disableStartAll = true;
  disableEndAll = true;
  jobFieldGrid;
  partFieldGrid;
  wshop: WorkShopModel;
  actionTypeEmployee = ActionTypeEmployee;
  data_modal: any;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private setModalHeightService: SetModalHeightService,
    private eventBusService: EventBusService,
    public dataFormatService: DataFormatService,
    private cdr: ChangeDetectorRef,
    private roWshopActApi: RoWshopActApi,
    private swalAlertService: ToastService,
  ) {
  }

  ngOnInit() {
    this.subscription = this.eventBusService.on('openContinuePlanModal').subscribe(val => {
      console.log(val)
      this.initDataWhenOpenModal(val);
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
    this.employeeList = [];
    this.modal.hide();
  }


  initDataWhenOpenModal(val) {
    console.log(val)
    this.data_modal = val;
    this.buildForm();
    this.modal.show();
    this.onResize();
  }

  open(val) {
    this.initDataWhenOpenModal(val);
  }


  private buildForm() {
    this.form = this.formBuilder.group({
      toTime: [this.data_modal.toTime],
    });
    console.log(this.form.value.fromDateTime)
    // this.form.patchValue(this.data_modal);
    
  }
  
  finishJobScc() {
    let data = {
      actualId: this.data_modal.actualId,
      toTime: this.form.value.toTime,
    }
    this.roWshopActApi.finishScc(data).subscribe(res => {
      this.swalAlertService.openSuccessToast("Kết thúc xe thành công");
      this.close();
    })
  }

  getDateValue(time) {
    if(!time) return null;
    else return time;
  }
}
