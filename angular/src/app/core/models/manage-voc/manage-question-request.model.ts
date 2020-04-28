import { BaseModel } from '../base.model';

export interface ManageQuestionRequestModel extends BaseModel {
  // --- Màn hình chính
  supplier: string;
  dateReception: string;
  toDateReception: string;
  licensePlate: string;
  status: string;
  dateFinish: string;
  toDateFinish: string;
  customerName: string;
  questionField: string;
  questionProblem: string;
  supplierReception: string;
  // --- Màn hình thêm
  // supplierReception: [{value: 1; disabled: true}];
  // dateReception: [undefined];
  timeReception: [undefined];
  // status: [undefined];
  stt: [{value: undefined; disable: true}];
  dateCreate: [{value: undefined; disabled: true}];
  // dateFinish: [undefined];
  timeFinish: [undefined];
  sourceReception: [undefined];
  approachMeans: [undefined];
  requestTMV: [undefined];
  dateSendToTMV: [{value: undefined; disabled: true}];

  // customerName: [undefined];
  customerAddress: [undefined];
  customerPhone: [undefined];

  carType: [undefined];
  // licensePlate: [undefined];
  vin: [undefined];
  dateBuy: [undefined];
  supplierSell: [undefined];
  km: [undefined];
  supplierService: [undefined];

  firstCall: [undefined];
  inFourHours: [undefined];
  inFourHoursTime: [{value: undefined; disabled: true}];
  another: [undefined];
  anotherTime: [{value: undefined; disabled: true}];
  hardQuestion: [undefined];
  transferToRelaventDepartment: [undefined];
  contentQuestionRequest: string;
  contentAnswer: string;

  // questionField: string;
  // questionProblem: string;
}

