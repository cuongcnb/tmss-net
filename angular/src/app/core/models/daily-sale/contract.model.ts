import { BaseModel } from '../base.model';

export interface ContractManagementModel extends BaseModel {
  contractNo: string;
  contractType: string;
  total: number;
  gradeProductionId?: number;
  wodDate;
  depositDate;
  salesStaffId: number;
  salesPerson: string;
  deliveryDate;
  audioId: number;
  audio: string;

  bankId: number;
  amount: number;
  paymentTypeId: number;
  paymentType: string;
  estimatedDate;
  newEstimatedDate;
  estimatedReasonId: number;
  reasonType: string;
  estimatedReasonText: string;
  orderPrice: number;
  commissionPrice: number;
  discountPrice: number;
  otherPromotionValue: number;

  dlrOutletId: number;
  dlrOutlet: string;
  salesDealerId: number;
  salesDealer: string;
  customerId: number;


  customerName: string;
  legalId: number;
  legalStatus: string;
  taxCode: string;
  contractRepresentative: string;
  email: string;
  customerAddress: string;
  provinceId: number;
  province: string;
  districtId: number;
  district: string;
  fax: string;
  tel: string;

  contactName: string;
  contactTel: string;
  contactAddress: string;

  invoiceName: string;
  ageLeadTimeId: number;
  age: string;
  genderId: number;
  gender: string;
  invoiceAddress: string;

  relativesName: string;
  relativesAddress: string;
  relativesPhone: string;
  relativesProvinceId: number;
  relativesProvince: string;
  relationship: string;

  purchasingTypeId: number;
  purchasingType: string;
  purchasingPurposeId: number;
  purchasingPurpose: string;
  driverSeftdriverId: number;
  driverSeft: string;

  gradeId: number;
  grade: string;
  colorId: number;
  color: string;
  interiorColor: string;
  interiorColorId: number;
  dlrRemarkForSale: string;
  tmvRemark: string;
  dlrRemarkForCs: string;

  salesDate;
  cancelDate;
  cancelDateNew;
  cancelTypeId: number;
  cancelType: string;
}
