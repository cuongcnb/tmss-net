export const RoState = [
  {id: null, name: 'Chưa có báo giá'},
  {id: '0', name: 'Báo giá tạm'},
  {id: '1', name: 'Báo giá'},
  {id: '1.5', name: 'LXPT'},
  {id: '2', name: 'LSC'},
  {id: '2.5', name: 'Hoàn thành SC'},
  {id: '3', name: 'Đang sửa chữa'},
  {id: '4', name: 'Ngừng sữa chữa'},
  {id: '5', name: 'Hoàn thành'},
  {id: '6', name: 'Quyết toán'},
  {id: '7', name: 'Hủy BG'},
  {id: '11', name: 'Đang KT chất lượng'},
  {id: '12', name: 'Đang rửa xe'},
  {id: '9', name: 'Xe ra cổng'},
];

export const RoStateOfProposal = [
  {id: '0', name: 'Báo giá tạm'},
  {id: '1', name: 'Báo giá'},
  {id: '1.5', name: 'LXPT'},
  {id: '2', name: 'LSC'},
  {id: '2.5', name: 'Hoàn thành SC'},
  {id: '3', name: 'Đang sửa chữa'},
  {id: '4', name: 'Ngừng sửa chữa'},
  {id: '5', name: 'Hoàn thành'},
  {id: '6', name: 'Đóng RO'},
  {id: '7', name: 'Hủy'},
  {id: '11', name: 'Đang QC'},
  {id: '12', name: 'Đang rửa xe'},
  {id: '9', name: 'Xe ra cổng'},
];

export const RoStateForUnfWork = [
  {id: '0', name: 'Báo giá tạm'},
  {id: '1', name: 'Báo giá'},
  {id: '1.5', name: 'LXPT'},
  {id: '2', name: 'LSC'},
  {id: '2.5', name: 'Hoàn thành SC'},
  {id: '3', name: 'Đang sửa chữa'},
  {id: '4', name: 'Ngừng sửa chữa'},
  {id: '5', name: 'Hoàn thành'},
  {id: '6', name: 'Quyết Toán'},
  {id: '7', name: 'Hủy báo giá'},
  {id: '11', name: 'Đang QC'},
  {id: '12', name: 'Đang rửa xe'},
  {id: '9', name: 'Xe ra cổng'}
];

export const state = {
  quotationTmp: '0',
  quotation: '1',
  lxpt: '1.5',
  lsc: '2',
  completeSc: '2.5',
  working: '3',
  stopWork: '4',
  complete: '5',
  settlement: '6',
  cancel: '7',
  qc: '11',
  washing: '12',
  gateInOut: '9'
};
