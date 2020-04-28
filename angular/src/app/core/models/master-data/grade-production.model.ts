export interface GradeProductionModel {
  id?;
  marketingCode: string;
  productionCode: string;
  enName?: string;
  shortModel: string;
  fullModel: string;
  frameLength: number;
  status?: string;
  wmi?: string;
  vds?: string;
  cbuCkdLexus?: string;
  fuel?: string;
  audioInstallation?: string;
  isFirmColor?: string;
  ordering;
  fromDate?;
  toDate?;
}
