import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone, OnDestroy, OnInit, Output, ViewChild, ViewRef } from '@angular/core';
import { ProgressTrackingService } from '../../../shared/common-service/progress-tracking.service';
import { forkJoin, Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';
import { DlrConfigApi } from '../../../api/common-api/dlr-config.api';
import { LoadingService } from '../../../shared/loading/loading.service';
import { EmpCalendarApi } from '../../../api/emp-calendar/emp-calendar.api';
import { RoWshopApi } from '../../../api/ro-wshop/ro-wshop.api';
import { ProgressVehicleModel } from '../../../core/models/advisor/progress-vehicle.model';
import { ShopCommonApi } from '../../../api/common-api/shop-common.api';
import { TechWshopApi } from '../../../api/tech-wshop/tech-wshop.api';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataFormatService } from '../../../shared/common-service/data-format.service';
import { EventBusService } from '../../../shared/common-service/event-bus.service';
import * as moment from 'moment';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { ProgressState, ProgressViewType, StateCount, RoType } from '../../../core/constains/progress-state';
import { CommonService } from '../../../shared/common-service/common.service';
import { EmployeeCommonApi } from '../../../api/common-api/employee-common.api';
import { RoWshopActApi } from '../../../api/ro-wshop/ro-wshop-act.api';
import { McopperPaintApi } from '../../../api/common-api/mcopper-paint.api';
import { Times } from '../../../core/constains/times';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { ShortcutInput } from 'ng-keyboard-shortcuts';
import { DomSanitizer } from '@angular/platform-browser';
import { extendMoment } from 'moment-range';
import { HostListener } from '@angular/core';
import { ErrorCodes } from '../../../core/interceptors/error-code';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';
import { TMSSTabs } from '../../../core/constains/tabs';


export enum KEY_CODE {
  F11 = 122,
  F12 = 123
}

const momentRange = extendMoment(moment);
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dong-son-progress',
  templateUrl: './dong-son-progress.component.html',
  styleUrls: ['./dong-son-progress.component.scss']
})
export class DongSonProgressComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  @ViewChild('createPlanModal', { static: false }) createPlanModal;
  @ViewChild('dongsonModal', { static: false }) dongsonModal;
  @ViewChild('completePlanModal', { static: false }) completePlanModal;
  @ViewChild(ContextMenuComponent, { static: false }) public basicMenu: ContextMenuComponent;
  @Output() shortcuts = new EventEmitter<Array<ShortcutInput>>();
  form: FormGroup;
  rowIndex: number;
  selectedData;
  progressOverflowHeight: number;
  waitingVehicleElem;

  workTimes: Array<any> = [];
  columns: Array<any> = [];
  vehicleChoosing: ProgressVehicleModel;
  waitingVehicles;
  emps = [];
  bpGroups = [];
  stateCount: Array<{ status: StateCount, count: number }> = [];
  listDs = [];
  listDsDefault = [];
  typeDs = -1;
  ds = 'ds';
  scc = 'scc';
  currentSearchKeyword: string;
  currentSearchIndex = 0;
  registerNoSearch: Array<Element> = [];
  arrayVehiclesSearch;
  showMouseTime = false;
  // khoang
  shops: Array<any> = [];

  // danh sách job
  list: Array<any> = [];
  positionTop;
  positionLeft;
  elemBody;

  subs = new Subscription();
  currentScroll: string; // đánh dấu đang scroll progress-area hay body-content
  interval;
  ProgressState = ProgressState;
  ProgessViewType = ProgressViewType;
  viewType = ProgressViewType.hour;
  StateCount = StateCount;
  // intervalReload;
  // for tracking line
  offsetLeft = 0;
  delayVehicles = 0;
  timeReload = 1;
  listTimeReload = [1, 2, 5, 10];
  listTimeView = [{ name: "Theo xe", functionCode: TMSSTabs.dongsonProgressByCar },
  { name: "Theo khoang", functionCode: TMSSTabs.dongsonProgressByWshop },
  { name: "Theo tổ/nhóm", functionCode: TMSSTabs.dongsonProgress }];
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
  delayPlanVehicles = 0;
  keyboardShortcuts: Array<ShortcutInput> = [];
  functionCode = TMSSTabs.dongsonProgress;
  viewCompleteCar = false;

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
    private empApi: EmployeeCommonApi,
    private progressTrackingService: ProgressTrackingService,
    private roWshopApi: RoWshopApi,
    private roWshopActApi: RoWshopActApi,
    private loadingService: LoadingService,
    private commonService: CommonService,
    private elem: ElementRef,
    private mcopperPaintApi: McopperPaintApi,
    private ngZone: NgZone,
    private sanitizer: DomSanitizer,
    private confirmService: ConfirmService,
  ) {
  }

  ngOnInit() {
    this.buildSearchForm();
    this.getListDs();
    this.getData();
    this.subs.add(this.dragulaService.drop('ds-waiting-vehicle-bag').subscribe(({ name, el, target, source, sibling }) => {
      if (target.className === 'ds-progress-area') {
        if (this.typeDs === -1) {
          this.swalAlert.openWarningToast('Chưa chọn loại công việc để tạo kế hoạch', 'Cảnh báo');
          this.refreshSearch();
          return;
        }
        const elem = el as HTMLElement;
        elem.style.display = 'none';
        // this.dongsonModal.open(Number(elem.dataset.roid), true);
        const trg = target as HTMLElement;
        const data = this.waitingVehicles.find(it => Number(it.wpId) === Number(elem.id));
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
          let obj = {
            fromDatetime: Math.round(this.timeMouseX),
            wpId: data.wpId,
            bpGroupId: trg.dataset.id,
            bpId: this.typeDs
          };
          // console.log(obj)
          this.roWshopApi.createNewPlanDs(obj).subscribe(res => {
            if (res && res.code == 6059) {
              this.confirmService.openConfirmModal('Cảnh báo', `Đã có kế hoạch cho xe ${res.data[0].registerNod} ở công đoạn ${res.data[0].bpId} tại tổ ${res.data[0].bpGroup}! 
              Bạn có muốn xóa kế hoạch cũ, tạo kế hoạch mới không?`).subscribe(() => {
                obj['ignoreCheck'] = true;
                this.roWshopApi.createNewPlanDs(obj).subscribe(() => {
                  this.refreshSearch();
                });
              }, () => {
                this.refreshSearch();
              });
            } else {
              this.refreshSearch();
            }

          }, () => this.refreshSearch());

        }, 200);
      }
    }));
    this.subs.add(this.eventBusService.on('searchProgress').subscribe(val => {
      if (val.progressType === 'ds') {
        this.refreshSearch();
      }
    }));
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
    this.progressTrackingService.destroyComponent(this.ds);
    this.dragulaService.destroy('ds-waiting-vehicle-bag');
    this.subs.unsubscribe();
    clearInterval(this.interval);
    // clearInterval(this.intervalReload);
  }

  ngAfterViewChecked() {
    if (!(this.cdr as ViewRef).destroyed) {
      this.cdr.detectChanges();
    }
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
  }

  getData(isClearInterval?) {
    this.loadingService.setDisplay(true);
    if (!moment(this.form.value.toDateTime).isSameOrAfter(this.form.value.fromDateTime, 'day')) {
      this.swalAlert.openWarningToast('Từ ngày không được lớn hơn Đến ngày');
      this.loadingService.setDisplay(false);
      return;
    }
    forkJoin([
      this.roWshopApi.getRoNoPlanDS(this.form.value),
      this.roWshopApi.searchRoDS(this.form.value)
    ]).subscribe(res => {
      this.waitingVehicles = res[0] || [];
      this.bpGroups = res[1].bpGroups || [];
      for (let i = 0; i < this.bpGroups.length; i++) {
        if (this.bpGroups[i].numberRow && this.bpGroups[i].numberRow > 1) {
          let check_first = parseInt(this.bpGroups[i].idTmp.split("_")[1]);

          if (check_first == 1) {
            let show_name_row = i;
            if (this.bpGroups[i].numberRow % 2 == 0) show_name_row += Math.floor(this.bpGroups[i].numberRow / 2) - 1;
            else {
              if ((this.bpGroups[i].numberRow / 2 - this.bpGroups[i].numberRow % 2) >= 0.5) {
                show_name_row += Math.floor(this.bpGroups[i].numberRow / 2);
              } else show_name_row += Math.floor(this.bpGroups[i].numberRow / 2) - 1;
            }

            this.bpGroups[show_name_row].show_name = true;
          }
        } else {
          this.bpGroups[i].show_name = true;
        }
      }
      this.list = [];
      if (this.bpGroups.length > 0) {
      }
      this.dlrConfigApi.getCurrentWorkTime(this.form.value, RoType.DS).subscribe(workTimes => {
        if (workTimes) {
          this.workTimes = workTimes;
          this.columns = this.progressTrackingService.countColumnsWithHourView(workTimes);
          this.progressTrackingService.generateBreaktime(workTimes, this.elem.nativeElement.querySelectorAll('.ds-td'), this.ds);
          if (isClearInterval) {
            clearInterval(this.interval);
          }
          this.initInterval(workTimes);
          this.search();
        }
      });
    });
  }

  changeViewType(viewType: ProgressViewType) {
    this.viewType = viewType;
    this.columns = viewType === ProgressViewType.hour
      ? this.progressTrackingService.countColumnsWithHourView(this.workTimes)
      : this.progressTrackingService.countColumnsWithMinuteView(this.workTimes);
  }


  getListDs() {
    this.mcopperPaintApi.getListByDealer().subscribe(res => {
      this.listDs = res.filter(it => it.status === 'Y');
      this.listDsDefault = res.filter(it => it.status === 'Y');
      this.typeDs = this.listDs[0].id;
    });
  }

  getStateCount(status) {
    const found = this.stateCount.find(item => item && item.status === status);
    return found ? found.count : 0;
  }

  displayTooltip(vehicle, type) {
    this.vehicleChoosing = vehicle;
    this[type] = vehicle ? this.elem.nativeElement.querySelector(`div[id='${vehicle.id}']`) : null;
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
    const elems = document.querySelectorAll('.ds-register-no-progress');
    const elems_wait = document.querySelectorAll('.vehicle-waiting-ds');

    const focusVehicleElem = document.querySelectorAll('.ds-focus-vehicle');
    if (focusVehicleElem) {
      focusVehicleElem.forEach(it => it.classList.remove('ds-focus-vehicle'));
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
        if (registernos) {
          registernos.forEach(registerno => {
            registerno_name += registerno;
          });
          if (registerno_name.toLowerCase().indexOf(keyword.trim().toLowerCase()) > -1) {
            none_result = false;
            this.registerNoSearch.push(elem);
          }
        }
      });

      // const focusVehicle = document.querySelector('.ds-focus-vehicle');
      // if (focusVehicle) {
      //   focusVehicle.classList.remove('ds-focus-vehicle');
      // }

      if (this.registerNoSearch.length) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.registerNoSearch.length; i++) {
          this.registerNoSearch[i].scrollIntoView(false);
          this.registerNoSearch[i].parentElement.classList.add('ds-focus-vehicle');
        }

      }
    }
    // this.currentSearchIndex = this.currentSearchIndex + 1 >= this.registerNoSearch.length ? 0 : this.currentSearchIndex + 1;
    for (let i = 0; i < this.waitingVehicles.length; i++) {
      if ((this.waitingVehicles[i].registerno.toLowerCase()).indexOf(keyword.trim().toLowerCase()) > -1) {
        none_result = false;
        elems_wait[i].scrollIntoView(false);
        this.arrayVehiclesSearch.push(this.waitingVehicles[i].registerno);
      }
    }

    if (none_result) this.swalAlert.openWarningToast("Không tìm thấy xe này!");
  }

  showCompleteCar() {
    const elems = document.querySelectorAll('.ds-tracking-progress');
    if (elems && elems.length) {
      elems.forEach(elem => {
        if (elem.className.indexOf("performed-vehicle") > -1 || elem.className.indexOf("complete-vehicle") > -1 || elem.className.indexOf("hide-stopinside") > -1) {
          if (!this.viewCompleteCar) elem.classList.add('hide');
          else elem.classList.remove('hide');
        }
      });
    }
  }

  refreshRoNoPlanList() {
    this.roWshopApi.getRoNoPlanDS(this.form.value).subscribe(val => {
      this.loadingService.setDisplay(false);
      this.waitingVehicles = val || [];
    });
  }

  refreshSearch() {
    if (!this.form.value.fromDateTime || !this.form.value.toDateTime) {
      this.swalAlert.openFailToast('Phải có thông tin ngày tháng');
      return;
    }

    this.getData(true);
  }

  search(isLoading?) {
    if (!moment(this.form.value.toDateTime).isSameOrAfter(this.form.value.fromDateTime, 'day')) {
      this.swalAlert.openWarningToast('Từ ngày không được lớn hơn Đến ngày');
      this.loadingService.setDisplay(false);
      return;
    }

    if (isLoading) {
      this.loadingService.setDisplay(true);
    }
    this.dlrConfigApi.getWorkTime(this.form.value).subscribe(res => {
      this.workTimeBySearch = res;
    });

    this.roWshopApi.searchRoDS(this.form.value).subscribe(res => {
      this.loadingService.setDisplay(false);
      const list = res.data.concat(res.planData);
      this.stateCount = res.stateCount;

      // xóa elems cũ sau khi refresh
      const progressElems = this.elem.nativeElement.querySelectorAll('resizeable-progress');
      if (progressElems && progressElems.length) {
        progressElems.forEach(elem => elem.parentNode.removeChild(elem));
      }

      if (list && list.length) {
        const result = list.map(item => {
          return {
            ...item, ...{
              index: this.bpGroups.findIndex(bpGroup => bpGroup.idTmp === item.bpGroupIdTmp)
            }
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
        // this.list = result;
        this.progressTrackingService.generatePlan(result, this.workTimes, this.bpGroups, this.ds, this.listDsDefault);
        setTimeout(() => {
          this.showCompleteCar();
        }, 1000);
      }
    });
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
          this.delayVehicles = this.progressTrackingService.autoIncreaseActualJobWidth(this.list, this.ds).totalActualLate;
          this.delayPlanVehicles = this.progressTrackingService.autoIncreaseActualJobWidth(this.list, this.ds).totalPlanLate;
        }
      }, 1000);
    } else {
      this.offsetLeft = 0;
      clearInterval(this.interval);
    }
  }

  private buildSearchForm() {
    this.form = this.formBuilder.group({
      fromDateTime: [this.dataFormatService.formatDate(this.commonService.getStartOfDay())],
      toDateTime: [this.dataFormatService.formatDate(this.commonService.getEndOfDay())],
      keyword: [null]
    });
  }

  onClickBtn(id) {
    this.typeDs = id;
    this.getData(true);
  }

  onBtnCarSuccess(item) {

  }

  // @HostListener('document:mouseup', ['$event'])
  onMouseUp(event) {
    const areas = document.querySelectorAll('.ds-left');
    const col132 = document.querySelector('.ds-right');
    if (!areas || !areas.length || !col132) {
      return;
    }
    this.minX = areas[0].getBoundingClientRect().left;
    this.maxX = col132.getBoundingClientRect().left;
    if (this.workTimeBySearch) {
      const arr = document.querySelectorAll('.ds-progress-area');
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

  onMouseMove(event) {
    const areas = document.querySelectorAll('.ds-left');
    const col132 = document.querySelector('.ds-right');
    if (!areas || !areas.length || !col132) {
      return;
    }
    this.minX = areas[0].getBoundingClientRect().left;
    this.maxX = col132.getBoundingClientRect().left;
    if (this.workTimeBySearch) {
      const arr = document.querySelectorAll('.ds-progress-area');
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

  // @HostListener('document:mousedown', ['$event'])
  onMouseDown(event) {
    const el = document.querySelectorAll('.ds-waiting-vehicle');
    if (!el || !el.length) {
      return;
    }
    this.showMouseTime = true;
    // Tọa độ danh sách xe chờ đến bên trái màn hình
    const vehicleWaitX = el[0].getBoundingClientRect().left;
    // Khoảng cách từ chuột đến bên trái danh sách xe chờ
    this.constVehicleWaitWithMouseDown = event.x - vehicleWaitX;
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

  changeView() {
    this.eventBusService.emit({
      type: 'openComponent',
      functionCode: this.functionCode,
    })
  }
}
