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
import {ProgressState, ProgressViewType, StateCount, RoType} from '../../../core/constains/progress-state';
import {CommonService} from '../../../shared/common-service/common.service';
import {ResizeableProgressComponent} from '../../../shared/resizeable-progress/resizeable-progress.component';
import {RoWshopActApi} from '../../../api/ro-wshop/ro-wshop-act.api';
import { HostListener} from '@angular/core';
import {McopperPaintApi} from '../../../api/common-api/mcopper-paint.api';
import {TMSSTabs} from '../../../core/constains/tabs';

import {extendMoment} from 'moment-range';

export enum KEY_CODE {
  F11 = 122,
  F12 = 123
}

const momentRange = extendMoment(moment);
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dong-son-progress-by-wshop',
  templateUrl: './dong-son-progress-by-wshop.component.html',
  styleUrls: ['./dong-son-progress-by-wshop.component.scss']
})
export class DongSonProgressByWshopComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('repairPlanModal', {static: false}) repairPlanModal;
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
  wshop = 'wshop';
  arrayVehiclesSearch;
  stateCount: Array<{ status: StateCount, count: number }> = [];
  listDs = [];
  currentSearchKeyword: string;
  // currentSearchIndex = 0;
  registerNoSearch: Array<Element> = [];
  delayPlanVehicles = 0;
  // khoang
  shops: Array<any> = [];
  listDsDefault = [];
  // danh sách job
  list: Array<any> = [];
  temp_list: Array<any> = [];

  subs = new Subscription();
  currentScroll: string; // đánh dấu đang scroll progress-area hay body-content
  interval;
  // intervalReload;
  // intervalRel;
  ProgressState = ProgressState;
  ProgessViewType = ProgressViewType;
  viewType = ProgressViewType.hour;
  StateCount = StateCount;
  timeReload = 1;
  listTimeReload = [1, 2, 5, 10];
  listTimeView = [{name: "Theo xe", functionCode: TMSSTabs.dongsonProgressByCar}, 
    {name: "Theo khoang", functionCode: TMSSTabs.dongsonProgressByWshop}, 
    {name: "Theo tổ/nhóm", functionCode: TMSSTabs.dongsonProgress}];
  // for tracking line
  offsetLeft = 0;
  delayVehicles = 0;
  top;
  minX;
  minY;
  maxY;
  maxX;
  rows;
  workTimeBySearch;
  functionCode = TMSSTabs.dongsonProgressByWshop;
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
    private progressTrackingService: ProgressTrackingService,
    private roWshopApi: RoWshopApi,
    private loadingService: LoadingService,
    private commonService: CommonService,
    private elem: ElementRef,
    private roWshopActApi: RoWshopActApi,
    private mcopperPaintApi: McopperPaintApi
  ) {
  }

  ngOnInit() {
    this.buildSearchForm();
    this.getData();
    this.getListDs();
    this.triggerMoveEmp();
    this.createSub();
    // this.intervalReload = setInterval(() => {
    //   this.search()
    // }, this.timeReload * 60000)
  }

  ngOnDestroy() {
    this.progressTrackingService.destroyComponent(this.wshop);
    this.destroy();
  }

  createSub() {
  }

  destroy() {
    clearInterval(this.interval);
    this.subs.unsubscribe();
    this.progressTrackingService.destroyComponent(true);
  }

  ngAfterViewInit() {
    const elem = this.elem.nativeElement.querySelector('.body-content');
    // cộng 52 vì là độ cao của header
    this.progressOverflowHeight = elem ? elem.getBoundingClientRect().height + 52 : 0;
    this.cdr.detectChanges();
    // this.intervalRel = setInterval(() => {
    //   this.cdr.detectChanges()
    // }, this.timeReload * 60000)
  }


  getData(isClearInterval?) {
    if (!moment(this.form.value.toDateTime).isSameOrAfter(this.form.value.fromDateTime, 'day')) {
      this.swalAlert.openWarningToast('Từ ngày không được lớn hơn Đến ngày');
      this.loadingService.setDisplay(false);
      return;
    }
    forkJoin([
      this.roWshopApi.getRoNoPlanDS(this.form.value),
      this.roWshopApi.getDsByWshop(this.form.value),
    ]).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.waitingVehicles = res[0] || [];
      this.temp_list = res[1].data.concat(res[1].planData);
      this.stateCount = res[1].stateCount;
      this.pendingVehicles = res[1].pendingOut;
      this.shops = res[1].wshops;
      for (let i = 0; i < this.shops.length; i++) {
        if (this.shops[i].numberRow && this.shops[i].numberRow > 1) {
          let check_first = parseInt(this.shops[i].idTmp.split("_")[1]);

          if (check_first == 1) {
            let show_name_row = i;
            if (this.shops[i].numberRow % 2 == 0) show_name_row += Math.floor(this.shops[i].numberRow / 2) - 1;
            else {
              if ((this.shops[i].numberRow / 2 - this.shops[i].numberRow % 2) >= 0.5) {
                show_name_row += Math.floor(this.shops[i].numberRow / 2);
              } else show_name_row += Math.floor(this.shops[i].numberRow / 2) - 1;
            }
           
            this.shops[show_name_row].show_name = true;
          }
        } else {
          this.shops[i].show_name = true;
        }
      }
      if (this.shops.length) {
        this.getCurrentWorkTime(isClearInterval);
      }
    });

  }

  getCurrentWorkTime(isClearInterval?) {
    this.dlrConfigApi.getCurrentWorkTime(this.form.value, RoType.DS).subscribe(workTimes => {
      if (workTimes) {
        this.workTimes = workTimes;
        this.columns = this.progressTrackingService.countColumnsWithHourView(workTimes);
        this.progressTrackingService.generateBreaktime(workTimes, this.elem.nativeElement.querySelectorAll('.wshop-td'), this.wshop);
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

  getListDs() {
    this.mcopperPaintApi.getListByDealer().subscribe(res => {
      this.listDs = res.filter(it => it.status === 'Y');
      this.listDsDefault = res.filter(it => it.status === 'Y');
      this.listDs.unshift({id: -1, name: 'Tất cả'});
    });
  }

  searchByRegisterNo(keyword) {
    let none_result = true;
    this.arrayVehiclesSearch = [];
    this.registerNoSearch = [];
    const elems = document.querySelectorAll('.wshop-register-no-progress');
    const focusVehicleElem = document.querySelectorAll('.wshop-focus-vehicle');
    if (focusVehicleElem) {
      focusVehicleElem.forEach(it => it.classList.remove('wshop-focus-vehicle'));
    }
    if (!keyword || keyword.trim().length === 0) {
      return;
    }
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
      if (this.registerNoSearch.length) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.registerNoSearch.length; i++) {
          this.registerNoSearch[i].scrollIntoView(false);
          this.registerNoSearch[i].parentElement.classList.add('wshop-focus-vehicle');
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

  showCompleteCar() {
    const elems = document.querySelectorAll('.wshop-tracking-progress');
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
    this.roWshopApi.getRoNoPlanDS(this.form.value).subscribe(val => {
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

  getStateCount(status) {
    const found = this.stateCount.find(item => item.status === status);
    return found ? found.count : 0;
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
    this.initPositionData();
    this.dlrConfigApi.getWorkTime(this.form.value).subscribe(res => {
      this.workTimeBySearch = res;
    });

    // this.roWshopApi.getDsByWshop(this.form.value).subscribe(res => {
      this.loadingService.setDisplay(false);
      const list = this.temp_list;
      // this.stateCount = res.stateCount;

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
            ...item, ...{index: this.shops.findIndex(shop => shop.idTmp === item.wshopIdTmp )}
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
        this.progressTrackingService.generatePlan(result, this.workTimes, this.shops, this.wshop, this.listDsDefault, true);
        setTimeout(() => {
          this.showCompleteCar();
        }, 1000);
        // this.pendingVehicles = list.filter(item => item.state === ProgressState.stopOutside);
      }
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
          this.delayVehicles = this.progressTrackingService.autoIncreaseActualJobWidth(this.list, this.wshop).totalActualLate;
          this.delayPlanVehicles = this.progressTrackingService.autoIncreaseActualJobWidth(this.list, this.wshop).totalPlanLate;
        }
      }, 1000);
      this.interval = setInterval(() => {
        if (new Date().getHours() >= start && new Date().getHours() < end) {
          // có workTimeIndex vì có thể ngày hiện tại sau khi search không phải ở vị trí đầu tiên
          this.delayVehicles = this.progressTrackingService.autoIncreaseActualJobWidth(this.list, this.wshop).totalActualLate;
          this.delayPlanVehicles = this.progressTrackingService.autoIncreaseActualJobWidth(this.list, this.wshop).totalPlanLate;
        }
      }, 10000);
    } else {
      this.offsetLeft = 0;
      clearInterval(this.interval);
    }
  }

  // action khi move KTV sang khoang khác hoặc move ra danh sách nghỉ
  private triggerMoveEmp() {
  }

  private buildSearchForm() {
    this.form = this.formBuilder.group({
      fromDateTime: [this.dataFormatService.formatDate(new Date())],
      toDateTime: [this.dataFormatService.formatDate(new Date())],
      keyword: [null]
    });
  }


  initPositionData() {
    // lấy điểm giới hạn drag
    const areas = document.querySelectorAll('.wshop-progress-area');
    const col132 = document.querySelector('.col132');
    if (!areas || !areas.length || !col132) {
      return;
    }
    this.minX = areas[0].getBoundingClientRect().left;
    this.minY = document.querySelector('.wshop-tbody').getBoundingClientRect().top;
    this.maxX = col132.getBoundingClientRect().left;
    this.maxY = this.minY + 410; // 410 là độ cao của bảng'
  }

  changeView() {
    this.eventBusService.emit({
      type: 'openComponent',
      functionCode: this.functionCode,
    })
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


