import { BaseModel } from '../base.model';

export interface KaizenApiModel extends BaseModel {
  sortAgency?: string;    // Đại lý
  isStatus?: string;      // Trạng thái
  numberRepair?: string;      // Số lệnh sửa chữa
  licensePlates?: string;      // Biển số xe
  isCVDV?: string;      // Cố vấn dịch vụ
  typeRepair?: string;      // Loại sửa chữa
  appointmentTime?: string;      // Thời điểm hẹn
  appointmentContent?: string;      // Nội dung hẹn
  leverMaintenance?: string;      // Phân cấp bảo dưỡng
  isMaintenance?: string;      // Bảo dưỡng
  speciesRepair?: string;      // Loại hình sửa chữa
  /*Ngày tháng*/
  settlementDateTo?: string;      // Đến ngày
  settlementDate?: string;      // Ngày quyết toán
  startDate?: string;      // Ngày giờ bắt đầu sửa xe
  overDate?: string;      // Ngày giờ kết thúc sửa xe
  leaveDate?: string;      // Ngày giờ xe rời đại lý
}
