import {Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

class MonthPicker {
  state: string;
  selectionItems: Array<IDatePickerSelectionItem>;
  selectedMonth: string;
  selectedMonthIndex: number;
  selectedYear: number;
  displayMonth: string;
  displayMonthIndex: number;
  displayYear: number;
  viewMode: string;
  private months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  constructor() {
    this.state = 'closed';
    this.viewMode = 'm';
    this.fillMonthsInSelectionList();
    const currentDate = new Date();
    this.setCurrentdate(currentDate);
  }

  toggleState() {
    this.state = this.state === 'closed' ? 'open' : 'closed';
  }

  fillMonthsInSelectionList() {
    this.selectionItems = [];
    this.months.forEach((v: string, i: number) => this.selectionItems.push({text: v, value: i, type: 'm'}));
  }

  fillYearsInSelectionList() {
    this.selectionItems = [];
    for (let start = this.displayYear - 6; start <= this.displayYear + 5; start++) {
      this.selectionItems.push({text: start.toString(), value: start, type: 'y'});
    }
  }

  setCurrentdate(currentDate: Date) {
    this.displayMonth = this.months[(currentDate.getMonth())];
    this.displayMonthIndex = currentDate.getMonth();
    this.displayYear = currentDate.getFullYear();

    this.selectedMonth = this.displayMonth;
    this.selectedMonthIndex = this.displayMonthIndex;
    this.selectedYear = this.displayYear;
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'month-picker',
  templateUrl: './month-picker.component.html',
  styleUrls: ['./month-picker.component.scss']
})
export class MonthPickerComponent implements OnInit, OnChanges {
  @Input() text: string;
  @Input() addOnMinWidth: string;
  @Input() model;
  @Input() removable: boolean;
  @Input() config: IMonthPickerConfig;
  @Output() modelChange = new EventEmitter();
  monthPicker: MonthPicker = new MonthPicker();

  constructor(private elementRef: ElementRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.model) {
      this.monthPicker.setCurrentdate(new Date(this.model));
    }
  }

  ngOnInit(): void { }

  onCalendarIconClick() {
    this.switchToMonthMode();
    this.monthPicker.setCurrentdate(this.model ? new Date(this.model) : new Date());
    this.monthPicker.toggleState();
  }

  switchToYearMode() {
    this.monthPicker.viewMode = 'y';
    this.monthPicker.fillYearsInSelectionList();
  }

  switchToMonthMode() {
    this.monthPicker.viewMode = 'm';
    this.monthPicker.fillMonthsInSelectionList();
  }

  onselectionItemClick(item: IDatePickerSelectionItem) {
    if (item.type === 'y') {
      this.monthPicker.displayYear = item.value;
      setTimeout(() => {
        this.switchToMonthMode();
      });
    } else if (item.type === 'm') {
      this.onSelectMonth(item);
    }
  }

  removeSelected() {
    this.model = undefined;
    this.modelChange.next(this.model);
  }

  onSelectMonth(item: IDatePickerSelectionItem) {
    this.monthPicker.displayMonth = item.text;
    this.monthPicker.displayMonthIndex = item.value;

    this.monthPicker.selectedMonth = item.text;
    this.monthPicker.selectedMonthIndex = item.value;
    this.monthPicker.selectedYear = this.monthPicker.displayYear;

    this.model = (this.monthPicker.selectedMonthIndex + 1) + '/01/' + this.monthPicker.selectedYear || undefined;
    this.monthPicker.state = 'closed';
    this.modelChange.next(this.model);
  }

  onPrevYearSelection() {
    this.monthPicker.displayYear--;
    if (this.monthPicker.viewMode === 'y') {
      this.monthPicker.fillYearsInSelectionList();
    }
  }

  onNextYearSelection() {
    this.monthPicker.displayYear++;
    if (this.monthPicker.viewMode === 'y') {
      this.monthPicker.fillYearsInSelectionList();
    }
  }

  onCancel() {
    this.monthPicker.state = 'closed';
  }

  @HostListener('document:click', ['$event', '$event.target'])
  public onClick(event: MouseEvent, targetElement: HTMLElement): void {
    if (!targetElement) {
      return;
    }

    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.monthPicker.state = 'closed';
    }
  }
}

export interface IMonthPickerConfig {
  readonly?: boolean;
  cssClass?: string;
  placeHolder?: string;
}

export interface IDatePickerSelectionItem {
  text: string;
  value: number;
  type: string;
}
