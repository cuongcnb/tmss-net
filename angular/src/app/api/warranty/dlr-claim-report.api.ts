import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { Observable } from 'rxjs';
import {EnvConfigService} from '../../env-config.service';


@Injectable()
export class DlrClaimReportApi extends BaseApiService {
  claimOrder = {
    amount: 'Double',
    adjustAmount: 'Double',
    total: 'Double',
    warrantySummaryLineTableDTOs: [
      {
        dealerClaimNo: 'String',
        brand: 'String',
        warrantyType: 'String',
        submitDate: 'Timestamp',
        judgeDate: 'Timestamp',
        modifyDate: 'Timestamp',
        claimAmount: 'Long',
        adjustAmount: 'Long',
        reasonCode: 'String',
        status: 'String',
        errorCode1: 'String',
        errorCode2: 'String',
        errorCode3: 'String',
        errorCode4: 'String',
        errorCode5: 'String',
        dlrStuff: 'String',
        distStuff: 'String',
        distMStuff: 'String',
        distComment: 'String',
        dlrComment: 'String'
      }
    ]
  };
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('warranty');
  }

  getClaimOrder(searchData, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const dataRequest = Object.assign({}, searchData, paginationParams);
    // return this.post('/summary/search', dataRequest)
    return new Observable((observer) => {
      setTimeout(() => observer.next(this.claimOrder), 100);
    });
  }
}







