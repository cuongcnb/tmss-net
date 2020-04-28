import { BaseModel } from '../base.model';

export interface OrderSentLexusModel extends BaseModel {
  sortAgency?: string;    // Đại lý
  isStatus?: string;    // Đại lý
  codeDH?: string;    // Đại lý
  codePT?: string;    // Đại lý
  sentTMV?: string;    // Đại lý
  /*Ngày tháng*/
  dateTime?: string;    // Đại lý
  dateTimeTo?: string;    // Đại lý
}
