import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'follow-detail',
  templateUrl: './follow-detail.component.html',
  styleUrls: ['./follow-detail.component.scss']
})
export class FollowDetailComponent implements OnInit {
  @ViewChild('followDetailModal', {static: false}) modal: ModalDirective;
  form: FormGroup;
  fieldGridDetail;
  followDetailParams;
  selectedFollowDetail;
  followUpDetails = [
    {
      dealer: 'TBH',
      tmvRefNo: 'TMV-SPL-110909',
      customerName: 'Cty TNHH MTV Mai Linh Bình Dương',
      fleetAppDate: new Date(2011, 9, 26),
      approveDate: new Date(2011, 9, 22),
      volumeRange: '5-19',
      expiryDate: new Date(2011, 11, 30),
      contractNo: '0497',
      wodDate: new Date(2011, 10, 3),
      depositDate: new Date(2011, 10, 3),
    },
    {
      dealer: 'TBH',
      tmvRefNo: 'TMV-SPD-110307',
      customerName: 'Cty TNHH MTV Mai Linh Tây Ninh',
      fleetAppDate: null,
      approveDate: null,
      volumeRange: null,
      expiryDate: null,
      contractNo: null,
      wodDate: null,
      depositDate: null,
    }
  ];

  constructor(private formBuilder: FormBuilder) {
    this.fieldGridDetail = [
      { field: 'dealer' },
      {
        headerName: 'TMV Ref No',
        field: 'tmvRefNo'
      },
    ];
  }

  ngOnInit() {
  }

  open() {
    this.buildForm();
    this.modal.show();
  }

  hide() {
    this.modal.hide();
  }

  reset() {
    this.form = undefined;
  }

  search() {
    if (this.form.invalid) {
      return;
    }
    // const apiCall = !this.selectedData ?
    //   this.bankService.createNewBank(this.form.value) : this.bankService.updateBank(this.form.value);
    // apiCall.subscribe(() => {
    //   this.close.emit();
    //   this.modal.hide();
    // }, () => {
    // })
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      dealer: [''],
      tmvRefNo: [''],
      customerName: [''],
      fleetAppDate: [''],
      approveDate: [''],
      volumeRange: [''],
      expiryDate: [''],
      contractNo: [''],
      wodDate: [''],
      depositDate: [''],
    });
  }

  callbackGridDetail(params) {
    params.api.setRowData(this.followUpDetails);
    this.followDetailParams = params;
  }

  getParamsDetail() {
    const selectedFollowDetail = this.followDetailParams.api.getSelectedRows();
    if (selectedFollowDetail) {
      this.selectedFollowDetail = selectedFollowDetail[0];
      this.form.patchValue(this.selectedFollowDetail);
    }
  }

  refreshDetail() {
    this.callbackGridDetail(this.followDetailParams);
  }
}
