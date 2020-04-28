import { BaseModel } from '../base.model';

export interface ServiceKpiDataModel extends BaseModel {
  numberRepairnumberRepair?: number;  // Số lệnh sửa chữa
  importStatus?: number;  // Trạng thái Import
  licensePlates?: string;  // Biển số xe
  serviceAdvisor?: string;  // Cố vấn dịch vụ
  isCity?: string;  // Tỉnh thành
  isCVDV?: string;  // cvdv
  isVin?: string;  // Số Vin
  isKM?: string;  // Số KM
  workContent?: string;  // Nội dung công việc
  isDistrict?: string;  // quận huyện
  isMaintenance?: string;  // bảo dưỡng
  isRepair?: string;  // Sửa chữa
  isType?: string;  // Loại hình
  generalRepair?: string;  // Sửa chữa chung
  isGuarantee?: string;  // Bảo hành
  isInternal?: string;  // Nội bộ
  internalGJ?: string;  // Nội bộ GJ
  internalBP?: string;  // Nội bộ BP
  guaranteeGJ?: string;  // Bảo hành GJ
  guaranteeBP?: string;  // Bảo hành BP
  paintSell?: string;  // Thân vỏ và sơn
  isBody?: string;  // Thân vỏ
  isPaint?: string;  // Sơn
  makeupCar?: string;  // Chăm sóc; làm đẹp xe
  fittingAccessories?: string;  // Lắp phụ kiện
  customersPay?: string;  // Khách hàng trả tiền
  cardContent?: string;  // Nội dung phiếu quà
  isKTV?: string;  // KTV
  groupKTV?: string;  // Nhóm KTV
  isCodeKP?: string;  // Phụ tùng có mã KP
  accessorySCC?: string;  // Phụ tùng SCC
  accessoryBody?: string;  // Phụ tùng thân vỏ
  isDiesel?: string;  // Dầu máy
  isChemistry?: string;  // Dầu và hóa chất khác
  isAccessories?: string;  // Phụ kiện
  codeAccessory?: string;  // Phụ tùng có mã khác
  saleAccessory?: string;  // Giảm giá phụ tùng
  notGenuine?: string;  // Phụ tùng không chính hiệu
  notAccessoriesGenuine?: string;  // Phụ kiện không chính hiệu
  notGenuineMerit?: string;  // Phụ tùng không chính hiệu từ công
  beforeSale?: string;  // TỔng doanh thu trước giảm giá
  afterSale?: string;  // TỔng doanh thu sau giảm giá
  afterVAT?: string;  // TỔng doanh thu sau VAT
  otherRevenue?: string;  // Phụ tùng bảo hành và doanh thu khác
  insuranceRevenue?: string;  // Doanh thu bảo hiểm
  isWarranty?: string;  // Công bảo hành
  totalRevenue?: string;  // Tổng doanh thu bảo hành
  maintenanceRevenue?: string;  // Doanh thu bảo dưỡng
  internalRevenue?: string;  // Doanh thu nội bộ
  actualRevenue?: string;  // Doanh thu thực tế
  publicOutsourcing?: string;  // Công thuê ngoài
  suppliesExtra?: string;  // Vật tư phụ
  suppliesPaint?: string;  // Vật tư sơn
  beautySalon?: string;  // Beauty Salon
  expecteddate?: string;  // Mức độ hư hỏng
  isLabor?: string;  // Công lao động
  isTotal?: number;  // Tổng
  invoiceNumber?: number;  // Số hóa đơn
  isNote?: string; // Ghi chú
  sortAgency?: string; // Đại lý
  statusCommand?: string; // trạng thái lệnh
  ratioSupplies?: string; // Tỉ lệ vật tư sơn
  statusClassify?: string; // Trạng thái phân loại
  isRoots?: string; // Nguồn gốc
  carModel?: string; // Mẫu xe
  codeCarType?: string; // Mã kiểu xe
  classifyKH?: string; // Phân loại khách hàng
  nextMaintenance?: string; // Lần bảo dưỡng tiếp theo
  packageName?: string; // Tên gói
  isFunds?: string; // Khoảng tiền
  isCalculate?: string; // Tính theo
  isSTT?: string; // STT
  isRevenue?: string; // Doanh thu từ
  isRevenueTo?: string; // Doanh thu từ ..đến

  /*Chủ xe*/
  carOwnerName?: string; // Tên chủ xe
  contactName?: string; // Tên người liên hệ
  CarOwnerPhone?: string; // Số điện thoại chủ xe
  contactPhone?: string; // Số điện thoại chủ xe
  carOwnerAddress?: string; // Địa chỉ chủ xe
  companyName?: string; // Tên Công ty
  isTMVDate?: string; // Ngày TMV duyệt bảo hành

  /*Liên quan date time*/

  settlementDate?: string; // Ngày quyết toán
  startTime?: string; // Giờ bắt đầu sửa chữa
  endTime?: string; // Giờ kết thúc sửa chữa
  totalTime?: string; // Tổng thời gian sửa chữa
  dateTime?: string; // Ngày quyết toán từ
  dateTimeTo?: string; // đến
  inputDate?: string; // Ngày vào
  sellCarDate?: string; // Ngày bán xe
}
