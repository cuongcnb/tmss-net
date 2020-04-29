import { Directive, EventEmitter, HostListener, OnDestroy, OnInit, Output } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[btnClickDebounce]'
})
export class BtnClickDebounceDirective implements OnInit, OnDestroy {
  @Output() btnClickDebounce = new EventEmitter();
  private clicks = new Subject();
  private subscription: Subscription;

  constructor() { }

  ngOnInit() {
    this.subscription = this.clicks.pipe(
      debounceTime(500)
    ).subscribe(e => this.btnClickDebounce.emit(e));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @HostListener('click', ['$event'])
  clickEvent(event) {
    event.preventDefault();
    event.stopPropagation();
    this.clicks.next(event);
  }
}
