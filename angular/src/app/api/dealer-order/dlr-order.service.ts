import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class DlrOrderService extends BaseApiSaleService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/dlr_order', true);
  }
  getData(dlrOrder) {
    return this.post('/search', dlrOrder);
  }
  getDataSecond(dlrOrder) {
    return this.post('/searchSecond', dlrOrder);
  }
  insertDlrOrder(dlrId, orderDate, dlrOrder) {
    return this.post(`?dlr_id=${dlrId}&order_date=${orderDate}`, dlrOrder);
  }

  updateDlrOrder(dlrOrder) {
    return this.put(`/${dlrOrder.id}`, dlrOrder);
  }
  getCbuData(dlrOrder) {
    return this.post('/searchCbu', dlrOrder);
  }
  getCbuSecondData(dlrOrder) {
    return this.post('/searchCbuSecond', dlrOrder);
  }
  insertDlrOrderCbu(dlrId, orderDate, dlrOrder) {
    return this.post(`/save_cbu?dlr_id=${dlrId}&order_date=${orderDate}`, dlrOrder);
  }
  //
  saveTempCbuColorOrder(dlrOrder) {
    return this.post('/save_temp_cbu_color', dlrOrder);
  }
  saveCbuColorOrder() {
    return this.post('/save_cbu_color');
  }
  //
  getDealerSalesTargetData(dlrOrder) {
    return this.post('/searchDealerSalesTarget', dlrOrder);
  }

  getDealerSalesTargetFleetData(dlrOrder) {
    return this.post('/searchDealerSalesTargetFleet', dlrOrder);
  }
  getDealerSalesPlanData(dlrOrder) {
    return this.post('/searchDealerSalesPlan', dlrOrder);
  }
  getDealerOrderData(dlrOrder) {
    return this.post('/searchDealerOrder', dlrOrder);
  }
  getDealerRunDownData(dlrOrder) {
    return this.post('/searchDealerRunDown', dlrOrder);
  }
  getDealerNenkeiData(dlrOrder) {
    return this.post('/searchDealerNenkei', dlrOrder);
  }
  getDealerAllocationData(dlrOrder) {
    return this.post('/searchDealerAllocation', dlrOrder);
  }
  getDealerCbuColorOrderData(dlrOrder) {
    return this.post('/searchDealerCbuColorOrder', dlrOrder);
  }

  getDealerOrderTemplate(searchData) {
    return this.download('/export_template_sale_order', searchData);
  }

  getDealerColorOrderTemplate(searchData) {
    return this.download('/export_template_color_order', searchData);
  }

  getSummaryDealerColorOrderTemplate(searchData) {
    return this.download('/export_summary_color_order', searchData);
  }

  getDealerPlanTemplate(searchData) {
    return this.download('/export_template_sale_plan', searchData);
  }

  // getDealerRundownTemplate(searchData) {
  //   return this.download('/export_template_dealer_rundown', searchData);
  // }
  getDealerRundownTemplate(searchData) {
    return this.download('/export_template_dealer_rundown', searchData);
  }
  //
  // getDealerNenkei(searchData) {
  //   return this.download('/export_template_dealer_nenkei', searchData);
  // }

  getDealerOrderReport(searchData) {
    return this.download('/dealer-report', searchData);
  }

  getOrderColorCbuReport(searchData) {
    return this.download('/order-color-cbu', searchData);
  }
}
