import {BaseModel} from '../base.model';

export interface MatchedListModel extends BaseModel {
  buyingGrade: string;
  buyingColor: string;
  expectedArrivalDate: string;
  buyingDealer: string;
  sellingGrade: string;
  sellingColor: string;
  lineOffDate: string;
  sellingDealer: string;
  status: string;
  tmssNo: string;
  matchingStatus: string;
  tmvApproveDate: string;
}

export interface BuyRequestModel extends BaseModel {
  grade: string;
  gradeId: number;
  color: string;
  buyPortEta?: string;
  colorId: number;
  expectedDate: string;
  dealer: string;
  dealerId: number;
  ordering: number;
  sellId: number;
}

export interface SellingListModel extends BaseModel {
  grade: string;
  color: string;
  sellPortEta?: string;
  lineOffDate: string;
  dealer: string;
  dealerId: number;
  status: string;
  tmssNo: string;
  ordering: number;
  buyId: number;
}
