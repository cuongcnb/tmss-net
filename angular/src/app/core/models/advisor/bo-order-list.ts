import { BaseModel } from '../base.model';
export interface BoOrderList extends BaseModel {
  id: number;
  customerCode: string;
  customerName: string;
  checked: boolean;
}

export interface BoOrderDetailList extends BaseModel {
  orderNumber: string;
  repairorderno: string;
  licensePlate: string;
  dealerAdivsor: string;
  orderDate: string;
  orderType: string;
  numberOfDate: string;
}
