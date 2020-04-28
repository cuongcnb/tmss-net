import {Injectable, Injector} from '@angular/core';
import {BaseApiService} from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class RoWshopActApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/ro-wshop-act');
  }

  // chuyển plan job sang actual job
  startSccJob(data, isCarWash?, isCusWait?, isTakeParts?, qcLevel?) {
    const carWash = isCarWash ? `isCarWash=${isCarWash}` : `isCarWash=N`;
    const cusWait = isCusWait ? `&isCusWait=${isCusWait}` : `&isCusWait=N`;
    const takeParts = isTakeParts ? `&isTakeParts=${isTakeParts}` : `&isTakeParts=N`;
    const qc = qcLevel ? `&qcLevel=${qcLevel}` : `&qcLevel=1`;
    return this.post(`/start-job-scc?${carWash}${cusWait}${takeParts}${qc}`, data);
  }


  finishSccJob(data, isCarWash?, isCusWait?, isTakeParts?, qcLevel?) {
    const carWash = isCarWash ? `isCarWash=${isCarWash}` : `isCarWash=N`;
    const cusWait = isCusWait ? `&isCusWait=${isCusWait}` : `&isCusWait=N`;
    const takeParts = isTakeParts ? `&isTakeParts=${isTakeParts}` : `&isTakeParts=N`;
    const qc = qcLevel ? `&qcLevel=${qcLevel}` : `&qcLevel=1`;
    return this.post(`/finish-job-scc?${carWash}${cusWait}${takeParts}${qc}`, data);
  }

  finishRxJob(data) {
    return this.post('/finish-job-rx', data);
  }

  startRxJob(data) {
    return this.post('/start-job-rx', data);
  }

  freePlanRx(id) {
    return this.post(`/free-plan-rx/${id}`);
  }

  freePlanDs(id) {
    return this.post(`/free-plan-ds/${id}`);
  }

  // chuyển xe về Xe chờ
  freePlanScc(data, isCarWash?, isCusWait?, isTakeParts?, qcLevel?) {
    const carWash = isCarWash ? `isCarWash=${isCarWash}` : `isCarWash=N`;
    const cusWait = isCusWait ? `&isCusWait=${isCusWait}` : `&isCusWait=N`;
    const takeParts = isTakeParts ? `&isTakeParts=${isTakeParts}` : `&isTakeParts=N`;
    const qc = qcLevel ? `&qcLevel=${qcLevel}` : `&qcLevel=1`;
    return this.post(`/free-plan-scc?${carWash}${cusWait}${takeParts}${qc}`, data);
  }

  // chuyển từ xe chờ về list -> thành status plan
  activePlanScc(data, isCarWash?, isCusWait?, isTakeParts?, qcLevel?) {
    const carWash = isCarWash ? `isCarWash=${isCarWash}` : `isCarWash=N`;
    const cusWait = isCusWait ? `&isCusWait=${isCusWait}` : `&isCusWait=N`;
    const takeParts = isTakeParts ? `&isTakeParts=${isTakeParts}` : `&isTakeParts=N`;
    const qc = qcLevel ? `&qcLevel=${qcLevel}` : `&qcLevel=1`;
    return this.post(`/active-plan-scc?${carWash}${cusWait}${takeParts}${qc}`, data);
  }

  // thay đổi state, dùng cho dừng trong khoang/ngoài khoang/bắt đầu lại
  changeStateJobScc(data) {
    // const carWash = isCarWash ? `isCarWash=${isCarWash}` : `isCarWash=N`;
    // const cusWait = isCusWait ? `&isCusWait=${isCusWait}` : `&isCusWait=N`;
    // const takeParts = isTakeParts ? `&isTakeParts=${isTakeParts}` : `&isTakeParts=N`;
    // const qc = qcLevel ? `&qcLevel=${qcLevel}` : `&qcLevel=1`;
    return this.post('/change-state-scc', data);
  }

  checkFinishScc(actualId) {
    if (actualId) {
      return this.post(`/check-finish-scc/${actualId}`);
    }
  }

  finishScc(data) {
    return this.post(`/finish-scc`, data);
  }

  // changeStateJobDs(data, isCarWash?, isCusWait?, isTakeParts?, qcLevel?) {
  //   const carWash = isCarWash ? `isCarWash=${isCarWash}` : `isCarWash=N`;
  //   const cusWait = isCusWait ? `&isCusWait=${isCusWait}` : `&isCusWait=N`;
  //   const takeParts = isTakeParts ? `&isTakeParts=${isTakeParts}` : `&isTakeParts=N`;
  //   const qc = qcLevel ? `&qcLevel=${qcLevel}` : `&qcLevel=1`;
  //   return this.post(`/change-state-ds?${carWash}${cusWait}${takeParts}${qc}`, data);
  // }
  changeStateJobDs(obj) {
    return this.post(`/change-state-ds`, obj);
  }

  startJobDs(obj) {
    return this.post(`/start-job-ds`, obj);
  }

  finishJobDs(obj) {
    return this.post(`/finish-job-ds`, obj);
  }

  activePlanRx(data) {
    return this.post('/active-plan-rx', data);
  }

  changeStateJobRx(data) {
    return this.post('/change-state-rx', data);
  }

  // danh sách job cho đồng sơn
  searchRoWshopDs(data) {
    return this.post('/ro-wshop-ds', data);
  }

  searchRoWshopDsByWshop(data) {
    return this.post('/ro-wshop-ds-by-wshop', data);
  }
  
  finishWshopAct(roId) {
    return this.post(`/complete-ro-ds/${roId}`, {});
  }

  // xóa job
  disableJobDs(idList: Array<number>) {
    return this.post('/disable-job-ds', idList);
  }

  cancelCarWash(wpId) {
    return this.post(`/cancel-wait-rx/${wpId}`);
  }


  startJobScc(data) {
    return this.post('/start-job-scc', data);
  }

  finishJobScc(data) {
    return this.post('/finish-job-scc', data);
  }

  continueJobScc(data) {
    return this.post('/continue-job-scc', data);
  }

  continueJobDSOutSide(data) {
    return this.post('/continue-job-ds', data);
  }

  finishJobRx(wpId) {
    return this.post(`/cancel-wait-rx/${wpId}`);
  }
}
