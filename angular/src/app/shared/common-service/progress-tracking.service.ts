import {ComponentFactoryResolver, EmbeddedViewRef, Injectable, Injector} from '@angular/core';
import * as moment from 'moment';
import {ParameterOperationAgentModel} from '../../core/models/catalog-declaration/parameter-operation-agent.model';
import {indexOf, range} from 'lodash';
import {ResizeableProgressComponent} from '../resizeable-progress/resizeable-progress.component';
import {ProgressState} from '../../core/constains/progress-state';
import {DataFormatService} from './data-format.service';
import {extendMoment} from 'moment-range';

const momentRange = extendMoment(moment);

@Injectable({
  providedIn: 'root'
})
export class ProgressTrackingService {
  rowIndex: number;
  rowData: any;
  elemWidth: number;
  rows: Array<any>; // rows là danh sách khoang nếu là SCC, là danh sách KTV nếu là ĐS
  workTimes: Array<any>;
  isSCC;
  scc = 'scc';
  ds = 'ds';
  rx = 'rx';
  car = 'car';
  wshop = 'wshop';
  refSCC: Array<any> = [];
  refDS: Array<any> = [];
  refRX: Array<any> = [];
  refCar: Array<any> = [];
  refWshop: Array<any> = [];
  timeDay = 24 * 60 * 60 * 1000;
  disable;
  byCar;
  selectors = {
    scc: '.scc-register-no-progress',
    ds: '.ds-register-no-progress',
    car: '.car-register-no-progress',
    wshop: '.wshop-register-no-progress',
    rx: '.rx-register-no-progress'
  };

  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private dataFormatService: DataFormatService
  ) {
  }

  countColumnsWithHourView(workTimes: Array<ParameterOperationAgentModel>) {
    const result = [];
    workTimes.forEach(data => {
      const morningStart = new Date(data.wkAmFrom).getHours();
      const noonEnd = new Date(data.wkPmTo).getHours();

      const workingTime = range(morningStart, noonEnd, 1);
      result.push({
        day: this.dataFormatService.parseTimestampToDate(data.dateSearch),
        workTimes: workingTime.map(hour => {
          return {hour, minute: 0};
        })
      });
    });
    return result;
  }

  countColumnsWithMinuteView(workTimes: Array<ParameterOperationAgentModel>) {
    const result = [];
    workTimes.forEach(data => {
      const morningStart = new Date(data.wkAmFrom).getHours();
      const noonEnd = new Date(data.wkPmTo).getHours();

      const workingTime = [];
      for (let hour = morningStart; hour < noonEnd; hour++) {
        for (let i = 0; i < 4; i++) {
          workingTime.push({hour, minute: 15 * i});
        }
      }

      result.push({
        day: this.dataFormatService.parseTimestampToDate(data.dateSearch),
        workTimes: workingTime
      });
    });
    return result;
  }

  generateBreaktime(workTimes: Array<ParameterOperationAgentModel>, progressAreaElems, isSCC?) {
    this.isSCC = isSCC;
    this.workTimes = workTimes;

    // xóa elems cũ sau khi refresh
    const breakTimeElems = document.querySelectorAll(
      isSCC === this.scc ? '.scc-break-time'
        : isSCC === this.ds ? '.ds-break-time'
        : isSCC === this.rx ? '.rx-break-time'
          : isSCC === this.car ? '.car-break-time'
            : '.wshop-break-time');
    if (breakTimeElems && breakTimeElems.length) {
      breakTimeElems.forEach(elem => elem.parentNode.removeChild(elem));
    }

    const timeElems = document.querySelectorAll('time');
    if (timeElems && timeElems.length) {
      timeElems.forEach(elem => elem.parentNode.removeChild(elem));
    }

    workTimes.forEach((data, idx) => {
      const morningStart = new Date(data.wkAmFrom).getHours();
      const morningEnd = new Date(data.wkAmTo);
      const noonStart = new Date(data.wkPmFrom);
      const noonEnd = new Date(data.wkPmTo).getHours();
      const columnsNum = noonEnd - morningStart;

      // độ chia nhỏ nhất của bảng tiến độ, mặc định là 10ph
      let min_step_minute = 10;
      switch (isSCC) {
        case this.scc:
          if (data.splitTimeScc) min_step_minute = data.splitTimeScc;
          else min_step_minute = 10;
          break;
        case this.ds:
          if (data.splitTimeDs) min_step_minute = data.splitTimeDs;
          else min_step_minute = 10;
          break;
        case this.wshop:
          if (data.splitTimeDs) min_step_minute = data.splitTimeDs;
          else min_step_minute = 10;
          break;
        case this.car:
          if (data.splitTimeDs) min_step_minute = data.splitTimeDs;
          else min_step_minute = 10;
          break;
        case this.rx:
          if (data.splitTimeRx) min_step_minute = data.splitTimeRx;
          else min_step_minute = 2;
          break;
        default:
          break;
      }

      const morningBreakStart = data.restAmFrom ? new Date(data.restAmFrom) : null;
      const morningBreakEnd = data.restAmTo ? new Date(data.restAmTo) : null;
      const noonBreakStart = data.restPmFrom ? new Date(data.restPmFrom) : null;
      const noonBreakEnd = data.restPmTo ? new Date(data.restPmTo) : null;
      this.calculateBreaktime(morningEnd, noonStart, morningStart, columnsNum, progressAreaElems, idx, min_step_minute);
      if (morningBreakStart && morningBreakEnd) {
        this.calculateBreaktime(morningBreakStart, morningBreakEnd, morningStart, columnsNum, progressAreaElems, idx, min_step_minute, true);
      }
      if (noonBreakStart && noonBreakEnd) {
        this.calculateBreaktime(noonBreakStart, noonBreakEnd, morningStart, columnsNum, progressAreaElems, idx, min_step_minute, true);
      }
    });
  }

  // tính margin left
  calculateSkipTimes(time, morningStart, hourNumbers) {
    const hour = time.getHours();
    const minute = time.getMinutes();
    const hourLeft = hour - morningStart;
    const minuteLeft = minute / 60;

    // nhân (100 / hourNumbers) vì với độ dài 100% có `hourNumbers` cột
    return (hourLeft + minuteLeft) * (100 / hourNumbers);
  }

  autoIncreaseActualJobWidth(list, isSCC?) {

    const now = new Date().getTime();
    const elems = isSCC === this.scc ? document.querySelectorAll('.scc-tracking-progress.fixing-vehicle')
      : isSCC === this.ds ? document.querySelectorAll('.ds-tracking-progress.fixing-vehicle')
        : isSCC === this.rx ? document.querySelectorAll('.rx-tracking-progress.fixing-vehicle')
          : isSCC === this.car ? document.querySelectorAll('.car-tracking-progress.fixing-vehicle')
            : document.querySelectorAll('.wshop-tracking-progress.fixing-vehicle');

    const elemsPlan = isSCC === this.scc ? document.querySelectorAll('.scc-tracking-progress.planning-vehicle')
      : isSCC === this.ds ? document.querySelectorAll('.ds-tracking-progress.planning-vehicle')
        : isSCC === this.rx ? document.querySelectorAll('.rx-tracking-progress.planning-vehicle')
          : isSCC === this.car ? document.querySelectorAll('.car-tracking-progress.planning-vehicle')
            : document.querySelectorAll('.wshop-tracking-progress.planning-vehicle');

    // Đổi màu xe quá plan
    const carPlanLate = list.filter(item => item.state === ProgressState.plan && item.fromDatetime < now && item.isStart !== 'Y' && !item.appId);
    if (carPlanLate) {
      carPlanLate.forEach(it => {
        let elemPlan;
        elemsPlan.forEach((el: HTMLElement) => {
          if ([this.ds, this.car, this.wshop].includes(isSCC) && el.dataset.empid === `${it.empId}` && el.dataset.wshopid === `${it.wshopId}`) {
            elemPlan = el;
          }
          if ((isSCC === this.scc || isSCC === this.rx) && el.dataset.wshopid === `${it.wshopId}` && Number(el.dataset.fromDatetime) <= new Date().getTime()) {
            elemPlan = el;
          }
        });
        if (elemPlan) {
          elemPlan.classList.add('delay-vehicle');
          if (it.jobType) {
            const clockIconElem = elemPlan.querySelector('.fa-clock-o');
            if (!clockIconElem) {
              const iconElem = elemPlan.querySelector('i');
              if (iconElem && iconElem.parentNode) {
                iconElem.parentNode.removeChild(iconElem);
              }

              const spanElem = elemPlan.querySelector(this.selectors[isSCC]);
              const newIconElem = document.createElement('i');
              newIconElem.classList.add('fa');
              newIconElem.classList.add('fa-clock-o');
              if (spanElem) {
                spanElem.insertBefore(newIconElem, spanElem.firstChild);
              }
            }
          }
        }
      });


    }
    // Đổi màu xe quá plan
    const actualJobCanIncreaseWidth = list.filter(item => item.state === ProgressState.actual && !item.toActDisplay && item.toDatetime < now);


    actualJobCanIncreaseWidth.forEach(job => {
      let elem;
      elems.forEach((el: HTMLElement) => {
        if (!(isSCC === this.scc) && el.dataset.empid === `${job.empId}`) {
          elem = el;
        }
        if (isSCC === this.scc && el.dataset.wshopid === `${job.wshopId}`) {
          elem = el;
        }
      });

      let workTime;
      this.workTimes.forEach(time => {
        if (moment(new Date(time.dateSearch)).format('DD/MM/YYYY') === moment(new Date(job.fromActDisplay)).format('DD/MM/YYYY')) {
          workTime = time;
        }
      });

      if (workTime) {
        const morningStart = new Date(workTime.wkAmFrom).getHours();
        const noonEnd = new Date(workTime.wkPmTo).getHours();
        const hourNumbers = noonEnd - morningStart;

        const diff = moment(new Date(job.fromActDisplay), 'DD/MM/YYYY HH:mm:ss').diff(moment(new Date(now), 'DD/MM/YYYY HH:mm:ss'));
        const diffTime = moment.duration(Math.abs(diff));
        let jobTime = diffTime.hours() + (diffTime.minutes() / 60);

        if (this.workTimes.length > 1) {
          if (job.fromActDisplay && job.toActDisplay && moment(new Date(job.fromActDisplay)).format('DD/MM/YYYY') !== moment(new Date(job.toActDisplay)).format('DD/MM/YYYY')) {
            const notWorkingTime = 24 - hourNumbers;
            const dayBetween = Math.round(((job.toActDisplay ? job.toActDisplay : job.toDisplay) - job.fromActDisplay) / this.timeDay);
            jobTime = jobTime - notWorkingTime * dayBetween;
          }
        }

        if (elem) {
          this.elemWidth = 0;
          this.calculateWidthOfProgress(elem, jobTime, hourNumbers);
          elem.classList.add('delay-vehicle');

          if (job.jobType) {
            const clockIconElem = elem.querySelector('.fa-clock-o');
            if (!clockIconElem) {
              const iconElem = elem.querySelector('i');
              if (iconElem && iconElem.parentNode) {
                iconElem.parentNode.removeChild(iconElem);
              }

              const spanElem = elem.querySelector('.ds-register-no-progress');
              const newIconElem = document.createElement('i');
              newIconElem.classList.add('fa');
              newIconElem.classList.add('fa-clock-o');
              if (spanElem) {
                spanElem.insertBefore(newIconElem, spanElem.firstChild);
              }
            }
          }
        }
      } else {
        return 0;
      }
    });
    return {totalActualLate: actualJobCanIncreaseWidth.length, totalPlanLate: carPlanLate.length};
  }

  generatePlan(list, workTimes, rows, isSCC?, listDs?, disable?, byCar?) {
    this.byCar = byCar;
    this.disable = disable;
    this.destroyComponent(this.isSCC);
    this.isSCC = isSCC;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < list.length; i++) {
      this.rows = rows;
      this.workTimes = workTimes;
      const existWShop = rows.find(it => it.id === list[i].wshopId);
      const existEmp = rows.find(it => it.id === list[i].empId);
      const existRegisterNo = rows.find(it => it.registerno === list[i].registerno);
      if ((list[i].state !== ProgressState.stopOutside && existWShop && this.isSCC === this.scc)
        || (this.isSCC === this.ds)
        || (existWShop && this.isSCC === this.rx) || (existRegisterNo && this.isSCC === this.car) || (existWShop && this.isSCC === this.wshop)) {
        this.createPlanComponents(list[i], list[i].state, listDs);
      }
    }
  }

  private createPlanComponents(item, state, listDs?) {
    let workTime;
    let workTimeIndex;

    const length = this.workTimes.length;
    if ([ProgressState.plan, ProgressState.autoSuggest, ProgressState.manualSuggest, ProgressState.autoAppointment, ProgressState.manualAppointment].includes(state)) {
      for (let i = 0; i < length; i++) {
        if (moment(new Date(this.workTimes[i].dateSearch)).format('DD/MM/YYYY') === moment(new Date(item.fromDisplay)).format('DD/MM/YYYY')) {
          workTime = this.workTimes[i];
          workTimeIndex = i;
          break;
        } else if (new Date(item.fromDisplay).getTime() < new Date(this.workTimes[i].dateSearch).getTime()
          && new Date(this.workTimes[i].dateSearch).getTime() < new Date(item.toDisplay).getTime()) {
          workTime = this.workTimes[i];
          workTimeIndex = -1; // Dùng để đánh dấu thời gian sữa chữa chạy qua ngày tìm kiếm
        }
      }
    } else {
      for (let i = 0; i < length; i++) {
        if (moment(new Date(this.workTimes[i].dateSearch)).format('DD/MM/YYYY') === moment(new Date(item.fromActDisplay)).format('DD/MM/YYYY')) {
          workTime = this.workTimes[i];
          workTimeIndex = i;
          break;
        } else if (new Date(item.fromActDisplay).getTime() < new Date(this.workTimes[i].dateSearch).getTime()
          && new Date(this.workTimes[i].dateSearch).getTime() < new Date(item.toActDisplay).getTime()) {
          workTime = this.workTimes[i];
          workTimeIndex = -1; // Dùng để đánh dấu thời gian sữa chữa chạy qua ngày tìm kiếm
        }
      }

    }
    if (workTime) {
      const morningStart = new Date(workTime.wkAmFrom).getHours();
      const noonEnd = new Date(workTime.wkPmTo).getHours();
      const hourNumbers = noonEnd - morningStart;

      const elems = document.querySelectorAll(
        this.isSCC === this.scc ? '.scc-progress-area'
          : this.isSCC === this.ds ? '.ds-progress-area'
          : this.isSCC === this.rx ? '.rx-progress-area'
            : this.isSCC === this.car ? '.car-progress-area'
              : '.wshop-progress-area');
      // this.ref = [];
      const component = this.createResizableProgressComponent(item, state, morningStart, hourNumbers);
      if (component && elems && elems.length) {
        elems[item.index].appendChild(component);
        let additionalClass;
        setTimeout(() => {
          const trackingProgressElem = component.querySelector(
            this.isSCC === this.scc ? '.scc-tracking-progress'
              : this.isSCC === this.ds ? '.ds-tracking-progress'
              : this.isSCC === this.rx ? '.rx-tracking-progress'
                : this.isSCC === this.car ? '.car-tracking-progress'
                  : '.wshop-tracking-progress') as HTMLElement;
          this.elemWidth = 0;
          let span_label;
          if (trackingProgressElem) span_label = trackingProgressElem.querySelector('div span')  as HTMLElement;
          if (trackingProgressElem) {
            let diff = 0;
            let skipTime = 0;

            if (this.isSCC === this.ds) {
              if (state === ProgressState.stopOutside) {
                additionalClass = 'stopping-vehicle';
                skipTime = item.fromActDisplay;
                if (item.toActDisplay) {
                  if (item.toActDisplay <= new Date().getTime()) {
                    diff = moment(new Date(item.fromActDisplay), 'DD/MM/YYYY HH:mm:ss').diff(moment(new Date(item.toActDisplay), 'DD/MM/YYYY HH:mm:ss'));
                  } else {
                    diff = moment(new Date(item.fromActDisplay), 'DD/MM/YYYY HH:mm:ss').diff(moment(new Date(), 'DD/MM/YYYY HH:mm:ss'));
                  }
                } else {
                  diff = moment(new Date(item.fromActDisplay), 'DD/MM/YYYY HH:mm:ss').diff(moment(new Date(), 'DD/MM/YYYY HH:mm:ss'));
                }
              }
            }
            switch (state) {
              // Plan xe đã in LSC
              case ProgressState.plan : {
                additionalClass = 'planning-vehicle';
                skipTime = item.fromDisplay;
                diff = moment(new Date(item.fromDisplay), 'DD/MM/YYYY HH:mm:ss').diff(moment(new Date(item.toDisplay), 'DD/MM/YYYY HH:mm:ss'));
                break;
              }
              case ProgressState.manualSuggest : {
                additionalClass = 'quotation';
                skipTime = item.fromDisplay;
                diff = moment(new Date(item.fromDisplay), 'DD/MM/YYYY HH:mm:ss').diff(moment(new Date(item.toDisplay), 'DD/MM/YYYY HH:mm:ss'));
                break;
              }
              case ProgressState.autoSuggest: {
                additionalClass = 'quotation';
                skipTime = item.fromDisplay;
                diff = moment(new Date(item.fromDisplay), 'DD/MM/YYYY HH:mm:ss').diff(moment(new Date(item.toDisplay), 'DD/MM/YYYY HH:mm:ss'));
                break;
              }
              case ProgressState.autoAppointment: {
                additionalClass = 'appointment';
                skipTime = item.fromDisplay;
                diff = moment(new Date(item.fromDisplay), 'DD/MM/YYYY HH:mm:ss').diff(moment(new Date(item.toDisplay), 'DD/MM/YYYY HH:mm:ss'));
                
                break;
              }
              case ProgressState.manualAppointment: {
                additionalClass = 'appointment';
                skipTime = item.fromDisplay;
                diff = moment(new Date(item.fromDisplay), 'DD/MM/YYYY HH:mm:ss').diff(moment(new Date(item.toDisplay), 'DD/MM/YYYY HH:mm:ss'));
                break;
              }
              case ProgressState.actual: {
                additionalClass = 'fixing-vehicle';
                skipTime = item.fromActDisplay;

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
                break;
              }
              case ProgressState.stopInside: {
                additionalClass = 'stopping-vehicle';
                skipTime = item.fromActDisplay;
                if (item.toActDisplay) {
                  if (item.toActDisplay <= new Date().getTime()) {
                    diff = moment(new Date(item.fromActDisplay), 'DD/MM/YYYY HH:mm:ss').diff(moment(new Date(item.toActDisplay), 'DD/MM/YYYY HH:mm:ss'));
                  } else {
                    if(item.toTimePlan > new Date().getTime())
                      diff = moment(new Date(item.fromActDisplay), 'DD/MM/YYYY HH:mm:ss').diff(moment(new Date(item.toTimePlan), 'DD/MM/YYYY HH:mm:ss'));
                    else
                      diff = moment(new Date(item.fromActDisplay), 'DD/MM/YYYY HH:mm:ss').diff(moment(new Date(), 'DD/MM/YYYY HH:mm:ss'));
                  }
                } else {
                  if(item.toTimePlan > new Date().getTime())
                    diff = moment(new Date(item.fromActDisplay), 'DD/MM/YYYY HH:mm:ss').diff(moment(new Date(item.toTimePlan), 'DD/MM/YYYY HH:mm:ss'));
                  else
                    diff = moment(new Date(item.fromActDisplay), 'DD/MM/YYYY HH:mm:ss').diff(moment(new Date(), 'DD/MM/YYYY HH:mm:ss'));
                }
                
                break;
              }
              case ProgressState.complete: {
                additionalClass = 'complete-vehicle';
                skipTime = item.fromActDisplay;
                diff = moment(new Date(item.fromActDisplay), 'DD/MM/YYYY HH:mm:ss').diff(moment(new Date(item.toActDisplay), 'DD/MM/YYYY HH:mm:ss'));
                break;
              }

              case ProgressState.performed: {
                additionalClass = 'performed-vehicle';
                skipTime = item.fromActDisplay;
                diff = moment(new Date(item.fromActDisplay), 'DD/MM/YYYY HH:mm:ss').diff(moment(new Date(item.toActDisplay), 'DD/MM/YYYY HH:mm:ss'));
                break;
              }
            }

            this.changeColorLateCar(item, trackingProgressElem);
            trackingProgressElem.classList.add(additionalClass);
            // ẩn các xe đã thực hiện, hoàn thành, (dừng trong khoang và đã có thời gian kết thúc)
            if ((item.state === ProgressState.complete || item.state === ProgressState.performed) && this.isSCC === this.scc)
            trackingProgressElem.classList.add("hide");

            if (item.state === ProgressState.stopInside && item.toTimeAct && this.isSCC === this.scc) {
              trackingProgressElem.classList.add("hide");
              trackingProgressElem.classList.add("hide-stopinside");
            }
            const color = listDs ? listDs.find(it => it.id === item.bpId).color : null;
            // Xét màu ds
            if (color) {
              trackingProgressElem.classList.add('ds');
              trackingProgressElem.style.background = color;
            }
            const diffTime = moment.duration(Math.abs(diff));
            let jobTime = diffTime.days() * 24 + diffTime.hours() + (diffTime.minutes() / 60);
            if (jobTime) {
              // nếu công việc kéo dài vài ngày thì phải trừ đi thời gian nghỉ (vd từ 6h tối nay đến 8h sáng mai)
              // if (this.workTimes.length > 1) {
              const dayWorking = [];
              this.workTimes.forEach(it => dayWorking.push((new Date(it.dateSearch)).getDate()));
              if (state === ProgressState.plan || state === ProgressState.autoAppointment || state === ProgressState.autoSuggest || state === ProgressState.manualAppointment ||
                  state === ProgressState.manualSuggest) {
                if (item.fromDisplay && item.toDisplay && moment(new Date(item.fromDisplay)).format('DD/MM/YYYY') !== moment(new Date(item.toDisplay)).format('DD/MM/YYYY')) {
                  // Tính số ngày nghỉ trong khoảng thời gian tiến độ
                  let countDayNotWorking = 0;
                  // Sử dụng monent-range để tính khoảng thời gian
                  const dateRange = momentRange.range(new Date(item.fromDisplay), new Date(item.toDisplay)).snapTo('day');

                  const days = Array.from(dateRange.by('days'));

                  // Danh sách các ngày trải qua của CV
                  const arrDay = days.map(m => Number(m.format('DD')));


                  for (const i of arrDay) {
                    if (!dayWorking.includes(i) && item.arrDaySearch.includes(i)) {
                      countDayNotWorking += 1;
                    }
                  }
                  if (workTimeIndex < 0) {
                    workTimeIndex = -(indexOf(arrDay, item.arrDaySearch[0]));
                  }
                  // Trường hợp ngày cuối cùng rơi vào ngày nghỉ
                  let toDisplay = 0;
                  if (!dayWorking.includes(new Date(item.toDisplay).getDate()) && new Date(item.toDisplay).getDate() < dayWorking[dayWorking.length - 1]) {
                    toDisplay = new Date(this.workTimes[0].wkPmTo).getHours() - new Date(item.toDisplay).getHours() - new Date(item.toDisplay).getMinutes() / 60;
                  }
                  const notWorkingTime = 24 - hourNumbers;
                  // Các ngày ở giữa
                  const dayBetween = arrDay.length;
                  
                  // Thời gian hiển thị
                  jobTime = jobTime - notWorkingTime * (dayBetween - 1) - countDayNotWorking * hourNumbers;
                }

              } else if ((state === ProgressState.actual || state === ProgressState.stopInside) && !item.toActDisplay) {
                // Tính số ngày nghỉ trong khoảng thời gian tiến độ
                let countDayNotWorking = 0;

                // Sử dụng monent-range để tính khoảng thời gian
                const dateRange = momentRange.range(new Date(item.fromActDisplay), new Date()).snapTo('day');

                const days = Array.from(dateRange.by('days'));
                // Danh sách các ngày trải qua của CV
                const arrDay = days.map(m => Number(m.format('DD')));

                for (const i of arrDay) {
                  if (!dayWorking.includes(i) && item.arrDaySearch.includes(i)) {
                    countDayNotWorking += 1;
                  }
                }
                if (workTimeIndex < 0) {
                  workTimeIndex = -(indexOf(arrDay, item.arrDaySearch[0]));
                }
                let toDisplay = 0;
                // Trường hợp ngày cuối cùng rơi vào ngày nghỉ
                if (!dayWorking.includes(new Date(item.toDisplay).getDate()) && new Date(item.toDisplay).getDate() < dayWorking[dayWorking.length - 1]) {
                  toDisplay = new Date(this.workTimes[0].wkPmTo).getHours() - new Date(item.toDisplay).getHours() - new Date(item.toDisplay).getMinutes() / 60;
                }
                const notWorkingTime = 24 - hourNumbers;
                // Các ngày ở giữa
                const dayBetween = arrDay.length;
                // Thời gian hiển thị
                jobTime = jobTime - notWorkingTime * (dayBetween - 1) - countDayNotWorking * hourNumbers;

              } else {
                if (item.fromActDisplay && item.toActDisplay
                  && moment(new Date(item.fromActDisplay)).format('DD/MM/YYYY') !== moment(new Date(item.toActDisplay)).format('DD/MM/YYYY')) {
                  // Tính số ngày nghỉ trong khoảng thời gian tiến độ
                  let countDayNotWorking = 0;

                  // Sử dụng monent-range để tính khoảng thời gian
                  const dateRange = momentRange.range(new Date(item.fromDisplay), new Date(item.toDisplay)).snapTo('day');

                  const days = Array.from(dateRange.by('days'));
                  // Danh sách các ngày trải qua của CV
                  const arrDay = days.map(m => Number(m.format('DD')));

                  for (const i of arrDay) {
                    if (!dayWorking.includes(i) && item.arrDaySearch.includes(i)) {
                      countDayNotWorking += 1;
                    }
                  }

                  if (workTimeIndex < 0) {
                    workTimeIndex = -(indexOf(arrDay, item.arrDaySearch[0]));
                  }
                  let toDisplay = 0;
                  // Trường hợp ngày cuối cùng rơi vào ngày nghỉ
                  if (!dayWorking.includes(new Date(item.toDisplay).getDate()) && new Date(item.toDisplay).getDate() < dayWorking[dayWorking.length - 1]) {
                    toDisplay = new Date(this.workTimes[0].wkPmTo).getHours() - new Date(item.toDisplay).getHours() - new Date(item.toDisplay).getMinutes() / 60;
                  }
                  const notWorkingTime = 24 - hourNumbers;
                  // Các ngày ở giữa
                  const dayBetween = arrDay.length;
                  // Thời gian hiển thị
                  jobTime = jobTime - notWorkingTime * (dayBetween - 1) - countDayNotWorking * hourNumbers;

                }

              }
              // }
              
              
              this.calculateWidthOfProgress(trackingProgressElem, jobTime, hourNumbers);
            } else {
              trackingProgressElem.style.width = '0%';
            }

            trackingProgressElem.style.left = `${(this.calculateSkipTimes(new Date(skipTime), morningStart, hourNumbers) + 100 * workTimeIndex) / this.workTimes.length}%`;
            // span_label.style.right =
            let left = parseFloat(trackingProgressElem.style.left.replace('%', ''));
            let width_progress = parseFloat(trackingProgressElem.style.width.replace('%', ''))
            if (span_label) span_label.style.left = `calc(50% - 21px)`
          }
        }, 100);
      }
    }
  }

  private changeColorLateCar(item, trackingProgressElem) {
    if(item.lateCar === 1) {
      if (!(this.isSCC === this.scc)) {
        // nếu là đồng sơn thì biến additionalClass đã dùng để đại diện cho kiểu công việc nên phải thêm tay class fixing
        trackingProgressElem.classList.add('fixing-vehicle');
      }

      trackingProgressElem.classList.add('delay-vehicle');
    }
  }

  private createResizableProgressComponent(val, state, morningStart, hourNumbers, estimateTime?) {
    const componentRef = this.resolver.resolveComponentFactory(ResizeableProgressComponent).create(this.injector);
    componentRef.instance.isSCC = this.isSCC;
    componentRef.instance.morningStart = morningStart;
    componentRef.instance.val = val;
    componentRef.instance.state = state;
    componentRef.instance.rows = this.rows;
    componentRef.instance.hourNumbers = hourNumbers;
    componentRef.instance.workTimes = this.workTimes;
    componentRef.instance.estimateTime = val.estimateTime;
    componentRef.instance.disable = this.disable;
    if ([ProgressState.stopInside, ProgressState.stopOutside, ProgressState.performed, ProgressState.complete].includes(state)) {
      componentRef.instance.disable_drag = true;
    }
    componentRef.instance.byCar = this.byCar;
    if (this.isSCC === this.scc) {
      this.refSCC.push(componentRef);
    } else if (this.isSCC === this.ds) {
      this.refDS.push(componentRef);
    } else if (this.isSCC === this.wshop) {
      this.refWshop.push(componentRef);
    } else if (this.isSCC === this.car) {
      this.refCar.push(componentRef);
    } else {
      this.refRX.push(componentRef);
    }
    return (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
  }

  private addEstimateTime(estimateTime){
    const componentRef = this.resolver.resolveComponentFactory(ResizeableProgressComponent).create(this.injector);
    componentRef.instance.estimateTime = estimateTime;

  }

  // tính width
  private calculateWidthOfProgress(divElem, jobTime, hourNumbers) {
    if (jobTime <= 0) {
      divElem.style.width = '0%';
    } else {
      if (jobTime <= 1) {
        // cộng (100 / hourNumbers) vì với độ dài 100% có `hourNumbers` cột
        this.elemWidth = this.elemWidth + ((jobTime * 100) * (100 / hourNumbers) / 100);
        divElem.style.width = `${this.elemWidth / this.workTimes.length}%`;
      } else {
        // cộng (100 / hourNumbers) vì với độ dài 100% có `hourNumbers` cột
        this.elemWidth += (100 / hourNumbers);
        jobTime -= 1;
        this.calculateWidthOfProgress(divElem, jobTime, hourNumbers);
      }
    }
  }

  private calculateBreaktime(start, end, workingStart, columnsNum, elems, workTimeIndex, min_step_minute, time?) {
    // start và end là giờ bắt đâu và kết thúc nghỉ
    // workingStart là giờ bắt đầu làm việc trong ngày
    const startHour = start.getHours();
    const startMinute = start.getMinutes();
    const endHour = end.getHours();
    const endMinute = end.getMinutes();

    if (startHour < endHour || (startHour === endHour && startMinute < endMinute)) {
      const diff = moment(end, 'DD/MM/YYYY HH:mm:ss').diff(moment(start, 'DD/MM/YYYY HH:mm:ss'));
      const diffTime = moment.duration(Math.abs(diff)).hours() + (moment.duration(Math.abs(diff)).minutes() / 60);

      elems.forEach((elem, index) => {
        const newDiv = document.createElement('div');
        newDiv.classList.add('break-time');
        newDiv.classList.add(this.isSCC === this.scc ? 'scc-break-time'
          : this.isSCC === this.ds ? 'ds-break-time'
            : this.isSCC === this.rx ? 'rx-break-time'
              : this.isSCC === this.car ? '"25G73743"car-break-time'
                : 'wshop-break-time');

        // tất cả đều chia cho workTimes.length vì nếu hiển thị 1 ngày làm việc thì độ dài là 100%, 2 ngày là 200%
        // VD: view từ 10 -> 12 thì ngày 10 ở độ dài 0% -> 100%, ngày 11 ở độ dài 100% -> 200%, ngày 12 ở độ dài 200% -> 300%
        newDiv.style.width = ((diffTime * 100 / columnsNum) / this.workTimes.length) + '%';
        newDiv.style.left = (((startHour + startMinute / 60) - workingStart) * 100 / columnsNum) / this.workTimes.length
          + (100 / this.workTimes.length) * workTimeIndex + '%';

        // khối break-time cuối cùng bị lệch style 1 chút, tính như này để cho cân
        if (index === elems.length - 1) {
          newDiv.style.height = `${elem.getBoundingClientRect().height - 1}px`;
        }

        if (!time) {  
          // tính tổng số dòng phải vẽ trong 1 ngày
          let total_line = columnsNum * 60 / min_step_minute;
          
          for (let i = 0; i < total_line ; i++) {
            if (i < total_line - 1) {
              const div = document.createElement('div');
              div.classList.add('time');
              // div.style.width = ((diffTime * 100 * lineInHour / columnsNum) / this.workTimes.length đại diện 1h
              div.style.width = ((100 / total_line) / this.workTimes.length) + '%';
              div.style.left = ((100 / total_line) * i + 100* workTimeIndex) / this.workTimes.length + '%';
              elem.appendChild(div);
            } else {
              // vẽ cột cuối cùng
              if (60 % min_step_minute == 0) {
                const div = document.createElement('div');
                div.classList.add('time');
                // div.style.width = ((diffTime * 100 * lineInHour / columnsNum) / this.workTimes.length đại diện 1h
                div.style.width = ((100 / total_line) / this.workTimes.length) + '%';
                div.style.left = ((100 / total_line) * i + 100* workTimeIndex) / this.workTimes.length + '%';
                elem.appendChild(div);
              } else { // trường hợp cột cuối cùng bị dư thời gian
                let length_of_last_column = Math.abs(60 * columnsNum - Math.floor(total_line) * min_step_minute);
                const div = document.createElement('div');
                div.classList.add('time');
                // div.style.width = ((diffTime * 100 * lineInHour / columnsNum) / this.workTimes.length đại diện 1h
                // let length_of_last_column = Math.abs(total_line * min_step_minute -)
                div.style.width = ((100 / total_line) / this.workTimes.length) * (length_of_last_column / min_step_minute) + '%';
                div.style.left = ((100 / total_line) * i + 100* workTimeIndex) / this.workTimes.length + '%';
                elem.appendChild(div);
              }
            }
            

          }

          // for (let i = 0; i < columnsNum; i++) {
          //   const lineInHour = 4;
          //   const left = (((workingStart + 60 / 60) - workingStart) * 100 / columnsNum) / this.workTimes.length / lineInHour;
          //   for (let j = 0; j < lineInHour; j++) {
          //     const div = document.createElement('div');
          //     div.classList.add('time');
          //     // div.style.width = ((diffTime * 100 * lineInHour / columnsNum) / this.workTimes.length đại diện 1h
          //     div.style.width = ((diffTime * 100 * lineInHour / columnsNum) / this.workTimes.length / (lineInHour * lineInHour)) + '%';
          //     div.style.left = ((((workingStart + i * 60 / 60) - workingStart) * 100 / columnsNum) / this.workTimes.length
          //       + (100 / this.workTimes.length) * workTimeIndex + left * j) + '%';
          //     elem.appendChild(div);

          //   }
          // }
        }
        elem.appendChild(newDiv);
      });
    }
  }

  destroyComponent(isSCC) {
    if (this.refSCC && isSCC === this.scc) {
      this.refSCC.forEach(it => it.destroy());
    } else if (this.refDS && isSCC === this.ds) {
      this.refDS.forEach(it => it.destroy());
    } else if (this.refWshop && isSCC === this.wshop) {
      this.refWshop.forEach(it => it.destroy());
    } else if (this.refCar && isSCC === this.car) {
      this.refCar.forEach(it => it.destroy());
    } else {
      this.refRX.forEach(it => it.destroy());
    }
  }
}
