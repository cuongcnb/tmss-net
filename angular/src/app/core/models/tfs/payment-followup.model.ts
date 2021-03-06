import { BaseModel } from '../base.model';

export interface PaymentFollowupModel extends BaseModel {
  status;
  grade;
  frameNo;
  vin;
  engineNo;
  color;
  audio;
  painInDate;
  lineOffDate;
  assAlloMonth;
  dlrPaymentPlan;
  deferPayment;
  invoiceRequestDate;
  assignmentDate;
  payInvoiceNo;
  invoiceDate;
  payVnAmount;
  payUsdAmount;
  mlDeliveryDate;
  mlDeliveryTime;
  mlArrivalPlanDate;
  mlArrivalPlanTime;
  tscDelivery;
  tscDeliveryTime;
  dlrArrivalDate;
  dlrArrivalTime;
  dlrVehicleStatusId;
  paymentBy;
  tfsAmount;
  tfsProcess;
  documentTmvSituationId;
  documentDeliveryDate;
  documentDeliveryTime;
  documentArrivalDate;
  documentArrivalTime;
  documentArrivalRemark;
  documentDlrSituationId;
  fleetPrice;
  fleetCustomer;
  saleDate;
  dealer;
  otherDealer;
  changeFrom;
  otherDealer2?;
}
