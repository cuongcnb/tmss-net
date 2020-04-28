import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {FileUploader} from 'ng2-file-upload';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class ImportService extends BaseApiSaleService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/', true);
  }

  loadTmvSalesTarget(uploader: FileUploader) {
    uploader.setOptions({
      url: this.baseUrl + 'import/sale_target/load',
    });
    uploader.queue[uploader.queue.length - 1].upload();
  }

  saveFileSalesTarget(importDate: Date) {
    return this.post('import/sale_target/save', {importDate});
  }

  loadTmvSalesTargetFleet(uploader: FileUploader) {
    uploader.setOptions({
      url: this.baseUrl + 'import/sale_target_fleet/load',
    });
    uploader.queue[uploader.queue.length - 1].upload();
  }

  saveFileSalesTargetFleet() {
    return this.get('import/sale_target_fleet/save', );
  }

  loadTmvSalesAllocation(uploader: FileUploader) {
    uploader.setOptions({
      url: this.baseUrl + 'import/sale_allocation/load',
    });
    uploader.queue[uploader.queue.length - 1].upload();
  }

  saveFileSalesAllocation(importDate: Date) {
    return this.post('import/sale_allocation/save', {importDate});
  }

  loadDlrSalesPlan(uploader: FileUploader) {
    uploader.setOptions({
      url: this.baseUrl + 'import/sale_plan/load',
    });
    uploader.queue[uploader.queue.length - 1].upload();
  }

  saveFileSalesPlan(importDate: Date) {
    return this.post('import/sale_plan/save', {importDate});
  }

  loadDlrSalesOrder(uploader: FileUploader) {
    uploader.setOptions({
      url: this.baseUrl + 'import/sale_order/load',
    });
    uploader.queue[uploader.queue.length - 1].upload();
  }

  uploadDlrSalesOrder(uploader: FileUploader, dealerId, currentDate) {
    uploader.setOptions({
      url: this.baseUrl + 'upload/dlr_order',
      additionalParameter: {
        dealerId,
        currentDate: this.dataFormatService.formatDateSale(currentDate)
      }
    });
    uploader.queue[uploader.queue.length - 1].upload();
  }

  uploadDlrRundown(uploader: FileUploader, dealerId, currentDate) {
    uploader.setOptions({
      url: this.baseUrl + 'upload/dlr_rundown',
      additionalParameter: {
        dealerId,
        currentDate: this.dataFormatService.formatDateSale(currentDate)
      }
    });
    uploader.queue[uploader.queue.length - 1].upload();
  }

  uploadDlrSalesOrderColor(uploader: FileUploader, dealerId, currentDate) {
    uploader.setOptions({
      url: this.baseUrl + 'upload/dlr_order_color',
      additionalParameter: {
        dealerId,
        currentDate: this.dataFormatService.formatDateSale(currentDate)
      }
    });
    uploader.queue[uploader.queue.length - 1].upload();
  }

  uploadDlrAllocation(uploader: FileUploader, dealerId, currentDate) {
    uploader.setOptions({
      url: this.baseUrl + 'upload/allocation',
      additionalParameter: {
        dealerId,
        currentDate: this.dataFormatService.formatDateSale(currentDate)
      }
    });
    uploader.queue[uploader.queue.length - 1].upload();
  }

  saveFileSalesOrder(importDate: Date) {
    return this.post('import/sale_order/save', {importDate});
  }

  loadDlrSaleNenkei(uploader: FileUploader) {
    uploader.setOptions({
      url: this.baseUrl + 'import/sale_nenkei/load',
    });
    uploader.queue[uploader.queue.length - 1].upload();
  }

  saveFileSaleNenkei() {
    return this.get('import/sale_nenkei/save');
  }

  loadDlrSalesOrderColor(uploader: FileUploader) {
    uploader.setOptions({
      url: this.baseUrl + 'import/sale_color_order/load',
    });
    uploader.queue[uploader.queue.length - 1].upload();
  }

  saveFileSalesOrderColor() {
    return this.get('import/sale_color_order/save');
  }

  importCbuCustomerInfo(uploader: FileUploader) {
    uploader.setOptions({
      url: this.baseUrl + 'import/cbu_customer_info',
    });
    uploader.queue[uploader.queue.length - 1].upload();
  }

  importCbuDeliveryRouteDlr(uploader: FileUploader) {
    uploader.setOptions({
      url: this.baseUrl + 'import/cbu_delivery_route_dlr',
    });
    uploader.queue[uploader.queue.length - 1].upload();
  }

  importFixPaymentDeadline(uploader: FileUploader) {
    uploader.setOptions({
      url: this.baseUrl + 'import/fix_payment_deadline',
    });
    uploader.queue[uploader.queue.length - 1].upload();
  }

  downloadTemplate(type) {
    return this.downloadByGet(`import/get_import_template?template_name=${type}`);
  }

  downloadFile(data) {
    const fileName = data.headers.get('content-disposition').replace('attachment;filename=', '');
    const link = document.createElement('a');
    const url = URL.createObjectURL(data.body);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  importCbuCkdExcel(url: string, formData: FormData) {
    return this.upload(`${url}`, formData);
  }

}
