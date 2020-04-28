import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { FileUploader } from 'ng2-file-upload';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class MasterLexusApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/master-lexus');
  }

  // list-of-dlr-order-to-lexus - Danh sách đại lý đặt phụ tùng chuyên biệt lexus lên Lexus
  doOrderToLexus(dlrId, status) {
    return this.get(`/order-to-lexus/${dlrId}/${status}`);
  }

  // lexus-parts-price-management - Quản lý giá phụ tùng chuyên biệt Lexus
  searchLexusPartPrice(searchParams, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const searchBody = Object.assign({}, searchParams, paginationParams);
    return this.post(`/lexus-price/search`, searchBody);
  }

  exportLexusPartPrice(searchParams, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const searchBody = Object.assign({}, searchParams, paginationParams);
    return this.download(`/lexus-price/export`, searchBody);
  }

  showRatio() {
    return this.get(`/lexus-price/show-ratio`);
  }

  uploadLexusPriceData(uploader: FileUploader) {
    uploader.setOptions({
      url: this.baseUrl + '/lexus-price/import',
    });
    uploader.queue[uploader.queue.length - 1].upload();
  }

  updateRatio(ratioId, ratio) {
    return this.get(`/lexus-price/update-ratio/${ratioId}/${ratio}`);

  }

  // dlr-order-to-lexus-management - Quản lý đại lý đặt phụ tùng lexus
  getListDealerOrderLexusPart(searchParams) {
    // return this.get(`/dealers-order-lexus-part${lexusDlrId ? `/${lexusDlrId}` : ''}`)
    return this.get('/dealers-order-lexus-part/search', searchParams);
  }

  saveDealerOrderLexusPart(id, lexusDlrId) {
    return this.put(`/dealers-order-lexus-part/save/${id}/${lexusDlrId}`);
  }
}
