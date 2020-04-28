import { BaseModel } from '../base.model';

export interface ColumnListModel extends BaseModel {
  colId?;
  columnId?: number;
  columnCode: string;
  columnName: string;
  columnWidth: string;
  columnDes: string;
}

export interface FormColumnModel extends ColumnListModel {
  columnId: number;
  formId: number;
  note: string;
}
