import {AfterViewInit, ChangeDetectorRef, Component, ComponentRef, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
import {FormBuilder, FormGroup} from '@angular/forms';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {EventBusService} from '../../../shared/common-service/event-bus.service';
import * as moment from 'moment';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {ProgressState, ProgressViewType, RxStateCount, RoType} from '../../../core/constains/progress-state';
import {CommonService} from '../../../shared/common-service/common.service';
import {ResizeableProgressComponent} from '../../../shared/resizeable-progress/resizeable-progress.component';
import {RoWshopActApi} from '../../../api/ro-wshop/ro-wshop-act.api';
import {ContextMenuComponent} from 'ngx-contextmenu';
import {Times} from '../../../core/constains/times';
import {extendMoment} from 'moment-range';

const momentRange = extendMoment(moment);
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'car-wash-progress',
  templateUrl: './car-wash-progress.component.html',
  styleUrls: ['./car-wash-progress.component.scss']
})
export class CarWashProgressComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('repairPlanModal', {static: false}) repairPlanModal;
  @ViewChild(ContextMenuComponent, {static: false}) public basicMenu: ContextMenuComponent;
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
  waitingVehicles: Array<ProgressVehicleModel> = [];
  pendingVehicles: Array<any> = [];
  notWorkingEmps: Array<any> = [];
  rx = 'rx';
  arrayVehiclesSearch;
  stateCount: Array<{ status: RxStateCount, count: number }> = [];
  showMouseTime = false;
  elemBody;
  positionTop;
  positionLeft;

  currentSearchKeyword: string;
  // currentSearchIndex = 0;
  registerNoSearch: Array<Element> = [];
  now = new Date().getTime();
  // khoang
  shops: Array<any> = [];

  // danh sách job
  list: Array<any> = [];

  subs = new Subscription();
  currentScroll: string; // đánh dấu đang scroll progress-area hay body-content
  interval;
  // intervalReload;
  // intervalRel;
  ProgressState = ProgressState;
  RxStateCount = RxStateCount;
  ProgessViewType = ProgressViewType;
  viewType = ProgressViewType.hour;
  timeReload = 1;
  listTimeReload = [1, 2, 5, 10];
  // for tracking line
  offsetLeft = 0;
  delayVehicles = 0;
  delayVehicleWait = 0;
  delayPlanVehicles = 0;
  top;
  minX;
  minY;
  maxY;
  maxX;
  rows;
  mouseX;
  timeMouseX;
  timeMouseXDisplay;
  workTimeBySearch;
  constVehicleWaitWithMouseDown;
  viewCompleteCar = false;
  @ViewChild('completePlanModal', { static: false }) completePlanModal;

  constructor(
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
    private roWshopActApi: RoWshopActApi
  ) {
  }

  ngOnInit() {
    this.buildSearchForm();
    this.getData();
    this.triggerMoveEmp();
    this.createSub();
    this.elem.nativeElement.addEventListener('mousedown', (event) => {
      this.showMouseTime = true;
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
    this.progressTrackingService.destroyComponent(this.rx);
    this.destroy();
    // clearInterval(this.intervalReload);
    // clearInterval(this.intervalRel)
  }

  createSub() {
    this.subs.add(this.dragulaService.drop('rx-waiting-vehicle-bag').subscribe(({name, el, target, source, sibling}) => {
      if (target.className === 'rx-progress-area') {
        const elem = el as HTMLElement;
        const trg = target as HTMLElement;
        elem.style.display = 'none';
        // this.repairPlanModal.open(el.id, ProgressState.plan, true, Number(trg.dataset.shopid));
        const data = this.waitingVehicles.find(it => Number(it.wpId) === Number(el.id));
        setTimeout(() => {
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.workTimeBySearch[i].length; i++) {
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
            id: data.id,
            wshopId: trg.dataset.shopid
          };
          this.roWshopActApi.activePlanRx(obj).subscribe(() => {
            this.refreshSearch();
          }, () => {
            this.refreshSearch();
          });
        }, 150);
      }
    }));
    this.subs.add(this.dragulaService.drop('pending-vehicle-bag').subscribe(({name, el, target, source, sibling}) => {
      if (target.className.indexOf('rx-td') > -1) {
        const elem = el as HTMLElement;
        const trg = target as HTMLElement;
        elem.style.display = 'none';
        this.repairPlanModal.open(el.id, ProgressState.stopOutside, true, Number(trg.dataset.shopid));
      }
    }));
    this.subs.add(this.eventBusService.on('searchProgress').subscribe(val => {
      if (val.progressType === 'rx') {
        this.refreshSearch();
      }
    }));
  }

  destroy() {
    clearInterval(this.interval);
    this.dragulaService.destroy('general-repair-employee');
    this.dragulaService.destroy('rx-waiting-vehicle-bag');
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
    //   this.cdr.detectChanges()
    // }, this.timeReload * 60000)
  }


  getData(isClearInterval?) {
    this.loadingService.setDisplay(true);
    if (!moment(this.form.value.toDateTime).isSameOrAfter(this.form.value.fromDateTime, 'day')) {
      this.swalAlert.openWarningToast('Từ ngày không được lớn hơn Đến ngày');
      this.loadingService.setDisplay(false);
      return;
    }
    forkJoin([
      this.empCalendarApi.getNotWorkEmployee(),
      this.roWshopApi.getRoNoPlanRx(this.form.value),
      this.shopApi.getAllRxShop(),
      this.techWshopApi.getTechWshopByDlr(RoType.RX)
    ]).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.notWorkingEmps = res[0] || [];
      this.waitingVehicles = res[1] || [];
      this.delayVehicleWait = this.waitingVehicles.filter(it => it.carDeliveryTime < this.now).length || 0;
      this.shops = res[2].map(shop => {
        return {
          ...shop, ...{
            emps: res[3] && res[3].length ? res[3].filter(item => item && item.wshopId === shop.id) : []
          }
        };
      });

      if (this.shops.length) {
        this.getCurrentWorkTime(isClearInterval);
      }
    });
  }

  getCurrentWorkTime(isClearInterval?) {
    this.dlrConfigApi.getCurrentWorkTime(this.form.value).subscribe(workTimes => {
      if (workTimes) {
        this.workTimes = workTimes;
        this.columns = this.progressTrackingService.countColumnsWithHourView(workTimes);
        this.progressTrackingService.generateBreaktime(workTimes, this.elem.nativeElement.querySelectorAll('.rx-td'), this.rx);
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
    const elems = document.querySelectorAll('.rx-register-no-progress');
    const focusVehicleElem = document.querySelectorAll('.rx-focus-vehicle');
    if (focusVehicleElem) {
      focusVehicleElem.forEach(it => it.classList.remove('rx-focus-vehicle'));
    }
    if (!keyword || keyword.trim().length === 0) {
      return;
    }
    this.currentSearchKeyword = keyword;
    if (elems && elems.length) {
      elems.forEach(elem => {
        let registernos = elem.innerHTML.toLowerCase().match(/(?<=(<!---->))(\w|\d|\n|[().,\-:;@#$%^&*\[\]"'+–/\/®°⁰!?{}|`~]| )+?(?=(<!--))/g);
        let registerno_name =  "";
        registernos.forEach(registerno => {
          registerno_name += registerno;
        });
        if (registerno_name.toLowerCase().indexOf(keyword.trim().toLowerCase()) > -1) {
          none_result = false;
          this.registerNoSearch.push(elem);
        }
      });
      if (this.registerNoSearch.length) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.registerNoSearch.length; i++) {
          this.registerNoSearch[i].scrollIntoView(false);
          this.registerNoSearch[i].parentElement.classList.add('rx-focus-vehicle');
        }

      }
    }
    // this.currentSearchIndex = this.currentSearchIndex + 1 >= this.registerNoSearch.length ? 0 : this.currentSearchIndex + 1
    this.waitingVehicles.forEach(it => {
      if ((it.registerno.toLowerCase()).indexOf(keyword.trim().toLowerCase()) > -1) {
        none_result = false;
        this.arrayVehiclesSearch.push(it.registerno);
      }
    });

    if (none_result) this.swalAlert.openWarningToast("Không tìm thấy xe này!");
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
    this.roWshopApi.getRoNoPlanRx(this.form.value).subscribe(val => {
      this.waitingVehicles = val;
      this.delayVehicleWait = this.waitingVehicles.filter(it => it.carDeliveryTime < this.now).length || 0;
      this.loadingService.setDisplay(false);
    });
  }

  refreshSearch() {
    if (!this.form.value.fromDateTime || !this.form.value.toDateTime) {
      this.swalAlert.openFailToast('Phải có thông tin ngày tháng');
      return;
    }

    this.getData(true);
  }

  getStateCount(status) {
    const found = this.stateCount.find(item => item.status === status);
    return found ? found.count : 0;
  }

  search(isLoading?) {
    if (isLoading) {
      this.loadingService.setDisplay(true);
    }
    this.dlrConfigApi.getWorkTime(this.form.value).subscribe(res => {
      this.workTimeBySearch = res;
    });

    this.roWshopApi.searchRoRx(this.form.value).subscribe(res => {
      this.loadingService.setDisplay(false);
      const list = res.data.concat(res.planData);
      this.stateCount = res.stateCount;
      // xóa elems cũ sau khi refresh
      const progressElems = this.elem.nativeElement.querySelectorAll('resizeable-progress');
      if (progressElems && progressElems.length) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < progressElems.length; i++) {
          progressElems[i].parentNode.removeChild(progressElems[i]);
        }
      }
      if (list && list.length) {
        const result = list.map(item => {
          return {
            ...item, ...{index: this.shops.findIndex(shop => shop.id === item.wshopId)}
          };
        });
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
        this.progressTrackingService.generatePlan(result, this.workTimes, this.shops, this.rx);
        this.pendingVehicles = list.filter(item => item.state === ProgressState.stopOutside);
        setTimeout(() => {
          this.showCompleteCar();
        }, 1000);
      }
    });
  }

  showCompleteCar() {
    const elems = document.querySelectorAll('.rx-tracking-progress');
    if (elems && elems.length) {
      elems.forEach(elem => {
        if (elem.className.indexOf("performed-vehicle") > -1 || elem.className.indexOf("complete-vehicle") > -1 || elem.className.indexOf("hide-stopinside") > -1) {
          if (!this.viewCompleteCar) elem.classList.add('hide');
          else elem.classList.remove('hide');
        }
      });
    }
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
          this.delayVehicles = this.progressTrackingService.autoIncreaseActualJobWidth(this.list, this.rx).totalActualLate;
          this.delayPlanVehicles = this.progressTrackingService.autoIncreaseActualJobWidth(this.list, this.rx).totalPlanLate;
        }
      }, 1000);
      this.interval = setInterval(() => {
        if (new Date().getHours() >= start && new Date().getHours() < end) {
          // có workTimeIndex vì có thể ngày hiện tại sau khi search không phải ở vị trí đầu tiên
          this.offsetLeft = workTimeIndex * 100 + this.progressTrackingService.calculateSkipTimes(new Date(), start, end - start);
          this.delayVehicles = this.progressTrackingService.autoIncreaseActualJobWidth(this.list, this.rx).totalActualLate;
          this.delayPlanVehicles = this.progressTrackingService.autoIncreaseActualJobWidth(this.list, this.rx).totalPlanLate;
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
              this.shopApi.getAllRxShop(),
              this.techWshopApi.getTechWshopByDlr(RoType.RX)
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
      fromDateTime: [this.dataFormatService.formatDate(this.commonService.getStartOfDay())],
      toDateTime: [this.dataFormatService.formatDate(this.commonService.getEndOfDay())],
    });
  }

  // @HostListener('document:mouseup', ['$event'])
  onMouseUp(event) {
    // Toạ độ điểm thả chuột
    const areas = document.querySelectorAll('.rx-left');
    const col132 = document.querySelector('.rx-right');
    if (!areas || !areas.length || !col132) {
      return;
    }
    this.minX = areas[0].getBoundingClientRect().left;
    this.maxX = col132.getBoundingClientRect().left;
    if (this.workTimeBySearch) {
      const arr = document.querySelectorAll('.rx-progress-area');
      if (!arr) {
        return;
      }
      this.mouseX = event.x;

      // Vị trí min của bảng tiến độ tính từ bên trái
      const positionMin = arr[0].getBoundingClientRect().left;

      // Vị trí của chuột theo bảng tiến độ tính từ bên trái
      // Chỉ rửa xe mới có padding
      const padding = 20;
      const positionMouse = this.minX - positionMin + this.mouseX - this.constVehicleWaitWithMouseDown - this.minX + padding;

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

  // @HostListener('document:mousedown', ['$event'])
  onMouseDown(event) {
    const el = document.querySelectorAll('.rx-waiting-vehicle');
    if (!el || !el.length) {
      return;
    }
    // Tọa độ danh sách xe chờ đến bên trái màn hình
    const vehicleWaitX = el[0].getBoundingClientRect().left;
    // Khoảng cách từ chuột đến bên trái danh sách xe chờ
    this.constVehicleWaitWithMouseDown = event.x - vehicleWaitX;
  }

  onMouseMove(event) {
    const areas = document.querySelectorAll('.rx-left');
    const col132 = document.querySelector('.rx-right');
    if (!areas || !areas.length || !col132) {
      return;
    }
    this.minX = areas[0].getBoundingClientRect().left;
    this.maxX = col132.getBoundingClientRect().left;
    if (this.workTimeBySearch) {
      const arr = document.querySelectorAll('.rx-progress-area');
      if (!arr) {
        return;
      }
      this.mouseX = event.x;

      // Vị trí min của bảng tiến độ tính từ bên trái
      const positionMin = arr[0].getBoundingClientRect().left;

      // Vị trí của chuột theo bảng tiến độ tính từ bên trái
      const positionMouse = this.minX - positionMin + this.mouseX - this.constVehicleWaitWithMouseDown - this.minX;

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

  cancelCarWash(item) {

    this.roWshopActApi.cancelCarWash(item.wpId).subscribe(() => {
      this.refreshSearch();
    }, () => {
    }, () => this.refreshSearch());
  }
}
