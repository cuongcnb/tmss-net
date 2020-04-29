import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../../../shared/common-service/set-modal-height.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'question-request-modal',
  templateUrl: './question-request-modal.component.html',
  styleUrls: ['./question-request-modal.component.scss'],
})
export class QuestionRequestModalComponent implements OnInit {

  @Output() questionData = new EventEmitter();
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  selectedData;
  form: FormGroup;
  modalHeight: number;
  fieldGrid;
  fieldGrid1;
  gridParams;
  questionOrProblem;
  dataQuestion: Array<any> = [];
  dataProblemProduct: Array<any> = [];
  dataProblemSales: Array<any> = [];
  selectedTab;
  tabs: Array<any> = [];

  rowData;

  constructor(
    private formBuilder: FormBuilder,
    private modalHeightService: SetModalHeightService,
  ) {
  }

  ngOnInit() {
    this.onResize();
    this.fieldGrid = [
      {headerName: 'Mã lĩnh vực', headerTooltip: 'Mã lĩnh vực', field: 'codeField'},
      {headerName: 'Tên lĩnh vực', headerTooltip: 'Tên lĩnh vực', field: 'nameField'},
    ];

    this.fieldGrid1 = [
      {headerName: 'Mã lĩnh vực', headerTooltip: 'Mã lĩnh vực', field: 'codeField'},
      {headerName: 'Mã vấn đề', headerTooltip: 'Mã vấn đề', field: 'codeProblem'},
      {headerName: 'Tên vấn đê', headerTooltip: 'Tên vấn đê', field: 'nameProblem'},
    ];

    this.dataQuestion = [{
      codeField: 'Product',
      nameField: 'Sản phẩm',
      questionField: 'Product - Sản phẩm',
      questionId: '1',
    }, {
      codeField: 'Sales',
      nameField: 'Kinh doanh',
      questionField: 'Sales - Kinh doanh',
      questionId: '2',
    }, {
      codeField: 'After Service and Parts',
      nameField: 'Dịch vụ và phụ tùng',
      questionField: 'After Service and Parts - Dịch vụ và phụ tùng',
      questionId: '3',
    }, {
      codeField: 'Other',
      nameField: 'Khác',
      questionField: 'Other - Khác',
      questionId: '4',
    }];

    this.dataProblemProduct = [{
      codeField: 'Product',
      codeProblem: '01',
      nameProblem: 'Product - problem 111',
      questionField: 'Product - Sản phẩm',
      questionId: '1',
    }, {
      codeField: 'Product',
      codeProblem: '02',
      nameProblem: 'Product - problem 222',
    }, {
      codeField: 'Product',
      codeProblem: '03',
      nameProblem: 'Product - problem 333',
    }, {
      codeField: 'Product',
      codeProblem: '04',
      nameProblem: 'Product - problem 444',
    },
    ];

    this.dataProblemSales = [{
      codeField: 'Sales',
      codeProblem: '01',
      nameProblem: 'Sales - problem 111',
    }, {
      codeField: 'Sales',
      codeProblem: '02',
      nameProblem: 'Sales - problem 222',
    }, {
      codeField: 'Sales',
      codeProblem: '03',
      nameProblem: 'Sales - problem 333',
    }, {
      codeField: 'Sales',
      codeProblem: '04',
      nameProblem: 'Sales - problem 444',
    },
    ];
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  colQuestionProblemApi() {
    if (this.rowData) {
      // this.api.subscribe(this.rowData.questionId).subscribe(dataBang => {
      //   this.gridParams.api.setRowData(dataBang)
      // })
    }
  }

  open(data, questionOrProblem?) {
    this.rowData = data ? data : undefined;
    this.colQuestionProblemApi();
    this.questionOrProblem = questionOrProblem;
    this.buildForm();
    this.modal.show();
  }

  getParams() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      this.selectedData = selectedData[0];
    }
  }

  choose() {
    const dataQuestion = Object.assign(this.selectedData, {
      contentQuestionRequest: this.rowData.contentQuestionRequest,
      contentAnswer: this.rowData.contentAnswer,
    });
    this.questionData.emit(dataQuestion);
    this.modal.hide();
  }

  reset() {
    this.form = undefined;
    this.selectedData = undefined;
  }

  callbackGrid(params) {
    this.gridParams = params;
    if (this.questionOrProblem) {
      this.gridParams.api.setRowData(this.dataQuestion);
    }
    if (this.rowData && !this.questionOrProblem) {
      if (this.rowData.questionId === '2') {
        this.gridParams.api.setRowData(this.dataProblemSales);
      }
      if (this.rowData.questionId === '1') {
        this.gridParams.api.setRowData(this.dataProblemProduct);
      }
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      multiSelect: [undefined],
    });
  }
}
