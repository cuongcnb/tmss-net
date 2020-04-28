import { BaseModel } from '../base.model';

export interface FileModel extends BaseModel {
  src?: string;
  file?: File;
}
