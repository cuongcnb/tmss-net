import { BaseModel } from '../base.model';

export interface ContactCustomerModel extends BaseModel {
  licensePlates?: string;
  sortAgency?: string;
  errorVin?: string;
  errorStatus?: string;
  serviceAdvisor?: string;
  dateTime?: string;
  errorContent?: string;

  errorTVBH?: string;
  errorModel?: string;
  nextBD?: string;
  ownerName?: string;
  errorAddress?: string;
  errorAddressCompany?: string;
  errorAddressChil?: string;
  errorPhone?: string;
  errorPhoneCompany?: string;
  errorPhoneChil?: string;
  errorEmail?: string;
  errorEmailChil?: string;
  companyName?: string;
  carCarrier?: string;
  errorContact?: string;
  errorStop?: string;
  errorTaxi?: string;
}
