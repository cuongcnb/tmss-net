import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {SetModalHeightService} from '../common-service/set-modal-height.service';
import {LoadingService} from '../loading/loading.service';
import {PaginationParamsModel} from '../../core/models/base.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {GridTableService} from '../common-service/grid-table.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'search-data-grid-modal',
  templateUrl: './search-data-grid-modal.component.html',
  styleUrls: ['./search-data-grid-modal.component.scss']
})
export class SearchDataGridModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Input() fieldGrid;
  @Input() modalClass: string;
  @Input() isHideSearchField: boolean;
  // tslint:disable-next-line:ban-types
  @Input() apiCall: Function;
  @Input() headerText: string;
  @Input() showPagination = true;
  @Input() list: Array<any>;
  @Input() paginationTotalsData: number;
  modalHeight: number;
  params;
  gridHeight = '250px';
  selectedData: any;
  form: FormGroup;
  formControlsArr: Array<string>;
  paginationParams: PaginationParamsModel;

  constructor(
    private setModalHeightService: SetModalHeightService,
    private loadingService: LoadingService,
    private formBuilder: FormBuilder,
    private elem: ElementRef,
    private gridTableService: GridTableService
  ) {
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  search() {
    if (this.apiCall && !this.isHideSearchField) {
      this.loadingService.setDisplay(true);
      const api = !this.paginationParams ? this.apiCall(this.form.value) : this.apiCall(this.form.value, this.paginationParams);
      api.subscribe(data => {
        this.loadingService.setDisplay(false);
        if (data && data.list) {
          this.list = data.list;
          this.paginationTotalsData = data.total;
        } else {
          this.list = data;
        }
        this.selectedData = undefined;
        // const inputElem = this.elem.nativeElement.querySelector('.form-control');
        // if (inputElem) {
        //   inputElem.focus();
        // }
        this.params.api.setRowData(this.list);
        this.gridTableService.selectFirstRow(this.params);
        setTimeout(() => {
          this.gridTableService.setFocusCell(this.params, this.fieldGrid[0].field);
        }, 50);
      });
    }
  }

  open(val?, list?, total?) {
    if (!this.isHideSearchField) {
      this.buildForm(val);
    }
    if (list) {
      this.list = list;
    }
    if (total) {
      this.paginationTotalsData = total;
    }
    this.modal.show();
  }

  onCancelBtn() {
    this.modal.hide();
    this.cancel.emit();
  }

  reset() {
    this.list = undefined;
    this.selectedData = undefined;
    this.paginationParams = undefined;
    this.paginationTotalsData = undefined;
  }

  callBackGrid(params) {
    this.params = params;
    if (this.list) {
      this.params.api.setRowData(this.list);
      setTimeout(() => {
        this.gridTableService.setFocusCell(this.params, this.fieldGrid[0].field);
      }, 100);
    } else {
      this.search();
    }
  }

  agKeyUp(event: KeyboardEvent) {
    event.stopPropagation();
    event.preventDefault();
    const keyCode = event.key;
    const KEY_ENTER = 'Enter';

    // Press enter to search with modal
    if (keyCode === KEY_ENTER) {
      this.close.emit(this.selectedData);
      this.modal.hide();
    }

  }

  getParams() {
    const selectedData = this.params.api.getSelectedRows();
    if (selectedData) {
      this.selectedData = selectedData[0];
    }
  }

  changePaginationParams(paginationParams) {
    if (!this.list) {
      return;
    }
    this.paginationParams = paginationParams;
    this.search();
  }

  confirm() {
    this.close.emit(this.selectedData);
    this.modal.hide();
  }

  getForm(val) {
    this.formControlsArr = Object.keys(val);
    const form = {};
    for (const key in val) {
      if (key) {
        form[key] = val[key];
      }
    }
    return form;
  }

  private buildForm(val?) {
    this.form = this.formBuilder.group(this.getForm(val));
  }

}
