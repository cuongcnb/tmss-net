import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { Observable } from 'rxjs';
import {EnvConfigService} from '../../env-config.service';


const dataSearch = {
  numberOfSrvDWoOrderResult: 2341231,
  srvDWoorders: [
    {
      orderno: 'VARCHAR2(15 BYTE)',
      claimcount: 'NUMBER(3,0)',
      orderdate: 'Date',
      dealercode: 'VARCHAR2(5 BYTE)'
    }
  ]
};

const history = {
  vinNo: 'VARCHAR2(250)',
  warrantyChangeAmount: 'NUMBER(10,2)',
  vWarrantyRoHistory: {
    repairorderno: 'String',
    platenumber: 'String',
    orderdate: 'Date',
    cmId: 2341231,
    cusname: 'String',
    tel1: 'String',
    tel2: 'String',
    odometer: 'String',
    sa: 'String'
  },
  srvMDealer: {
    cusName: 'VARCHAR2(250)',
    dlrName: 'VARCHAR2(250)',
    region: 'NUMBER',
    smdAdd: 'VARCHAR2(400)',
    tel: 'VARCHAR2(25)',
    fax: 'VARCHAR2(25)'
  },
  vWarrantyLaborDetails: [
    {
      rccCode: 'VARCHAR2(30),',
      rcName: 'VARCHAR2(150)',
      rcType: 'VARCHAR2(150)',
      cost: 'NUMBER'
    }
  ],
  vWarrantyPartsDetails: [
    {
      partsCode: 'String',
      partsName: 'String',
      bo: 'String',
      qty: 2341231,
      repairType: 'String',
      rate: 'Double',
      amount: 'Double'
    }
  ]
};

const claim = {
  processFlagLabel: 'String',
  dlrName: 'String',
  reasonCode: 'String',
  flatratedlr: 'String',
  pwrdlr: 'String',
  dealerName: 'String',
  distCode: 'String',
  sfx: 'String',
  twcNo: 'String',
  claimantcode: 'String',
  invoiceNo: 'String',
  dealerCode: 'String',
  kmFlag: 'String',
  dealerClaimNo: 'String',
  processFlag: 'String',
  warrantyType: 'String',
  franchise: 'String',
  cmId: 'String',
  warrantyAppCode: 'String',
  nvFlag: 'String',
  fvFlag: 'String',
  wmi: 'String',
  vds: 'String',
  cd: 'String',
  vis: 'String',
  orderno: 'String',
  deliveryDate: 'Timestamp',
  repairDate: 'Timestamp',
  odometer: 'String',
  authoType: 'String',
  authoNo: 'String',
  dataId: 'String',
  tc: 'String',
  subletDesc: 'String',
  t1Code: 'String',
  t2Code: 'String',
  t2CodeType: 'String',
  condition: 'String',
  cause: 'String',
  remedy: 'String',
  ofpLocalFlag: 'String',
  ofpNo: 'String',
  pwrDlr: 'String',
  prrDlr: 'String',
  flatRateDrl: 'String',
  freePm: 'String',
  dlrComment: 'String',
  laborAdj: 2341231,
  partsAdj: 2341231,
  subletAdj: 2341231,
  distComment: 'String',
  roState: 'String',
  sumSubletSubTotal: 2341231,
  sumLaborSubTotal: 2341231,
  laborTotalHour: 2341231,
  sumPartsSubTotal: 2341231,
  partsTotal: 2341231,
  total: 2341231,
  warrantyClaimPartsDTOs: [
    {
      id: 3123,
      payCode: 'String',
      opeMFlag: 'String',
      localFlag: 'String',
      partsCode: 'String',
      qty: 1,
      amount: 1000,
      fobCurrencyCode: 'String',
      fobPrice: 'Double',
      price: 1000
    }, {
      id: 3123,
      payCode: 'String',
      opeMFlag: 'String',
      localFlag: 'String',
      partsCode: 'String',
      qty: 1,
      amount: 1000,
      fobCurrencyCode: 'String',
      fobPrice: 'Double',
      price: 1000
    }, {
      id: 3123,
      payCode: 'String',
      opeMFlag: 'String',
      localFlag: 'String',
      partsCode: 'String',
      qty: 1,
      amount: 1000,
      fobCurrencyCode: 'String',
      fobPrice: 'Double',
      price: 1000
    }, {
      id: 3123,
      payCode: 'String',
      opeMFlag: 'String',
      localFlag: 'String',
      partsCode: 'String',
      qty: 2,
      amount: 2000,
      fobCurrencyCode: 'String',
      fobPrice: 'Double',
      price: 1000
    }, {
      id: 3123,
      payCode: 'String',
      opeMFlag: 'String',
      localFlag: 'String',
      partsCode: 'String',
      qty: 1,
      amount: 1000,
      fobCurrencyCode: 'String',
      fobPrice: 'Double',
      price: 1000
    },
  ],
  srvMSublettypes: [
    {
      id: 1,
      modifiedBy: 2341231,
      modifyDate: 'Timestamp',
      createdBy: 2341231,
      createDate: 'Timestamp',
      deleteflag: 'String',
      desceng: 'PT Painting repair',
      descvn: 'PT Painting repair',
      dlrId: 2341231,
      updatecount: 'Float'
    }, {
      id: 2,
      modifiedBy: 2341231,
      modifyDate: 'Timestamp',
      createdBy: 2341231,
      createDate: 'Timestamp',
      deleteflag: 'String',
      desceng: 'UP Bla bla bla',
      descvn: 'UP Bla bla bla',
      dlrId: 2341231,
      updatecount: 'Float'
    }, {
      id: 3,
      modifiedBy: 2341231,
      modifyDate: 'Timestamp',
      createdBy: 2341231,
      createDate: 'Timestamp',
      deleteflag: 'String',
      desceng: 'WD Welding',
      descvn: 'WD Welding',
      dlrId: 2341231,
      updatecount: 'Float'
    },
  ],
  warrantyClaimLaborDTOs: [
    {
      id: 2341231,
      payCode: 'String',
      opeMFlag: false,
      srvCode: 'String',
      hours: 0.6,
      amount: 1200
    }, {
      id: 2341231,
      payCode: 'String',
      opeMFlag: false,
      srvCode: 'String',
      hours: 1.5,
      amount: 3000
    }, {
      id: 2341231,
      payCode: 'String',
      opeMFlag: false,
      srvCode: 'String',
      hours: 'aa',
      amount: 4120
    },
  ],
  warrantyClaimSubletDTOs: [
    {
      id: 2341231,
      dlrId: 2341231,
      payCode: 'String',
      subletType: 'String',
      subletInvoiceNo: 'String',
      subletAmountDlr: 'Float',
      cost: 'Float'
    }, {
      id: 2341231,
      dlrId: 2341231,
      payCode: 'String',
      subletType: 'String',
      subletInvoiceNo: 'String',
      subletAmountDlr: 'Float',
      cost: 'Float'
    },
  ]
};

const claimOrder = {
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


@Injectable()
export class DlrDisplayScreenApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/warranty');
  }

  search(searchData, paginationParams?) {
    // paginationParams = paginationParams || {
    //   page: 1,
    //   size: 20,
    // }
    // const dataRequest = Object.assign({}, searchData, paginationParams)
    // return this.post('/generate-claim-via-order/search', dataRequest)
    return new Observable((observer) => {
      setTimeout(() => observer.next(dataSearch), 100);
    });
  }

  getRepairJobHistory(orderNo) {
    // const dealerCode = localStorage.TMSS_Service_Current_User.dealerName
    // return this.get(`/generate-claim-via-order/repair-job-history?dealerCode=${dealerCode}&orderNo=${orderNo}`)
    return new Observable((observer) => {
      setTimeout(() => observer.next(history), 100);
    });
  }

  getNewClaim(orderNo) {
    // const dealerCode = localStorage.TMSS_Service_Current_User.dealerName
    // return this.get(`/generate-claim-via-order/create-new-claim=${dealerCode}&orderNo=${orderNo}`)
    return new Observable((observer) => {
      setTimeout(() => observer.next(claim), 100);
    });
  }

  getClaimOrder(searchData, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const dataRequest = Object.assign({}, searchData, paginationParams);
    // return this.post('/summary/search', dataRequest)
    return new Observable(observer => {
      setTimeout(() => observer.next(claimOrder), 100);
    });
  }

  saveClaim(dataSave) {
    // return this.post('/generate-claim-via-order/save-claim', dataRequest)
    // return this.post('/summary/search', dataRequest)
    return new Observable(observer => {
      setTimeout(() => observer.next('success'), 100);
    });
  }

  submitClaim(dataSave) {
    // return this.post('/generate-claim-via-order/submit-claim', dataRequest)
    // return this.post('/summary/search', dataRequest)
    return new Observable(observer => {
      setTimeout(() => observer.next('success'), 100);
    });
  }

  getT1Code(tCode?) {
    let condition;
    if (tCode) {
      condition += `&tCode=${tCode}`;
    }
    return this.get(`/tcode/search?tcodeType=T1${condition || ''}`);
  }

  getT2Code(tCode?) {
    let condition;
    if (tCode) {
      condition += `&tCode=${tCode}`;
    }
    return this.get(`/tcode/search?tcodeType=T2${condition || ''}`);
  }

  getT3Code(tCode?) {
    let condition;
    if (tCode) {
      condition += `&tCode=${tCode}`;
    }
    return this.get(`/tcode/search?tcodeType=T3${condition || ''}`);
  }
}
