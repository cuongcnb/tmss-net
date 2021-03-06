export interface DealerModel {
  id?;
  code?: string;
  abbreviation: string;
  status?: boolean;
  contactPerson?: string;
  dlrParent?: string;
  type?: string;
  groupDLR?: string;
  vnName?: string;
  enName?: string;
  taxCode?: string;
  accountNo?: string;
  ordering?: number;
  director?: string;
  phone?: string;
  fax?: string;
  address?: string;
  provinceId?: string;
  bank?: string;
  bankAddress?: string;
  description?: string;
  addressPrintDelivery?: string;
  biServer: any;
  createDate: any;
  createdBy: any;
  dealerGroupId: any;
  dealerId: any;
  dealerTypeId: any;
  dlrFooter: any;
  ipAddress: any;
  isDlrSales: string;
  isLexus: string;
  isPrint: string;
  isSellLexusPart: string;
  isSpecial: string;
  isSumDealer: string;
  modifiedBy: any;
  modifyDate: any;
  partLeadtime: number;
  passwordSearchVin: string;
  receivingAddress: any;
  tfsAmount: number;
}
