import { BaseModel } from '../base.model';

export interface SsiSurveyModel extends BaseModel {
  removeReason?: string; // lí do loại bỏ
  removePhoneNumber?: string; // xóa số điện thoại k hợp lệ
  removeCustomBlackList?: string; // xóa khách hàng trong danh sách đen
  removeLexus?: string; // xóa khách hàng trong đại lý lexus
  removeSuggestionsList?: string; // xóa khách hàng trong danh sách gợi ý
  removePhoneNumberRepeat?: string; // xóa khách hàng trùng lặp
  customerName?: string; // tên khách hàng
  customerAdd?: string; // địa chỉ khách hàng
  phoneNumber?: number; // số điện thoại khách hàng
  contactName?: string; // tên người liên hệ
  contactPhoneNumber?: number; // số điện thoại liên hệ
  model?: string; // model
  frameNumber?: string; // số khung
  saleDate?: string; // ngày báo bán
  deliveryDate?: string; // ngày giao xe
  dayCreateQuestion?: string; // ngày tạo câu hỏi
  seller?: string; // người bán
  note?: string; // ghi chú
  dlrRemark?: string; // Dlr remark for CS
  agency?: string; // đại lý
  daySurvey?: string; // ngày khảo sát
  dayIn?: string; // ngày vào
  dayOut?: string; // ngày ra
  idNumber?: string; // ID
  node?: string; // ghi chú
  surveyType?: string; // Loại khảo sát
  colData?: string; // cột dữ liệu
  dataType?: string; // loại dữ liệu
  dataName?: string; // tên dữ liệu
  status?: string; // trạng thái
  surveyResult?: string; // kết quả khảo sát
  chooseFile?: any; // chọn file
}
