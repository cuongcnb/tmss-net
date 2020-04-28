import { BaseModel } from '../base.model';

export interface SoldVehicleModel extends BaseModel {
  vin?;
  model?;
  sfx?;
  color?;
  engine?;
  vheNameCode?;
  lineOffDate?;
  dealerCode?;
  orderNo?;
  salesDate?;
  pdsDate?;
  deliveryDate?;
  odometer?;
  kmFlag?;
  registNo?;
  memo?;
}
