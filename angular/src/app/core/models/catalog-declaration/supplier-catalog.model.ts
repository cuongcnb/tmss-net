import { BaseModel } from '../base.model';

export interface SupplierCatalogModel extends BaseModel {
  supplierCode?: string;
  supplierName?: string;
  address?: string;
  accNo?: string;
  email?: string;
  tel?: string;
  pic?: string;
  pic_mobi?: string;
  pic_tel?: string;
  fax?: string;
  bankId?: number;
  bankCode?: string;
  picTel?: string;
  ctCode?: string;
  ctId?: string;
  leadTime?: number;
  taxCode?: string;
}
