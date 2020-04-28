import {Injectable, Injector} from '@angular/core';
import {BaseApiService} from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class ServiceReportApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('');
  }

  // Bao cao xuat nhap phu tung
  partImportExportReport(data) {
    return this.download('/parts-report/import-export-report', data);
  }

  // Báo cáo điều chỉnh số lượng phụ tùng
  partAmountAdjustmentReport(data) {
    return this.download('/parts-report/adjusted-part-quantities-report', data);
  }

  // BC phân cấp kiểm tra chất lượng
  decentralizedInspectionAgentQuality(data) {
    return this.download('/parts-report/decentralized-inspection-agent-quality', data);
  }

  // Báo cáo tỉ lệ cung cấp phụ tùng theo mã phụ tùng
  partSupplyRateByPartCodeReport(data) {
    return this.download('/parts-report/rate-provide-parts-report', data);
  }

  // Báo cáo tỷ lệ cung cấp phụ tùng theo RO
  partsSupplyRatioReport(data) {
    return this.download('/parts-report/rate-provide-parts-sr', data);
  }

  // Báo cáo nhận hàng
  receiveReport(data) {
    return this.download('/report/report-receiving', data);
  }

  // Bao cao tong hop Ro theo ngay
  reportRoDaily(data) {
    return this.download('/parts-report/ro-over-all', data);
  }

  // Báo cáo kiểm kê tồn kho theo giá đích danh
  partsCheckInventoryReportDownload(data) {
    return this.download('/parts-report/parts-instock-bycode', data);
  }

  // Báo cáo lịch sử bán hàng 1 PT
  partsExportReport(data) {
    return this.download('/parts-report/parts-export-report', data);
  }

  // Báo cáo hàng TMV còn nợ
  partsDebitInquiry(data) {
    return this.download('/parts-report/parts-debit-inquiry', data);
  }

  // Báo cáo xuất bán lẻ
  reportRetailShipping(data) {
    return this.download('/report/report-retail-shipping', data);
  }

  // Báo cáo kiểm kê PT tồn kho
  partsInstockDlr(data) {
    return this.download('/parts-report/parts-instock-dlr', data);
  }

  //  Báo cáo lịch sử nhập xuất phụ tùng
  impExpParthis(data) {
    return this.download('/parts-report/imp-exp-parthis', data);
  }

  //  BC Service rate và RO Fill rate theo ngàynăm
  reportServiceRate(data) {
    return this.download('/report/report-service-rate', data);
  }

  //  BC tổng hợp bán lẻ phụ tùng
  csOverAll(data) {
    return this.download('/parts-report/cs-over-all', data);
  }

  // Báo cáo danh sách RO chưa hoàn thành
  reportRoUnfinished(data) {
    return this.download('/report/report-ro-unfinished', data);
  }

  // Danh sách RO có PT về đủ
  partReceiveEnough(data) {
    return this.download('/parts-report/part-receive-enough', data);
  }

  // Thời gian lưu kho hàng BO
  timeStoreBo(obj) {
    return this.download('/report/day-in-warehouse', obj);
  }

  // In multi báo giá
  printMultiQuotation(obj) {
    return this.download('/report-quotation/print-multi-quotation', obj);
  }

  // In multi quyết toán
  printMultiSettlement(obj) {
    return this.download('/report-quotation/print-multi-settlement', obj);
  }

  // Báo cáo xuất hàng
  shipmentReport(obj) {
    return this.download('/parts-report/export-report', obj);
  }

  orderOfDlrToTMV(obj) {
    return this.download('/parts-report/parts-order-dealer-to-tmv', obj);
  }

  listRoPartBoNotEnough(obj) {
    return this.download('/parts-report/list-ro-part-bo-not-enough', obj);
  }

  printPartReceive(obj) {
    return this.download('/part-receive/manual/print', obj);
  }

  printPartBoOrder(obj) {
    return this.download('/part-bo/bo-order/print', obj);
  }

  printPartSpecialOrder(obj) {
    return this.download('/part/special/print', obj);
  }

  printLexusReceiveHistory(obj) {
    return this.download('/part-receive/lexus_receive_history/print', obj);
  }

  printOrderOverAll(obj) {
    return this.download('/part-sale/print-order-over-all', obj);
  }

  printListAttachBill(obj) {
    return this.download('/part-sale/list-attach-contract', obj);
  }

  printListDelivery(obj) {
    return this.download('/part-sale/list-delivery', obj);
  }

  // Báo cáo lượt xe theo ngày
  reportvehicleSummary(data) {
    return this.download('/report/report-vehicle-summary', data);
  }

  // Báo cáo tổng hợp đặt hẹn
  appointmentAggregate(obj) {
    return this.download('/report/appointment-report', obj);
  }

  // Daily Claim Report
  dailyClaimReport(obj) {
    return this.download('/report/daily-claim-report', obj);
  }

  // Danh sách chức năng người dùng
  userListFunction(obj) {
    return this.download('/report/user-list-function', obj);
  }
}
