import { BaseModel } from '../base.model';

export interface InvoiceModel extends BaseModel {
  id?: number;
  sVourcher?: string;
  orderNo?: string;
  invoiceNo?: string;
  invoiceDate?: number;
  shipdate?: string;
}
