import { BaseModel } from '../base.model';

/**
 * RO list - "Danh sach don hang" grid
 */
export interface PartsExportRoModel extends BaseModel {
  stt?: number;
  plate: string;
  ro: string;
  createDate: number;
  customerId: number;
  createby: number;
  cusvsId: number;
  dlrId: number;
  empId: number;
  id: number;
  itemNo: number;
  ngayRo: number;
  reqId: number;
  reqdesc: string;
  reqtype: number;
  status: number;
  advisor: string;
  vehId: number;
}

/**
 * Model for customerInfo, api part-export/ro/customer-search.
 * "Thong tin ro" form
 */
export interface PartsExportCustomerInfo extends BaseModel {
  plate: string;
  customerName: string;
  model: string;
  taxNo: string;
  advisor: string;
  address: string;

  ro?: string;
  createDate?: number;
  diDong?: string;
  dienThoai?: string;
  dlrCode?: string;
  dlrId?: number;
  dlrName?: string;
  ngayDatHen?: number;
  ngayRo?: number;
  reqId?: number;
  reqdesc?;
  reqtype?: number;
  status?;
  trangThai?;
}

/**
 * Parts of RO - api /part-export/ro/part-search
 * "Xuat phu tung" grid
 */
export interface PartsExportPartsOfRoAndShip extends BaseModel {
  parts: Array<PartsExportPartOfRo>;
  // Kiểm tra xem đơn hàng đã được xuất lần nào chưa
  ship: boolean;
}

export interface PartsExportPartOfRo extends BaseModel {
  partsCode: string;
  partsName: string;
  unit: string;
  slTon: number; // sl ton kho
  slConDatBo: number; // sl d.dat
  slCan: number; // sl can
  slXuat;
  slDaXuat: number; // sl da xuat
  slCon: number; // sl no
  price: number;
  sumPrice: number;
  rate: number;
  locationNo: number;
  status: number;
  prepickLocationNo: string; // vi  tri prepick
  prepicks: any;

  statusName: string;
  partsId: number;
  createDate: number; // Xuat vao luc
  boStatus: string;
  color: any;
  createby: number;
  dlrId: number;
  donViTinhMua: string;
  genuine: string;
  giaMua: number;
  id: number;
  itemNo: number;
  mip: string;
  partstypeCode: string;
  partstypeName: string;
  reqId: string;
  reqtype: string;
  searchId: number;
  seqdisplay: string;
  slBoChuaXuat: number;
  slBoDaVe: number;
  slBoDaXuat: number;
  slDat: number;
  slDatBo: number;
  slThucXuat: number;
  tongSlConDatBo: number;
  tongSlDatBo: number;
  unitName: string;
}

// /**
//  Parts of RO - api /part-export/ro/part-prepick-search
//  "Xuat phu tung" grid
// **/
// export interface PartsExport_PartDetailData extends BaseModel {
//   partShippings: Array<PartsExportPartDetailShipping>,
//   prepicks: Array<PartsExportPartDetailPrepick>
// }

/**
 * Parts of RO - api /part-export/ro/part-shipping-history
 * "Chi tiet xuat phu tung" grid
 */
export interface PartsExportPartDetailShipping {
  stt?: number;
  createDate: number;
  locationno;
  qty: number;
  shippingStatusName: string;

  attribute1;
  attribute2;
  color: { shippingStatusName: string };
  createdBy: number;
  deleteflag: number;
  dlrId: number;
  gship: number;
  id: number;
  modifiedBy: number;
  modifyDate: number;
  partsId: number;
  prepickStatus: number;
  rate: number;
  reqId: number;
  reqtype: string;
  sellprice: number;
  sellunit: string;
  seqdisplay: number;
  shippingstatus: number;
}

/**
 * Parts of RO - api /part-export/ro//part-prepick-search
 * "Danh Sach Prepick" grid
 */
export interface PartsExportPartDetailPrepick {
  dlrId: number;
  locationno: string;
  newQty: number;
  partsCode: string;
  partsId: number;
  qty: number;
  reqId: number;
  reqtype: string;
}
