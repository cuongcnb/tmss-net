import {AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';

import {PaginationParamsModel} from '../../../core/models/base.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnChanges, AfterViewInit {
  @ViewChild('agPageSize', {static: false}) agPageSize;
  @Input() paginationParams: PaginationParamsModel;
  @Input() paginationTotalsData: number;
  @Input() isHaveOwnerTotals: boolean;
  @Input() totalData: number;
  @Input() params;
  @Input() tenTotal;
  @Input() morePageSize = false;
  @Input() addTotallk;
  @Input() disablePagination;
  @Output() changePaginationParams = new EventEmitter();

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngAfterViewInit(): void {
    if (this.paginationParams) {
      this.paginationParams.size = this.paginationParams.size ? this.paginationParams.size : this.tenTotal ? this.tenTotal : 20;
      this.agPageSize.nativeElement.value = this.paginationParams.size ? this.paginationParams.size : this.tenTotal ? this.tenTotal : 20;
    }
  }

  onPageSizeChanged() {
    const value = this.agPageSize.nativeElement.value;
    this.params.api.paginationSetPageSize(Number(value));
    this.paginationParams.size = Number(value);
    this.paginationParams.page = 1;
    this.changePaginationParams.emit(this.paginationParams);
  }

  get totalPages() {
    return Math.ceil(this.totalData / this.paginationParams.size);
  }

  get currentPage() {
    return this.totalPages > 0 ? this.paginationParams.page - 1 : -1;
  }

  get currentFirstRow() {
    if (this.currentPage < 0) {
      return this.totalData > 0 ? 1 : 0;
    }

    const value = (this.currentPage * this.paginationParams.size) + 1;
    return this.totalData > 0 ? value : 0;
  }

  get currentLastRow() {
    let currentPage = this.currentPage;
    if (currentPage === -1) {
      currentPage = 0;
    }

    const value = (currentPage + 1) * this.paginationParams.size;
    return value <= this.totalData ? value : this.totalData;
  }

  goFirstPage() {
    if (!this.isHaveOwnerTotals) {
      this.params.api.paginationGoToFirstPage();
    } else {
      this.paginationParams.page = 1;
      this.changePaginationParams.emit(this.paginationParams);
    }
  }

  goPreviousPage() {
    if (!this.isHaveOwnerTotals) {
      this.params.api.paginationGoToPreviousPage();
    } else {
      this.paginationParams.page = this.paginationParams.page - 1;
      this.changePaginationParams.emit(this.paginationParams);
    }
  }

  goNextPage() {
    if (!this.isHaveOwnerTotals) {
      this.params.api.paginationGoToNextPage();
    } else {
      this.paginationParams.page = this.paginationParams.page + 1;
      this.changePaginationParams.emit(this.paginationParams);
    }
  }

  goLastPage() {
    if (!this.isHaveOwnerTotals) {
      this.params.api.paginationGoToLastPage();
    } else {
      this.paginationParams.page = this.totalPages;
      this.changePaginationParams.emit(this.paginationParams);
    }
  }

}
