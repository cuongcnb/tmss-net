import {Injectable, Injector} from '@angular/core';
import {BaseApiService} from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';
import {ProgressState} from '../../core/constains/progress-state';
import * as moment from 'moment';


@Injectable()
export class RoWshopApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/ro-wshop');
  }

  // Xe chờ SCC
  getRoNoPlan(obj) {
    return this.post('/ro-no-plan', obj);
  }

  getRoNoPlanRx(obj) {
    return this.post('/car-washing-no-plan', obj);
  }

  // Xe chờ DS
  getRoNoPlanDS(obj) {
    return this.post('/ro-no-plan-ds', obj);
  }

  searchRoScc(searchData) {
    return this.post('/ro-scc', searchData);
  }

  searchRoRx(searchData) {
    return this.post('/ro-rx', searchData);
  }

  searchRoDS(searchData) {
    return this.post('/ro-ds', searchData);
  }

  // đổi khoang và tăng thời gian
  changePlanScc(data, isCarWash?, isCusWait?, isTakeParts?, qcLevel?) {

    const carWash = isCarWash ? `isCarWash=${isCarWash}` : `isCarWash=N`;
    const cusWait = isCusWait ? `&isCusWait=${isCusWait}` : `&isCusWait=N`;
    const takeParts = isTakeParts ? `&isTakeParts=${isTakeParts}` : `&isTakeParts=N`;
    const qc = qcLevel ? `&qcLevel=${qcLevel}` : `&qcLevel=1`;
    const diff = moment(new Date(data.fromDatetime), 'DD/MM/YYYY HH:mm:ss').diff(moment(new Date(data.toDatetime), 'DD/MM/YYYY HH:mm:ss'));

    const estimate = Math.floor(Math.abs(diff) / 60000);
    data.estimateTime = estimate;
    return this.post(`/change-plan-scc?${carWash}${cusWait}${takeParts}${qc}`, data);
  }

  changeActualScc(data) {
    const diff = moment(new Date(data.fromDatetime), 'DD/MM/YYYY HH:mm:ss').diff(moment(new Date(data.toDatetime), 'DD/MM/YYYY HH:mm:ss'));

    const estimate = Math.floor(Math.abs(diff) / 60000);
    data.estimateTime = estimate;
    return this.post(`/change-actual-scc`, data);
  }

  changeActualDs(data) {
    const diff = moment(new Date(data.fromDatetime), 'DD/MM/YYYY HH:mm:ss').diff(moment(new Date(data.toDatetime), 'DD/MM/YYYY HH:mm:ss'));

    const estimate = Math.floor(Math.abs(diff) / 60000);
    data.estimateTime = estimate;
    return this.post(`/change-actual-ds`, data);
  }

  clonePlan(data, isCarWash?, isCusWait?, isTakeParts?, qcLevel?) {
    const carWash = isCarWash ? `isCarWash=${isCarWash}` : `isCarWash=N`;
    const cusWait = isCusWait ? `&isCusWait=${isCusWait}` : `&isCusWait=N`;
    const takeParts = isTakeParts ? `&isTakeParts=${isTakeParts}` : `&isTakeParts=N`;
    const qc = qcLevel ? `&qcLevel=${qcLevel}` : `&qcLevel=1`;
    return this.post(`/clone-plan?${carWash}${cusWait}${takeParts}${qc}`, data);
  }

  createPlanDs(obj, wpId, isCarWash, isCusWait, isTakeParts, qcLevel?) {
    const carWash = isCarWash ? `isCarWash=${isCarWash}` : `isCarWash=N`;
    const cusWait = isCusWait ? `&isCusWait=${isCusWait}` : `&isCusWait=N`;
    const takeParts = isTakeParts ? `&isTakeParts=${isTakeParts}` : `&isTakeParts=N`;
    const qc = qcLevel ? `&qcLevel=${qcLevel}` : `&qcLevel=1`;
    return this.post(`/create-plan-ds/${wpId}?${carWash}${cusWait}${takeParts}${qc}`, obj);
  }

  createNewPlanDs(obj) {
    return this.post(`/create-new-plan-ds`, obj);
  }

  changePlanDs(obj) {
    const diff = moment(new Date(obj.fromDatetime), 'DD/MM/YYYY HH:mm:ss').diff(moment(new Date(obj.toDatetime), 'DD/MM/YYYY HH:mm:ss'));

    const estimate = Math.floor(Math.abs(diff) / 60000);
    obj.estimateTime = estimate;
    return this.post(`/change-plan-ds`, obj);
  }

  removePlanDs(id) {
    return this.post(`/remove-one-plan-ds/${id}`);
  }

  changePlanRx(data) {
    return this.post('/change-plan-rx', data);
  }
  // stopInside = 2,
  // stopOutside = 3,
  // performed = 0
  getRepairPlan(planId, actualId?, state?) {
    if (actualId) {
      return this.get(`/repair-plan/${planId}?actualId=${actualId}`);
    } else {
      return this.get(`/repair-plan/${planId}`);
    }
  }


  getEmpPlan(empName?, roType?) {
    if (empName) return this.get(`/emp-plan?empName=${empName}&roType=${roType}`)
    else return this.get(`/emp-plan?roType=${roType}`);
  }

  removePlanScc(roWshopId) {
    return this.get(`/remove-plan-scc/${roWshopId}`);
  }

  getPlanDs(planId, actualId?, state?) {
    if (actualId) {
      return this.get(`/repair-plan-ds/${planId}?actualId=${actualId}`);
    } else {
      return this.get(`/repair-plan-ds/${planId}`);
    }
  }

  createPlanScc(roId) {
    return this.get(`/create-plan-scc/${roId}`);
  }

  // tiến độ sc
  searchRepairInfo(type, obj) {
    return this.post(`/search-repair-info/${type}`, obj);
  }

  searchActualInfo(type, obj) {
    return this.post(`/search-actual-info/${type}`, obj);
  }


  searchWaitDelivery(obj) {
    return this.post(`/search-wait-delivery`, obj);
  }

  searchPedingWork(obj) {
    return this.post(`/search-pending-work`, obj);
  }

  cancelAllSuggest(id, isApp) {
    return this.post(`/cleanup-suggest?id=${id}&isApp=${isApp}`);
  }

  cancelSuggest(id, isApp) {
    return this.post(`/remove-one-plan?id=${id}&isApp=${isApp}`);
  }

  carSuccess(isComplete, data) {
    return this.post(`/complete-the-plan?isComplete=${isComplete}`, data);
  }

  getWshopFree(fromDate, toDate) {
    return this.get(`/get-wshop-free?fromDate=${fromDate}&toDate=${toDate}`);
  }

  pendingOutScc(obj) {
    return this.post('/pending-out-scc', obj);
  }

  getEmpByTime(data) {
    return this.post('/list-employee', data);
  }

  changeEmployeePlan(data) {
    return this.post('/change-employee-plan', data);
  }

  getDsByWshop(data) {
    return this.post('/ro-ds-by-wshop', data);
  }

  searchRoWshopDsVehicle(data) {
    return this.post('/ro-ds-by-vehicle', data);
  }
}