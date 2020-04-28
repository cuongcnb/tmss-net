import { BaseModel } from '../base.model';

export interface CsiSurveyModel extends BaseModel {
  // xử lý khách hàng khảo sát CSI

  removeReason?: string; // lí do loại bỏ removeReason
  agency?: string; // đại lý
  customerName?: string; // tên khách hàng
  companyName?: string; // tên công ty
  customerAdd?: string; // địa chỉ khách hàng
  contactName?: string; // tên người liên hệ
  contactPhoneNumber?: number; // số điện thoại người liên hệ
  node?: string; // ghi chú
  licensePlate?: string; // biển số xe
  Model?: string; // model
  Amount?: string; // amount
  repairRequest?: string; // yêu cầu sửa chữa
  km?: string; // Km
  carComeDay?: string; // ngày mang xe đến
  deliveryDate?: string; // ngày giao xe
  serviceAdviser?: string; // cố vấn dịch vụ CVDV
}
