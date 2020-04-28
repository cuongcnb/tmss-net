import { BaseModel } from '../base.model';

export interface SearchExtractDataModel extends BaseModel {
  isRO?: string;  // Số RO
  repairContent?: string;  // Nội dung sửa chữa
  licensePlates?: string; // Biển số
  sortAgency?: string;  // Đại lý
  errorVin?: string;  // Vin
  errorModel?: string;  // Model
  Km?: string;  // Km
  updateKm?: string;  // Số km cập nhật
  nextBD?: string;  // Mốc BD
  isRo?: string;  // Số RO
  nextBDto?: string;  // Mốc BD tiếp
  requestKH?: string;   // yêu cầu của khách hàng
  numberSC?: string; // số lệnh SC
  isTechnicians?: string; // Kỹ thuật viên
  LHSC?: string; // LHSC
  CVDV?: string; // CVDV
  errorName?: string; // Tên bộ phận gây lỗi
  isDescribe?: string; // Mô tả
  isLHDV?: string; // LHDV
  contentDV?: string; // Nội dung dv
  isList?: string; // Danh sách
  typeDV?: string; // Loại hình DV
  serviceAdviser?: string; // Cố vấn dịch vụ
  serviceType?: string; // Loại hình dịch vụ
  infoAppointment?: string; // Thông tin đặt hẹn
  isComplain?: string; // Phàn nàn
  contentCall?: string; // Nội dung gọi
  isNote?: string; // Ghi chú
  isAnnotate?: string; // Chú thích
  errorReason?: string; // Lý do
  reasonKH?: string; // Lý do kH không quay lại
  noteReason?: string; // Ghi chú Lý do kH không quay lại
  errorStatus?: string;   // Trạng thái
  callResult?: string;    // kết quả cuộc gọi
  callPeople?: string;    // Người thực hiện cuộc gọi
  /*Tìm kiếm cuộc gọi*/
  /*Thông tin người lái xe*/
  isDriver?: string;    // Người mang xe
  driverAddress?: string;    // Địa chỉ Người mang xe
  driverPhone?: number;    // Điện thoại Người mang xe
  driverEmail?: string;    // Email Người mang xe
  /*Người Mang xe*/
  companyName?: string;    // Tên công ty
  companyAddress?: string;    // Địa chỉ Công ty
  companyPhone?: number;    // Điện thoại Công ty
  companyEmail?: string;    // Email Công ty
  /*Thông tin liên hệ*/
  contactFail?: string; // LH không thành công
  errorContact?: string;  // Người liên hệ
  contactStatus?: string;    // Trạng thái liên hệ
  contactType?: string; // Loại liên hệ
  infoContact?: string; // thông tin LH
  resultContact?: string; // kết quả LH
  contactAddress?: string;    // Địa chỉ Liên hệ
  contactPhone?: number;    // Điện thoại liên hệ
  contactEmail?: string;    // Email Liên hệ
  /*Thông tin chủ xe*/
  isName?: string;    // Tên Chủ xe
  isAddress?: string;    // Địa chỉ Chủ xe
  isPhone?: number;    // Điện  thoại Chủ xe
  isEmail?: string;    // Email Chủ xe
  isDistrict?: string;    // Quận/Huyện Chủ xe
  isCity?: string;    // Tỉnh/TP Chủ xe
  saleConsultant?: string;    // Tư vấn bán hàng
  /*Liên quan date time*/
  dateAppointment?: string; // Ngày hẹn từ
  dateAppointmentTo?: string;  // Đến ngày
  hourAppointment?: string; // Giờ hẹn
  arrivalDate?: string; // ngày xe đến
  arrivalDateTo?: string; // ngày xe đi
  expectedDate?: string; // ngày dự kiến
  dayReality?: string;    // Ngày thực tế
  contactData?: string; // ngày liên hệ
  contactHour?: string; // Giờ liên hệ
  fromDate?: string; // Từ ngày
  fromDateTo?: string; // Đến ngày
  dealDate?: string; // Ngày giao xe
  dateDVOut?: string; // Ngày ra DV
  dateDV?: string; // Ngày vào DV
  dateComeBack?: string; // Ngày quay lại
  dateNumber?: string; // Ngày quay lại ở dạng số
}
