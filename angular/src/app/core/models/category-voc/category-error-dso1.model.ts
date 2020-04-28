import { BaseModel } from '../base.model';

export interface CategoryErrorDso1Model extends BaseModel {
  codeDSO1?: string;
  nameDSO1EN?: string;
  nameDSO1VN?: string;
  status?: string;
  stt?: string;
  description?: string;
  /// loại lỗi 2 DSO
  codeDSO2?: string;
  nameDSO2VN?: string;
  nameDSO2EN?: string;
  /// nguyên nhân 1 DSO
  codeReasonDSO1?: string;
  nameReasonDSO1EN?: string;
  nameReasonDSO1VN?: string;
  // nguyên nhân 2 DSO
  nameDSO1?: string;
  nameDSO2?: string;
  codeReasonDSO2?: string;
  nameReasonDSO2VN?: string;
  nameReasonDSO2EN?: string;
}
