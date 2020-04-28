import {Injectable} from '@angular/core';
import {DataFormatService} from './data-format.service';
import {FormStoringService} from './form-storing.service';

@Injectable({
  providedIn: 'root'
})
export class GridTableService {
  public NUMBER_REG = /^\d+(\.\d{0,2})?$/g;
  public FLOAT_NUMBER_REG = /^(?=.*[1-9])\d*(?:\.\d{1,2})?$/g;

  constructor(
    private dataFormatService: DataFormatService,
    private formStoringService: FormStoringService
  ) {
  }

  autoSizeColumn(params, autoSizeColumn?) {
    const allColumnIds = [];
    params.columnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.colId);
    });
    setTimeout(() => {
      (autoSizeColumn) ? params.columnApi.autoSizeColumns(allColumnIds) : params.api.sizeColumnsToFit(allColumnIds);
    }, 50);
  }

  selectFirstRow(params) {
    params.api.forEachNode(node => {
      if (node.childIndex === 0) {
        node.setSelected(true);
      }
    });
  }

  selectFirstRowAbsolute(params) {
    params.api.forEachNode(node => {
      if (node.childIndex === 0) {
        node.setSelected(true, true);
      }
    });
  }

  expandAllRows(params) {
    params.api.forEachNode(node => {
      node.setExpanded(true);
    });
  }

  getAllData(params) {
    const dataArr = [];
    params.api.forEachNode(node => {
      dataArr.push(node.data);
    });
    return dataArr;
  }

  getAllDataAfterFilterAndSort(params) {
    const dataArr = [];
    params.api.forEachNodeAfterFilterAndSort(node => {
      dataArr.push(node.data);
    });
    return dataArr;
  }

  // EXPORT
  generateExportFileName(startingName: string, storageKey: string) {
    const year = (new Date().getFullYear()).toString().slice(2, 4);
    const month = new Date().getMonth() + 1;
    const date = new Date().getDate();
    return `${startingName}${year}${month < 10 ? `0${month}` : month}${date < 10 ? `0${date}` : date}${this.storeAndGetExportTime(storageKey)}`;
  }

  storeAndGetExportTime(storageKey) {
    const storage = this.formStoringService.get(storageKey);
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const date = new Date().getDate();
    if (storage) {
      if (storage.setTime < new Date(year, month, date, 0, 0, 0)) {
        this.formStoringService.clear(storageKey);
        this.formStoringService.set(storageKey, {value: 1, setTime: new Date().getTime()});
        return '001';
      }
      this.formStoringService.clear(storageKey);
      this.formStoringService.set(storageKey, {value: storage.value + 1, setTime: new Date().getTime()});
      return storage.value + 1 < 10 ? `00${storage.value + 1}`
        : storage.value + 1 < 100 ? `0${storage.value + 1}` : storage.value + 1;
    } else {
      this.formStoringService.set(storageKey, {value: 1, setTime: new Date().getTime()});
      return '001';
    }
  }

  export(gridParams, fileName?: string, sheetName?: string, csvExport?: boolean) {
    const paramsExport = {
      fileName,
      sheetName: !sheetName ? fileName : sheetName,
      columnGroups: true,
      allColumns: true,
      processCellCallback: (params) => { // Add this class to each fields in fieldGridExport to format data
        if (params.column.colDef.cellClass.includes('csvStringStartWithZero')) {
          return `'${params.value}`;
        }
        if (params.column.colDef.cellClass.includes('excelDateType')) {
          return this.dataFormatService.parseTimestampToDateString(params.value);
        }
        if (params.column.colDef.cellClass.includes('excelDateTimeType')) {
          return this.dataFormatService.parseTimestampToFullDate(params.value);
        }
        if (params.column.colDef.cellClass.includes('excelBooleanType')) {
          return params.value === 'Y' ? 'Có' : 'Không';
        }
        if (params.column.colDef.cellClass.includes('excelMoneyType')) {
          return this.dataFormatService.moneyFormat(params.value);
        }
        if (params.column.colDef.cellClass.includes('excelCustomerType')) {
          if (params.node.data.isAppointment === 'Y') {
            return 'Hẹn';
          }
          if (params.node.data.isWarranty === 'Y') {
            return 'Bảo hành';
          }
          if (params.node.data.isReRepair === 'Y') {
            return 'Sửa chữa lại';
          }
          if (params.node.data.is1K === 'Y') {
            return '1K';
          }
          return 'KHDV';
        }
        if (params.column.colDef.cellClass.includes('excelJobType')) {
          let result = '';
          if (params.node.data.isMa === 'Y') {
            result += 'BD';
          }
          if (params.node.data.isGj === 'Y') {
            result += result.length ? ' + GJ' : 'GJ';
          }
          if (params.node.data.isBp === 'Y') {
            result += result.length ? ' + BP' : 'BP';
          }
          return result;
        }
        return params.value;
      }
    };
    csvExport ? gridParams.api.exportDataAsCsv(paramsExport) : gridParams.api.exportDataAsExcel(paramsExport);
  }

  exportSelected(gridParams, fileName?: string, sheetName?: string, csvExport?: boolean) {
    const paramsExport = {
      fileName,
      sheetName: !sheetName ? fileName : sheetName,
      onlySelected: true
    };
    csvExport ? gridParams.api.exportDataAsCsv(paramsExport) : gridParams.api.exportDataAsExcel(paramsExport);
  }

  // AUTO SELECT ROW
  autoSelectRow(params, dataArr, dataToFocus, comparingFields?) {
    if (params && dataArr.length) {
      if (dataToFocus) {
        let index = 0;
        let partIndex = 0;
        while (partIndex < dataArr.length) {
          if (comparingFields ? dataArr[partIndex][comparingFields] === dataToFocus[comparingFields]
            : dataArr[partIndex].id === dataToFocus.id) {
            index = partIndex;
            break;
          }
          partIndex++;
        }
        index ? params.api.getModel().rowsToDisplay[index].setSelected(true) : this.selectFirstRow(params);
      } else {
        this.selectFirstRow(params);
      }
    }
  }

  get firstDayOfMonth() {
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    return new Date(year, month, 1);
  }

  addSttToData(dataArr, paginationParams?) {
    const startNum = paginationParams ? (paginationParams.page - 1) * paginationParams.size : 0;
    const returnList = [];
    if (dataArr) {
      for (let i = 0; i < dataArr.length; i++) {
        dataArr[i] = Object.assign({}, dataArr[i], {stt: startNum + i + 1});
        returnList.push(dataArr[i]);
      }
    }
    return returnList;
  }

  addCheckedToData(dataList, checkedData, id) {
    for (let i = 0, length = dataList.length; i < length; i++) {
      const index = dataList[i][id];
      if (checkedData[index]) {
        Object.assign(checkedData[index], dataList[i]);
        Object.assign(dataList[i], checkedData[index]);
      }
    }
  }

  changeCheckedIndex(checkedData, id) {
    if (checkedData[id]) {
      delete checkedData[id];
    }
  }

  calculateFooterDetail(displayedData) {
    const footerDetail = {totalPriceBeforeTax: undefined, taxOnly: undefined, totalPriceIncludeTax: undefined};
    let beforeTax = 0;
    let tax = 0;
    let taxIncluded = 0;
    displayedData.forEach(data => {
      beforeTax += data.sumPrice;
      tax += data.sumPrice * (data.rate / 100);
      taxIncluded += data.sumPrice + data.sumPrice * (data.rate / 100);
    });
    footerDetail.totalPriceBeforeTax = this.dataFormatService.moneyFormat(beforeTax);
    footerDetail.taxOnly = this.dataFormatService.moneyFormat(tax);
    footerDetail.totalPriceIncludeTax = this.dataFormatService.moneyFormat(taxIncluded);
    return footerDetail;
  }

  setFocusCell(params, colName, displayedData?, rowIndex?, editing?) {
    const rowToFocus = rowIndex || rowIndex === 0 ? rowIndex : displayedData ? displayedData.length - 1 : 0;
    params.api.forEachNode(node => {
      if (node.childIndex === rowToFocus) {
        node.setSelected(true);
        params.api.setFocusedCell(node.childIndex, colName);
        if (editing == null || editing) {
          params.api.startEditingCell({
            rowIndex: rowToFocus,
            colKey: colName
          });
        }
        return;
      }
    });
  }

  setFocusCellDontEdit(params, colName, rowIndex?) {
    const rowToFocus = rowIndex ? rowIndex : 0;
    params.api.forEachNode(node => {
      if (node.childIndex === rowToFocus) {
        params.api.setFocusedCell(node.childIndex, colName);
        return;
      }
    });
  }

  startEditCell(params, field?) {
    // params: Row params
    setTimeout(() => {
      params.api.setFocusedCell(params.rowIndex, params.colDef.field);
      params.api.startEditingCell({
        rowIndex: params.rowIndex,
        colKey: field ? field : params.colDef.field
      });
    }, 300);
  }

  removeSelectedRow(params, selectedPart) {
    params.api.updateRowData({remove: [selectedPart]});
    if (selectedPart.stt) {
      params.api.forEachNode(node => {
        node.data.stt = node.rowIndex + 1;
      });
    }
    params.api.refreshCells();
  }

  setDataToRow(params, rowIndex, val, displayedData, nextCellToFocus) {
    params.api.forEachNode(node => {
      if (node.rowIndex === rowIndex) {
        node.data = val;
        params.api.refreshCells();
        this.setFocusCell(params, nextCellToFocus, displayedData, rowIndex);
      }
    });
  }

  setDataToEachColumn(params, rowIndex, val, displayedData, nextCellToFocus) {
    params.api.forEachNode(node => {
      if (node.rowIndex === rowIndex) {
        for (const key in val) {
          if (val) {
            node.data[key] = val[key];
          }
        }
        params.api.refreshCells();
        this.setFocusCell(params, nextCellToFocus, displayedData, rowIndex);
      }
    });
  }
}
