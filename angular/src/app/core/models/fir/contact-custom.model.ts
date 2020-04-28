import { BaseModel} from '../base.model';

export interface ContactCustomModel extends BaseModel {
  licensePlate?: string; // biển số xe
  dayIn?: string; // ngày vào
  dayOut?: string; // ngày ra
  historyContact?: string; // lịch sử liên hệ
  carownerName?: string; // tên chủ xe
  phoneNumber?: string; // số điện thoại
  companyName?: string; // tên công ty
  email?: string; // email
  address?: string; // địa chỉ
  moDel?: string; // model
  carName?: string; // tên xe
  namecarCome?: string; // người mx đên
  sumKm?: number; // số km
  roleName?: string; // vai trò
  vinNo?: string; // vin
  typeRepair?: string; // loại hình sửa chữa
  commandRepair?: string; // lệnh sửa chữa
  serviceAdvisor?: string;  // cố vấn dịch vụ
  workContent?: string; // nội dung công việc
  priceRepair?: string; // thành tiền sửa chữa
  taxRepair?: string; // thuế sc
  accessaryCode?: string; // mã phụ tùng
  accessaryName?: string; // tên phụ tùng
  amount?: string; // số lượng
  accessaryPrice?: string; // giá bán phụ tùng
  accessaryPriceTotal?: string; // thành tiền phụ tùng
  taxAccessary?: string; // thuế phụ tùng
  agency?: string; // đại lí
  contentService?: string; // nội dung dịch vụ
  techniciansName?: string; // kĩ thuật viên
  dayContact?: string; // ngày liên hệ
  hourContact?: string; // giờ liên hệ
  nameContact?: string; // người liên lạc
  statusContact?: string; // trạng thái liên lạc
  comment?: string; // ý kiến
  reason?: string; // lí do
  contactTrue?: string; // lí do liên hệ thành công
  contactFalse?: string; // lí do liên hệ không thành công
  notContact?: string; // không liện lạc
  typeCar?: string; // loại xe
  // thêm khiếu nại
  requestContent?: string; // nội dung không hài lòng khiếu nại
  requestCustomer?: string; // yêu cầu của khách hàng
  requestField?: string; // lĩnh vực không hài lòng
  requestProblem?: string; // vấn đề không hài lòng
  partDamaged?: string; // bộ phận hư hỏng
  phenomenaDamaged?: string; // hiện tượng hư hỏng
  nameQuestion?: string; // tên câu hỏi
  yes?: string; // có
  no?: string; // không
  check?: any; // yêu cầu tham gia
  dayReceive?: any; // ngày nhận
  daySend?: any; // ngày gửi
  sourceReceipt?: any; // ngày tiếp nhận
  status?: any; // trạng thái
}
