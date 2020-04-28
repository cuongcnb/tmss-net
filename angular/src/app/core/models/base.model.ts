export interface BaseModel {
  id?: number;
  ordering?: number;
  createdBy?: number;
  createdDate?: number;
  modifiedBy?: any;
  modifiedDate?: any;
  status?;
  dlrId?: number;
}

export interface LookupDataModel {
  id: number;
  code?: string;
  name: string;
  description?: string;
  value?: string;
}

export interface DealerModel {
  id: number;
  vnName: string;
  code: string;
}

export interface SidebarMenuModel {
  code: string;
  list: Array<SidebarFunctionModel>;
}

export interface SidebarFunctionModel {
  functionCode: string;
  functionName: string;
  functionId?: number;

  functionDescription?: string;
  functionLabel?: string;
  menuCode?: string;
  menuDescription?: string;
  menuId?: number;
  menuName?: string;
}

export interface PaginationParamsModel {
  fieldSort?;
  page;
  size;
  sortType?;
  filters?;
}

interface PaginationFilterFieldModel {
  fieldFilter: string;
  filterValue: string;
}

export interface CurrentUserModel {
  admin: boolean;
  data;
  dealerId: number;
  dealerName: string;
  dealerCode?: string;
  isAdmin: boolean;
  isLexus: boolean;
  menuList: [{code: string, list: Array<SidebarFunctionModel>}];
  token: string;
  userName: string;
  dealerVnName: string;
}
