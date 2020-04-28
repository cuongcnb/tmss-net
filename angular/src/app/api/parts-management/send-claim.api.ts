import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { EnvConfigService } from '../../env-config.service';

@Injectable()
export class SendClaimApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('');
  }
  module = 'claim';

  // send-claim.component.ts
  searchClaim(searchParams, paginationParams) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const searchBody = Object.assign({}, searchParams, paginationParams);
    return this.post(`/get-sending-claim-header`, searchBody);
  }

  searchPartsOfClaim(partsRecvId, claimId?) {
    let url = `/get-sending-claim-detail/${partsRecvId}`;
    if (claimId) {
      url += `?claimId=${claimId}`;
    }
    return this.get(url);
  }

  getTotalQtyBroken(partsRecvId?) {
    return this.get(`/get-total-qty-broken/${partsRecvId}`);
  }

  saveClaim(saveClaimData) {
    return this.post('/save-sending-claim', saveClaimData);
  }

  sendClaim(sendClaimData) {
    return this.post('/send-claim', sendClaimData);
  }

  // approval-claim.component.ts
  searchApprovalClaim(searchParams, paginationParams) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const searchBody = Object.assign({}, searchParams, paginationParams);
    return this.post('/get-appvall-sending-claim-header', searchBody);
  }

  searchPartsOfApprovalClaim(id) {
    return this.get(`/get-approval-sending-claim-detail/${id}`);
  }

  saveClaimTmv(saveClaimTmvData) {
    return this.put('/save-claim-tmv', saveClaimTmvData);
  }

  // Upload files
  importFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    return this.sendForm(`/image-upload`, formData).send().response;
  }

  // getUploadedFiles(claimId) {
  //   return this.get(`/${claimId}/img`);
  // }

  deleteFile(id) {
    return this.delete(`/delete-file-claim/${id}`);
  }

  downloadFile(fileName) {
    return this.downloadByGet(`/download-file/${fileName}?module=${this.module}`);
  }
  upLoadFile(formData: FormData) {
    return this.upload(`/upload-file?module=${this.module}`, formData);
  }

  getSendingClaimAttachlist(claimId: number) {
    return this.get(`/get-sending-claim-attachlist/${claimId}`);
  }

  //send-claim-modal
  getAllClaimByPartsRecvId(partsRecvId: number) {
    return this.get(`/get-sending-claim/${partsRecvId}`);
  }

  deleteClaim(claimId) {
    return this.delete(`/delete-claim/${claimId}`);
  }
}
