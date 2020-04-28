import { BaseModel } from '../base.model';

export interface SsiCsiSurveyModel extends BaseModel {
  stt?: string; // sô thứ tự
  daySurvey?: string; // ngày khảo sát
  agency?: string; // đại lí
  staffSurvey?: string; // nhân viên khảo sát
  contactName?: string; // tên người liên hệ
  customerName?: string; // tên khách hàng
  customerAdd?: string; // địa chỉ khách hàng
  contactPhoneNumber: number; // số điện thoại khách hàng
  idd?: string; // idd
  licensePlate?: string; // biển số xe
  model?: string; // model
  amount?: string; // doanh thu
  repairRequest?: string; // yêu cầu sửa chữa
  dayCarCome?: string; // ngày mang xe đến
  receiveDate?: string; // ngày nhận xe
  serviceAdviser?: string; // CVDV
  refuseFirst?: string; // từ chối ngay ban đầu
  refuseInSurvey?: string; // từ chối trong quá trình khảo sát
  otherPeople?: string; // người khác
  otherCase?: string; // trường hợp khác
  phoneBusy?: string; // máy bận
  errorNumber?: string; // sai số
  turnOffPhone?: string; // tắt máy
  unHeard?: string; // không nghe máy
  result?: string; // kết quả 1/0
  reason?: string; // lý do
  questionOne?: string; // câu hỏi 1
  questionTwo?: string; // câu hỏi 2
  questionThree?: string; // câu hỏi 3
  questionFour?: string; // câu hỏi 4
  repairTime?: string; // thời gian sửa chữa
  comment?: string; // comment
  reasonSuccess?: string; // lý do thành công



  // csi-survey
  contractOwner?: string; // người đứng tên hợp đồng
  deliveryDate?: string; // ngày giao xe
  warrantyStaff?: string; // nhân viên bảo hành
  frameNumber?: string; // số khung
  point?: string; // điểm
  notePoint?: string; // note điểm
  firstBuyCar?: string; // KH mua xe lần đầu
  replaceOldCar?: string; // KH mua xe thay thế cho xe cũ
  buyMore?: string; // mua thêm
  questionOneOne?: string; // Chiếc xe A/C sử dụng trước đây là xe gì
  questionOneTwo?: string; // A/C bán chiếc xe cũ cho người quen, môi giới , NVBH hay ĐL xe cũ của TMV
  noteQuestionOneTwo?: string;
  questionOldCar?: string; // A/C có biết đến hệ thống ĐL xe cũ của Toyota không?
  questionForPrice?: string; // Trước khi bán xe , A/C có liên hệ đến ĐL xe cũ để định giá xe không
  questionForReason?: string; // Lý do không bán xe cho ĐL TMV/Không liên hệ định giá
  opinion?: string; // A/C có điểm nào muốn góp ý để khâu thu mua xe cũ của bên em cải thiện tốt hơn không
  noteOpinion?: string;
  modelOldCar?: string; // Mẫu xe A/C đang sử dụng song song với chiếc xe mới mua là xe gì
  questionPurpose?: string; // A/C mua chiếc xe này là mua cho cá nhân/Gia đình hay mình mua để kinh doanh
  questionFinanceOne?: string; // Khi mua chiếc xe này  , A/C có sử dụng dịch vụ hỗ trợ tài chính nào không
  noteFinanceOne?: string;
  questionFinanceTwo?: string; // 'A/C sử dụng dịch vụ hỗ trợ tài chính ở ĐL mình mua xe không
  noteFinanceTwo?: string; //
  questionFinanceThree?: string; // A/C sử dụng sự hỗ trợ từ ngân hàng nào
  noteFinanceThree?: string;
  buyInsurance?: string; // 'Lần vừa rồi , A/C có mua bảo hiểm cho xe không
  noteInsuranceOne?: string;
  noteInsuranceTwo?: string;
  insuranceConsultants?: string; // Khi A/C mua xe  , NVBH bên em có tư vấn về bảo hiểm cho mình không
  noteInsuranceConsultants?: string;
  reasonBuyInsuranceOne?: string; // Bạn bè/Người thân bán bảo hiểm
  reasonBuyInsuranceTwo?: string; // Giá BH tại ĐL cao hơn ở ngoài
  reasonBuyInsuranceThree?: string; // Ở tỉnh khách/Ở xa ĐL
  reasonBuyInsuranceFour?: string; // NVBH tư vấn nên mua bên ngoài ĐL
  reasonBuyInsuranceFive?: string; // Chưa mua , chờ đăng kí xong mới mua
  otherReasonBuyInsuranceTwo?: string; // Khác
  typeInsurance?: string; // A/C mua bảo hiểm thường hay bảo hiểm Toyota
  noteTypeInsurance?: string;
  advisoryInsurance?: string; // A/C có được tư vấn bảo hiểm Toyota hay không
  noteAdvisoryInsurance?: string;
  reasonNotBuyInsuranceToyota?: string; // Lý do không mua bảo hiểm Toyota
  advisoryInsuranceTwo?: string; // A/C có được NV tư vấn rõ về sản phẩm phù hợp với phạm vi bảo hiểm không
  noteAdvisoryInsuranceTwo?: string;
  satisfactionAdvisoryInsuranceTwo?: string; // Mức độ hài lòng về việc tư vấn bảo hiểm tại ĐL
  noteSatisfactionAdvisoryInsuranceTwo?: string;
  feedBackInsurance?: string; // A/C có góp ý gì để dịch vụ bảo hiểm hoàn thiện hơn
  noteFeedBackInsurance?: string;
  accessoriesOne?: string; // Lâu lắm rồi , A/C có mua thêm phụ kiện cho xe không
  noteAccessoriesOne?: string;
  accessoriesTwo?: string; // Mình có hay đi mua phụ kiện ở ĐL không A/C
  noteAccessoriesTwo?: string;
  accessoriesTwoOne?: string; // Có mối quen bên ngoài
  noteAccessoriesTwoTwo?: string; // NVBH hỗ trợ giới thiệu mua bên ngoài
  noteAccessoriesTwoThree?: string; // Giá phụ kiện ở ĐL cao hơn bên ngoài
  noteAccessoriesTwoFour?: string; // ĐL không có phụ kiện KH cần
  noteAccessoriesOther?: string; // Khác
  testCarBefore?: string; // A/C có tham gia lái thử xe trước khi quyết định mua xe không
  noteTestCarBefore?: string;
  testCarBeforeForDecision?: string; // Việc lái xe thử có quan trọng đối với việc quyết định mua xe
  noteTestCarBeforeDecision?: string;
  reasonNotTestCarBeforeOne?: string; // Không biết ĐL có xe lái thử
  reasonNotTestCarBeforeTwo?: string; // Mẫu xe không có tại ĐL
  reasonNotTestCarBeforeThree?: string; // Đã trải nghiệm nhiều xe nên không cần thiết
  reasonNotTestCarBeforeFour?: string; // Không có thời gian lái thử
  reasonNotTestCarBeforeOther?: string; // khác
}
