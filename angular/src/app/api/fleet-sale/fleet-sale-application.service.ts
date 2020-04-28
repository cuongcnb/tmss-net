import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class FleetSaleApplicationService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/fleet/fleet_application', true);
  }

  searchFleetApp(fleetHeaderForm) {
    return this.post('/filter', fleetHeaderForm);
  }

  createNewFleetApp(newFleetApp) {
    return this.post('', newFleetApp);
  }

  getDlrRefNo(dealerId) {
    return this.get(`/dlr_ref_no/${dealerId}`);
  }

  getTmvRefNo() {
    return this.get('/tmv_ref_no');
  }

  getFleetData(fleetAppId) {
    return this.get(`/fleet_app/${fleetAppId}`);
  }

  approveFleetApp(fleetAppId, dataToApprove, save?) {
    const requestQuery = save ? `/approve?fleet_app_id=${fleetAppId}&style=save` : `/approve?fleet_app_id=${fleetAppId}&style=draft`;
    return this.put(requestQuery, dataToApprove);
  }

  rejectFleetApp(fleetAppId) {
    return this.put('/reject', fleetAppId);
  }

  cancelFleetApp(fleetAppId) {
    return this.put(`/cancel/${fleetAppId}`);
  }

  updateFleetApp(fleetAppId, FleetAppUpdate, save?) {
    const requestQuery = save ? `?fleet_application_id=${fleetAppId}&style=save` : `?fleet_application_id=${fleetAppId}&style=draft`;
    return this.put(requestQuery, FleetAppUpdate);
  }

  changeFleetAppRequest(fleetApp, requestIntentionAndDelivery) {
    return this.put(`/change/${fleetApp.id}`, requestIntentionAndDelivery);
  }

  getFleetAppHistoryByFleetAppId(fleetApp) {
    return this.get(`/fleet_app_history/${fleetApp.id}`);
  }

  getHistoryTablesByFleetAppHistory(fleetAppHistory) {
    return this.get(`/fleet_app_history/detail/${fleetAppHistory.id}`);
  }

  saveHistoryNote(fleetAppHistory, isTMV, note) {
    return this.put(`/fleet_app_history/detail/${fleetAppHistory.id}/note/is_tmv/${isTMV}`, note);
  }
}
