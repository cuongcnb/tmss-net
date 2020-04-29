import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { SsiSurveyModel } from '../../../core/models/ssi-survey/ssi-survey.model';
import { SetModalHeightService } from '../../../shared/common-service/set-modal-height.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'remove-type',
  templateUrl: './remove-type.component.html',
  styleUrls: ['./remove-type.component.scss']
})
export class RemoveTypeComponent implements OnInit {
  @ViewChild('removeSurvey', {static: false}) removeSurvey: ModalDirective;
  @ViewChild('modal', {static: false}) modal;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  gridParams;
  selectedData: SsiSurveyModel;
  textArrays: Array<string> = [];
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private setModalHeight: SetModalHeightService,
  ) {
  }

  ngOnInit() {
    this.buildForm();
    // this.textArrays = {
    //   1: 'Lý do loại bỏ',
    //   2: 'Loại bỏ số điện thoại không hợp lệ',
    //   3: 'Loại bỏ khách hàng trong danh sách đen',
    //   4: 'Loại bỏ khách hàng trong đại lý Lexus',
    //   5: 'Loại bỏ khách hàng trong danh sách gợi ý',
    //   6: 'Loại bỏ số điện thoại trùng lặp trong 3 tháng',
    // }
    this.textArrays = [
      'Lý do loại bỏ',
      'Loại bỏ số điện thoại không hợp lệ',
      'Loại bỏ khách hàng trong danh sách đen',
      'Loại bỏ khách hàng trong đại lý Lexus',
      'Loại bỏ khách hàng trong danh sách gợi ý',
      'Loại bỏ số điện thoại trùng lặp trong 3 tháng',
    ];
  }

  onResize() {
    // const abc = [1, 2, 4];
    // const target = [];
    // for (const key, value in textArrays) {
    //   abc.find(a => {
    //     if (a === key) {
    //       target.push(value);
    //     }
    //   })
    // }
    //
    // target = ['Lý do loại b', 'sdfsdf'].toString();
    this.modalHeight = this.setModalHeight.onResize();
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.buildForm();
    this.removeSurvey.show();
  }


  reset() {
    this.form = undefined;
  }

  saveHandle() {
    this.close.emit(this.form.value);
    this.removeSurvey.hide();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      removeReason: this.textArrays[0],
      removePhoneNumber: this.textArrays[1],
      removeCustomBlackList: this.textArrays[2],
      removeLexus: this.textArrays[3],
      removeSuggestionsList: this.textArrays[4],
      removePhoneNumberRepeat: this.textArrays[5],
    });
    this.form.get('removeReason').valueChanges.subscribe(value => {
      if (value) {
        this.form.get('removePhoneNumber').patchValue(true);
        this.form.get('removeCustomBlackList').patchValue(true);
        this.form.get('removeLexus').patchValue(true);
        this.form.get('removeSuggestionsList').patchValue(true);
        this.form.get('removePhoneNumberRepeat').patchValue(true);
      }
    });
  }

}
