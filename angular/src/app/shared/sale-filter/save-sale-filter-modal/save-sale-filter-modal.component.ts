import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterService} from '../../../api/lookup/filter.service';
import { LoadingService } from '../../loading/loading.service';
import { FormStoringService } from '../../common-service/form-storing.service';
import { StorageKeys } from '../../../core/constains/storageKeys';
import { GlobalValidator } from '../../form-validation/validators';
import {ToastService} from '../../common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'save-sale-filter',
  templateUrl: './save-sale-filter-modal.component.html',
  styleUrls: ['./save-sale-filter-modal.component.scss']
})
export class SaveSaleFilterModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  filterDetail;
  filterFieldArr;
  formName: string;
  currentUser;

  constructor(
    private formBuilder: FormBuilder,
    private filterService: FilterService,
    private swalAlertService: ToastService,
    private loadingService: LoadingService,
    private formStoringService: FormStoringService
  ) { }

  ngOnInit() {
    this.currentUser = this.formStoringService.get(StorageKeys.currentUser);
  }

  open(filterDetail, filterFieldArr, formName) {
    this.filterDetail = filterDetail;
    this.filterFieldArr = filterFieldArr;
    this.formName = formName;
    this.buildForm();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    let saveObj = {};
    const filterDetailArr = [];
    let filterDetail;
    if (this.filterDetail) {
      this.filterDetail.forEach(detail => {
        delete detail.id;
        const filterField = this.filterFieldArr.find(field => field.id === detail.filterId);
        filterDetail = Object.assign({}, detail, { filterId: filterField ? filterField.id : undefined });
        filterDetailArr.push(filterDetail);
      });
      saveObj = Object.assign({}, this.form.value, {
          listFilterDetail: filterDetailArr,
          formName: this.formName,
          userId: this.currentUser.userId
        });
    }

    this.loadingService.setDisplay(true);
    this.filterService.createNewFilter(saveObj).subscribe(() => {
      this.modal.hide();
      this.close.emit();
      this.swalAlertService.openSuccessModal();
      this.loadingService.setDisplay(false);
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      name: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(255)])]
    });
  }

}
