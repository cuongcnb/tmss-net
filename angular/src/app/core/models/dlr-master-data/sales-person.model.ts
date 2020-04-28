export interface SalesPersonModel {
  id?;
  salesGroupId?: number;
  groupName?: string;
  saleTeamId?: number;
  teamName?: string;
  fullName?: string;
  ordering?: number;
  birthday?: Date;
  position?: string;
  abbreviation?: string;
  status?: string;
  gender?: number;
  phone?: string;
  email?: string;
  address?: string;
  description?: string;
}
