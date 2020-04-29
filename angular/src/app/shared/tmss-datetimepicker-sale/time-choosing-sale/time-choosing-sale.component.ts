import {AfterViewInit, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'time-choosing-sale',
  templateUrl: './time-choosing-sale.component.html',
  styleUrls: ['./time-choosing-sale.component.scss']
})
export class TimeChoosingSaleComponent implements AfterViewInit {
  @ViewChild('inputHour', {static: true}) inputHour;
  @ViewChild('inputMinute', {static: true}) inputMinute;
  @Output() calculateHour = new EventEmitter();
  @Output() accept = new EventEmitter();
  // tslint:disable-next-line:no-input-rename
  @Input('val') val;
  hour;
  minute;

  constructor() {
  }


  ngAfterViewInit() {
    if (this.val) {
      this.hour = this.val.hour;
      this.minute = this.val.minute;
      this.inputHour.nativeElement.value = this.hour;
      this.inputMinute.nativeElement.value = this.minute;
    }
  }

  onChange(val, type) {
    this.calculateHour.emit({
      hour: type === 'h' ? Number(val) : Number(this.hour),
      minute: type === 'm' ? Number(val) : Number(this.minute)
    });

    type === 'h' ? this.hour = val : this.minute = val;
  }

  onBtnAccept() {
    this.accept.emit();
  }

}
