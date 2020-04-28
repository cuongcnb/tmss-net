export enum ProgressState {
  plan = 5,
  actual = 1,
  stopInside = 2,
  stopOutside = 3,
  complete = 4,
  wait = 5,
  autoSuggest = 6,
  autoAppointment = 7,
  manualSuggest = 8,
  manualAppointment = 9,
  performed = 0,
}

export enum RoType {
  DS = 1,
  SCC = 2,
  RX = 3
}

export enum ProgressViewType {
  hour = 0,
  minute = 1
}

export const NameProgressByState = {
  0: 'Đã thực hiện',
  1: 'Đang thực hiện',
  2: 'Dừng trong khoang',
  3: 'Dừng ngoài khoang',
  4: 'Hoàn thành',
  5: 'Xe chờ',
  6: 'Auto báo giá',
  7: 'Manual báo giá',
  8: 'Auto phiếu hẹn',
  9: 'Manual phiếu hẹn'
};

export const CarStatus = [{
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
},  {key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}, {
  key: 9,
  value: 'Chờ quyết toán'
}, {
  key: 10,
  value: 'Thanh toán & giao xe'
}, {
  key: 11,
  value: 'Chờ ra cổng'
}, {
  key: 0,
  value: 'Chờ tiếp nhận'
}, {
  key: 1,
  value: 'Tiếp nhận'
}, {
  key: 2,
  value: 'Báo giá chờ bảo hiểm'
}, {
  key: 3,
  value: 'Kiểm tra'
}, {
  key: 4,
  value: 'Chờ SC'
}, {
  key: 5,
  value: 'Đang SC'
}, {
  key: 6,
  value: 'Dừng chờ SC'
}, {
  key: 7,
  value: 'Chờ rửa xe'
}, {
  key: 8,
  value: 'Rửa xe'
}];


export enum StateCount {
  stopping = "DD",
  performing = "DTH",
  appointment = "XH",
  lateCar = "XT"
}

export enum RxStateCount {
  plan = "XKH",
  performing = "DTH",
  lateWaitingCar = "XCT",
  lateCar = "THT",
  latePlanCar = "KHT",
  lateFinishCar = "KTM"
}
