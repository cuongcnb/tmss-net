import { BaseModel } from '../base.model';

export interface InvoiceLexusModel extends BaseModel {
  id?: number;
  sVourcher?: string;
  orderno?: string;
  invoiceno?: string;
  invoicedate?: number;
  shipdate?: string;

}
