import { BaseModel } from '../base.model';

export interface DeskAdvisorModel extends BaseModel {
  deskName?: string;
  advisorId?: number;
  advisorCode?: string;
  advisorName?: string;
  busyTodate?: string;
  description?: string;
  updateStatusDate?: string;
}
