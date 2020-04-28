export enum ImportType {
  customerInfo,
  deliveryRouteDLR,
  fixPaymentDeadline
}

export const ImportTemplate = {
  cbuCustomerInfo: 'cbuCustomerInfo',
  cbuDeliveryRouteDlr: 'cbuDeliveryRouteDlr',
  fixPaymentDeadline: 'fixPaymentDeadline',
  // dlrColorOrder: 'dlrColorOrder',
  // dlrOrder: 'dlrOrder',
  // dlrSalesPlan: 'dlrSalesPlan',
  tmvAllocation: 'tmvAllocation',
  tmvSalesTarget: 'tmvSalesTarget',
  tmvNenkei: 'tmvNenkei'
};
