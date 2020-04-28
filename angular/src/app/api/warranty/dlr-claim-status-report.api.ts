import { BaseApiService } from '../base-api.service';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import {EnvConfigService} from '../../env-config.service';

const claimInfo = {
  generateClaim: 500,
  withdrewClaim: 30,
  unsubmittedClaim: 12,
};

const claimWaitingOrderList = [
  {
    no: '1',
    orderNo: 'S20180093913',
    claimTimes: '0',
    repairHistory: '...',
    arrivalDate: '',
    newClaim: 'new claim'
  }
];
const unclaimOrderList = [
  {
    no: '1',
    orderNo: '100293',
    claimWaitingAmount: '20192003',
    arrivalDate: '12/10/2018'
  }
];

const withdreClaimList = [
  {
    no: '1',
    dealerClaimNo: '123421',
    submissionDate: '10/2/2018',
    claimAmount: '94800',
    judgeDate: '10/10/2018',
    reasonDate: '',
    modify: 'Modify'
  }
];
const unsubmittedClaimList = [
  {
    no: '1',
    dlrClaimNo: 'T500391',
    modifyDate: '10/10/2018',
    claimAmount: '',
    modify: 'modify',
    cancelSubmit: 'cancel-submit'
  },
  {
    no: '1',
    dlrClaimNo: 'T500391',
    modifyDate: '10/10/2018',
    claimAmount: '',
    modify: 'modify',
    cancelSubmit: 'cancel-submit'
  }
];
const claimStatusList: any[] = [
  {
    twcld: 'Bignit',
    dealerClaimNo: '123456',
    brand: 'camry',
    warrantyType: '123',
    latestSubmitTime: '12/10/2018',
    claimAmount: '',
    adjustmentAmount: '',
    reasonCode: '',
    status: '',
    errorCode1: '',
    errorCode2: '',
    errorCode3: '',
    errorCode4: '',
    errorCode5: '',
    dlrStaffName: '',
    distStaffName: '',
    distManagerName: '',
    distComment: '',
    dlrComment: ''
  }
];

const brandList = [
  {
    id: '1',
    value: 'Toyota'
  }, {
    id: '2',
    value: 'Lexus'
  }, {
    id: '3',
    value: 'Ferrari'
  },
];
const wtList = [
  {
    id: 1,
    value: 'VE'
  }, {
    id: 2,
    value: 'GE'
  }, {
    id: 3,
    value: 'VL'
  }
];
const dataIDList = [
  {
    id: 1,
    value: 'Data-1'
  }, {
    id: 2,
    value: 'Data-2'
  }, {
    id: 3,
    value: 'Data-3'
  },
];

const statusList = [
  {
    id: 1,
    value: 'Sumitted'
  }, {
    id: 2,
    value: 'Withdrew'
  }, {
    id: 3,
    value: 'In-process'
  },
];

const tCode = [
  {
    tCode: '01',
    tCodeType: 'T2',
    descEng: 'BURNT'
  }, {
    tCode: '02',
    tCodeType: 'T2',
    descEng: 'descEng'
  }, {
    tCode: '03',
    tCodeType: 'T1',
    descEng: 'descEng'
  }, {
    tCode: '05',
    tCodeType: 'T1',
    descEng: 'descEng'
  },
];

const partsList = [
  {
    partsCode: 45424234,
    partsName: 'GoodBye',
    partsType: 'P',
    sellPrice: 12532123,
    fobC: 2,
    local: 'J',
    sum: 233431235
  }, {
    partsCode: 4354752,
    partsName: 'Hello',
    partsType: 'P',
    sellPrice: 12532123,
    fobC: 2,
    local: 'J',
    sum: 233431235
  }, {
    partsCode: 6523432,
    partsName: 'Gitaaa',
    partsType: 'P',
    sellPrice: 12532123,
    fobC: 2,
    local: 'J',
    sum: 233431235
  },
];

const repairResultSearch = [
  {
    dlrNo: 432123123,
    licensePlate: '4461-21332',
    km: '45424234',
    arrivalDate: '3524234'
  }
];
const repairProfileDetail = {
  vinNo: 412123,
  licensePlate: 123341231,
  modelCode: 3123,
  modelCodeDetail: 'hello world',
  model: '342234',
  carFamily: 2914,
  frameNo: 'aassbvdas',
  engineNo: '',
  deliveryDate: ' ',
  color: 'Xanh',
  carOwner: 'Tam',
  carOwnerDetail: 'pam thanh tam',
  callTime: '12:30',
  companyName: '',
  taxCode: '344234',
  otherType: 'aasdasd',
  address: 'thanh xuan',
  phone1: '0483482342',
  contactName: 'Tam',
  contactPhone: '363432434',
  contactEmail: 'tampt@',
  contactAddress: 'thanh xuan',
  contactCallTime: '12:39'
};
const roList = [
  {
    repairorderno: '3421321',
    jobType: '1',
    state: '1',
    appointmentDate: 'tam',
    accountDate: '2012-11-11',
    dealerAdvisor: '',
    customerRequest: 'xx',
    carWash: '',
    getPart: '',
    versionNumber: ''
  },
];

const repairJobHistory = {
  orderNo: 'VARCHAR2(15 BYTE)',
  plateNumber: 'VARCHAR2(20)',
  vinNo: 'VARCHAR2(250)',
  orderDate: 'Date',
  srvMCarModel: {
    cmId: 'NUMBER'
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
      cost: 50
    }
  ],
  vWarrantyPartsDetails: [
    {
      partsCode: 'String',
      partsName: 'String',
      bo: 'String',
      qty: 'Long',
      repairType: 'String',
      rate: 'Double',
      amount: 200
    }
  ],
  tel1: 'VARCHAR2(20)',
  tel2: 'VARCHAR2(20)',
  warrantyChangeAmount: 'NUMBER(10,2)',
  odoMeter: 'VARCHAR2(6)',
  sa: 'VARCHAR2(50)'
};

const newClaim = {
  // 'vWarrantyOrderMaster': {
  cd: '3',
  cmId: 1194,
  dealercode: '08070',
  dlrId: 432,
  freePm: 'N',
  id: 1501458,
  odometer: null,
  orderdate: 1224694800000,
  repairorderno: 'S08070044957',
  rostate: '6',
  vds: 'XW43G',
  vis: '69209011',
  wmi: 'RL4',
  // },
  dealerName: 'tam',
  dealerClaimNo: 52342543,
  invoiceNo: null,
  wrrantyType: 'VE',
  franchise: 'toyota',
  nvFlag: null,
  fvFlag: null,
  deliveryDate: null,
  arrivalDate: null,
  kmFlag: '1',
  authoType: null,
  authoNo: null,
  dataId: 'W',
  tc: null,
  warrantyClaimLaborDTOs: [
    {
      id: null,
      payCode: null,
      opeMFlag: null,
      srvCode: null,
      hours: null,
      amount: null,
    },
    {
      id: null,
      payCode: null,
      opeMFlag: null,
      srvCode: null,
      hours: null,
      amount: null,
    }
  ],
  laborRate: null,
  warrantyClaimSubletDTOs: [
    {
      id: null,
      dlrId: null,
      payCode: null,
      subletType: null,
      subletInvoiceNo: null,
      cost: null,
    },
    {
      id: null,
      dlrId: null,
      payCode: null,
      subletType: null,
      subletInvoiceNo: null,
      cost: null,
    },
    {
      id: null,
      dlrId: null,
      payCode: null,
      subletType: null,
      subletInvoiceNo: null,
      cost: null,
    }
  ],
  subletDescription: null,
  t1Code: null,
  t2Code: null,
  t2CodeType: null,
  t3Codes: [],
  condition: null,
  cause: null,
  remedy: null,
  vWarrantyPartsDetailDTOs: [
    {
      id: null,
      payCode: null,
      opeMFlag: null,
      localFlag: null,
      partsCode: null,
      qty: null,
      amount: null,
      fobCurrencyCode: null,
      fobPrice: null,
      price: null,
    },
    {
      id: null,
      payCode: null,
      opeMFlag: null,
      localFlag: null,
      partsCode: null,
      qty: null,
      amount: null,
      fobCurrencyCode: null,
      fobPrice: null,
      price: null,
    },
    {
      id: null,
      payCode: null,
      opeMFlag: null,
      localFlag: null,
      partsCode: null,
      qty: null,
      amount: null,
      fobCurrencyCode: null,
      fobPrice: null,
      price: null,
    },
    {
      id: null,
      payCode: null,
      opeMFlag: null,
      localFlag: null,
      partsCode: null,
      qty: null,
      amount: null,
      fobCurrencyCode: null,
      fobPrice: null,
      price: null,
    },
    {
      id: null,
      payCode: null,
      opeMFlag: null,
      localFlag: null,
      partsCode: null,
      qty: null,
      amount: null,
      fobCurrencyCode: null,
      fobPrice: null,
      price: null,
    },
    {
      id: null,
      payCode: null,
      opeMFlag: null,
      localFlag: null,
      partsCode: null,
      qty: null,
      amount: null,
      fobCurrencyCode: null,
      fobPrice: null,
      price: null,
    }
  ],
  ofpNo: null,
  pwrDlr: null,
  dlrComment: null,
  distClaimAdjustment: null,
  laborAdj: 100,
  subletAdj: 100,
  partsAdj: 100,
  distComment: null,
  srvMSublettypes: [
    {
      createDate: 1118311292000,
      createdBy: 1,
      deleteflag: 'N',
      desceng: 'ZZ Other fee',
      descvn: 'ZZ Other fee',
      dlrId: -1,
      modifiedBy: 1,
      modifyDate: null,
      updatecount: 0
    },
    {
      createDate: 1118311292000,
      createdBy: 1,
      deleteflag: 'N',
      desceng: 'WD Welding',
      descvn: 'WD Welding',
      dlrId: -1,
      modifiedBy: 1,
      modifyDate: null,
      updatecount: 0
    },
    {
      createDate: 1181785973000,
      createdBy: 1,
      deleteflag: 'N',
      desceng: 'UP Interior Fabrics Upholstery',
      descvn: 'UP Interior Fabrics Upholstery',
      dlrId: -1,
      modifiedBy: 1,
      modifyDate: 1182407555000,
      updatecount: 1
    },
    {
      createDate: 1181786006000,
      createdBy: 1,
      deleteflag: 'N',
      desceng: 'TY Tire replacement',
      descvn: 'TY Tire replacement',
      dlrId: -1,
      modifiedBy: 1,
      modifyDate: 1182407574000,
      updatecount: 1
    },
    {
      createDate: 1181785989000,
      createdBy: 1,
      deleteflag: 'N',
      desceng: 'TW Towing Charge',
      descvn: 'TW Towing Charge',
      dlrId: -1,
      modifiedBy: 1,
      modifyDate: 1182407495000,
      updatecount: 1
    },
    {
      createDate: 1181786029000,
      createdBy: 1,
      deleteflag: 'N',
      desceng: 'SL Seal/Glue',
      descvn: 'SL Seal/Glue',
      dlrId: -1,
      modifiedBy: 1,
      modifyDate: 1182407534000,
      updatecount: 1
    },
    {
      createDate: 1118311292000,
      createdBy: 1,
      deleteflag: 'N',
      desceng: 'RA Radio or Alarm',
      descvn: 'RA Radio or Alarm',
      dlrId: -1,
      modifiedBy: 1,
      modifyDate: null,
      updatecount: 0
    },
    {
      createDate: 1118311292000,
      createdBy: 1,
      deleteflag: 'N',
      desceng: 'PT Painting repair',
      descvn: 'PT Painting repair',
      dlrId: -1,
      modifiedBy: 1,
      modifyDate: null,
      updatecount: 0
    },
    {
      createDate: 1118311292000,
      createdBy: 1,
      deleteflag: 'N',
      desceng: 'OF Lube or Workliquid',
      descvn: 'OF Lube or Workliquid',
      dlrId: -1,
      modifiedBy: 1,
      modifyDate: null,
      updatecount: 0
    },
    {
      createDate: 1118311292000,
      createdBy: 1,
      deleteflag: 'N',
      desceng: 'MC Mechanical repair',
      descvn: 'MC Mechanical repair',
      dlrId: -1,
      modifiedBy: 1,
      modifyDate: null,
      updatecount: 0
    },
    {
      createDate: 1181786041000,
      createdBy: 1,
      deleteflag: 'N',
      desceng: 'GL Glass',
      descvn: 'GL Glass',
      dlrId: -1,
      modifiedBy: 1,
      modifyDate: 1182407513000,
      updatecount: 1
    },
    {
      createDate: 1118311292000,
      createdBy: 1,
      deleteflag: 'N',
      desceng: 'EL Electrical repair',
      descvn: 'EL Electrical repair',
      dlrId: -1,
      modifiedBy: 1,
      modifyDate: null,
      updatecount: 0
    },
    {
      createDate: 1118311292000,
      createdBy: 1,
      deleteflag: 'N',
      desceng: 'DS Diesel supply repair',
      descvn: 'DS Diesel supply repair',
      dlrId: -1,
      modifiedBy: 1,
      modifyDate: null,
      updatecount: 0
    },
    {
      createDate: 1328461200000,
      createdBy: 2816,
      deleteflag: 'N',
      desceng: 'BA BATTERY REPLACEMENT',
      descvn: 'battery replacement',
      dlrId: -1,
      modifiedBy: 2816,
      modifyDate: 1328461200000,
      updatecount: 1
    },
    {
      createDate: 1328461200000,
      createdBy: 2816,
      deleteflag: 'N',
      desceng: 'AL ALIGNMENT',
      descvn: null,
      dlrId: -1,
      modifiedBy: null,
      modifyDate: null,
      updatecount: 0
    },
    {
      createDate: 1118311292000,
      createdBy: 1,
      deleteflag: 'N',
      desceng: 'AC Aircondition repair',
      descvn: 'AC Aircondition repair',
      dlrId: -1,
      modifiedBy: 1,
      modifyDate: null,
      updatecount: 0
    }
  ],
  sumLaborAmount: null,
  sumLaborHours: null,
  sumSubletCost: null,
  sumPartsTotal: null,
  ofpLocalFlag: null,
  flatRateDrl: null,
  prrDrl: null
};

@Injectable({
  providedIn: 'root'
})
export class DlrClaimStatusReportApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/claim-status-report');
  }

  getClaimInfo(): Observable<any> {
    // return this.post(`/search`, data)
    const result = new Observable((observer) => {
      setTimeout(() => {
        observer.next(claimInfo);
      }, 100);
    });
    return result;
  }

  getClaimWaitingOrder(data): Observable<any> {
    // return this.post(`/claim-waiting-order`, data)
    const result = new Observable((observer) => {
      setTimeout(() => {
        observer.next(claimWaitingOrderList);
      }, 100);
    });
    return result;
  }

  getRepairJobHistory(params): Observable<any> {
    // return
    const result = new Observable((observer) => {
      setTimeout(() => {
        observer.next(repairJobHistory);
      }, 100);
    });
    return result;
  }

  getNewClaim(params): Observable<any> {
    // return
    const result = new Observable((observer) => {
      setTimeout(() => {
        observer.next(newClaim);
      }, 100);
    });
    return result;
  }

  getWithdrewClaim(): Observable<any> {
    const result = new Observable((observer) => {
      setTimeout(() => {
        observer.next(withdreClaimList);
      }, 100);
    });
    return result;
  }

  getUnsubmittedClaim(): Observable<any> {
    const result = new Observable((observer) => {
      setTimeout(() => {
        observer.next(unsubmittedClaimList);
      }, 100);
    });
    return result;
  }

  getClaimStatusReport(params): Observable<any> {
    const result = new Observable((observer) => {
      setTimeout(() => {
        observer.next(claimStatusList);
      }, 100);
    });
    return result;
  }

  getBrand(): Observable<any> {
    const result = new Observable((observer) => {
      setTimeout(() => {
        observer.next(brandList);
      }, 100);
    });
    return result;
  }

  getWT(): Observable<any> {
    const result = new Observable((observer) => {
      setTimeout(() => {
        observer.next(wtList);
      }, 100);
    });
    return result;
  }

  getDataID(): Observable<any> {
    const result = new Observable((observer) => {
      setTimeout(() => {
        observer.next(dataIDList);
      }, 100);
    });
    return result;
  }

  getStatus(): Observable<any> {
    const result = new Observable((observer) => {
      setTimeout(() => {
        observer.next(statusList);
      }, 100);
    });
    return result;
  }

  getTCode(): Observable<any> {
    const result = new Observable((observer) => {
      setTimeout(() => {
        observer.next(tCode);
      }, 100);
    });
    return result;
  }

  getParts(): Observable<any> {
    const result = new Observable((observer) => {
      setTimeout(() => {
        observer.next(partsList);
      }, 100);
    });
    return result;
  }

  getUnclaimOrder(): Observable<any> {
    const result = new Observable((observer) => {
      setTimeout(() => {
        observer.next(unclaimOrderList);
      }, 100);
    });
    return result;
  }

  findRepairProfile(params) {
    const result = new Observable((observer) => {
      setTimeout(() => {
        observer.next(repairResultSearch);
      }, 100);
    });
    return result;
  }

  getRepairProfileDetail(params) {
    const result = new Observable((observer) => {
      setTimeout(() => {
        observer.next(repairProfileDetail);
      }, 100);
    });
    return result;
  }

  getRoList(params) {
    const result = new Observable((observer) => {
      setTimeout(() => {
        observer.next(roList);
      }, 100);
    });
    return result;
  }

  getListTest(params) {
    const result = new Observable((observer) => {
      setTimeout(() => {
        observer.next([
          {
            no: 'no 1',
            id: 1
          },
          {
            no: 'no 2',
            id: 2
          },
        ]);
      }, 100);
    });
    return result;
  }

  getSubletType(params?) {
    const result = new Observable((observer) => {
      setTimeout(() => {
        observer.next([
          {
            name: 'Sublet type 1',
            id: 1
          },
          {
            no: 'Sublet type 2',
            id: 2
          },
        ]);
      }, 100);
    });
    return result;
  }
}

