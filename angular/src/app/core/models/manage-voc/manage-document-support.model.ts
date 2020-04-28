import { BaseModel } from '../base.model';

export interface ManageDocumentSupportModel extends BaseModel {
  model?: string;
  title?: string;
  documentName?: string;
  status?: string;
  stt?: string;
  document?: string;
  documentTitle?: string;
  documentKeyWord?: string;
  documentContent?: string;
}
