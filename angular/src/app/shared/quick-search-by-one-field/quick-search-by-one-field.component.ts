import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'quick-search-by-one-field',
  templateUrl: './quick-search-by-one-field.component.html',
  styleUrls: ['./quick-search-by-one-field.component.scss']
})
export class QuickSearchByOneFieldComponent implements OnInit, OnChanges {
  @Input() fieldSearch: string;
  @Input() arraySearch: Array<any> = [];
  @Input() textLabel: string;
  @Input() addOnMinWidth: string;

  @Output() resultSearch = new EventEmitter();

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.arraySearch && this.form) {
      this.resultSearch.emit(this.quickSearch(this.fieldSearch, this.arraySearch));
    }
  }

  private quickSearch(fieldSearch, sourceArr: Array<any>) {
    if (this.form.getRawValue()[fieldSearch]) {
      const targetArr = [];
      sourceArr.forEach(item => {
        if (item[fieldSearch].toLowerCase().indexOf(this.form.getRawValue()[fieldSearch].toLowerCase()) > -1) {
          targetArr.push(item);
        }
      });
      return targetArr;
    } else {
      return sourceArr;
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      [this.fieldSearch]: [undefined],
    });
    this.form.get(this.fieldSearch).valueChanges.subscribe(() => {
      this.resultSearch.emit(this.quickSearch(this.fieldSearch, this.arraySearch));
    });
  }
}
