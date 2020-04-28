import { BaseModel } from '../base.model';

export interface ManualOrderModel extends BaseModel {
  id?;
  sVourcher?;
  orderNo?;
  invoiceNo?;
  invoiceDate?;
  shipDate?;
  transportType?;
  transportTypeId?;
  orderType?;
  orderTypeId?;
  orderDate?;
}
