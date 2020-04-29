import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SearchDocumentSupportModel } from '../../../core/models/manage-voc/search-document-support.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'search-document-support',
  templateUrl: './search-document-support.component.html',
  styleUrls: ['./search-document-support.component.scss'],
})
export class SearchDocumentSupportComponent implements OnInit {

  form: FormGroup;
  fieldGrid;
  gridParams;
  selectedRowData: SearchDocumentSupportModel;

  constructor(
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.fieldGrid = [
      {headerName: 'Title', headerTooltip: 'Title', field: 'title'},
    ];
  }

  callbackGrid(params) {
    this.gridParams = params;
    this.gridParams.api.setRowData();
  }

  getParams() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      this.selectedRowData = selectedData[0];
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      supplier: [undefined],
      model: [undefined],
    });
  }
}
