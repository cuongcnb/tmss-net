import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RepairOrderApi } from '../../../../../../api/quotation/repair-order.api';
import { LoadingService } from '../../../../../../shared/loading/loading.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'fix-of-proposal',
  templateUrl: './fix-of-proposal.component.html',
  styleUrls: ['./fix-of-proposal.component.scss'],
})
export class FixOfProposalComponent implements OnInit {
  @Input() proposalForm;
  @ViewChild('submitBtn', {static: false}) submitBtn;
  readjustRoid;

  constructor(private formBuilder: FormBuilder,
              private repairOrderApi: RepairOrderApi,
              private loadingService: LoadingService) {
  }

  ngOnInit() {
  }


  searchRoRoot(event) {
    if (event.target.value !== this.readjustRoid) {
      this.loadingService.setDisplay(true);
      this.repairOrderApi.searchByRepairOrderNo(event.target.value).subscribe(val => {
        if (val) {
          this.proposalForm.get('readjustRoid').setErrors(null);
        } else {
          this.proposalForm.get('readjustRoid').setErrors({readjustRoid: true});
          this.submitBtn.nativeElement.click();
        }
        this.loadingService.setDisplay(false);
      });
    }

  }
}
