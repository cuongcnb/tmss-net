import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'multi-checkbox-select',
  templateUrl: './multi-checkbox-select.component.html',
  styleUrls: ['./multi-checkbox-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiCheckboxSelectComponent),
      multi: true,
    }],
})
export class MultiCheckboxSelectComponent implements OnInit, ControlValueAccessor {

  dropDownSettings;
  @Input() selectedItem: Array<any> = [];
  @Input() className: string;
  @Input() text: string;
  @Input() placeHolder: string;
  @Input() data: Array<any>;
  @Input() isDisabled: boolean;
  @Input() id: string;
  @Input() content: string;
  @Input() formControlName: string;
  @Input() itemsShowLimit: number;
  @Input() maxHeight: number;

  // tslint:disable-next-line:ban-types
  private onChange: Function;
  selectedValue;
  disabled = true;

  constructor() {
  }

  ngOnInit() {
    this.dropDownSettings = {
      singleSelection: false,
      idField: this.id, // Default: 'id'
      textField: this.content, // Default: 'text'
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: this.itemsShowLimit,
      allowSearchFilter: true,
      enableCheckAll: false,
      searchPlaceholderText: 'Tìm kiếm',
      maxHeight: this.maxHeight
    };
  }

  writeValue(val) {
    this.selectedItem = val;
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {}

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }

  onItemSelect() {
    this.onChange(this.convertData(this.selectedItem));
  }

  onItemDeSelect() {
    this.onChange(this.convertData(this.selectedItem));
  }

  onSelectAll() {
    this.onChange(this.convertData(this.selectedItem));
  }

  private convertData(val): Array<any> {
    if (val) {
      return val.map(valDetail => {
        return this.data.find(dataDetail => valDetail && valDetail.id && valDetail.id === dataDetail.id);
      });
    } else {
      return [];
    }
  }
}
