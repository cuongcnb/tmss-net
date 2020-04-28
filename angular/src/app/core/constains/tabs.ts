export const TMSSTabs = {
  // System admin
  systemUserAndGroupDefinition: 'SYSTEM_USER_AND_GROUP',
  userGroupAndAuthority: 'USER_GROUP_AUTHORITY',
  systemFunctionList: 'SYSTEM_FUNCTIONS',
  declareIp: 'DECLARR_IP',
  userManagement: 'USER_MANAGEMENT', // Đang k dùng
  userListFunctionReport: 'USER_LIST_FUNCTION_REPORT',

  // DLR Khai báo danh mục
  provinceList: 'PROVINCES', // Danh sách tỉnh thành
  districtList: 'DISTRICTS', // Danh sách quận huyện
  dealerIpConfig: 'IP_DEALER_CONFIG',
  repairJobMaster: 'REPAIR_JOB_MASTER',
  applyJobForCarMaster: 'APPLY_JOB_FOR_CAR_MASTER',
  applyBPJobForCarMaster: 'APPLY_BP_JOB_FOR_CAR_MASTER',
  unitCatalog: 'UNIT_CATALOG', // Danh mục đơn vị
  staffCatalog: 'STAFF_CATALOG', // Danh sách nhân viên
  repairCavity: 'REPAIR_CAVITY', // Danh mục khoang sửa chữa
  wshopBpGroup: 'WSHOP_BP_GROUP', // Danh mục khai báo tổ/nhóm đồng sơn
  parameterOperationAgent: 'PARAMETER_OPERATION_AGENT', // Khai báo tham số hoạt động đại lý
  modelDeclaration: 'MODEL_DECLARATION', // Quản lý công việc SCC
  generalRepair: 'SCC_MANAGEMENT', // Quản lý công việc SCC
  supplierManagement: 'SUPPLIER_MANAGEMENT', // Danh mục nhà cung cấp
  insuranceCompany: 'INSURANCE_MASTER', // Danh sách công ty bảo hiểm
  agentCampaignManagement: 'AGENT_CAMPAIGN_MANAGEMENT', // Quản lý chiến dịch đại lý
  bankCatalog: 'BANK_MANAGEMENT', // Danh mục ngân hàng
  dealerFooter: 'DEALER_FOOTER', // DLR Footer
  deskAdvisor: 'DESK_ADVISOR', // Desk Advisor
  dlrFloor: 'DLR_FLOOR', // DLR Floor
  collocationCustomer: 'COLLOCATION_CUSTOMER', // Sắp xếp thứ tự tiếp nhận khách hàng dịch vụ
  forecastOrder: 'FORECAST_ORDER', // TEST Forecast Stock Order
  followOrder: 'FOLLOW_ORDER', // TEST BO Follow Up CVDV
  dsManagement: 'DS_MANAGEMENT', // TEST BO Follow Up CVDV
  campaignDlr: 'CAMPAIGN_DLR', // TEST BO Follow Up CVDV
  laborRateMaintenance: 'LABOR_RATE_MAINTENANCE', // Labor rate maintenance

  // DLR Advisor
  customerInfo: 'CUSTOMER_INFO', // Thông tin khách hàng
  progressTrackingTable: 'PROGRESS_TRACKING_TABLE', // Bảng theo dõi tiến độ
  cavityStatus: 'CAVITY_STATUS', // Trạng thái khoang
  technicianStatus: 'TECHNICIAN_STATUS', // Trạng thái kỹ thuật viên
  booking: 'PHIEU_HEN', // Phiếu hẹn
  standardizeCustomerInfo: 'CHUAN_HOA_KH', // Chuẩn hóa thông tin khách hàng
  changeCustomerInfo: 'SUA_KH', // Sửa thông tin khách hàng
  unfWorkDlrAdv: 'CONG_VIEC_DANG_DO_CVDV', // Công việc dang dở của CVDV
  repairProfile: 'REPAIR_PROFILE', // Hồ sơ sửa chữa
  quotationAccount: 'BAO_GIA_QUYET_TOAN', // Tạo báo giá/ Quyết toán kết hợp
  storageQuotation: 'STORAGE_QUOTATION', // Lưu trữ báo giá
  storageJobPackage: 'STORAGE_JOB_PACKAGE', // Lưu trữ gói công việc
  proposal: 'BAO_GIA', // Báo giá
  viewProposal: 'THONG_TIN_LUU_TRU_BAO_GIA', // Báo giá
  dlrBoPartsFollowupCvdv: 'MAN_HINH_BO_FOLLOWUP_CVDV',
  moveRoSettlementToRepair: 'MOVE_RO_SETTLEMENT_TO_REPAIR',

  // DLR-Coo
  generalRepairProgress: 'TIEN_DO_SCC', // Tiến độ sửa chữa chung
  infoGeneralRepairProgress: 'TT_TIEN_DO_SCC', // Thông tin tiến độ sửa chữa chung
  dongsonProgress: 'TIEN_DO_DONG_SON', // Tiến độ sửa chữa Đồng sơn
  dongsonProgressByCar: 'DONG_SON_BY_CAR', // Tiến độ sửa chữa Đồng sơn
  dongsonProgressByWshop: 'DONG_SON_BY_WSHOP', // Tiến độ sửa chữa Đồng sơn
  vehicleHistory: 'VEHICLE_HISTORY', // Lịch sử xe dừng
  progressReport: 'PROGRESS_REPORT', // Báo cáo tiến độ
  carWash: 'CAR_WASH', // Tiến độ rửa xe
  emp: 'EMP', // Tiến độ KTV
  managementStatus: 'MANAGEMENT_STATUS', // Quản lý trạng thái

  // DLR-Cashier
  cashier: 'CASHIER', // Thu ngân
  carNotSettlementToOutGate: 'XE_CHUA_QUYET_TOAN_RA_CONG', // Xe chưa quyết toán ra cổng
  carOutPortGeneralReport: 'BAO_CAO_XE_RA_CONG', // Báo cáo tổng hợp xe ra cổng

  // SERVICE REPORT
  accessoryImportExportHistoryReport: 'accessoryImportExportHistoryReport', // Báo cáo lịch sử xuất nhập phụ tùng **
  // accessoryInventoryCheckReport: 'accessoryInventoryCheckReport', // BC kiểm kê PT tồn kho
  // outputReport: 'outputReport', // BC xuất hàng **
  // accessorySellingReport: 'accessorySellingReport', // BC lịch sử bán hàng 1 PT **
  dealerBookingToTmvReport: 'dealerBookingToTmvReport', // BC đặt hàng của đại lý lên TMV
  receiveReport: 'REPORT_RECEIVE', // BC nhận hàng
  accessoryAmountAdjustReport: 'accessoryAmountAdjustReport', // BC điều chỉnh số lượng PT
  accessoryImportExportReport: 'accessoryImportExportReport', // BC xuất nhập PT
  tmvOutstandingReport: 'tmvOutstandingReport', // BC hàng TMV còn nợ
  appointmentReport: 'bookReportByDay', // BC tổng hợp đặt hẹn theo ngày
  carOutPortReport: 'carOutPortReport', // BC xe ra cổng
  accessoryRateReport: 'accessoryRateReport', // BC tỉ lệ cung cấp PT
  roGeneralReportByDay: 'roGeneralReportByDay', // BC tổng hợp RO theo ngày
  contactAfterRepairGeneralReport: 'contactAfterRepairGeneralReport', // BC tổng hợp liên hệ sau sữa chữa
  stockInventoryReportByPrice: 'stockInventoryReportByPrice', // BC kiểm kê tồn kho theo giá đích danh
  boStorageTime: 'boStorageTime', // Thời gian lưu kho hàng BO
  rateOfSupplyAccessoryByRo: 'rateOfSupplyAccessoryByRo', // Tỉ lệ cung cấp PT theo RO
  rateOfSupplyAccessoryByAccessoryCode: 'rateOfSupplyAccessoryByAccessoryCode', // Tỉ lệ cung cấp PT theo mã PT
  customerServiceReport: 'customerServiceReport', // BC lượt xe, khách hàng dịch vụ
  roListWithNotEnoughAccessory: 'roListWithNotEnoughAccessory', // Danh sách RO có PT về chưa đủ
  // checkQualityReportByDealer: 'checkQualityReportByDealer', // BC phân cấp kiểm tra chất lượng theo đại lý

  partImportExportHistoryReport: 'PART_IMPORT_EXPORT_HISTORY_REPORT', // Bao cao lich su xuat nhap phu tung
  partImportExportReport: 'PART_IMPORT_EXPORT_REPORT', // Bao cao xuat nhap phu tung
  partAmountAdjustmentReport: 'PART_AMOUNT_ADJUSTMENT_REPORT', // BC điều chỉnh số lượng PT
  partSupplyRateByPartCodeReport: 'PART_SUPPLY_RATE_BY_PART_CODE_REPORT', // Báo cáo tỉ lệ cung cấp phụ tùng theo mã phụ tùng
  partsSupplyRatioReport: 'PARTS_SUPPLY_RATIO_REPORT', // Báo cáo tỷ lệ cung cấp phụ tùng theo RO
  reportReceive: 'REPORT_RECEIVE', // BC nhận hàng
  roGeneralByDayReport: 'RO_GENERAL_BY_DAY_REPORT', // BC tổng hợp RO theo ngày
  partsCheckInventoryReport: 'PARTS_CHECK_INVENTORY_REPORT', // Báo cáo kiểm kê tồn kho theo giá đích danh
  accessoryInventoryCheckReport: 'ACCESSORY_INVENTORY_CHECK_REPORT', // BC kiểm kê PT tồn kho
  outputReport: 'PARTS_STOCK_EXPORT_REPORT', // BC xuất hàng
  accessorySellingReport: 'ACCESSORY_SELLING_REPORT', // BC lịch sử bán hàng 1 PT **
  retailSalesReport: 'PARTS_RETAIL_EXPORT_REPORT', // BC xuất bán lẻ **
  oweTmvReport: 'OWE_TMV_REPORT', // BC hàng TMV còn nợ **
  decentralizedInspectionAgentQuality: 'CHECK_QUALITY_REPORT_BY_DEALER', // BC phân cấp kiểm tra chất lượng **
  serviceRateAndRoFillReport: 'SERVICE_RATE_AND_RO_FILL_REPORT', // BC Service rate và R/O Fill rate theo ngày/năm
  partRetailGeneralReport: 'PART_RETAIL_GENERAL_REPORT', // BC tổng hợp bán lẻ phụ tùng
  roUnfinishedReport: 'RO_UNFINISHED_REPORT', // Danh sách RO chưa hoàn thành
  roListWithFullPart: 'RO_LIST_WITH_FULL_PART', // Danh sách RO có PT về đủ
  timeStoreBo: 'TIME_STORE_BO', // Thời gian lưu trữ kho hàng BO
  orderOfDlrToTmv: 'ORDER_OF_DLR_TO_TMV', // đặt hàng đại lý đến TMV
  listRoPartBoNotEnough: 'RO_LIST_WITH_NOT_ENOUGH_PART', // Báo cáo danh sách RO có phụ tùng chưa về đủ
  vehicleSummaryReport: 'VEHICLE_SUMMARY_REPORT',

  // DLR-Warranty
  dlrClaimReport: 'DLR_CLAIM_STATUS_REPORT',
  dlrUnclaimOrder: 'DLR_UNCLAIM_ORDER',
  vehicleRegistration: 'VEHICLE_REGISTRATION',
  campaignManagementTmv: 'CAMPAIGN_MANAGEMENT_TMV', // Quản lý chiến dịch TMV

  // DLR-Warranty-new:
  warrantyInformation: 'WARRANTY_INFORMATION',
  claimStatusReport: 'CLAIM_STATUS_REPORT',
  warrantyFollowUp: 'WARRANTY_FOLLOW_UP',
  warrantyAssign: 'WARRANTY_ASSIGN',
  updateKm: 'UPDATE_KM',
  exchangeRateMaintenance: 'EXCHANGE_RATE_MAINTENANCE',
  t1t2t3WarningList: 'T1_T2_T3_WARNING_LIST',
  subletTypeMaintenance: 'SUBLET_TYPE_MAINTENANCE',
  warrantyDailyClaimReport: 'WARRANTY_DAILY_CLAIM_REPORT',
  warrantyCheckWmi: 'WARRANTY_CHECK_WMI',
  vendorMaintenance: 'VENDOR_MAINTENANCE',
  warrantyVehicleRegistration: 'WARRANTY_VEHICLE_REGISTRATION',
  soldVehicleMaintenance: 'SOLD_VEHICLE_MAINTENANCE',

  // TMV-Warranty
  warrantyClaimJudgement: 'warrantClaimJudgement',
  warrantyTimeSheetDeclare: 'WARRANTY_TIME_SHEET_DECLARE',  // Khai báo tham số giờ công bảo hành

  campaignVehComplete: 'CAMPAIGN_VEH_COMPLETE',
  campaignFollowRemind: 'CAMPAIGN_FOLLOW_REMIND',
  campaignFollowUp: 'CAMPAIGN_FOLLOW_UP',

  // DLR Parts Management
  dlrBoPartsExport: 'XUAT_PHU_TUNG',
  dlrBoPartsRequest: 'DAT_HANG_BO',
  dlrBoPartsFollowup: 'THEO_DOI_BO',
  dlrBoPartsFollowupNvpt: 'MAN_HINH_BO_FOLLOWUP_NVPT',
  dlrRoLackOfParts: 'XUAT_PHU_TUNG_RO',
  dlrPartsOrderForStoring: 'DAT_HANG_DU_TRU',
  dlrPartsRetail: 'BAN_LE_PHU_TUNG',
  dlrPartsRetailNewTabOrder: 'TAO_MOI_BAN_LE_PHU_TUNG',
  dlrPartsManualOrder: 'DAT_HANG_THU_CONG',
  newManualTabOrder: 'NEW_MANUAL_TAB_ORDER',
  dlrPartsInStockAdjustment: 'DIEU_CHINH_PHU_TUNG',
  dlrPartsSpecialOrder: 'DAT_HANG_DAC_BIET',
  dlrPartsPrePlanOrder: 'DAT_HANG_KE_HOACH',
  dlrPartsInStockStatus: 'TRANG_THAI_STOCK',
  dlrPartsInfoManagement: 'QUAN_LY_PHU_TUNG',
  dlrPartsCancelOrderRequest: 'HUY_DAT_HANG',
  dlrPartsReceiveAuto: 'NHAN_HANG_TU_DONG',
  dlrPartsReceiveManual: 'NHAN_HANG_THU_CONG',
  dlrPartsReceiveNonToyota: 'NHAN_HANG_NON_TOYOTA',
  dlrPartsUpcommingInfo: 'HANG_SAP_VE',
  dlrPartsLookupInfo: 'TRA_CUU_PHU_TUNG',
  dlrPartsExportLackLookup: 'TIM_KIEM_LENH_XUAT_CHUA_DU',
  dlrPartsCancelChecking: 'THEO_DOI_TINH_TRANG_HUY_PHU_TUNG',
  dlrDeadStockPartForSale: 'RAO_BAN_PHU_TUNG_DEAD_STOCK',
  dlrDeadStockPartSearching: 'TIM_KIEM_PT_DEADSTOCK_RAO_BAN',
  dlrSendClaim: 'GUI_CLAIM',
  dlrPartsRepairPositionPrepick: 'SUA_VI_TRI_PT_DANG_PREPICK',
  dlrMipCalculate: 'TINH_MIP',
  dlrOnhandOrderFollowup: 'THEO_DOI_VA_XU_LY_DH_TON',
  partsCheckPriceCode: 'HOI_MA_GIA_PT',
  partsReciveHistory: 'LICH_SU_NHAP_PHU_TUNG',
  partShippingHistory: 'LICH_SU_XUAT_PHU_TUNG',
  mipImport: 'IMPORT_MIP',
  orderForLexusPart: 'DAT_HANG_PHU_TUNG_CHUYEN_BIET_LEXUS',
  partsNonLexusOrderLexus: 'DON_HANG_DAI_LY_GUI_LEXUS',
  setupFormulaMIP: 'SETUP_FORMULA_MIP',
  partSaleDlrToTmv: 'PART_SALE_DLR_TO_TMV',
  lexusReturnToDealer: 'LEXUS_RETURN_TO_DEALER',

  // DLR FIR & MRS
  dlrListOfMaintenanceMilestones: 'dlrListOfMaintenanceMilestones',
  dlrListOfCustomersRequiringMaintenance: 'dlrListOfCustomersRequiringMaintenance',
  dlrListOfMilestonesNeedToBeRequireAfterRepair: 'dlrListOfMilestonesNeedToBeRequireAfterRepair',
  dlrListOfCustomersToContactAfterRepair: 'dlrListOfCustomersToContactAfterRepair',
  firModifyAfterProcess: 'UPDATE_AFTER_PROCESS',
  contactAfterRepair: 'LIEN_HE_KHACH_HANG_SAU_SUA_CHUA',

  // QUEUING SYSTEM
  gateInOut: 'GATE_IN_OUT',
  receptionist: 'RECEPTIONIST', // Lễ tân
  receivingVehicle: 'RECEIVING_VEHICLE', // Tiếp nhận xe ra vào của CVDV
  vehicleInModal: 'PROTECTOR', // Màn hình cho bảo vệ
  progressCustomer: 'PROGRESS_CUSTOMER',
  screenWaitReception: 'SCREEN_WAIT_RECEPTION',

  // MAINTENANCE OPERATION - Hoạt động nhắc bảo dưỡng
  maintenanceCalling: 'MAINTENANCE_CALLING',
  maintenanceCallingNotContact: 'MAINTENANCE-CALLING-NOT-CONTACT',
  maintenanceMessage: 'MAINTENANCE_MESSAGE',
  maintenanceLetter: 'MAINTENANCE_LETTER',

  // WORDS_1K - Hoạt động 1k
  contactAfterDays15: 'CONTACT_AFTER_DAY15',
  contactAfterDays55: 'CONTACT_AFTER_DAY55',
  contactMaintenanceRemind: 'CONTACT_MAINTENANCE_REMIND',

  // SEARCH_EXTRACT_DATA - Tìm kiếm và trích xuất dữ liệu
  searchCustomer: 'SEARCH_CUSTOMER',
  callSearch: 'CALL_SEARCH',
  islistDealCar: 'LIST_DEAL_CAR',
  listCustomerAppointment: 'LIST_CUSTOMER_APPOINTMENT',
  customerService: 'CUSTOMER_SERVICE',
  customerBuyNewCar: 'CUSTOMER_BUY_NEW_CAR',

  // TRACK CUSTOMER - Theo dõi khách hàng chưa quay lại
  trackCustomerNotBack: 'TRACK_CUSTOMER_NOT_BACK',
  trackCustomerBuyCarNotBack: 'TRACK_CUSTOMER_BUY_CAR_NOT_BACK',

  // MANAGE VOC - Quản lý VOC
  manageQuestionRequest: 'MANAGE_QUESTION_REQUEST',
  manageDiscontentComplain: 'MANAGE_DISCONTENT_COMPLAIN',
  manageComplainPotential: 'MANAGE_COMPLAIN_POTENTIAL',
  referHandlingComplain: 'REFER_HANDLING_COMPLAIN',
  historyUpdateComplain: 'HISTORY_UPDATE_COMPLAIN',
  listComplainHandleTMV: 'LIST_COMPLAIN_HANDLE_TMV',
  listRequestComlainCRAM: 'LIST_REQUEST_COMPLAIN_CRAM',
  manageFAQ: 'MANAGE_FAQ',
  manageDocumentSupport: 'MANAGE_DOCUMENT_SUPPORT',
  searchDocumentSupport: 'SEARCH_DOCUMENT_SUPPORT',

  // SSI
  ssiSurveyList: 'SSI_SURVEY_LIST',
  ssiSurveyHandle: 'SSI_SURVEY_HANDLE',
  webSsiSurveyList: 'WEB_SSI_SURVEY',
  webSsiSurveyHandle: 'WEB_SSI_SURVEY_HANDLE',
  surveyResultList: 'SURVEY_RESULT_LIST',
  blackList: 'BLACK_LIST',
  ssiDataList: 'SSI_DATA_LIST',
  importDataSurvey: 'IMPORT_DATA_SURVEY',


  // CSI
  csiSurveyHandle: 'CSI_SURVEY_HANDLE',
  csiSurveyList: 'CSI_SURVEY_LIST',
  webCsiSurveyHandle: 'WEB_CSI_SURVEY_HANDLE',
  webCsiSurveyList: 'WEB_CSI_SURVEY_LIST',
  csiSurveyResult: 'CSI_SURVEY_RESULT',
  blackListCsi: 'BLACK_LIST_CSI',
  csiDataList: 'CSI_DATA_LIST',


  // SSI/CSI SURVEY RESULT
  csiSsiSurveyResult: 'CSI_SSI_SURVEY_RESULT',
  ssiCsiSurveyResult: 'SSI_CSI_SURVEY_RESULT',
  webSsiCsiSurveyResult: 'WEB_SSI_CSI_SURVEY_RESULT',
  webCsiSsiSurveyResult: 'WEB_CSI_SSI_SURVEY_RESULT',
  webSsiImportResultSurvey: 'WEB_SSI_IMPORT_RESULT_SURVEY',
  webCsiImportResultSurvey: 'WEB_CSI_IMPORT_RESULT_SURVEY',
  ssiImportResultSurvey: 'SSI_IMPORT_RESULT_SURVEY',
  csiImportResultSurvey: 'CSI_IMPORT_RESULT_SURVEY',


  // SRV-MASTER
  dlrOrderToLexusManagement: 'DEALER_MANAGEMENT_LEXUS',
  listOfDlrOrderToLexus: 'DLR_PUT_ACCESSARY_LEXUS',
  lexusPartsPriceManagement: 'MANAGE_SPARE_PART_LEXUS',

  // FIR CATEGORY - Danh mục FIR
  firContactQuestions: 'FIR_CONTACT_QUESTIONS',
  agencyContactQuestions: 'AGENCY_CONTACT_QUESTIONS',
  listErrorField: 'LIST_ERROR_FIELD',
  listPartError: 'LIST_PARTS_ERRORS',
  isErrorCode: 'ERROR_CODE',
  errorCause: 'ERROR_CAUSE',
  reasonNotContact: 'REASON_NOT_CONTACT',

  // CATEGORY VOC - Danh mục VOC
  categoryRequestField: 'CATEGORY_REQUEST_FIELD',
  categoryRequestProblem: 'CATEGORY_REQUEST_PROBLEM',
  categoryComplainField: 'CATEGORY_COMPLAIN_FIELD',
  categoryComplainProblem: 'CATEGORY_COMPLAIN_PROBLEM',
  categoryPartsDamaged: 'CATEGORY_PARTS_DAMAGED',
  categoryPhenomenaDamaged: 'CATEGORY_PHENOMENA_DAMAGED',
  categoryErrorDSO1: 'CATEGORY_ERROR_DSO_1',
  categoryErrorDSO2: 'CATEGORY_ERROR_DSO_2',
  categoryReasonDSO1: 'CATEGORY_REASON_DSO_1',
  categoryReasonDSO2: 'CATEGORY_REASON_DSO_2',
  categoryCarType: 'CATEGORY_CAR_TYPE',
  categoryCarModel: 'CATEGORY_CAR_MODEL',
  categorySpecifications: 'CATEGORY_SPECIFICATIONS',

  // SERVICE KPI DATA - Cập nhật/điều chỉnh dữ liệu KPI dịch vụ
  updateDvData: 'UPDATE_DV_DATA',
  isSettlementDebtAccessory: 'SETTLEMENT_DEBT_ACCESSORY',
  isLaborWages: 'LABOR_WAGES',
  isInputFormatData: 'INPUT_FORMAT_DATA_AFTER_SALE',
  isInputFormatDataBefore: 'INPUT_FORMAT_DATA_BEFORE_SALE',
  isInputInvoice: 'INPUT_INVOICE',
  isLaborWagesNation: 'LABOR_WAGES_NATION',

  // KAIZEN API
  isUpdateKzServiceData: 'UPDATE_KAIZEN_SERVICE',

  // DLR NEW PART
  isOrderSentLexus: 'ORDER_SENT_LEXUS',
  partsReceiveAutoLexus: 'PARTS_RECEIVE_AUTO_LEXUS',
  partsReceiveManualLexus: 'PARTS_RECEIVE_MANUAL_LEXUS',
  isOrderSpecializedLaxus: 'ORDER_SPECIALIZED_LEXUS',
  lexusPartsReceiveHistory: 'LEXUS_PARTS_RECEIVE_HISTORY',

  // NEW INFOMATION
  isNewPromotion: 'IS_NEW_PROMOTION',
  regisTestDrive: 'REGIS_TEST_DRIVE',

  // ------------------------------SALE--------------------------------------------

  dealerList: 'DEALER_OUTLET',
  dealerGroup: 'DEALER_GROUPS',
  dealerAddressDelivery: 'DLR_ADDRESS_RC_VEH',
  arrivalLeadTime: 'PLAN_DELIVERY_DATE_TIME',
  audioManagement: 'AUDIO_MASTER',
  // insuranceCompanySale: 'INSURANCE_MASTER_SALE',
  invoiceLeadtime: 'INVOICE_LEAD_TIMES',
  bankManagement: 'BANKS',
  provinceListSale: 'PROVINCES_SALE',
  districtListSale: 'DISTRICTS_SALE',
  modelList: 'MODEL_GRADE',
  gradeProduction: 'GRADE_PRODUCTION',
  petrolManagement: 'GASOLINE_ASSIGNMENT_DEALERS',
  yardManagement: 'YARD_MANAGEMENT',
  yardRegion: 'YARD_AREA',
  yardLocation: 'YARD_LOCATION',
  colorList: 'COLORS_MASTER',
  colorAssignment: 'COLOR_ASSIGNMENT',
  meanOfTransportation: 'TRAINSPORT_VEHICLE_MANAGEMENT',
  logisticsCompany: 'LOGISTICS_MASTER',
  tmvDayoff: 'TMV_DAY_OFF_MANAGEMENT',
  dlrDayoff: 'DLR_DAY_OFF_MANAGEMENT',
  cbuVehicleInfo: 'CBU_VEHICLES',
  ckdVehicleInfo: 'CKD_VEHICLES',
  vehicleArrival: 'VEHICLES_ARRIVAL',
  csChangeInformation: 'CS_CHANGE_INFORMATION',
  contractManagement: 'CONTRACT_MANAGEMENT',
  dealersBalance: 'TFS_PAY_BY',
  paymentFollowup: 'TFS_APPROVE',
  changeContactInformation: 'CS_CHANGE_INFORMATION',
  reportSpecialCases: 'P_SPECIAL_CASE_REQUEST_102',
  reportWrongDeliveryDate: 'P_DEFERENT_DELIVERY_DATE_101',
  reportNotHaveDeliveryDate: 'P_NO_DELIVERY_DATE',
  columnList: 'SLE_COLUMN_LIST',
  formColumn: 'SLE_FORM_COLUMN',
  formGroup: 'SLE_GROUP_LIST',
  userColumn: 'SLE_S_USER_COLUMN',
  fleetSaleApplicationTMV: 'FLEET_SALES_BY_TMV',
  fleetCustomer: 'FLEET_CUSTOMER',
  changeDelivery: 'CHANGE_DELIVERY',
  dealerIpConfigSale: 'IP_DEALER_CONFIG_SALE',
  tmssCheckLogs: 'TMSS_CHECK_LOGS',
  checkLogVehicles: 'CHECK_LOG_VEHICLES',
  dlrVehicleInformation: 'STOCK_CAR_AT_DEALER',
  nationwideSellingList: 'NATIONWIDE_SELLING_LIST',
  nationwideBuyingList: 'NATIONWIDE_BUYING_LIST',
  buyingPendingList: 'BUYING_PENDING_LIST',
  searchingVehicle: 'SWAPPING_SEARCH_VEHICLE',
  swappingVehicle: 'SWAPPING_VEHICLE',
  dispatchChangeRequest: 'DISPATCH_CHANGE_REQUEST',
  sellSwapReport: 'TMV_SELL_REPORT',
  advanceReport: 'TMV_ADVANCE_REPORT',
  moneyDefine: 'MONEY_DEFINITION',
  sellBuyMatching: 'SELL_BUY_MATCHING',
  dlrFleetSaleApplication: 'FLEET_SALES_BY_DLR',
  salesGroup: 'SALES_GROUP',
  salesPerson: 'SALES_PERSON',
  ckdOrder: 'CKD_ORDER',
  cbuOrder: 'CBU_ORDER',
  secondCkdOrder: 'SECOND_CKD_ORDER',
  secondCbuOrder: 'SECOND_CBU_ORDER',
  dlrOrderSummary: 'DLR_ORDER_SUMARY',
  // systemUserAndGroupDefinition: 'SYSTEM_USER_AND_GROUP',
  // userGroupAndAuthority: 'USER_GROUP_AUTHORITY',
  // systemFunctionList: 'SYSTEM_FUNCTIONS',
  dealerSalesTarget: 'DEALER_SALES_TARGET',
  dealerSalesPlan: 'DEALER_SALES_PLAN',
  dealerOrder: 'DEALER_ORDER',
  dealerAllocation: 'DEALER_ALLOCATION',
  dealerCbuColorOrder: 'DEALER_CBU_COLOR_ORDER',
  dealerRunDown: 'DEALER_RUNDOWN',
  dealerNenkei: 'DEALER_NENKEI',
  dealerSalesTargetFleet: 'DEALER_SALES_TARGET_FLEET',
  dealerOrderConfig: 'DEALER_ORDER_CONFIG',
  dealerVersionType: 'DEALER_VERSION_TYPE',

};

export const MODULE_MAP = {
  'src/app/application/fir-category/fir-category.module#FirCategoryModule': [
    TMSSTabs.firContactQuestions,
    TMSSTabs.agencyContactQuestions,
    TMSSTabs.listErrorField,
    TMSSTabs.listPartError,
    TMSSTabs.isErrorCode,
    TMSSTabs.errorCause,
    TMSSTabs.reasonNotContact
  ],
  'src/app/application/service-kpi-data/service-kpi-data.module#ServiceKpiDataModule': [
    TMSSTabs.updateDvData,
    TMSSTabs.isSettlementDebtAccessory,
    TMSSTabs.isInputFormatData,
    TMSSTabs.isInputFormatDataBefore,
    TMSSTabs.isInputInvoice
  ],
  'src/app/application/category-voc/category-voc.module#CategoryVocModule': [
    TMSSTabs.categoryRequestField,
    TMSSTabs.categoryRequestProblem,
    TMSSTabs.categoryComplainField,
    TMSSTabs.categoryComplainProblem,
    TMSSTabs.categoryPartsDamaged,
    TMSSTabs.categoryPhenomenaDamaged,
    TMSSTabs.categoryErrorDSO1,
    TMSSTabs.categoryErrorDSO2,
    TMSSTabs.categoryReasonDSO1,
    TMSSTabs.categoryReasonDSO2,
    TMSSTabs.categoryCarType,
    TMSSTabs.categoryCarModel,
    TMSSTabs.categorySpecifications
  ],
  'src/app/application/catalog-declaration/dlr-catalog.module#DlrCatalogModule': [
    TMSSTabs.provinceList,
    TMSSTabs.districtList,
    TMSSTabs.unitCatalog,
    TMSSTabs.staffCatalog,
    TMSSTabs.repairCavity,
    TMSSTabs.parameterOperationAgent,
    TMSSTabs.modelDeclaration,
    TMSSTabs.generalRepair,
    TMSSTabs.supplierManagement,
    TMSSTabs.insuranceCompany,
    TMSSTabs.bankCatalog,
    TMSSTabs.dealerFooter,
    TMSSTabs.deskAdvisor,
    TMSSTabs.dlrFloor,
    TMSSTabs.forecastOrder,
    TMSSTabs.followOrder,
    TMSSTabs.dsManagement,
    TMSSTabs.campaignDlr,
    TMSSTabs.laborRateMaintenance,
    TMSSTabs.applyJobForCarMaster,
    TMSSTabs.applyBPJobForCarMaster,
    TMSSTabs.repairJobMaster,
    TMSSTabs.wshopBpGroup,
  ],
  'src/app/application/kaizen-api/kaizen-api.module#KaizenApiModule': [
    TMSSTabs.isUpdateKzServiceData
  ],
  'src/app/application/cashier/cashier.module#CashierModule': [
    TMSSTabs.cashier,
    TMSSTabs.carNotSettlementToOutGate
  ],
  'src/app/application/parts-management/parts-management.module#PartsManagementModule': [
    TMSSTabs.dlrBoPartsExport,
    TMSSTabs.dlrBoPartsRequest,
    TMSSTabs.dlrBoPartsFollowup,
    TMSSTabs.dlrBoPartsFollowupNvpt,
    TMSSTabs.dlrRoLackOfParts,
    TMSSTabs.dlrPartsOrderForStoring,
    TMSSTabs.dlrPartsRetail,
    TMSSTabs.dlrPartsRetailNewTabOrder,
    TMSSTabs.dlrPartsManualOrder,
    TMSSTabs.newManualTabOrder,
    TMSSTabs.dlrPartsInStockAdjustment,
    TMSSTabs.dlrPartsSpecialOrder,
    TMSSTabs.dlrPartsPrePlanOrder,
    TMSSTabs.dlrPartsInStockStatus,
    TMSSTabs.dlrPartsInfoManagement,
    TMSSTabs.dlrPartsCancelOrderRequest,
    TMSSTabs.dlrPartsReceiveAuto,
    TMSSTabs.dlrPartsReceiveManual,
    TMSSTabs.dlrPartsReceiveNonToyota,
    TMSSTabs.dlrPartsUpcommingInfo,
    TMSSTabs.dlrPartsLookupInfo,
    TMSSTabs.dlrPartsExportLackLookup,
    TMSSTabs.dlrPartsCancelChecking,
    TMSSTabs.dlrDeadStockPartForSale,
    TMSSTabs.dlrDeadStockPartSearching,
    TMSSTabs.dlrSendClaim,
    TMSSTabs.dlrPartsRepairPositionPrepick,
    TMSSTabs.dlrMipCalculate,
    TMSSTabs.dlrOnhandOrderFollowup,
    TMSSTabs.partsCheckPriceCode,
    TMSSTabs.partsReciveHistory,
    TMSSTabs.partShippingHistory,
    TMSSTabs.mipImport,
    TMSSTabs.orderForLexusPart,
    TMSSTabs.partsNonLexusOrderLexus,
    TMSSTabs.setupFormulaMIP,
    TMSSTabs.partSaleDlrToTmv,
    TMSSTabs.lexusReturnToDealer
  ],
  'src/app/application/coo/coo.module#CooModule': [
    TMSSTabs.generalRepairProgress,
    TMSSTabs.infoGeneralRepairProgress,
    TMSSTabs.dongsonProgress,
    TMSSTabs.dongsonProgressByCar,
    TMSSTabs.dongsonProgressByWshop,
    TMSSTabs.vehicleHistory,
    TMSSTabs.carWash,
    TMSSTabs.emp,
    TMSSTabs.managementStatus
  ],
  'src/app/application/srv-master/srv-module#SrvModule': [
    TMSSTabs.dlrOrderToLexusManagement,
    TMSSTabs.listOfDlrOrderToLexus,
    TMSSTabs.lexusPartsPriceManagement
  ],
  'src/app/application/new-infomation/new-infomation.module#NewInfomationModule': [
    TMSSTabs.isNewPromotion,
    TMSSTabs.regisTestDrive
  ],
  'src/app/application/warranty/warranty.module#WarrantyModule': [
    TMSSTabs.campaignManagementTmv,
    TMSSTabs.warrantyInformation,
    TMSSTabs.claimStatusReport,
    TMSSTabs.warrantyTimeSheetDeclare,
    TMSSTabs.warrantyFollowUp,
    TMSSTabs.warrantyAssign,
    TMSSTabs.updateKm,
    TMSSTabs.exchangeRateMaintenance,
    TMSSTabs.t1t2t3WarningList,
    TMSSTabs.subletTypeMaintenance,
    TMSSTabs.warrantyCheckWmi,
    TMSSTabs.vendorMaintenance,
    TMSSTabs.warrantyVehicleRegistration,
    TMSSTabs.soldVehicleMaintenance,
    TMSSTabs.campaignVehComplete,
    TMSSTabs.campaignFollowRemind,
    TMSSTabs.campaignFollowUp
  ],
  'src/app/application/dlr-new-part/dlr-new-part.module#DlrNewPartModule': [
    TMSSTabs.isOrderSentLexus,
    TMSSTabs.partsReceiveAutoLexus,
    TMSSTabs.partsReceiveManualLexus,
    TMSSTabs.isOrderSpecializedLaxus,
    TMSSTabs.lexusPartsReceiveHistory
  ],
  'src/app/application/ssi-survey/ssi.module#SsiModule': [
    TMSSTabs.ssiSurveyList,
    TMSSTabs.ssiSurveyHandle,
    TMSSTabs.webSsiSurveyList,
    TMSSTabs.webSsiSurveyHandle,
    TMSSTabs.surveyResultList,
    TMSSTabs.blackList,
    TMSSTabs.ssiDataList,
    TMSSTabs.importDataSurvey,
    TMSSTabs.csiSurveyResult,
    TMSSTabs.blackListCsi,
    TMSSTabs.csiDataList
  ],
  'src/app/application/csi-survey/csi.module#CsiModule': [
    TMSSTabs.csiSurveyHandle,
    TMSSTabs.csiSurveyList,
    TMSSTabs.webCsiSurveyHandle,
    TMSSTabs.webCsiSurveyList
  ],
  'src/app/application/system-admin/system-admin.module#SystemAdminModule': [
    TMSSTabs.systemUserAndGroupDefinition,
    TMSSTabs.userGroupAndAuthority,
    TMSSTabs.userManagement,
    TMSSTabs.systemFunctionList,
    TMSSTabs.declareIp
  ],
  'src/app/application/manage-voc/manage-voc.module#ManageVocModule': [
    TMSSTabs.manageQuestionRequest,
    TMSSTabs.manageDiscontentComplain,
    TMSSTabs.manageComplainPotential,
    TMSSTabs.referHandlingComplain,
    TMSSTabs.historyUpdateComplain,
    TMSSTabs.listComplainHandleTMV,
    TMSSTabs.listRequestComlainCRAM,
    TMSSTabs.manageFAQ,
    TMSSTabs.manageDocumentSupport,
    TMSSTabs.searchDocumentSupport
  ],
  'src/app/application/fir/fir.module#FirModule': [
    TMSSTabs.firModifyAfterProcess,
    TMSSTabs.contactAfterRepair
  ],
  'src/app/application/maintenance-operation/maintenance-operation.module#MaintenanceOperationModule': [
    TMSSTabs.maintenanceCalling,
    TMSSTabs.maintenanceCallingNotContact,
    TMSSTabs.maintenanceMessage,
    TMSSTabs.maintenanceLetter
  ],
  'src/app/application/track-customer/track-customer.module#TrackCustomerModule': [
    TMSSTabs.trackCustomerNotBack,
    TMSSTabs.trackCustomerBuyCarNotBack
  ],
  'src/app/application/works-1k/works-1k.module#Works1kModule': [
    TMSSTabs.contactAfterDays15,
    TMSSTabs.contactAfterDays55,
    TMSSTabs.contactMaintenanceRemind
  ],
  'src/app/application/search-extract-data/search-extract-data.module#SearchExtractDataModule': [
    TMSSTabs.searchCustomer,
    TMSSTabs.callSearch,
    TMSSTabs.listCustomerAppointment,
    TMSSTabs.customerService,
    TMSSTabs.customerBuyNewCar

  ],
  'src/app/application/advisor/dlr-advisor.module#DlrAdvisorModule': [
    TMSSTabs.booking,
    TMSSTabs.customerInfo,
    TMSSTabs.standardizeCustomerInfo,
    TMSSTabs.changeCustomerInfo,
    TMSSTabs.unfWorkDlrAdv,
    TMSSTabs.repairProfile,
    TMSSTabs.quotationAccount,
    TMSSTabs.storageQuotation,
    TMSSTabs.storageJobPackage,
    TMSSTabs.proposal,
    TMSSTabs.viewProposal,
    TMSSTabs.moveRoSettlementToRepair,
    TMSSTabs.dlrBoPartsFollowupCvdv
  ],


  // ---------SALE-----------------
  'src/app/application/daily-sale/daily-sale.module#DailySaleModule': [
    TMSSTabs.cbuVehicleInfo,
    TMSSTabs.ckdVehicleInfo,
    TMSSTabs.changeDelivery,
    TMSSTabs.contractManagement,
    TMSSTabs.csChangeInformation,
    TMSSTabs.vehicleArrival
  ],
  'src/app/application/admin/admin.module#AdminModule': [
    TMSSTabs.columnList,
    TMSSTabs.formColumn,
    TMSSTabs.formGroup,
    TMSSTabs.userColumn,
    TMSSTabs.dealerIpConfig,
    TMSSTabs.tmssCheckLogs,
    TMSSTabs.checkLogVehicles
  ],
  'src/app/application/dealer-order/dealer-order.module#DealerOrderModule': [
    TMSSTabs.cbuOrder,
    TMSSTabs.ckdOrder,
    // TMSSTabs.dlrOrderSummary,
    TMSSTabs.secondCbuOrder,
    TMSSTabs.secondCkdOrder
  ],
  'src/app/application/dlr-order/dlr-order.module#DlrOrderModule': [
    TMSSTabs.dealerSalesTarget,
    TMSSTabs.dealerSalesPlan,
    TMSSTabs.dealerOrder,
    TMSSTabs.dealerAllocation,
    TMSSTabs.dealerCbuColorOrder,
    TMSSTabs.dealerRunDown,
    TMSSTabs.dealerNenkei,
    TMSSTabs.dealerOrderConfig,
    TMSSTabs.dealerVersionType,
    TMSSTabs.dealerSalesTargetFleet
  ],
  'src/app/application/dlr/dlr-master-data/dlr-master-data.module#DlrMasterDataModule': [
    TMSSTabs.salesGroup,
    TMSSTabs.salesPerson
  ],
  'src/app/application/fleet-sale/fleet-sale.module#FleetSaleModule': [
    TMSSTabs.fleetCustomer,
    TMSSTabs.dlrFleetSaleApplication,
    TMSSTabs.fleetSaleApplicationTMV,
    TMSSTabs.salesPerson
  ],
  'src/app/application/master-data/master-data.module#MasterDataModule': [
    TMSSTabs.arrivalLeadTime,
    TMSSTabs.audioManagement,
    TMSSTabs.bankManagement,
    TMSSTabs.colorAssignment,
    TMSSTabs.colorList,
    TMSSTabs.dealerAddressDelivery,
    TMSSTabs.dealerGroup,
    TMSSTabs.districtList,
    TMSSTabs.gradeProduction,
    TMSSTabs.insuranceCompany,
    TMSSTabs.invoiceLeadtime,
    TMSSTabs.logisticsCompany,
    TMSSTabs.meanOfTransportation,
    TMSSTabs.modelList,
    TMSSTabs.moneyDefine,
    TMSSTabs.provinceList,
    TMSSTabs.tmvDayoff,
    TMSSTabs.dlrDayoff,
    TMSSTabs.yardRegion,
    TMSSTabs.yardManagement,
    TMSSTabs.yardLocation,
    TMSSTabs.dealerList,
    TMSSTabs.petrolManagement
  ],
  'src/app/application/swapping/swapping.module#SwappingModule': [
    TMSSTabs.advanceReport,
    TMSSTabs.dispatchChangeRequest,
    TMSSTabs.nationwideSellingList,
    TMSSTabs.nationwideBuyingList,
    TMSSTabs.dlrVehicleInformation,
    TMSSTabs.searchingVehicle,
    TMSSTabs.sellBuyMatching,
    TMSSTabs.sellSwapReport,
    TMSSTabs.swappingVehicle,
    TMSSTabs.dlrVehicleInformation
  ],
  'src/app/application/tfs/tfs.module#TfsModule': [
    TMSSTabs.dealersBalance,
    TMSSTabs.paymentFollowup
  ]
};
