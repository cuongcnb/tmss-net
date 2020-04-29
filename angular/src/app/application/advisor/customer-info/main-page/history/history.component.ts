import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements AfterViewInit, OnInit, OnChanges {
  @ViewChild('submitBtn', {static: false}) submitBtn;
  @Input() form: FormGroup;
  @Input() isSubmit: boolean;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isSubmit && this.submitBtn) {
      this.submitBtn.nativeElement.click();
    }
  }

  ngOnInit() {
    this.checkForm();
  }

  ngAfterViewInit(): void {

  }

  checkForm() {

  }

  // form: FormGroup
  // historyForm = new EventEmitter<any>()
  //
  // constructor(private formBuilder: FormBuilder,) {
  // }
  //
  // ngOnInit() {
  //   this.buildForm()
  // }
  //
  // private buildForm() {
  //   this.form = this.formBuilder.group({
  //     firstComeIn: [{ value: undefined, disabled: true }],
  //     howMany: [{ value: undefined, disabled: true }],
  //     lastComeIn: [{ value: undefined, disabled: true }],
  //     kmBefore: [{ value: undefined, disabled: true }],
  //     cvdv: [{ value: undefined, disabled: true }],
  //     workContent: [{ value: undefined, disabled: true }],
  //     workFocus: [{ value: undefined, disabled: true }],
  //   })
  //   this.historyForm
  // }

}
