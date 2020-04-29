import { Component, ElementRef, forwardRef, HostListener, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isFunction } from 'util';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'multi-column-select-control',
  templateUrl: './multi-column-select-control.component.html',
  styleUrls: ['./multi-column-select-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiColumnSelectControlComponent),
      multi: true,
    }],
})
export class MultiColumnSelectControlComponent implements ControlValueAccessor {
  @Input() enableFilter: boolean;
  @Input() fieldGrid;
  @Input() isClear = true;
  @Input() list: Array<any>;
  @Input() displayField: string;
  @Input() dataField: string;
  @Input() isRequired;
  // tslint:disable-next-line:ban-types
  @Input() apiCall: Function;
  // tslint:disable-next-line:ban-types
  private onChange: Function;

  isDisabled: boolean;
  gridApi;
  selectedValue;
  isShowList: boolean;
  height = '200px';

  constructor(
    private elementRef: ElementRef,
  ) {}

  getParams(params) {
    this.gridApi = params.api;
    const rowsSelection = this.gridApi.getSelectedRows();
    if (rowsSelection) {
      this.selectedValue = rowsSelection[0];
      if (isFunction(this.onChange)) {
        this.isShowList = false;
        this.onChange(!this.dataField ? this.selectedValue : this.selectedValue[this.dataField]);
      }
    }
  }

  callbackGrid(params) {
    if (this.apiCall) {
      this.apiCall(params);
    }
    if (this.list) {
      params.api.setRowData(this.list);
    }
    setTimeout(() => {
      params.api.sizeColumnsToFit();
    });
    this.gridApi = params.api;
    this.gridApi.getSelectedRows().length = 1;
  }

  writeValue(val) {
    this.selectedValue = this.dataField ?
      this.list.find(data => data[this.dataField] === val) : val;
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
  }

  @HostListener('document:click', ['$event', '$event.target'])
  public onClick(event: MouseEvent, targetElement: HTMLElement): void {
    if (!targetElement) {
      return;
    }

    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.isShowList = false;
    }
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }

  clearValue() {
    this.selectedValue = null;
    if (isFunction(this.onChange)) {
      this.isShowList = false;
      this.onChange(this.selectedValue);
    }
  }
}
