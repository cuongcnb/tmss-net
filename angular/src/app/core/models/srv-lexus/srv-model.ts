import { BaseModel } from '../base.model';

export interface SrvModel extends BaseModel {
  lexusAgency: string;
  agency: string;
  status: string;

  find: string ;
  code: string;
  vnName: string;
  lexusId: string;
  partId: string;
  dlrId: number;

  partsCode: string;
  partsName: string;
  dlrPrice: string;
  sellPrice: string;
  purchasePrice: string;

}
