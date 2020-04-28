import { BaseModel} from '../base.model';

export interface FirCategoryModel extends BaseModel {
  licensePlate?: string; // biển số xe
  sortAgency?: string; // Đại lý
  questionName?: string; // Tên câu hỏi
  isStatus?: string; // Trạng thái
  isSerial?: number; // Số thứ tự
  isNote?: string; // Ghi chú
  errorName?: string; // Tên bộ phận gây lỗi
  errorField?: string; // Tên lĩnh vực gây lỗi
  isDescribe?: string; // Mô tả
  isAdviser?: string; // Cố vấn dịch vụ
  isNotContact?: string; // Lý do không liên hệ được
  isValue?: number; // Giá trị
  errorCause?: string; // Nguyên nhân lỗi
  codeCause?: string; // Mã lỗi
  coreReason?: string; // Nguyên nhân cốt lõi
}
