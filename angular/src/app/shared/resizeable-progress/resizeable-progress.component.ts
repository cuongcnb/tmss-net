import {ChangeDetectorRef, Component, ElementRef, HostListener, Input, NgZone, OnDestroy, ViewChild, ViewRef} from '@angular/core';
import {EventBusService} from '../common-service/event-bus.service';
import {RoWshopApi} from '../../api/ro-wshop/ro-wshop.api';
import {LoadingService} from '../loading/loading.service';
import * as moment from 'moment';
import {RoWshopActApi} from '../../api/ro-wshop/ro-wshop-act.api';
import {NameProgressByState, ProgressState} from '../../core/constains/progress-state';
import {ContextMenuComponent} from 'ngx-contextmenu';
import {Times} from '../../core/constains/times';
import {ToastService} from '../swal-alert/toast.service';
import { ConfirmService } from '../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'resizeable-progress',
  templateUrl: './resizeable-progress.component.html',
  styleUrls: ['./resizeable-progress.component.scss']
})
export class ResizeableProgressComponent implements OnDestroy {
  @ViewChild('trackingProgress', {static: false}) trackingProgress;
  @ViewChild(ContextMenuComponent, {static: false}) public basicMenu: ContextMenuComponent;

  @Input() val;
  @Input() workTimes: Array<any>;
  @Input() morningStart = 7;
  @Input() state: ProgressState;
  @Input() rows: Array<any>;
  @Input() hourNumbers: number;
  @Input() isSCC;
  @Input() estimateTime;
  @Input() disable;
  @Input() disable_drag = false;
  @Input() byCar;
  ProgressState = ProgressState;
  NameProgressByState = NameProgressByState;
  scc = 'scc';
  ds = 'ds';
  rx = 'rx';
  car = 'car';
  wshop = 'wshop';
  // vì gọi sự kiện toàn cục nên currentProgressElem sẽ đc set cho tất cả plan
  // isMouseOver để check chuột chọn vào plan nào
  currentProgressElem;
  isMouseOver: boolean;
  isShowTooltip: boolean;

  px: number;
  width = 0;
  top: number;
  isResize: boolean;
  isShowContextMenu: boolean;
  areaHeight: number;
  disableFieldContent = [ProgressState.plan];
  disablePlanContent = [ProgressState.plan, ProgressState.autoSuggest, ProgressState.autoAppointment, ProgressState.manualSuggest];
  disableMenuContent = [ProgressState.complete];
  disableCancel = [ProgressState.autoAppointment, ProgressState.manualAppointment, ProgressState.autoSuggest, ProgressState.manualSuggest, ProgressState.plan];
  disableCancelAll = [ProgressState.autoAppointment, ProgressState.manualAppointment, ProgressState.autoSuggest, ProgressState.manualSuggest];
  disableDragAndResize = [ProgressState.complete, ProgressState.stopInside, ProgressState.stopOutside, ProgressState.performed];
  // for context-menu
  contextMenuLeft: number;
  contextMenuTop: number;
  hourWork;
  // for drag
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  leftWithMouseDown;
  startTimeDisplay;
  showTime = false;
  heightProgressResize = 40;
  positionTop;
  positionLeft;
  diff_mouse;
  showMouseTime = false;
  endTimeDisplay;

  mouseX;
  mouseY;

  constructor(
    private eventBusService: EventBusService,
    private cdr: ChangeDetectorRef,
    private roWshopApi: RoWshopApi,
    private roWshopActApi: RoWshopActApi,
    private loadingService: LoadingService,
    private elem: ElementRef,
    private ngZone: NgZone,
    private swalAlert: ToastService,
    private confirmService: ConfirmService,
  ) {
    setTimeout(() => {
      if (!(this.cdr as ViewRef).destroyed) {
        this.cdr.detectChanges();
        this.elem.nativeElement.addEventListener('mousedown', (event) => {
          this.isShowTooltip = false;
          this.showMouseTime = true;
          this.onMouseDown(event);
        });
        this.elem.nativeElement.addEventListener('mouseup', (event) => {
          this.showMouseTime = false;
          this.onMouseUp(event);
        });
        this.elem.nativeElement.addEventListener('mousemove', (event) => {
          // this.isShowTooltip = false;
          this.onMouseMove(event);
        });
        this.elem.nativeElement.addEventListener('mouseenter', () => {
          this.triggerTooltip(true);
        });
        this.elem.nativeElement.addEventListener('mouseleave', () => {
          this.triggerTooltip(false);
        });
      }
    }, 100);
  }


  ngOnDestroy(): void {
    this.elem.nativeElement.removeEventListener('mousedown', (event) => {
      this.onMouseDown(event);
    });
    this.elem.nativeElement.removeEventListener('mouseup', (event) => {
      this.onMouseUp(event);
    });
    // this.elem.nativeElement.removeEventListener('mousemove', (event) => {
    //   this.onMouseMove(event);
    // });
    this.elem.nativeElement.removeEventListener('mouseenter', () => {
      this.triggerTooltip(true);
    });
    this.elem.nativeElement.removeEventListener('mouseleave', () => {
      this.triggerTooltip(false);
    });
  }

  cdkDragStarted() {
    this.triggerTooltip(false);
  }

  openRepairPlanModal() {
    let planId = this.val.roWshopsId;
    let actualId = this.val.id;
    if (this.state == this.ProgressState.actual || this.state == this.ProgressState.stopInside || 
      this.state == this.ProgressState.complete || this.state == this.ProgressState.performed || 
      this.state == this.ProgressState.stopOutside) {
      planId = this.val.wshopsPlanId;
    }
    const data = this.isSCC === this.scc ? {
      type: 'openRepairPlanModal',
      wpId: this.val.wpId,
      state: this.state,
      wshopId: this.val.wshopId,
      id: this.val.roWshopsId,
      planId: planId,
      actualId: actualId,
    } : this.isSCC === this.ds ? {
      type: 'openDsModal',
      wpId: this.val.wpId,
      state: this.state,
      wshopId: this.val.wshopId,
      id: this.val.roWshopsId,
      planId: planId,
      actualId: this.val.id,
      estimateTime: this.estimateTime,
    } : '';
    this.eventBusService.emit(data);
  }

  triggerTooltip(val) {
    this.isShowTooltip = val;
    if (!(this.cdr as ViewRef).destroyed) {
      this.cdr.detectChanges();
    }
  }

  get progressIcon() {
    if(this.val.lateCar === 1) {
      return 'fa fa-clock-o';
    }
    switch (this.state) {
      case ProgressState.plan:
        return 'fa fa-paperclip';
      case ProgressState.actual:
        return 'fa fa-gear';
      case ProgressState.stopInside:
        return 'fa fa-flag';
      case ProgressState.complete:
        return 'fa fa-check';
      // case ProgressState.autoSuggest:
      //   return 'fa clip-lamp';
      case ProgressState.performed:
        return 'fa fa-dot-circle-o';
    }
  }

  changePlanToWorking() {
    let planId = this.val.roWshopsId;
    let actualId = null;
    if (this.state == this.ProgressState.actual || this.state == this.ProgressState.stopInside) {
      planId = this.val.wshopsPlanId;
      actualId = this.val.id;
    }
    if (this.isSCC === this.scc) {
      this.eventBusService.emit({
        type: 'openRepairPlanModal',
        wpId: this.val.wpId,
        state: this.state,
        changePlanToWorking: true,
        id: this.val.roWshopsId,
        planId: planId,
        actualId: actualId
      });
    } else if (this.isSCC === this.ds) {
      this.eventBusService.emit({
        type: 'openDsModal',
        wpId: this.val.wpId,
        state: this.state,
        wshopId: this.val.wshopId,
        id: this.val.roWshopsId,
        planId: planId,
        actualId: this.val.id,
        estimateTime: this.estimateTime,
        changePlanToWorking: true,
      });
    } else {

    }
    // const apiCall = this.isSCC === this.scc ?
    //   this.roWshopActApi.startSccJob({
    //     id: this.val.roWshopsId,
    //     wshopId: this.val.wshopId,
    //     fromDatetime: this.val.fromDatetime,
    //     toDatetime: this.val.toDatetime
    //   }, this.val.isCarWash, this.val.isCusWait, this.val.isTakeParts, this.val.qcLevel) : this.isSCC === this.ds ? this.roWshopActApi.startJobDs({id: this.val.roWshopId},
    //     this.val.isCarWash, this.val.isCusWait, this.val.isTakeParts, this.val.qcLevel) : this.roWshopActApi.startRxJob({
    //     id: this.val.roWshopsId,
    //     wshopId: this.val.wshopId,
    //     fromDatetime: this.val.fromDatetime,
    //     toDatetime: this.val.toDatetime
    //   });

    // this.loadingService.setDisplay(true);
    // apiCall.subscribe(() => {
    //   this.loadingService.setDisplay(false);
    //   this.refreshSearch();
    // }, () => {
    //   this.refreshSearch();
    // });
  }

  freePlan() {
    this.loadingService.setDisplay(true);
    const apiCall = this.isSCC === this.scc ? this.roWshopActApi.freePlanScc({id: this.val.roWshopsId},
      this.val.isCarWash, this.val.isCusWait, this.val.isTakeParts, this.val.qcLevel) : this.isSCC === this.ds
      ? this.roWshopActApi.freePlanDs(this.val.roWshopsId) : this.roWshopActApi.freePlanRx({id: this.val.roWshopsId});
    apiCall.subscribe(() => {
      this.loadingService.setDisplay(false);
      this.refreshSearch();
    }, () => this.refreshSearch());
  }

  removePlan() {
    this.loadingService.setDisplay(true);
    if (this.isSCC === this.ds) {
      this.roWshopApi.removePlanDs(this.val.roWshopsId).subscribe(() => {
        this.loadingService.setDisplay(false);
        this.refreshSearch();
      });
    }
  }

  clonePlan() {
    this.loadingService.setDisplay(true);
    const obj = Object.assign(this.val, {
      fromDatetime: this.val.toDatetime,
      toDatetime: this.val.toDatetime
    });
    this.roWshopApi.clonePlan([obj], this.val.isCarWash, this.val.isCusWait, this.val.isTakeParts, this.val.qcLevel).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.refreshSearch();
    }, () => this.refreshSearch());
  }

  continueWorking() {
    const obj = {
      actualStartedId: this.val.id,
      newState: ProgressState.actual,
      pendingReasonNote: null,
      pendingReasonType: null,
      fromDateTime: null,
    };
    if (this.isSCC === this.scc) {
      this.loadingService.setDisplay(true);
      this.roWshopActApi.changeStateJobScc(obj).subscribe(() => {
        this.loadingService.setDisplay(false);
        this.refreshSearch();
      }, () => this.refreshSearch());
    }

    if (this.isSCC === this.ds) {
      let planId = this.val.roWshopsId;
      let actualId = null;
      if (this.state == this.ProgressState.actual || this.state == this.ProgressState.stopInside || this.state == this.ProgressState.stopOutside) {
        planId = this.val.wshopsPlanId;
        actualId = this.val.id;
      }
      this.eventBusService.emit({
        type: 'openDsModal',
        wpId: this.val.wpId,
        state: this.state,
        wshopId: this.val.wshopId,
        id: this.val.roWshopsId,
        planId: planId,
        actualId: this.val.id,
        estimateTime: this.estimateTime,
        continueWorking: true,
      });
    }
    
    // const apiCall = this.isSCC === this.scc ?
    //   this.roWshopActApi.changeStateJobScc({
    //     id: this.val.id,
    //     wshopActId: this.val.wshopId,
    //     state: ProgressState.actual
    //   }, this.val.isCarWash, this.val.isCusWait, this.val.isTakeParts, this.val.qcLevel) : this.isSCC === this.ds ?
    //     this.roWshopActApi.changeStateJobDs({
    //       id: this.val.roWshopId,
    //       roWshopActId: this.val.id,
    //       empId: this.val.empId,
    //       state: ProgressState.actual
    //     }, this.val.isCarWash, this.val.isCusWait, this.val.isTakeParts, this.val.qcLevel) : this.roWshopActApi.changeStateJobRx({
    //       id: this.val.id,
    //       wshopActId: this.val.wshopId,
    //       state: ProgressState.actual
    //     });

    // this.loadingService.setDisplay(true);
    // apiCall.subscribe(() => {
    //   this.loadingService.setDisplay(false);
    //   this.refreshSearch();
    // }, () => {
    //   this.refreshSearch();
    // });
  }

  stopWorkingInside() {
    let planId = this.val.roWshopsId;
    let actualId = null;
    if (this.state == this.ProgressState.actual || this.state == this.ProgressState.stopInside) {
      planId = this.val.wshopsPlanId;
      actualId = this.val.id;
    }
    if (this.isSCC === this.scc) {
      this.eventBusService.emit({
        type: 'openRepairPlanModal',
        wpId: this.val.wpId,
        state: this.state,
        stopPosition: 'inside',
        id: this.val.roWshopsId,
        planId: planId,
        actualId: actualId
      });
    } else if (this.isSCC === this.ds) {
      this.eventBusService.emit({
        type: 'openDsModal',
        wpId: this.val.wpId,
        state: this.state,
        wshopId: this.val.wshopId,
        id: this.val.roWshopsId,
        planId: planId,
        actualId: this.val.id,
        estimateTime: this.estimateTime,
        stopWorking: true,
      });
    } else {

    }
  }

  stopWorkingOutside() {
    this.eventBusService.emit({
      type: 'openRepairPlanModal',
      wpId: this.val.wpId,
      state: this.state,
      stopPosition: 'outside',
      id: this.val.roWshopsId
    });
  }

  completeWorking() {
    let planId = this.val.roWshopsId;
    let actualId = null;
    if (this.state == this.ProgressState.actual || this.state == this.ProgressState.stopInside) {
      planId = this.val.wshopsPlanId;
      actualId = this.val.id;
    }
    if (this.isSCC === this.scc) {
      // this.eventBusService.emit({
      //   type: 'openContinuePlanModal',
      //   wpId: this.val.wpId,
      //   state: this.state,
      //   completeWorking: true,
      //   id: this.val.roWshopsId,
      //   planId: planId,
      //   actualId: actualId,
      //   toTime: new Date().getTime(),
      // });
      if (this.state == this.ProgressState.actual) {
        this.loadingService.setDisplay(true);
        this.roWshopActApi.checkFinishScc(this.val.id).subscribe(res => {
          this.loadingService.setDisplay(false);
          if (res && res.length > 0) {
            let latestTime = res[0].latestTime;
            this.confirmService.openConfirmModal('Bạn có muốn kết thúc xe?').subscribe(res => {
              this.eventBusService.emit({
                type: 'openContinuePlanModal',
                wpId: this.val.wpId,
                state: this.state,
                completeWorking: true,
                id: this.val.roWshopsId,
                planId: planId,
                actualId: actualId,
                toTime: latestTime,
              });
            });
          } else {
            this.openRepairPlanScc(planId, actualId);
          }
        })
      } else {
        this.openRepairPlanScc(planId, actualId);
      }
      
    } else if (this.isSCC === this.ds) {
      this.eventBusService.emit({
        type: 'openDsModal',
        wpId: this.val.wpId,
        state: this.state,
        wshopId: this.val.wshopId,
        id: this.val.roWshopsId,
        planId: planId,
        actualId: this.val.id,
        estimateTime: this.estimateTime,
        completeWorking: true,
      });
    } else {

    }
    // const apiCall = this.isSCC === this.scc ?
    //   this.roWshopActApi.finishSccJob({id: this.val.id}, this.val.isCarWash, this.val.isCusWait, this.val.isTakeParts, this.val.qcLevel) : this.isSCC === this.ds ?
    //     this.roWshopActApi.finishJobDs({id: this.val.id}, this.val.isCarWash, this.val.isCusWait, this.val.isTakeParts, this.val.qcLevel) :
    //     this.roWshopActApi.finishRxJob({id: this.val.id});

    // this.loadingService.setDisplay(true);
    // apiCall.subscribe(() => {
    //   this.loadingService.setDisplay(false);
    //   this.refreshSearch();
    // }, () => {
    //   this.refreshSearch();
    // });
  }

  completePlanRx() {
    if (this.isSCC === this.rx) {
      console.log("ffff")
      this.eventBusService.emit({
        type: 'openCompletePlanRxModal',
        data: this.val
      });
    } 
  }

  cancelSuggest() {
    this.roWshopApi.cancelSuggest(this.val.roWshopsId
      , ![ProgressState.manualSuggest, ProgressState.autoSuggest, ProgressState.plan].includes(this.val.state)).subscribe(() => {
      const cancelCarBody = {
        id: this.val.roWshopsId,
        wshopId: this.val.wpId
      };
      // this.roWshopActApi.cancelCarWash(cancelCarBody).subscribe();
      this.refreshSearch();
    });
  }

  cancelAllSuggest() {
    console.log(this.val);
    this.roWshopApi.cancelAllSuggest([ProgressState.autoAppointment, ProgressState.autoSuggest, ProgressState.plan].includes(this.val.state) ? this.val.roId : this.val.appId
      , ![ProgressState.autoAppointment, ProgressState.autoSuggest, ProgressState.plan].includes(this.val.state)).subscribe(() => {
      this.refreshSearch();
    });
  }


  startDrag(event: MouseEvent) {
    this.ngZone.runOutsideAngular(() => {
      this.ngZone.run(() => {
        event.preventDefault();
        event.stopPropagation();
        this.isShowTooltip = undefined;
        // chuột trái
        if (event.button === 0) {
          this.isShowTooltip = false;
          this.showTime = true;
          this.initPositionData(event);
        }
        // chuột phải
        if (event.button === 2) {
          this.isShowContextMenu = true;
          this.contextMenuLeft = event.clientX - 2;
          this.contextMenuTop = event.clientY - 2;
        }
      });
    });

  }

  startResize(event: MouseEvent) {
    // this.ngZone.runOutsideAngular(() => {
    //   this.ngZone.run(() => {
    this.isShowTooltip = false;
    event.preventDefault();
    event.stopPropagation();
    this.isResize = true;
    this.initPositionData(event);
    // });
    // });
  }

  cdkDragEnded(event) {
    this.isShowTooltip = false;
    this.ngZone.runOutsideAngular(() => {
      this.ngZone.run(() => {
        const elem = event.source.element.nativeElement;
        if (this.isMouseOver) {
          // sau khi kéo thả nếu progress không nằm trọn trong 1 dòng thì phải set vào dòng gần nhất
          const topDifferent = elem.getBoundingClientRect().top - this.top;
          const indexDifferent = Math.round(topDifferent / this.areaHeight);

          const left = elem.getBoundingClientRect().left - this.minX;

          this.currentProgressElem.style.top = `${indexDifferent * (this.areaHeight + 1)}px`;
          this.currentProgressElem.style.transform = 'none';
          this.top = 0;
          this.mouseX = elem.getBoundingClientRect().left;
          this.mouseY = elem.getBoundingClientRect().top + this.heightProgressResize;
          // if (!(this.minX < this.mouseX && this.mouseX < this.maxX && this.minY < this.mouseY)) {
          //   this.swalAlert.openWarningToast('Chỉ được thao tác trong bảng tiến độ');
          //   this.refreshSearch();
          //   return;
          // }
          
          this.updatePlanAfterDrag(indexDifferent, left);
        }
      });
    });
  }


  initPositionData(event) {
    // lấy điểm giới hạn drag
    this.showMouseTime = true;
    const areas = document.querySelectorAll(this.isSCC === this.scc
      ? '.scc-progress-area' : this.isSCC === this.ds
        ? '.ds-progress-area' : this.isSCC === this.rx
          ? '.rx-progress-area' : this.isSCC === this.car
            ? '.car-progress-area' : '.wshop-progress-area');
    if (!areas || !areas.length) {
      return;
    }
    this.minX = areas[0].getBoundingClientRect().left;
    this.minY = document.querySelector(this.isSCC === this.scc ?
      '.scc-tbody' : this.isSCC === this.ds
        ? '.ds-tbody' : this.isSCC === this.rx
          ? '.rx-tbody' : this.isSCC === this.car
            ? '.car-tbody' : '.wshop-tbody').getBoundingClientRect().top;
    this.maxX = areas[areas.length - 1].getBoundingClientRect().right;
    this.maxY = this.minY + 410; // 410 là độ cao của bảng
    this.px = event.clientX;

    this.areaHeight = areas[0].getBoundingClientRect().height;
    this.currentProgressElem = this.elem.nativeElement
      .querySelector(this.isSCC === this.scc ? '.scc-tracking-progress'
        : this.isSCC === this.ds ? '.ds-tracking-progress'
          : this.isSCC === this.rx ? '.rx-tracking-progress'
            : this.isSCC === this.car ? '.car-tracking-progress'
              : '.wshop-tracking-progress') as HTMLElement;
    this.top = this.currentProgressElem.getBoundingClientRect().top;
  }

  updatePlanAfterResize(toTime) {
    const apiCall = this.isSCC === this.scc ?
      this.changePlanScc(toTime) :
      this.isSCC === this.ds ?
      this.changePlanDs(toTime) : this.changePlanRx(toTime);

    this.loadingService.setDisplay(true);
    apiCall.subscribe(() => {
      this.loadingService.setDisplay(false);
      this.refreshSearch();
    }, () => {
      this.refreshSearch();
    });
  }

  changePlanScc(toTime) {
    const fromTime = ([ProgressState.plan, ProgressState.autoAppointment, ProgressState.autoSuggest, ProgressState.manualSuggest, ProgressState.manualAppointment].includes(this.val.state)) ? this.val.fromDatetime : this.val.fromActDisplay;
    if (this.state != ProgressState.actual) {
      return this.roWshopApi.changePlanScc({
        fromDatetime: fromTime,
        toDatetime: toTime,
        wshopId: this.val.wshopId,
        id: this.val.roWshopsId,
        isStart: !([ProgressState.plan, ProgressState.autoAppointment, ProgressState.autoSuggest].includes(this.val.state)) ? 'Y' : 'N'
      }, this.val.isCarWash, this.val.isCusWait, this.val.isTakeParts, this.val.qcLevel);
    } else {
      return this.roWshopApi.changeActualScc({
        fromDatetime: fromTime,
        toDatetime: toTime,
        wshopId: this.val.wshopId,
        id: this.val.id,
        isStart: !([ProgressState.plan, ProgressState.autoAppointment, ProgressState.autoSuggest].includes(this.val.state)) ? 'Y' : 'N'
      });
    }
    
  }

  changePlanDs(toTime) {
    const fromTime = ([ProgressState.plan, ProgressState.autoAppointment, ProgressState.autoSuggest, ProgressState.manualSuggest, ProgressState.manualAppointment].includes(this.val.state)) ? this.val.fromDatetime : this.val.fromActDisplay;
    if (this.state != ProgressState.actual) {
      return this.roWshopApi.changePlanDs({
        fromDatetime: fromTime,
        toDatetime: toTime,
        wpId: this.val.wpId,
        bpGroupId: this.val.bpGroupId,
        id: this.val.roWshopsId,
      });
    } else {
      return this.roWshopApi.changeActualDs({
        fromDatetime: fromTime,
        toDatetime: toTime,
        wpId: this.val.wpId,
        bpGroupId: this.val.bpGroupId,
        wshopId: this.val.wshopId,
        id: this.val.id,
      });
    }
  }

  changePlanRx(toTime) {
    const fromTime = (this.val.state === 0) ? this.val.fromDatetime : this.val.fromActDisplay;
    return this.roWshopApi.changePlanRx({
      fromDatetime: fromTime,
      toDatetime: toTime,
      id: this.val.roWshopsId,
      wshopId: this.val.wshopId
    });
  }

  // dùng cho sau khi kéo thả
  updatePlanAfterDrag(idx, left) {
    this.showTime = false;
    // idx là sự thay đổi so với index gốc của dòng đó
    const area = this.isSCC === this.scc ?
      document.querySelector('.scc-tbody .progress-area') : this.isSCC === this.ds
        ? document.querySelector('.ds-tbody .progress-area') : document.querySelector('.rx-tbody .progress-area');
    if (area) {
      const areaWidth = area.getBoundingClientRect().width;

      const hourSpace = (this.currentProgressElem.parentNode.parentNode.offsetWidth / this.workTimes.length) / this.hourNumbers;
      const jobTime = (left > areaWidth ? left - areaWidth : left) / hourSpace;
      const minute = (jobTime % 1) * 60;
      const hour = jobTime - jobTime % 1;

      const workTimeIndex = Math.trunc(left / areaWidth);
      if (workTimeIndex > this.workTimes.length - 1) {
        this.refreshSearch();
        this.swalAlert.openWarningToast('Chỉ được thao tác trong bảng tiến độ');
        return;
      }
      const workTime = new Date(this.workTimes[workTimeIndex].dateSearch);
      const startTime = moment(new Date(`${workTime.getFullYear()}-${workTime.getMonth() + 1}-${workTime.getDate()} 00:00:00`))
        .add(hour + this.morningStart, 'hour').add(minute, 'minute');
      const progressAreaIndex = parseFloat(this.currentProgressElem.parentNode.parentNode.getAttribute('data-index'));
      const currentRow = this.rows[progressAreaIndex + idx]; // là ktv nếu đang ở ĐS, là khoang nếu đang ở SCC
      const apiCall = this.isSCC === this.scc ?
        this.updatePlanAfterDragInScc(currentRow, startTime) :
        this.isSCC === this.ds ?
          this.updatePlanAfterDragInDs(currentRow, startTime) : this.updatePlanAfterDragInRx(currentRow, startTime);

      this.loadingService.setDisplay(true);
      apiCall.subscribe(() => {
        this.loadingService.setDisplay(false);
        this.refreshSearch();
      }, () => {
        this.refreshSearch();
      });
    }
  }

  updatePlanAfterDragInScc(currentRow, startTime) {
    // if ([ProgressState.plan, ProgressState.autoAppointment, ProgressState.autoSuggest].includes(this.val.state)) {
      if (!(currentRow && currentRow.id)) {
        this.swalAlert.openWarningToast('Chỉ được thao tác trong bảng tiến độ');
        this.refreshSearch();
        return;
      }
      let diff = moment(new Date(this.val.fromDatetime), 'DD/MM/YYYY HH:mm:ss').diff(moment(new Date(this.val.toDatetime), 'DD/MM/YYYY HH:mm:ss'));

      let estimate = Math.floor(Math.abs(diff) / 60000);
      let estimate_now = this.estimateTime;
      if (this.state === ProgressState.actual) {
        estimate_now = this.getEstimateTime(this.val) / 60000;
      }
      if (estimate) estimate_now = estimate;
      if (this.state != ProgressState.actual) {
        return this.roWshopApi.changePlanScc({
          fromDatetime: startTime.valueOf(),
          toDatetime: estimate_now ? startTime.valueOf() + Number(estimate_now) * Times.minTimeStamp : startTime.valueOf(),
          id: this.val.roWshopsId,
          isStart: !([ProgressState.plan, ProgressState.autoAppointment, ProgressState.autoSuggest].includes(this.val.state)) ? 'Y' : 'N',
          wshopId: currentRow.id
        }, this.val.isCarWash, this.val.isCusWait, this.val.isTakeParts, this.val.qcLevel);
      } else {
        return this.roWshopApi.changeActualScc({
          fromDatetime: startTime.valueOf(),
          toDatetime: estimate_now ? startTime.valueOf() + Number(estimate_now) * Times.minTimeStamp : startTime.valueOf(),
          id: this.val.id,
          isStart: !([ProgressState.plan, ProgressState.autoAppointment, ProgressState.autoSuggest].includes(this.val.state)) ? 'Y' : 'N',
          wshopId: currentRow.id
        });
      }
    // } else {
    //   return this.roWshopActApi.changeStateJobScc({
    //     id: this.val.id,
    //     wshopActId: currentRow ? currentRow.id : null,
    //     state: ProgressState.actual
    //   }, this.val.isCarWash, this.val.isCusWait, this.val.isTakeParts, this.val.qcLevel);
    // }
  }

  updatePlanAfterDragInRx(currentRow, startTime) {
    return this.roWshopApi.changePlanRx({
      fromDatetime: startTime.valueOf(),
      id: this.val.roWshopsId,
      wshopId: currentRow ? currentRow.id : null
    });
  }

  updatePlanAfterDragInDs(currentRow, startTime) {
    if ([ProgressState.plan, ProgressState.autoSuggest].includes(this.val.state)) {
      return this.roWshopApi.changePlanDs({
          fromDatetime: startTime.valueOf(),
          toDatetime: this.estimateTime ? startTime.valueOf() + Number(this.estimateTime) * Times.minTimeStamp : startTime.valueOf(),
          wpId: this.val.wpId,
          bpGroupId: currentRow.id,
          id: this.val.roWshopsId
        });
    } else if(ProgressState.actual === this.val.state) {
      let estimate_now = Math.abs(this.getEstimateTime(this.val) / 60000);
      return this.roWshopApi.changeActualDs({
        fromDatetime: startTime.valueOf(),
        toDatetime: estimate_now ? startTime.valueOf() + Number(estimate_now) * Times.minTimeStamp : startTime.valueOf(),
        wpId: this.val.wpId,
        bpGroupId: currentRow ? currentRow.id : null,
        wshopId: this.val.wshopId,
        id: this.val.id,
      });
    } else {
      return this.roWshopActApi.changeStateJobDs({
        id: this.val.roWshopId,
        roWshopActId: this.val.id,
        state: this.val.state,
        empId: currentRow ? currentRow.id : null
      });
    }
  }

  private trackingResize(event, progressAreaNode) {
    this.isShowTooltip = undefined;
    const currentX = event.clientX;

    if (this.isResize && this.px) {
      if (this.px < currentX && currentX < (progressAreaNode.getBoundingClientRect().left + progressAreaNode.offsetWidth)) {
        this.width = this.width + (currentX - this.px);
        this.trackingProgress.nativeElement.style.width = this.width + 'px';
      }

      if (this.px > currentX) {
        this.width -= (this.px - currentX);
        this.trackingProgress.nativeElement.style.width = this.width + 'px';
      }
      this.px = currentX;
    }
  }

  private refreshSearch() {
    this.eventBusService.emit({
      type: 'searchProgress',
      progressType: this.isSCC === this.scc ? this.scc : this.isSCC === this.ds ? this.ds : this.isSCC === this.rx ? this.rx : this.isSCC === this.car ? this.car : this.wshop
    });
  }

  cancelCarWash() {
    const obj = {
      id: this.val.roWshopsId,
      wpId: this.val.wpId
    };
    this.roWshopActApi.cancelCarWash(obj).subscribe(() => {

    }, () => {
    }, () => this.refreshSearch());
  }

  freePlanRx() {
    const apiCall = this.roWshopActApi.freePlanRx(this.val.roWshopsId);
    apiCall.subscribe(() => {
      this.loadingService.setDisplay(false);
      this.refreshSearch();
    }, () => this.refreshSearch());
  }

  // @HostListener('document:mousedown', ['$event'])
  onMouseDown(event) {
    this.isShowTooltip = false;
    // this.ngZone.runOutsideAngular(() => {
    //   this.ngZone.run(() => {
    setTimeout(() => {
      if (!(this.cdr as ViewRef).destroyed) {
        this.cdr.detectChanges();
      }
    }, 100);
    // });
    // });

  }

  // @HostListener('document:mouseup', ['$event'])
  onMouseUp(event) {
    this.showMouseTime = false;
    // this.ngZone.runOutsideAngular(() => {
    //   this.ngZone.run(() => {
    if (this.isMouseOver && this.isResize && this.disable !== true) {
      this.updatePlanAfterResize(Math.round(this.endTimeDisplay));
    }

    this.isResize = false;
    this.isMouseOver = false;
    // });
    // });


  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event) {
    if (!this.disable_drag) {
      if (this.currentProgressElem) {

        // Khoảng cách từ thanh resize đến bên trái danh sách xe chờ
        if (!this.isResize) {
          this.leftWithMouseDown = this.currentProgressElem.getBoundingClientRect().left - this.minX;
          this.positionLeft = event.clientX;
          this.startTimeDisplay = this.getTimeOnMouseMove(this.leftWithMouseDown);
        }
        else {
          const mouseX = this.currentProgressElem.getBoundingClientRect().left + this.currentProgressElem.getBoundingClientRect().width;
          this.positionLeft = this.currentProgressElem.getBoundingClientRect().left + this.currentProgressElem.getBoundingClientRect().width;
          this.endTimeDisplay = this.getTimeOnMouseMove(mouseX - this.minX);
        }
        this.positionTop = event.clientY;
        this.cdr.detectChanges();
      }
    }
    
    
    this.isShowTooltip = false;
    // this.ngZone.runOutsideAngular(() => {
    //   this.ngZone.run(() => {
    if (this.disable === true || this.val.isStart === 'Y' || (this.state === ProgressState.plan && !!this.val.appId) || this.disableDragAndResize.includes(this.state) ||
      ((event.target as Element).className.indexOf('progress-area') < 0 && (event.target as Element).className.indexOf('tracking-progress') < 0
        && (event.target as Element).className.indexOf('register-no-progress') < 0)) {
      event.stopPropagation();
      return;
    }
    if (!this.currentProgressElem) {
      return;
    }

    const rowTop = this.currentProgressElem.getBoundingClientRect().top;
    if (rowTop <= event.clientY && event.clientY <= (rowTop + this.areaHeight + 1)) {
      this.isMouseOver = true;
      if (this.currentProgressElem.style.width.indexOf('%') > -1) {
        this.width = this.currentProgressElem.offsetWidth;
      }

      if (this.isSCC != this.rx) this.trackingResize(event, this.currentProgressElem.parentNode.parentNode);
    }
  }

  getTimeOnMouseMove(left) {
    const area = this.isSCC === this.scc ?
      document.querySelector('.scc-tbody .progress-area') : this.isSCC === this.ds
        ? document.querySelector('.ds-tbody .progress-area') : document.querySelector('.rx-tbody .progress-area');
    if (area) {
      const areaWidth = area.getBoundingClientRect().width;
      if (this.currentProgressElem) {
        const hourSpace = (this.currentProgressElem.parentNode.parentNode.offsetWidth / this.workTimes.length) / this.hourNumbers;
        const jobTime = (left > areaWidth ? left - areaWidth : left) / hourSpace;
        const minute = (jobTime % 1) * 60;
        const hour = jobTime - jobTime % 1;
  
        const workTimeIndex = Math.trunc(left / areaWidth);
        if (workTimeIndex > this.workTimes.length - 1) {
          this.refreshSearch();
          this.swalAlert.openWarningToast('Chỉ được thao tác trong bảng tiến độ');
          return;
        }
        const workTime = new Date(this.workTimes[workTimeIndex].dateSearch);
        let startTime = moment(new Date(`${workTime.getFullYear()}-${workTime.getMonth() + 1}-${workTime.getDate()} 00:00:00`))
          .add(hour + this.morningStart, 'hour').add(minute, 'minute');
        // console.log(new Date(startTime.valueOf()))
        return startTime.valueOf();
      } else return null;
     
    }
  }

  // );
  // });
// }

  getEstimateTime(item) {
    let diff = 0;
    if (item.toActDisplay) {
      diff = moment(new Date(item.fromActDisplay), 'DD/MM/YYYY HH:mm:ss').diff(moment(new Date(item.toActDisplay), 'DD/MM/YYYY HH:mm:ss'));
    } else if (item.toDisplay) {
      if (item.toDisplay > new Date().getTime()) {
        diff = moment(new Date(item.fromActDisplay), 'DD/MM/YYYY HH:mm:ss').diff(moment(new Date(item.toDisplay), 'DD/MM/YYYY HH:mm:ss'));
      }
      if (item.toDisplay <= new Date().getTime()) {
        diff = moment(new Date(item.fromActDisplay), 'DD/MM/YYYY HH:mm:ss').diff(moment(new Date(), 'DD/MM/YYYY HH:mm:ss'));
      }
    }
    return diff;
  }

  openRepairPlanScc(planId, actualId) {
    this.eventBusService.emit({
      type: 'openRepairPlanModal',
      wpId: this.val.wpId,
      state: this.state,
      completeWorking: true,
      id: this.val.roWshopsId,
      planId: planId,
      actualId: actualId
    });
  }
}
