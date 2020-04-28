export const ServicesReportDetail = {
  outputReport: {
    title: 'Báo cáo xuất hàng',
    params: ['isDisableDealer', 'isHaveAccessoryType']
  },
  accessorySellingReport: {
    title: 'Báo cáo lịch sử bán hàng 1 phụ tùng',
    params: ['isDisableDealer', 'isHaveAccessoryCodeWithRequired']
  },
  retailSalesReport: {
    title: 'Báo cáo xuất bán lẻ',
    params: ['isHaveAccessoryType', 'isHaveFormatHTML', 'isHaveGroupBy']
  },
  receiveReport: {
    title: 'Báo cáo nhận hàng',
    params: ['isHaveAccessoryType', 'isHaveFormatHTML', 'isHaveGroupBy']
  },
  accessoryImportExportReport: {
    title: 'Báo cáo xuất nhập phụ tùng',
    params: ['isHaveAccessoryType', 'isHaveFormatHTML']
  },
  tmvOutstandingReport: {
    title: 'Báo cáo hàng TMV còn nợ',
    params: ['isHaveAccessoryCode', 'isHaveOrderNo', 'isHaveFormatHTML']
  },
  roUnfinishedReport: {
    title: 'Danh sách RO chưa hoàn thành',
    params: ['isHaveRepair']
  },
  rateOfSupplyAccessoryByRo: {
    title: 'Tỉ lệ cung cấp phụ tùng theo RO',
    params: ['isHaveMonth']
  },
  rateOfSupplyAccessoryByAccessoryCode: {
    title: 'Tỉ lệ cung cấp phụ tùng theo mã phụ tùng',
    params: ['isHaveMonth']
  },
  accessoryImportExportHistoryReport: {
    title: 'Báo cáo lịch sử xuất nhập phụ tùng',
    params: ['isDisableDealer', 'isHaveFormatFile']
  },
  dealerBookingToTmvReport: {
    title: 'Báo cáo đặt hàng của đại lý lên TMV',
    params: ['isDisableDealer', 'isHaveFormatFile']
  },
  accessoryAmountAdjustReport: {
    title: 'Báo cáo điều chỉnh số lượng phụ tùng',
    params: ['isHaveFormatHTML', 'isHaveFormatFile']
  },
  carOutPortReport: {
    title: 'Báo cáo xe ra cổng',
    params: []
  },
  warrantyDailyClaimReport: {
    title: 'Báo cáo yêu cầu bảo hành hàng ngày',
    params: []
  },
  userListFunctionReport: {
    title: 'Danh sách chức năng user',
    params: []
  },
  accessoryRateReport: {
    title: 'Báo cáo tỷ lệ cung cấp phụ tùng theo RO',
    params: []
  },
  roGeneralReportByDay: {
    title: 'Báo cáo tổng hợp RO theo ngày',
    params: ['isHaveRoInDay', 'isHaveRoProposalInDay']
  },
  accessoryRetailGeneralReport: {
    title: 'Báo cáo tổng hợp bán lẻ phụ tùng',
    params: ['isHaveFormatFile', 'isHaveProposal']
  },
  contactAfterRepairGeneralReport: {
    title: 'Báo cáo tổng hợp liên hệ sau sữa chữa',
    params: []
  },
  boStorageTime: {
    title: 'Thời gian lưu kho hàng BO',
    params: ['isDisableDealer', 'isHaveFormatFile'],
  },
  roListWithNotEnoughAccessory: {
    title: 'Danh sách RO có phụ tùng về chưa đủ',
    params: ['isHaveFormatFile'],
  },
  roListWithEnoughAccessory: {
    title: 'Danh sách RO có phụ tùng về đủ',
    params: ['isHaveFormatFile'],
  },
  checkQualityReportByDealer: {
    title: 'Báo cáo phân cấp kiểm tra chất lượng theo đại lý',
    params: ['isDisableDealer'],
  },
  bookReportByDay: {
    title: 'Báo cáo tổng hợp đặt hẹn theo ngày',
    displayTab: ['date', 'rangeDate']
  },
  serviceRateAndRoFillReportByYear: {
    title: 'Báo cáo Service rate và R/O Fill rate theo ngày/năm',
    displayTab: ['month', 'year']
  },
  accessoryInventoryCheckReport: {
    title: 'Báo cáo kiểm kê phụ tùng tồn kho',
    params: ['isDisableDealer', 'isHaveAccessoryType'],
  },
  stockInventoryReportByPrice: {
    title: 'Báo cáo kiểm kê tồn kho theo giá đích danh',
    params: ['isDisableDealer'],
  },
};

export interface CheckDisplay {
  isDisableDealer: boolean;
  isHaveAccessoryCodeWithRequired?: boolean;
  isHaveAccessoryCode?: boolean;
  isHaveAccessoryType?: boolean;
  isHaveFormatHTML?: boolean;
  isHaveFormatFile?: boolean;
  isHaveOrderNo?: boolean;
  isHaveGroupBy?: boolean;
  isHaveMonth?: boolean;
  isHaveRepair?: boolean;
  isHaveProposal?: boolean;
  isHaveRoInDay?: boolean;
  isHaveRoProposalInDay?: boolean;
}
