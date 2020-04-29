import {AfterViewInit, ChangeDetectorRef, Component, ComponentRef, ElementRef, Input, NgZone, OnChanges, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ProgressTrackingService} from '../../../shared/common-service/progress-tracking.service';
import {forkJoin, Subscription} from 'rxjs';
import {DragulaService} from 'ng2-dragula';
import {DlrConfigApi} from '../../../api/common-api/dlr-config.api';
import {LoadingService} from '../../../shared/loading/loading.service';
import {EmpCalendarApi} from '../../../api/emp-calendar/emp-calendar.api';
import {RoWshopApi} from '../../../api/ro-wshop/ro-wshop.api';
import {ProgressVehicleModel} from '../../../core/models/advisor/progress-vehicle.model';
import {ShopCommonApi} from '../../../api/common-api/shop-common.api';
import {TechWshopApi} from '../../../api/tech-wshop/tech-wshop.api';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {EventBusService} from '../../../shared/common-service/event-bus.service';
import * as moment from 'moment';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {ProgressState, ProgressViewType, StateCount, RoType} from '../../../core/constains/progress-state';
import {CommonService} from '../../../shared/common-service/common.service';
import {ResizeableProgressComponent} from '../../../shared/resizeable-progress/resizeable-progress.component';
import {RoWshopActApi} from '../../../api/ro-wshop/ro-wshop-act.api';
import {ContextMenuComponent} from 'ngx-contextmenu';
import {Times} from '../../../core/constains/times';
import {EmployeeCommonApi} from '../../../api/common-api/employee-common.api';
import {DomSanitizer} from '@angular/platform-browser';
import { GlobalValidator } from '../../../shared/form-validation/validators';
import { HostListener} from '@angular/core';


import {extendMoment} from 'moment-range';
import * as $ from 'jquery';
import { element } from 'protractor';

export enum KEY_CODE {
  F11 = 122,
  F12 = 123
}

const momentRange = extendMoment(moment);

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'general-repair-progress',
  templateUrl: './general-repair-progress.component.html',
  styleUrls: ['./general-repair-progress.component.scss']
})
export class GeneralRepairProgressComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @ViewChild('repairPlanModal', {static: false}) repairPlanModal;
  @ViewChild('stoppedPlanModal', {static: false}) stoppedPlanModal;
  @ViewChild('pendingPlanModal', {static: false}) pendingPlanModal;
  @ViewChild('upcomingCollisionModal', {static: false}) upcomingCollisionModal;
  @ViewChild('continuePlanModal', {static: false}) continuePlanModal;
  PendingPlanModalComponent
  @ViewChild(ContextMenuComponent, {static: false}) public basicMenu: ContextMenuComponent;
  @Input() dataProgress;
  form: FormGroup;
  rowIndex: number;
  selectedData;
  progressOverflowHeight: number;
  waitingVehicleElem; // dùng cho tooltip
  pendingVehicleElem; // dùng cho tooltip
  ref: ComponentRef<ResizeableProgressComponent>;
  workTimes: Array<any> = [];
  columns: Array<any> = [];
  vehicleChoosing: ProgressVehicleModel;
  waitingVehicles;
  pendingVehicles: Array<any> = [];
  notWorkingEmps: Array<any> = [];
  planData;
  arrayVehiclesSearch;
  stateCount: Array<{ status: StateCount, count: number }> = [];
  positionMin;
  currentSearchKeyword: string;
  submitSearch = false;
  // currentSearchIndex = 0;
  registerNoSearch: Array<Element> = [];
  registerNoWait: Array<Element> = [];
  showMouseTime = false;
  // khoang
  shops: Array<any> = [];

  // danh sách job
  list: Array<any> = [];
  scc = 'scc';
  subs = new Subscription();
  currentScroll: string; // đánh dấu đang scroll progress-area hay body-content
  interval;
  // intervalReload;
  // intervalRel;
  ProgressState = ProgressState;
  StateCount = StateCount;
  ProgessViewType = ProgressViewType;
  viewType = ProgressViewType.hour;
  timeReload = 2;
  listTimeReload = [1, 2, 5, 10];
  // for tracking line
  offsetLeft = 0;
  delayVehicles = 0;
  delayPlanVehicles = 0;
  top;
  minX;
  maxX;
  rows;
  mouseX;
  timeMouseX;
  workTimeBySearch;
  constVehicleWaitWithMouseDown;
  elemBody;
  positionTop;
  positionLeft;
  timeMouseXDisplay;
  viewCompleteCar = false;

  constructor(
    private sanitizer: DomSanitizer,
    private dragulaService: DragulaService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private dataFormatService: DataFormatService,
    private dlrConfigApi: DlrConfigApi,
    private swalAlert: ToastService,
    private shopApi: ShopCommonApi,
    private eventBusService: EventBusService,
    private techWshopApi: TechWshopApi,
    private empCalendarApi: EmpCalendarApi,
    private progressTrackingService: ProgressTrackingService,
    private roWshopApi: RoWshopApi,
    private loadingService: LoadingService,
    private commonService: CommonService,
    private elem: ElementRef,
    private roWshopActApi: RoWshopActApi,
    private ngZone: NgZone,
    private employeeCommonApi: EmployeeCommonApi,
  ) {
  }

  ngOnChanges(): void {
  }

  ngOnInit() {
    this.buildSearchForm();
    this.getData();
    this.triggerMoveEmp();
    this.createSub();
    this.elem.nativeElement.addEventListener('mousedown', (event) => {
      this.onMouseDown(event);
    });
    this.elem.nativeElement.addEventListener('mouseup', (event) => {
      this.showMouseTime = false;
      this.onMouseUp(event);
    });
    // this.intervalReload = setInterval(() => {
    //   this.refreshSearch();
    // }, this.timeReload * 60000);
  }

  ngOnDestroy() {
    this.elem.nativeElement.removeEventListener('mousedown', (event) => {
      this.onMouseDown(event);
    });
    this.elem.nativeElement.removeEventListener('mouseup', (event) => {
      this.onMouseUp(event);
    });
    this.progressTrackingService.destroyComponent(this.scc);
    this.destroy();
    // clearInterval(this.intervalReload);
    // clearInterval(this.intervalRel);
  }

  createSub() {
    this.subs.add(this.dragulaService.drop('scc-waiting-vehicle-bag').subscribe(({name, el, target, source, sibling}) => {
      if (target.className === 'scc-progress-area') {
        const elem = el as HTMLElement;
        const trg = target as HTMLElement;
        elem.style.display = 'none';
        // this.repairPlanModal.open(el.id, ProgressState.plan, true, Number(trg.dataset.shopid));
        const data = this.waitingVehicles.find(it => Number(it.wpId) === Number(el.id));
        setTimeout(() => {
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.workTimeBySearch.length; i++) {
            if (this.timeMouseX && this.timeMouseX >= this.workTimeBySearch[i].wkAmTo
              && this.timeMouseX <= this.workTimeBySearch[i].wkPmFrom) {
              this.swalAlert.openWarningToast('Bạn không thể lên kế hoạch trong giờ nghỉ', 'Cảnh báo');
              this.refreshSearch();
              return;
            }
          }
          const obj = {
            fromDatetime: Math.round(this.timeMouseX),
            toDatetime: Math.round(this.timeMouseX + Number(data.estimateTime) * Times.minTimeStamp),
            wpId: data.id,
            wshopId: trg.dataset.shopid
          };
          this.roWshopActApi.activePlanScc(obj, data.isCarWash, data.isCusWait, data.isTakeParts, data.qcLevel).subscribe(() => {
            this.refreshSearch();
          }, () => {
            this.refreshSearch();
          });
        }, 150);
      }
    }));
    this.subs.add(this.dragulaService.drop('pending-vehicle-bag').subscribe(({name, el, target, source, sibling}) => {
      if (target.className.indexOf('scc-td') > -1) {
        const elem = el as HTMLElement;
        const trg = target as HTMLElement;
        elem.style.display = 'none';
        if (!trg.dataset.shopid) {
          this.swalAlert.openWarningToast('Không tồn tại Khoang đã chọn');
          this.refreshSearch();
          return;
        }
        // this.repairPlanModal.open(el.id, ProgressState.stopOutside, true, Number(trg.dataset.shopid));
        const data = this.pendingVehicles.find(it => Number(it.wpId) === Number(el.id) && it.state === 3);
        if (!data) {
          this.refreshSearch();
          return;
        }
        // this.roWshopApi.getRepairPlan(data.wpId).subscribe(res => {
        this.loadingService.setDisplay(false);
        const obj = {
          id: data.roWshopsId,
          state: 1,
          wshopActId: trg.dataset.shopid
        };
        this.roWshopActApi.changeStateJobScc(obj).subscribe(resp => {
          this.refreshSearch();
        }, () => {
          this.refreshSearch();
        });
        // });
      }
    }));
    this.subs.add(this.eventBusService.on('searchProgress').subscribe(val => {
      if (val.progressType === 'scc') {
        this.refreshSearch();
      }
    }));
  }

  destroy() {
    clearInterval(this.interval);
    this.dragulaService.destroy('general-repair-employee');
    this.dragulaService.destroy('scc-waiting-vehicle-bag');
    this.dragulaService.destroy('pending-vehicle-bag');
    this.subs.unsubscribe();
    this.progressTrackingService.destroyComponent(true);
  }

  ngAfterViewInit() {
    if (this.elem) {
      setTimeout(() => {
        const elem = this.elem.nativeElement.querySelector('.body-content');
        // cộng 52 vì là độ cao của header
        const heightHeader = 52;
        this.progressOverflowHeight = elem ? elem.getBoundingClientRect().height + heightHeader : 0;
      }, 50);
    }
    this.cdr.detectChanges();

    this.elemBody = this.elem.nativeElement.querySelector('.progress-area-body');
    if (this.elemBody) {
      this.elemBody.addEventListener('mousemove', (event) => {
        // this.onMouseDown(event);
        this.onMouseMove(event);
        const mainContent = document.querySelector('.main-content');
        if (!mainContent) {
          return;
        }
        const mainContentLeft = mainContent.getBoundingClientRect().left;
        this.positionTop = event.clientY;
        this.positionLeft = event.clientX - mainContentLeft - 75;
      });
    }
    // this.intervalRel = setInterval(() => {
    //   this.cdr.detectChanges();
    // }, this.timeReload * 60000);
  }

  getData(isClearInterval?) {
    if (!moment(this.form.value.toDateTime).isSameOrAfter(this.form.value.fromDateTime, 'day')) {
      this.swalAlert.openWarningToast('Từ ngày không được lớn hơn Đến ngày');
      this.loadingService.setDisplay(false);
      return;
    }
    this.loadingService.setDisplay(true);
    forkJoin([
      this.empCalendarApi.getNotWorkEmployee(),
      this.roWshopApi.getRoNoPlan(this.form.value),
      this.shopApi.getAllSccShop(),
      this.techWshopApi.getTechWshopByDlr(RoType.SCC)
    ]).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.notWorkingEmps = res[0] || [];
      this.waitingVehicles = res[1] || [];

      this.shops = res[2].map(shop => {
        return {
          ...shop, ...{
            emps: res[3] && res[3].length ? res[3].filter(item => item && item.wshopId === shop.id) : []
          }
        };
      });

      if (this.shops.length) {
        this.getCurrentWorkTime(isClearInterval);
        this.shops.forEach(it => {
          if (it.emps && it.emps.length > 0) {
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < it.emps.length; i++) {
              it.emps[i].empNameAcronym = (it.emps[i].empName).replace(/[^A-ZĐĂÂÍ]/g, '');
              let url = '';
              this.employeeCommonApi.getImg(it.emps[i].empId).subscribe(val => {
                url = val && val.img_content ? this.sanitizer.bypassSecurityTrustResourceUrl('data:image/PNG;base64,' + val.img_content) as string : '';
              }, () => url = '', () => it.emps[i].url = url);
            }
          }
        });
      }
    });
  }

  getCurrentWorkTime(isClearInterval?) {
    this.dlrConfigApi.getCurrentWorkTime(this.form.value).subscribe(workTimes => {
      if (workTimes) {
        this.workTimes = workTimes;
        this.columns = this.progressTrackingService.countColumnsWithHourView(workTimes);
        this.progressTrackingService.generateBreaktime(workTimes, this.elem.nativeElement.querySelectorAll('.scc-td'), this.scc);
        if (isClearInterval) {
          clearInterval(this.interval);
        }
        this.initInterval(workTimes);
        this.search();
      }
    });
  }

  onScroll(event, className) {
    if (this.currentScroll !== className) {
      const elem = this.elem.nativeElement.querySelector(`.${className}`);
      if (elem) {
        elem.scrollTop = event.target.scrollTop;
      }
    }
  }

  searchByRegisterNo(keyword) {
    let none_result = true;
    this.arrayVehiclesSearch = [];
    this.registerNoSearch = [];
    const elems = document.querySelectorAll('.scc-register-no-progress');
    const focusVehicleElem = document.querySelectorAll('.scc-focus-vehicle');
    
    const elems_wait = document.querySelectorAll('.vehicle-waiting-scc');
    if (focusVehicleElem) {
      focusVehicleElem.forEach(it => it.classList.remove('scc-focus-vehicle'));
    }
    if (!keyword || keyword.trim().length === 0) {
      return;
    }
    // if (!this.currentSearchKeyword || this.currentSearchKeyword !== keyword) {
    //   this.currentSearchIndex = 0
    // }
    this.currentSearchKeyword = keyword;
    if (elems && elems.length) {
      elems.forEach(elem => {
        let registernos = elem.innerHTML.toLowerCase().match(/(?<=(<!---->))(\w|\d|\n|[().,\-:;@#$%^&*\[\]"'+–/\/®°⁰!?{}|`~]| )+?(?=(<!--))/g);
        let registerno_name =  "";
        registernos.forEach(registerno => {
          registerno_name += registerno;
        });
        if (registerno_name.toLowerCase().indexOf(keyword.trim().toLowerCase()) > -1) {
          this.registerNoSearch.push(elem);
          none_result = false;
        }
      });

      // const focusVehicleElem = document.querySelectorAll('.scc-focus-vehicle')
      // if (focusVehicleElem) {
      //   focusVehicleElem.forEach(it => it.classList.remove('scc-focus-vehicle'))
      // }

      if (this.registerNoSearch.length) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.registerNoSearch.length; i++) {
          this.registerNoSearch[i].scrollIntoView(false);
          this.registerNoSearch[i].parentElement.classList.add('scc-focus-vehicle');
        }

      }
    }
    // this.currentSearchIndex = this.currentSearchIndex + 1 >= this.registerNoSearch.length ? 0 : this.currentSearchIndex + 1
    for (let i = 0; i < this.waitingVehicles.length; i++) {
      if ((this.waitingVehicles[i].registerno.toLowerCase()).indexOf(keyword.trim().toLowerCase()) > -1) {
        none_result = false;
        elems_wait[i].scrollIntoView(false);
        this.arrayVehiclesSearch.push(this.waitingVehicles[i].registerno);
      }
    }

    if (none_result) this.swalAlert.openWarningToast("Không tìm thấy xe này!")

  }

  showCompleteCar() {
    const elems = document.querySelectorAll('.scc-tracking-progress');
    if (elems && elems.length) {
      elems.forEach(elem => {
        if (elem.className.indexOf("performed-vehicle") > -1 || elem.className.indexOf("complete-vehicle") > -1 || elem.className.indexOf("hide-stopinside") > -1) {
          if (!this.viewCompleteCar) elem.classList.add('hide');
          else elem.classList.remove('hide');
        }
      });
    }
  }

  displayTooltip(vehicle, type) {
    this.vehicleChoosing = vehicle;
    this[type] = vehicle ? this.elem.nativeElement.querySelector(`div[id='${vehicle.id}']`) : null;
  }

  changeViewType(viewType: ProgressViewType) {
    this.viewType = viewType;
    this.columns = viewType === ProgressViewType.hour ?
      this.progressTrackingService.countColumnsWithHourView(this.workTimes)
      : this.progressTrackingService.countColumnsWithMinuteView(this.workTimes);
  }

  refreshRoNoPlanList() {
    this.roWshopApi.getRoNoPlan(this.form.value).subscribe(val => {
      this.waitingVehicles = val || [];
      this.loadingService.setDisplay(false);
    });
  }

  refreshSearch() {
    this.submitSearch = true;
    if (this.form.invalid) {
      console.log(this.form.errors)
    }
    if (!this.form.value.fromDateTime || !this.form.value.toDateTime) {
      return;
    }

    this.getData(true);
  }

  // getStateCount(state, appId?) {
  //   if (appId) {
  //     return this.planData && this.planData.length ? this.planData.filter(item => item && item.state === state && item.appId).length : 0;
  //   }
  //   const found = this.stateCount.find(item => item && item.status === state);
  //   return found ? Number(found.count) : 0;
  // }

  getTotalStateCar(status) {
    const found = this.stateCount.find(item => item && item.status === status);
    return found ? Number(found.count) : 0;
  }

  search(isLoading?) {
    if (isLoading) {
      this.loadingService.setDisplay(true);
    }

    this.dlrConfigApi.getWorkTime(this.form.value).subscribe(res => {
      this.workTimeBySearch = res;
    });

    this.roWshopApi.searchRoScc(this.form.value).subscribe(res => {
      this.loadingService.setDisplay(false);
      const list = res.data.concat(res.planData); //state = 1
      this.planData = (res.planData); //state != 1
      this.stateCount = res.stateCount;
      if(res.collisionData && res.collisionData.length > 0) {
        this.upcomingCollisionModal.open(res.collisionData);
      }
      // xóa elems cũ sau khi refresh
      const progressElems = this.elem.nativeElement.querySelectorAll('resizeable-progress');
      if (progressElems && progressElems.length) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < progressElems.length; i++) {
          progressElems[i].parentNode.removeChild(progressElems[i]);
        }
      }
      let pendingVehicle_temp = [];
      for (let i = 0; i < list.length; i++) {
        if (list[i].state === 3) {
          pendingVehicle_temp.push(list[i]);
        }
      }
      this.pendingVehicles = pendingVehicle_temp;
      if (list && list.length) {
        const result = list.map(item => {
          return {
            ...item, ...{index: this.shops.findIndex(shop => shop.id === item.wshopId)}
          };
        });
        let temp_shop = this.shops;
        // temp_shop = this.shops.map(shop => {
        //   return {
        //     ...shop, ...{
        //       cars_wshop: result && result.length ? result.filter(item => shop.id === item.wshopId) : []
        //     }
        //   };
        // });
        for (let i = 0; i < this.shops.length; i++) {
          let cars_in_wshop = [];
          for (let j = 0; j < result.length; j++) {
            if (this.shops[i].id === result[j].wshopId) {
              cars_in_wshop.push(result[j])
            }
          }
          this.shops[i].cars_in_wshop = cars_in_wshop;
        }
        const dateRange = momentRange.range(new Date(this.form.value.fromDateTime), new Date(this.form.value.toDateTime)).snapTo('day');

        const days = Array.from(dateRange.by('days'));

        // Danh sách các ngày trải qua của CV
        const arrDaySearch = days.map(m => Number(m.format('DD')));
        result.map(it => {
          it.arrDaySearch = arrDaySearch;
          return it;
        });
        this.list = result;
        this.rows = this.shops;
        this.progressTrackingService.generatePlan(result, this.workTimes, this.shops, this.scc);
        setTimeout(() => {
          this.showCompleteCar();
        }, 1000);
        if (this.dataProgress && this.dataProgress.registerNo) {
          setTimeout(() => {
            this.searchByRegisterNo(this.dataProgress.registerNo);
            this.dataProgress = undefined;
          }, 1000);
        } else {
          this.searchByRegisterNo('');
        }
      }
    });

    // this.roWshopApi.pendingOutScc(this.form.value).subscribe(res => {
    //   this.pendingVehicles = res;
    //   console.log(this.pendingVehicles[0])
    // });
  }

  private initInterval(workTimes) {
    let todayWorktime;
    let workTimeIndex;

    workTimes.find((time, idx) => {
      if (moment(new Date(time.dateSearch)).format('DD/MM/YYYY') === moment(new Date()).format('DD/MM/YYYY')) {
        todayWorktime = time;
        workTimeIndex = idx;
      }
    });

    if (todayWorktime) {
      const start = new Date(todayWorktime.wkAmFrom).getHours();
      const end = new Date(todayWorktime.wkPmTo).getHours();
      setTimeout(() => {
        if (new Date().getHours() >= start && new Date().getHours() < end) {
          // có workTimeIndex vì có thể ngày hiện tại sau khi search không phải ở vị trí đầu tiên
          this.offsetLeft = workTimeIndex * 100 + this.progressTrackingService.calculateSkipTimes(new Date(), start, end - start);
          this.delayVehicles = this.progressTrackingService.autoIncreaseActualJobWidth(this.list, this.scc).totalActualLate;
          this.delayPlanVehicles = this.progressTrackingService.autoIncreaseActualJobWidth(this.list, this.scc).totalPlanLate;
        }
      }, 1000);
      this.interval = setInterval(() => {
        if (new Date().getHours() >= start && new Date().getHours() < end) {
          // có workTimeIndex vì có thể ngày hiện tại sau khi search không phải ở vị trí đầu tiên
          this.delayVehicles = this.progressTrackingService.autoIncreaseActualJobWidth(this.list, this.scc).totalActualLate;
          this.delayPlanVehicles = this.progressTrackingService.autoIncreaseActualJobWidth(this.list, this.scc).totalPlanLate;
        }
      }, 1000);
    } else {
      this.offsetLeft = 0;
      clearInterval(this.interval);
    }
  }

  // action khi move KTV sang khoang khác hoặc move ra danh sách nghỉ
  private triggerMoveEmp() {
    this.subs.add(this.dragulaService.drop('general-repair-employee').subscribe(({name, el, target, source, sibling}) => {
      if (source.id === target.id) {
        return;

      }
      const elem = el as HTMLElement;
      // SPAN là ở list danh sách KTV, DIV là ở list KTV
      if (target.nodeName === 'SPAN') {
        elem.style.display = 'none';
      }

      const data = {
        id: el.id,
        empId: elem.dataset.empid,
        wshopInId: source.nodeName === 'DIV' && target.nodeName === 'SPAN' ? null : this.shops[target.id].id,
        wshopOutId: source.nodeName === 'SPAN' && target.nodeName === 'DIV' ? null : this.shops[source.id].id
      };

      this.loadingService.setDisplay(true);
      if (source.nodeName === 'DIV') {
        if (target.nodeName === 'DIV') {
          this.techWshopApi.changeWshop(data).subscribe(() => {
            this.loadingService.setDisplay(false);
          });
        }
        if (target.nodeName === 'SPAN') {
          this.empCalendarApi.insertNotWorkEmp(data).subscribe(() => {
            this.empCalendarApi.getNotWorkEmployee().subscribe(notWorkingEmps => {
              this.notWorkingEmps = notWorkingEmps;
              this.loadingService.setDisplay(false);
            });
          });
        }
      }

      if (source.nodeName === 'SPAN') {
        if (target.nodeName === 'DIV') {
          this.empCalendarApi.updateEmpNotWork(data).subscribe(() => {
            forkJoin([
              this.shopApi.getAllSccShop(),
              this.techWshopApi.getTechWshopByDlr(RoType.SCC)
            ]).subscribe(res => {
              this.shops = res[0].map(shop => {
                return {
                  ...shop, ...{
                    emps: res[1] && res[1].length ? res[1].filter(item => item.wshopId === shop.id) : []
                  }
                };
              });
              if (this.shops.length) {
                this.getCurrentWorkTime(true);
              }
            });
          });
        }
      }
    }));
  }

  private buildSearchForm() {
    this.form = this.formBuilder.group({
      fromDateTime: [this.dataFormatService.formatDate(this.commonService.getStartOfDay()), GlobalValidator.required],
      toDateTime: [this.dataProgress ? this.dataProgress.toDate : this.dataFormatService.formatDate(this.commonService.getEndOfDay()), GlobalValidator.required],
      keyword: [null],
      viewCompleteCar: false,
    },{
      validator: this.compareTime()
    });
  }

  compareTime() {
    return (group: FormGroup) => {
      const toDateTime = group.get('toDateTime');
      const fromDateTime = group.get('fromDateTime');
      if (toDateTime && toDateTime.value && fromDateTime && fromDateTime.value && 
        new Date(toDateTime.value).setHours(0, 0, 0, 0) < new Date(fromDateTime.value).setHours(0, 0, 0, 0)) {
        return {compareTime: true};
      }
      return null;
    };
  }


  cancelSuggest(item) {
    if (item.state === 5) {
      this.swalAlert.openFailToast('Chỉ được hủy xe manual báo giá và phiếu hẹn');
      return;
    }
    this.roWshopApi.cancelAllSuggest([ProgressState.manualSuggest, ProgressState.autoSuggest].includes(item.state) ? item.roId : item.appId
      , ![ProgressState.manualSuggest, ProgressState.autoSuggest].includes(item.state)).subscribe(() => {
      this.refreshSearch();
    });
  }

  // @HostListener('document:mouseup', ['$event'])
  onMouseUp(event, mouseMove?) {
    // Toạ độ điểm thả chuột
    const areas = document.querySelectorAll('.scc-left');
    const col132 = document.querySelector('.scc-right');
    if (!areas || !areas.length || !col132) {
      return;
    }
    this.minX = areas[0].getBoundingClientRect().left;
    this.maxX = col132.getBoundingClientRect().left;
    if (this.workTimeBySearch) {
      const arr = document.querySelectorAll('.scc-progress-area');
      if (!arr) {
        return;
      }
      this.mouseX = event.x;
      // Vị trí min của bảng tiến độ tính từ bên trái
      this.positionMin = arr[0].getBoundingClientRect().left;

      if (!!mouseMove) {
        this.constVehicleWaitWithMouseDown = 0;
      }
      // Vị trí của chuột theo bảng tiến độ tính từ bên trái
      const positionMouse = -this.positionMin + this.mouseX - this.constVehicleWaitWithMouseDown;

      // Tính width của 1 ngày
      const widthDay = this.maxX - this.minX;

      // Vị trí chuột nằm trong mốc thời gian của ngày nào (index - 1)
      const positionIndex = Math.floor(positionMouse / widthDay);

      // Tính thời gian thả chuột
      if (positionIndex === 0) {
        this.timeMouseX = (positionMouse / widthDay) * (this.workTimeBySearch[0].toDate - this.workTimeBySearch[0].fromDate) + this.workTimeBySearch[0].fromDate;
        return;
      }
      if (positionIndex > 0 && this.workTimeBySearch.length > positionIndex) {
        this.timeMouseX = (positionMouse - widthDay * (positionIndex)) / widthDay
          * (this.workTimeBySearch[positionIndex].toDate - this.workTimeBySearch[positionIndex].fromDate) + this.workTimeBySearch[positionIndex].fromDate;
        return;
      }
    }
  }
  
  getCarActual(cars) {
    if (cars && cars.length) {
      for (let i = 0; i < cars.length; i++) {
        if ([ProgressState.actual, ProgressState.stopInside].includes(cars[i].state) && !cars[i].toTimeAct) return cars[i].registerno;
      }
    } else return "";
    
  }

  // @HostListener('document:mousedown', ['$event'])
  onMouseDown(event) {
    let el;
    if (event.target.className.indexOf('vehicle-pending-scc') > -1) {
      el = document.querySelectorAll('.vehicle-pending-scc');
    } else if (event.target.className.indexOf('vehicle-waiting-scc') > -1) {
      el = document.querySelectorAll('.scc-waiting-vehicle');
    }
    if (!el || !el.length) {
      return;
    }
    this.showMouseTime = true;
    // Tọa độ danh sách xe chờ đến bên trái màn hình
    const vehicleWaitX = el[0].getBoundingClientRect().left;
    // Khoảng cách từ chuột đến bên trái danh sách xe chờ
    this.constVehicleWaitWithMouseDown = event.x - vehicleWaitX;
  }

  onMouseMove(event, mouseMove?) {
    // Toạ độ điểm thả chuột
    const areas = document.querySelectorAll('.scc-left');
    const col132 = document.querySelector('.scc-right');
    if (!areas || !areas.length || !col132) {
      return;
    }
    this.minX = areas[0].getBoundingClientRect().left;
    this.maxX = col132.getBoundingClientRect().left;
    if (this.workTimeBySearch) {
      const arr = document.querySelectorAll('.scc-progress-area');
      if (!arr) {
        return;
      }
      this.mouseX = event.x;
      // Vị trí min của bảng tiến độ tính từ bên trái
      this.positionMin = arr[0].getBoundingClientRect().left;

      if (!!mouseMove) {
        this.constVehicleWaitWithMouseDown = 0;
      }
      // Vị trí của chuột theo bảng tiến độ tính từ bên trái
      const positionMouse = -this.positionMin + this.mouseX - this.constVehicleWaitWithMouseDown;

      // Tính width của 1 ngày
      const widthDay = this.maxX - this.minX;

      // Vị trí chuột nằm trong mốc thời gian của ngày nào (index - 1)
      const positionIndex = Math.floor(positionMouse / widthDay);

      // Tính thời gian thả chuột
      if (positionIndex === 0) {
        this.timeMouseXDisplay = (positionMouse / widthDay) * (this.workTimeBySearch[0].toDate - this.workTimeBySearch[0].fromDate) + this.workTimeBySearch[0].fromDate;
        return;
      }
      if (positionIndex > 0 && this.workTimeBySearch.length > positionIndex) {
        this.timeMouseXDisplay = (positionMouse - widthDay * (positionIndex)) / widthDay
          * (this.workTimeBySearch[positionIndex].toDate - this.workTimeBySearch[positionIndex].fromDate) + this.workTimeBySearch[positionIndex].fromDate;
        return;
      }
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.F11) {
      this.ngAfterViewInit();
    }

    if (event.keyCode === KEY_CODE.F12) {
      this.ngAfterViewInit();
    }
  }
}
