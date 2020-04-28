import { BaseModel } from '../base.model';

export interface ReferHandlingComplainModel extends BaseModel {
  supplierReception?: string;
  dateSupplierReception?: string;
  todateSupplierReception?: string;
  complainField?: string;
  dateComplainReception?: string;
  todateComplainReception?: string;
  complainProblem?: string;
  complain?: string;
}
