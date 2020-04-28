import { BaseModel } from '../base.model';

export interface RoLackOfPartsModel extends BaseModel {
  stt?: number;
  ro: string;
  plate: string;
  orderNo: string;
  partsCode: string;
  partsName: string;
  orderQty: number;
  qty: number;
  ngayNhanHang: number;
  prepickLocationNo: string;
  dlrId?;
  donGia?;
  donViTinh?;
  orderId?;
  partsId?;
  phanTramThue?;
  pwId?;
  reqId?;
  reqtype?;
  seqdisplay?;
  slChuaXuat?;
  slDaXuat?;
}
