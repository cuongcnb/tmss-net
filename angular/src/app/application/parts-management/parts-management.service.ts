import { Injectable } from '@angular/core';
import { ToastService } from '../../shared/swal-alert/toast.service';
import { DealerModel } from '../../core/models/sales/dealer.model';
import { GridTableService } from '../../shared/common-service/grid-table.service';

@Injectable()
export class PartsManagementService {

  constructor(
    private toastService: ToastService,
    private gridTableService: GridTableService,
  ) {
  }

  validateLexusPart(checkingDetail: CheckingLexusPartModel) {
    const dataArr = checkingDetail.dataArr;
    const dlrLexusOfCurrentDlr = checkingDetail.dlrLexusOfCurrentDlr;
    const fieldToCheck = checkingDetail.fieldToCheck ? checkingDetail.fieldToCheck : 'frCd';
    const valueToCheck = checkingDetail.valueToCheck ? checkingDetail.valueToCheck : 'X';
    const fieldToFocus = checkingDetail.fieldToFocus;
    const gridParams = checkingDetail.gridParams;
    const fieldToCheckQty = checkingDetail.fieldToCheckQty;

    if (dlrLexusOfCurrentDlr) {
      // If dlrLexusOfCurrentDlr => Dealers can't order lexus parts by themselves,
      // must order lexus part to Lexus Dealer
      for (let i = 0; i < dataArr.length; i++) {
        if (fieldToCheckQty) {
          // frCd = X and qty > 0
          if (dataArr[i][fieldToCheck] === valueToCheck && +dataArr[i][fieldToCheckQty]) {
            this.toastService.openWarningToast(`Có phụ tùng Lexus, kiểm tra lại dòng số ${i + 1}`);
            if (gridParams && fieldToFocus) {
              this.gridTableService.setFocusCell(gridParams, fieldToFocus, null, i);
            }
            return false;
          }
        } else {
          if (dataArr[i][fieldToCheck] === valueToCheck) {
            this.toastService.openWarningToast(`Có phụ tùng Lexus, kiểm tra lại dòng số ${i + 1}`);
            if (gridParams && fieldToFocus) {
              this.gridTableService.setFocusCell(gridParams, fieldToFocus, null, i);
            }
            return false;
          }
        }
      }
    }
    return true;
  }
}

export interface CheckingLexusPartModel {
  dataArr: any; // Data list to check
  dlrLexusOfCurrentDlr: DealerModel; // Logged in dealer must order Lexus parts to this Lexus dealer
  fieldToCheck?: string; // take value of this field as reference. Use "frCd" as default
  valueToCheck?: string; // value of "fieldToCheck". User 'X" as default
  gridParams?: object; // grid params of current gridtable
  fieldToFocus?: string; // if condition is met, focus on this field.
  fieldToCheckQty?: string; // check based on qty of each data?
}
