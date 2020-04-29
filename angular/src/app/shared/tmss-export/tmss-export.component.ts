import {Component, EventEmitter, Input, Output, OnChanges} from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'tmss-export',
  templateUrl: './tmss-export.component.html',
  styleUrls: ['./tmss-export.component.scss']
})
export class TmssExportComponent implements OnChanges {
  @Input() fieldGrid;
  @Output() getExportParams = new EventEmitter();
  @Input() excelStyles: Array<any>;
  blackBorder = {
    borderBottom: {
      color: '#000000',
      lineStyle: 'Continuous',
      weight: 1
    },
    borderLeft: {
      color: '#000000',
      lineStyle: 'Continuous',
      weight: 1
    },
    borderRight: {
      color: '#000000',
      lineStyle: 'Continuous',
      weight: 1
    },
    borderTop: {
      color: '#000000',
      lineStyle: 'Continuous',
      weight: 1
    }
  };
  customExcelStyle = [
    {
      id: 'header',
      interior: {
        color: '#b5e6b5',
        pattern: 'Solid'
      },
      font: {
        size: 12,
        fontName: 'Times New Roman'
      },
      borders: this.blackBorder
    },
    {
      id: 'cellBorder',
      borders: this.blackBorder
    },
    {
      id: 'excelStringType',
      dataType: 'string'
    }
  ];

  constructor() {
    if (this.excelStyles && this.excelStyles.length) {
      this.customExcelStyle = [...this.customExcelStyle, ...this.excelStyles];
    }
  }

  ngOnChanges(): void {
    if (this.excelStyles && this.excelStyles.length) {
      this.customExcelStyle = [...this.customExcelStyle, ...this.excelStyles];
    }
  }

  callbackGrid(params) {
    this.getExportParams.emit(params);
  }

}
