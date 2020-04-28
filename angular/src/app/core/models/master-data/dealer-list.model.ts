export interface DealerListModel {
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
}

export interface DealerContactsInforModel {
  id?;
  name: string;
  title: string;
  position: string;
  tel: string;
  mobile: string;
  fax: string;
  email: string;
}
