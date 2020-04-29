import {
  ChangeDetectorRef, Component, ComponentFactoryResolver, EmbeddedViewRef, EventEmitter, forwardRef,
  Injector, Input, OnInit, Output, ViewChild, ViewRef, ViewContainerRef, AfterViewInit
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {defineLocale} from 'ngx-bootstrap/chronos';
import {viLocale} from 'ngx-bootstrap/locale';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';

import {DataFormatService} from '../common-service/data-format.service';
import {TimeChoosingComponent} from './time-choosing/time-choosing.component';
import {ToastService} from '../swal-alert/toast.service';
import {isFunction} from 'util';

defineLocale('vi', viLocale);

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'tmss-datepicker',
  templateUrl: './tmss-datepicker.component.html',
  styleUrls: ['./tmss-datepicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TmssDatepickerComponent),
      multi: true
    }]
})
export class TmssDatepickerComponent implements ControlValueAccessor, OnInit, AfterViewInit {
  @ViewChild('datepicker', {static: false}) datepicker;
  @Input() dateValue;
  @Input() className: string;
  @Input() addOnMinWidth: string;
  @Input() dateInputFormat: string;
  @Input() text: string;
  @Input() isRequired: boolean;
  @Input() hasTimepicker: boolean;
  @Input() placement: string;
  @Input() disable;
  @Input() ignoredCalender;
  @Input() minDate;
  @Input() maxDate;
  @Input() typeMonth;
  @Input() showMonth: boolean;
  @Input() showDeleteBtn: boolean;

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onChoose = new EventEmitter();
  // tslint:disable-next-line:ban-types
  private onChange: Function;
  isDisabled: boolean;
  selectedValue;
  hour = new Date().getHours();
  minute = new Date().getMinutes();
  isChangeTime: boolean;
  ignoreFormControl = true;
  locale = 'vi';

  constructor(
    private cdr: ChangeDetectorRef,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private dataFormatService: DataFormatService,
    private swalAlert: ToastService,
    private localeService: BsLocaleService,
    private viewContainerRef: ViewContainerRef
  ) {
  }

  ngOnInit() {
    this.localeService.use(this.locale);
    if (this.dateValue) {
      this.selectedValue = new Date(this.dateValue);
    }
    if (this.disable && this.disable === true) {
      this.isDisabled = true;
    }
    if (!(this.cdr as ViewRef).destroyed) {
      this.cdr.detectChanges();
    }
  }

  ngAfterViewInit(): void {
    if (!(this.cdr as ViewRef).destroyed) {
      this.cdr.detectChanges();
    }
  }

  remove() {
    this.selectedValue = null;
    if (isFunction(this.onChange)) {
      this.onChange(null);
    }
  }

  openDatepicker() {
    this.datepicker.toggle();
  }

  onBlur(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (!value || value === '') {
      this.selectedValue = null;
      this.onValueChange();
    }
  }

  onValueChange(val?) {
    if (val) {
      this.selectedValue = val;
      if (isNaN(this.selectedValue.getDate())) {
        this.swalAlert.openWarningToast('Nhập sai định dạng ngày(DD/MM/YYYY)');
      }
    }

    if (this.ignoreFormControl) {
      if (this.selectedValue && this.hasTimepicker && this.isChangeTime) {
        this.selectedValue.setHours(this.hour, this.minute);
      }

      this.onChoose.emit(this.dataFormatService.formatDate(this.selectedValue));
    } else {
      if (this.selectedValue && this.hasTimepicker && this.isChangeTime) {
        this.selectedValue.setHours(this.hour, this.minute);
      }

      if (isFunction(this.onChange)) {
        this.onChange(this.selectedValue ? this.dataFormatService.formatDate(this.selectedValue) : null);
      }
    }
  }

  writeValue(val) {
    this.ignoreFormControl = false;
    switch (typeof val) {
      case 'string':
        this.selectedValue = val ? new Date(val) : '';
        break;
      case 'number':
        this.selectedValue = val ? new Date(val) : '';
        break;
      default:
        this.selectedValue = val ? val : '';
        break;
    }
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
  }

  onShown(container) {

    setTimeout(() => {
      if (this.hasTimepicker) {
        const component = this.createTimepickerComponent();
        const elem = document.querySelector('.bs-datepicker-container');
        if (elem) {
          elem.appendChild(component);
        }
      }
    }, 100);
    if (this.showMonth) {
      container.monthSelectHandler = (event: any): void => {
        container._store.dispatch(container._actions.select(event.date));
      };
      container.setViewMode('month');
      return;
    }
    let isBreak = false;
    // tìm những elem trong tháng
    const arr = [];
    const elems = document.querySelectorAll('span[bsdatepickerdaydecorator]');
    elems.forEach(item => {
      if (item.classList.contains('selected')) {
        isBreak = true;
      }

      if (!item.classList.contains('is-other-month') && !isBreak) {
        arr.push(item);
      }
    });

    if (isBreak) {
      return;
    } else {
      const date = new Date().getDate();
      arr[date - 1].classList.add('selected');
    }
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }

  private createTimepickerComponent() {
    const component = this.resolver.resolveComponentFactory(TimeChoosingComponent);
    const componentRef = this.viewContainerRef.createComponent(component);

    componentRef.instance.val = {
      hour: this.selectedValue && this.selectedValue !== '' ? this.selectedValue.getHours() : this.hour,
      minute: this.selectedValue && this.selectedValue !== '' ? this.selectedValue.getMinutes() : Number(this.minute)
    };
    componentRef.instance.calculateHour.subscribe(val => {
      this.isChangeTime = true;
      this.hour = val.hour;
      this.minute = val.minute;
      this.onValueChange();
    });

    componentRef.instance.accept.subscribe(() => {
      this.isChangeTime = true;
      this.onValueChange();
      this.datepicker.hide();
    });
    return (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
  }

  onOpenCalendar(container) {
    if (!this.typeMonth) {
      return;
    }
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }
}
