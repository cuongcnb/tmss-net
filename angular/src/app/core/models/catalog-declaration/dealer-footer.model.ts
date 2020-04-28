import { BaseModel } from '../base.model';

export interface FooterModel extends BaseModel {
  code?: string;
  name?: string;
  description?: string;
  footer?: DealerFooterModel;
  footerTMV?: TmvFooterModel;
}

export interface TmvFooterModel extends BaseModel {
  footerTmv?: string;
  typeId?: number;
}

export interface DealerFooterModel extends BaseModel {
  footer?: string;
  footerTmv?: string;
  typeId?: number;
}

export interface FooterDetailModel extends BaseModel {
  footer?: DealerFooterModel;
  footerTMV?: TmvFooterModel;
}
