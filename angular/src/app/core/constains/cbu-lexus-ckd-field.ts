/* Note:
* field: Tên dùng để hiển thị
* fieldSubmit: tên dùng để submit form (chỉ dùng với những list có id)
* editType: kiểu edit
* apiCall: gọi api khi mở modal
* gridField: tạo grid-table trong modal
* displayField: sử dụng trong modal: field được chọn để hiển thị khi kiểu dữ liệu là danh sách
* dataFormatType: convert data để hiển thị(nếu cần; ví dụ: date, time, hour)
*/
export const SpecialFields = [
  {
    field: 'installDate',
    editType: 'datePicker'
  },
  {
    field: 'pdiDate',
    editType: 'datePicker'
  },
  {
    field: 'dlrHasFloorMat',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['Yes', 'No']
  },
  {
    field: 'pdiOwnerManual',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['Yes', 'No']
  },
  {
    field: 'pInstallDate',
    editType: 'datePicker'
  },
  {
    field: 'pInstallTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'installTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'paintInTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'dealerActualDispatchTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'pdiTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'pBeginInstallTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'pFinishInstallTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'yardLoc',
    fieldSubmit: 'yardLocId',
    editType: 'list',
    apiCall: 'getYardLocationAvailable',
    gridField: [
      {field: 'code'},
      {headerName: 'Row', field: 'locationRow'},
      {headerName: 'Column', field: 'locationColumn'},
      {field: 'area'},
      {field: 'yardCode'},
      {field: 'description'}
    ],
    displayField: 'code'
  },
  {
    field: 'loc',
    fieldSubmit: 'locId',
    editType: 'list',
    apiCall: 'getYardLocationVP',
    gridField: [
      {field: 'code'},
      {headerName: 'Row', field: 'locationRow'},
      {headerName: 'Area Code', field: 'areaCode'},
      {field: 'description'}
    ],
    displayField: 'code'
  },
  {
    field: 'firstTimeMaintPlan',
    editType: 'datePicker'
  },
  {
    field: 'firstTimeMaintAct',
    editType: 'datePicker'
  },
  {
    field: 'secondTimeMaintPlan',
    editType: 'datePicker'
  },
  {
    field: 'secondTimeMaintAct',
    editType: 'datePicker'
  },
  {
    field: 'thirdTimeMaintPlan',
    editType: 'datePicker'
  },
  {
    field: 'thirdTimeMaintAct',
    editType: 'datePicker'
  },
  {
    field: 'forthTimeMaintPlan',
    editType: 'datePicker'
  },
  {
    field: 'forthTimeMaintAct',
    editType: 'datePicker'
  },
  {
    field: 'fifthTimeMaintPlan',
    editType: 'datePicker'
  },
  {
    field: 'fifthTimeMaintAct',
    editType: 'datePicker'
  },
  {
    field: 'sixthTimeMaintPlan',
    editType: 'datePicker'
  },
  {
    field: 'sixthTimeMaintAct',
    editType: 'datePicker'
  },
  {
    field: 'damageClaimDate',
    editType: 'datePicker'
  },
  {
    field: 'damageFinishingDate',
    editType: 'datePicker'
  },
  {
    field: 'damageFoundDate',
    editType: 'datePicker'
  },
  {
    field: 'damageRepairDate',
    editType: 'datePicker'
  },
  {
    field: 'customCompletePlan',
    editType: 'datePicker'
  },
  {
    field: 'customCompleteAct',
    editType: 'datePicker'
  },
  {
    field: 'cbuDocDelivery',
    editType: 'datePicker'
  },
  {
    field: 'actArrivalDate',
    editType: 'datePicker'
  },
  {
    field: 'documentArrivalDate',
    editType: 'datePicker'
  },
  {
    field: 'dlrDispatchDate',
    editType: 'datePicker'
  },
  {
    field: 'originalLoPlanDate',
    editType: 'datePicker'
  },
  {
    field: 'damageTypeId',
    // fieldSubmit: 'damageTypeId',
    editType: 'listOption',
    dataFormatType: ['convertIdToValue'],
    defaultValue: [
      {id: null, value: null},
      {id: 1, value: 'Can sell as new car'},
      {id: 2, value: 'Can not sell as new car (Used car)'}
    ]
  },
  {
    field: 'damageInsCompany',
    fieldSubmit: 'damageInsCompanyId',
    editType: 'select',
    apiCall: 'getInsuranceCompanies',
    displayField: 'vnName'
  },
  {
    field: 'damageRepaireCost',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'tmvOcSigningDate',
    editType: 'datePicker'
  },
  {
    field: 'customOcSigningDate',
    editType: 'datePicker'
  },
  {
    field: 'vrCertificateReceiveDate',
    editType: 'datePicker'
  },
  {
    field: 'customStartPlan',
    editType: 'datePicker'
  },
  {
    field: 'vrCheckPlan',
    editType: 'datePicker'
  },
  {
    field: 'customStartAct',
    editType: 'datePicker'
  },
  {
    field: 'vrCheckAct',
    editType: 'datePicker'
  },
  {
    field: 'vrCheckActLt',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'priceConsultingDate',
    editType: 'datePicker'
  },
  {
    field: 'customActLt',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'arivalPort',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['CL', 'HP', 'SPCT', 'Cát lái']
  },
  {
    field: 'portEtd',
    editType: 'datePicker'
  },
  {
    field: 'portEta',
    editType: 'datePicker'
  },
  {
    field: 'actDepartDate',
    editType: 'datePicker'
  },
  {
    field: 'interPortDispatchPlan',
    editType: 'datePicker'
  },
  {
    field: 'interPortDispatchDate',
    editType: 'datePicker'
  },
  {
    field: 'interDesArrivalDelay',
    editType: 'datePicker'
  },
  {
    field: 'interPortAssignDate',
    editType: 'datePicker'
  },
  {
    field: 'originDocPlan',
    editType: 'datePicker'
  },
  {
    field: 'interAssignDesId',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['', 'TMV', 'TSC', 'ST', 'HLVY', 'DLR', 'NALV', 'HLVY', '']
  },
  {
    field: 'arivalPortId',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['CL', 'HP', 'SPCT', 'Cát Lái']
  },
  {
    field: 'swapAssignDesId',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['', 'TMV', 'TSC', 'Other']
  },
  {
    field: 'portTransportWay',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['', '1C', '2C']
  },
  {
    field: 'interTransRouteId',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: [
      '', 'CL->TMV', 'HP->TMV', 'SPCT->TMV', 'CL->TSC', 'HP->TSC', 'SPCT->TSC', 'CL->ST', 'HP->ST', 'SPCT->ST', 'CL->DLR', 'HP->DLR', 'SPCT->DLR',
      'CATLAI->TMV', 'CATLAI->TSC', 'CATLAI->ST', 'CATLAI->DLR', 'CL->HLVY', 'HP->HLVY', 'SPCT->HLVY', 'CATLAI->HLVY', 'SPCT->NALV'
    ]
  },
  {
    field: 'interLog',
    fieldSubmit: 'interLogId',
    editType: 'select',
    apiCall: 'getLogisticCompanyAvailable',
    displayField: 'code'
  },
  {
    field: 'interDesArrivalPlan',
    editType: 'datePicker'
  },
  {
    field: 'interDesArrivalDate',
    editType: 'datePicker'
  },
  {
    field: 'interPortDispatchDelay',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'interTransCost',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'stockDay',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'stockFeeExport',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'interMeanTrans',
    fieldSubmit: 'interMeanTransId',
    editType: 'select',
    apiCall: 'getTransportTypeAvailable',
    displayField: 'name'
  },
  {
    field: 'interTruct',
    fieldSubmit: 'interTructId',
    editType: 'list',
    apiCall: 'getTrucksAvailable',
    gridField: [
      {field: 'registerNo'},
      {field: 'driverName'},
      {headerName: 'phone', field: 'driverPhone'},
      {headerName: 'Pro Year', field: 'productionYear'},
      {field: 'description'}
    ],
    displayField: 'registerNo'
  },
  {
    field: 'swappingDispatchPlan',
    editType: 'datePicker'
  },
  {
    field: 'swappingDispatchDate',
    editType: 'datePicker'
  },
  {
    field: 'swappingDesArrivalPlan',
    editType: 'datePicker'
  },
  {
    field: 'swapDesArrivalDate',
    editType: 'datePicker'
  },
  {
    field: 'swapAssignDate',
    editType: 'datePicker'
  },
  {
    field: 'swapAssignDes',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['TMV', 'TSC', 'OTHER']
  },
  {
    field: 'swapRouteId',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: [
      '', 'TMV->TMV', 'TMV->TSC', 'TMV->OTHER', 'TSC->TMV', 'TSC->TSC', 'TSC->OTHER', 'ST->TMV', 'ST->TSC',
      'ST->OTHER', 'DLR->TMV', 'DLR->TSC', 'DLR->OTHER', 'HLVY->TMV', 'HLVY->TSC', 'HLVY->OTHER'
    ]
  },
  {
    field: 'swapLog',
    fieldSubmit: 'swapLogId',
    editType: 'select',
    apiCall: 'getLogisticCompanyAvailable',
    displayField: 'code'
  },
  {
    field: 'swapTructType',
    fieldSubmit: 'swapTructTypeId',
    editType: 'select',
    apiCall: 'getTransportTypeAvailable',
    displayField: 'name'
  },
  {
    field: 'swapTruct',
    fieldSubmit: 'swapTructId',
    editType: 'list',
    apiCall: 'getTrucksAvailable',
    gridField: [
      {field: 'registerNo'},
      {field: 'driverName'},
      {headerName: 'phone', field: 'driverPhone'},
      {headerName: 'Pro Year', field: 'productionYear'},
      {field: 'description'}
    ],
    displayField: 'registerNo'
  },
  {
    field: 'swapTransportCost',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'swappingArrivalDelay',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'docSendingVendor',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['', 'Viettel', 'Netco']
  },
  {
    field: 'dlrPaymentPlan',
    editType: 'datePicker'
  },
  {
    field: 'dlrDispatchPlan',
    editType: 'datePicker'
  },
  {
    field: 'dlrDispatchPlanTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'mlArrivalPlanTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'documentDeliveryTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'interDesArrivalTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'deferPayment',
    editType: 'datePicker'
  },
  {
    field: 'dlrTransRouteId',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['', 'TMV->DLR', 'TSC->DLR', 'ST->DLR', 'CL->DLR', 'SPCT->DLR', 'HP->DLR', 'CATLAI->DLR', 'HLVY->DLR', 'NALV->DLR']
  },
  {
    field: 'dlrPlanArrivalDate',
    editType: 'datePicker'
  },
  {
    field: 'dlrArrivalDate',
    editType: 'datePicker'
  },
  {
    field: 'originalArrivalPlan',
    editType: 'datePicker'
  },
  {
    field: 'dlrActualArrivalDate',
    editType: 'datePicker'
  },
  {
    field: 'tempLicenseDate',
    editType: 'datePicker'
  },
  {
    field: 'invoiceRequestDate',
    editType: 'datePicker'
  },
  {
    field: 'mlMovingYardDate',
    editType: 'datePicker'
  },
  {
    field: 'payDelay',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'payVnAmount',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'payUsdAmount',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'dlrTransportWay',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['', '1C', '2C']
  },
  {
    field: 'dlrDeliveryAtId',
    fieldSubmit: 'dlrDeliveryAtId',
    editType: 'select',
    apiCall: 'getAllDlrDeliveryAtAddress',
    displayField: 'address'
  },
  {
    field: 'lineOffDate',
    editType: 'datePicker'
  },
  {
    field: 'originalLoPlanTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'latestLoPlanDate',
    editType: 'datePicker'
  },
  {
    field: 'audio',
    fieldSubmit: 'audioId',
    editType: 'select',
    apiCall: 'getAudiosAvailable',
    displayField: 'name'
  },
  {
    field: 'qcLoshift',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['Y', 'R']
  },
  {
    field: 'painInDate',
    editType: 'datePicker'
  },
  {
    field: 'dlrDispatchTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'dealerColorDeadlineTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'dealerColorDeadline',
    editType: 'datePicker'
  },
  {
    field: 'rFPaymentDate',
    editType: 'datePicker'
  },
  {
    field: 'assRFPaymentDate',
    editType: 'datePicker'
  },
  {
    field: 'payActualInvoiceDate',
    editType: 'datePicker'
  },
  {
    field: 'fleetPrice',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'fleetCustomer',
    fieldSubmit: 'fleetCustomer',
    editType: 'list',
    apiCall: 'getFleetCustomer',
    gridField: [
      {field: 'code'},
      {field: 'name'},
      {field: 'address'},
      {field: 'phone'},
      {field: 'email'}
    ],
    displayField: 'name'
  },
  {
    field: 'documentDeliveryDate',
    editType: 'datePicker'
  },
  {
    field: 'mlOtherDlr',
    fieldSubmit: 'mlOtherDlr',
    editType: 'select',
    displayField: 'abbreviation'
  },
  {
    field: 'assChangeFrom',
    fieldSubmit: 'assChangeFrom',
    editType: 'select',
    displayField: 'abbreviation'
  },
  {
    field: 'dealerRequestColorId',
    fieldSubmit: 'dealerRequestColorId',
    editType: 'list',
    apiCall: 'getColorsForCbuCkd',
    gridField: [
      {field: 'code'},
      {headerName: 'Vietnamese Name', field: 'vnName'},
      {headerName: 'English Name', field: 'enName'},
      {field: 'description'}
    ],
    displayField: 'code'
  },
  {
    field: 'intColor',
    fieldSubmit: 'interiorColorId',
    editType: 'list',
    apiCall: 'getIntColorsForCbuCkd',
    gridField: [
      {field: 'code'},
      {headerName: 'Vietnamese Name', field: 'vnName'},
      {headerName: 'English Name', field: 'enName'},
      {field: 'description'}
    ],
    displayField: 'code'
  },
  {
    field: 'extColor',
    fieldSubmit: 'colorId',
    editType: 'list',
    apiCall: 'getColorsForCbuCkd',
    gridField: [
      {field: 'code'},
      {headerName: 'Vietnamese Na/vehicleme', field: 'vnName'},
      {headerName: 'English Name', field: 'enName'},
      {field: 'description'}
    ],
    displayField: 'code'
  },
  {
    field: 'assAlloMonth',
    editType: 'monthPicker',
    // dataFormatType: 'formatMonth'
    dataFormatType: 'formatAlloMonth'
  },
  {
    field: 'documentArrivalTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'transportRoute',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['', 'ML->DLR', 'ML->TSC->DLR', 'TSC->DLR', 'TSC->ML->DLR', 'ST->DLR', 'ST->ML->DLR', 'CL->DLR', 'CL->ML->DLR']
  },
  {
    field: 'pdiTransportRoute',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['', 'TSC -> DLR', 'TSC -> TMV']
  },
  {
    field: 'tfsApprove',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['Approve', 'Reject']
  },
  {
    field: 'paymentBy',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['', 'Trả thẳng', 'Ngân hàng', 'Thuê mua']
  },
  {
    field: 'mlPlanDeliveryDate',
    editType: 'datePicker'
  },
  {
    field: 'mlPlanDeliveryTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'pdiPlanDeliveryTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'dlrPlanArrivalTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'pdiPlanArrivalTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'dlrArrivalTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'mlLogisticCompanyId',
    fieldSubmit: 'mlLogisticCompanyId',
    editType: 'select',
    apiCall: 'getLogisticCompanyAvailable',
    displayField: 'code'
  },
  {
    field: 'mlTruckType',
    fieldSubmit: 'mlTruckTypeId',
    editType: 'select',
    apiCall: 'getTransportTypeAvailable',
    displayField: 'name'
  },
  {
    field: 'clTruckType',
    fieldSubmit: 'clTruckTypeId',
    editType: 'select',
    apiCall: 'getTransportTypeAvailable',
    displayField: 'name'
  },
  {
    field: 'spctTruckType',
    fieldSubmit: 'spctTruckTypeId',
    editType: 'select',
    apiCall: 'getTransportTypeAvailable',
    displayField: 'name'
  },
  {
    field: 'dlrLogId',
    fieldSubmit: 'dlrLogId',
    editType: 'select',
    apiCall: 'getLogisticCompanyAvailable',
    displayField: 'code'
  },
  {
    field: 'dlrTruckType',
    fieldSubmit: 'dlrTruckTypeId',
    editType: 'select',
    apiCall: 'getTransportTypeAvailable',
    displayField: 'name'
  },
  {
    field: 'dlrTruck',
    fieldSubmit: 'dlrTruckId',
    editType: 'list',
    apiCall: 'getTrucksAvailable',
    gridField: [
      {field: 'registerNo'},
      {field: 'driverName'},
      {headerName: 'phone', field: 'driverPhone'},
      {headerName: 'Pro Year', field: 'productionYear'},
      {field: 'description'}
    ],
    displayField: 'registerNo'
  },
  {
    field: 'hpLogisticCompany',
    fieldSubmit: 'hpLogisticCompanyId',
    editType: 'select',
    apiCall: 'getLogisticCompanyAvailable',
    displayField: 'code'
  },
  {
    field: 'hpTruckType',
    fieldSubmit: 'hpTruckTypeId',
    editType: 'select',
    apiCall: 'getTransportTypeAvailable',
    displayField: 'name'
  },
  {
    field: 'mlTruck',
    fieldSubmit: 'mlTruckId',
    editType: 'list',
    apiCall: 'getTrucksAvailable',
    gridField: [
      {field: 'registerNo'},
      {field: 'driverName'},
      {headerName: 'phone', field: 'driverPhone'},
      {headerName: 'Pro Year', field: 'productionYear'},
      {field: 'description'}
    ],
    displayField: 'registerNo'
  },
  {
    field: 'pdiTruckType',
    fieldSubmit: 'pdiTruckTypeId',
    editType: 'select',
    apiCall: 'getTransportTypeAvailable',
    displayField: 'name'
  },
  {
    field: 'pdiPlanDeliveryDate',
    editType: 'datePicker'
  },
  {
    field: 'pdiLogisticCompany',
    fieldSubmit: 'pdiLogisticCompanyId',
    editType: 'select',
    apiCall: 'getLogisticCompanyAvailable',
    displayField: 'code'
  },
  {
    field: 'pdiTructType',
    fieldSubmit: 'pdiTructTypeId',
    editType: 'select',
    apiCall: 'getTransportTypeAvailable',
    displayField: 'name'
  },
  {
    field: 'pdiTransCost',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'dlrTransCost',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'dlrGasoline',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'diesel',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'dlrdelay',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'pdiDeliveryDate',
    editType: 'datePicker'
  },
  {
    field: 'mlDeliveryDate',
    editType: 'datePicker'
  },
  {
    field: 'mlDeliveryTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'pdiDeliveryTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'mlYardArea',
    fieldSubmit: 'mlYardAreaId',
    editType: 'list',
    apiCall: 'getYardRegionVP',
    gridField: [
      {field: 'name'},
      {field: 'yardCode'}
    ],
    displayField: 'name'
  },
  {
    field: 'mlMovingYardTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'pdiArrivalDate',
    editType: 'datePicker'
  },
  {
    field: 'mlArrivalActualDate',
    editType: 'datePicker'
  },
  {
    field: 'ccrAIn',
    editType: 'datePicker'
  },
  {
    field: 'ccrAOut',
    editType: 'datePicker'
  },
  {
    field: 'mlArrivalActualTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'pdiArrivalTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'selfDrivingTripRequest',
    // editType: 'number',
    // dataFormatType: 'text',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']
  },
  {
    // CKD: TSC Location: lấy yard location của ybd
    // Đây là cbu
    field: 'pdiLocId',
    fieldSubmit: 'pdiLocId',
    editType: 'list',
    apiCall: 'getYardLocationParkingNotNo',
    gridField: [
      {field: 'code'},
      {headerName: 'Row', field: 'locationRow'},
      {headerName: 'Area Code', field: 'areaCode'},
      {field: 'description'}
    ],
    displayField: 'code'
  },
  {
    field: 'mlArrivalTransCost',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    // CKD: TSC Yard Area lấy yard location của YBD
    // Đây là CBU
    field: 'pdiYardArea',
    fieldSubmit: 'pdiYardArea',
    editType: 'select',
    apiCall: 'getYardNo',
    displayField: 'name'
  },

  {
    field: 'dlrColRq',
    fieldSubmit: 'dlrColRqId',
    editType: 'list',
    apiCall: 'getColorsAvailable',
    gridField: [
      {field: 'code'},
      {headerName: 'Vietnamese Name', field: 'vnName'},
      {headerName: 'English Name', field: 'enName'},
      {field: 'description'}
    ],
    displayField: 'code'
  },
  {
    field: 'dlrColDeadline',
    editType: 'datePicker'
  },

  {
    field: 'mlLogistic',
    fieldSubmit: 'mlLogisticId',
    editType: 'select',
    apiCall: 'getLogisticCompanyAvailable',
    displayField: 'code'
  },
  {
    field: 'pdiLogistic',
    fieldSubmit: 'pdiLogisticId',
    editType: 'select',
    apiCall: 'getLogisticCompanyAvailable',
    displayField: 'code'
  },
  {
    field: 'mlYardLoc',
    fieldSubmit: 'mlYardLocId',
    editType: 'list',
    apiCall: 'getYardLocationAvailable',
    gridField: [
      {field: 'code'},
      {headerName: 'Row', field: 'locationRow'},
      {headerName: 'Column', field: 'locationColumn'},
      {field: 'area'},
      {field: 'yardCode'},
      {field: 'description'}
    ],
    displayField: 'code'
  },
  {
    field: 'damageType',
    editType: 'listOption',
    dataFormatType: ['convertIdToValue'],
    defaultValue: [
      {id: null, value: ''},
      {id: 1, value: 'Can sell as new car'},
      {id: 2, value: 'Can not sell as new car (Used car)'}
    ]
  },
  {
    field: 'dealerId',
    fieldSubmit: 'dealerId',
    editType: 'select',
    displayField: 'abbreviation'
  }
];
export const EditTypeOfCellVehicleInfo = [
  {
    field: 'installDate',
    editType: 'datePicker'
  },
  {
    field: 'pdiDate',
    editType: 'datePicker'
  },
  {
    field: 'dlrHasFloorMat',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['Yes', 'No']
  },
  {
    field: 'pdiOwnerManual',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['Yes', 'No']
  },
  {
    field: 'pInstallDate',
    editType: 'datePicker'
  },
  {
    field: 'pInstallTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'installTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'paintInTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'dealerActualDispatchTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'pdiTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'pBeginInstallTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'pFinishInstallTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'yardLoc',
    fieldSubmit: 'yardLocId',
    editType: 'list',
    apiCall: 'getYardLocationAvailable',
    gridField: [
      {field: 'code'},
      {headerName: 'Row', field: 'locationRow'},
      {headerName: 'Column', field: 'locationColumn'},
      {field: 'area'},
      {field: 'yardCode'},
      {field: 'description'}
    ],
    displayField: 'code'
  },
  {
    field: 'loc',
    fieldSubmit: 'locId',
    editType: 'list',
    apiCall: 'getYardLocationVP',
    gridField: [
      {field: 'code'},
      {headerName: 'Row', field: 'locationRow'},
      {headerName: 'Area Code', field: 'areaCode'},
      {field: 'description'}
    ],
    displayField: 'code'
  },
  {
    field: 'firstTimeMaintPlan',
    editType: 'datePicker'
  },
  {
    field: 'firstTimeMaintAct',
    editType: 'datePicker'
  },
  {
    field: 'secondTimeMaintPlan',
    editType: 'datePicker'
  },
  {
    field: 'secondTimeMaintAct',
    editType: 'datePicker'
  },
  {
    field: 'thirdTimeMaintPlan',
    editType: 'datePicker'
  },
  {
    field: 'thirdTimeMaintAct',
    editType: 'datePicker'
  },
  {
    field: 'forthTimeMaintPlan',
    editType: 'datePicker'
  },
  {
    field: 'forthTimeMaintAct',
    editType: 'datePicker'
  },
  {
    field: 'fifthTimeMaintPlan',
    editType: 'datePicker'
  },
  {
    field: 'fifthTimeMaintAct',
    editType: 'datePicker'
  },
  {
    field: 'sixthTimeMaintPlan',
    editType: 'datePicker'
  },
  {
    field: 'sixthTimeMaintAct',
    editType: 'datePicker'
  },
  {
    field: 'damageClaimDate',
    editType: 'datePicker'
  },
  {
    field: 'damageFinishingDate',
    editType: 'datePicker'
  },
  {
    field: 'damageFoundDate',
    editType: 'datePicker'
  },
  {
    field: 'damageRepairDate',
    editType: 'datePicker'
  },
  {
    field: 'customCompletePlan',
    editType: 'datePicker'
  },
  {
    field: 'customCompleteAct',
    editType: 'datePicker'
  },
  {
    field: 'cbuDocDelivery',
    editType: 'datePicker'
  },
  {
    field: 'actArrivalDate',
    editType: 'datePicker'
  },
  {
    field: 'documentArrivalDate',
    editType: 'datePicker'
  },
  {
    field: 'dlrDispatchDate',
    editType: 'datePicker'
  },
  {
    field: 'originalLoPlanDate',
    editType: 'datePicker'
  },
  {
    field: 'damageTypeId',
    // fieldSubmit: 'damageTypeId',
    editType: 'listOption',
    dataFormatType: ['convertIdToValue'],
    defaultValue: [
      {id: 1, value: 'Can sell as new car'},
      {id: 2, value: 'Can not sell as new car (Used car)'}
    ]
  },
  {
    field: 'damageInsCompany',
    fieldSubmit: 'damageInsCompanyId',
    editType: 'select',
    apiCall: 'getInsuranceCompanies',
    displayField: 'vnName'
  },
  {
    field: 'damageRepaireCost',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'tmvOcSigningDate',
    editType: 'datePicker'
  },
  {
    field: 'customOcSigningDate',
    editType: 'datePicker'
  },
  {
    field: 'vrCertificateReceiveDate',
    editType: 'datePicker'
  },
  {
    field: 'customStartPlan',
    editType: 'datePicker'
  },
  {
    field: 'vrCheckPlan',
    editType: 'datePicker'
  },
  {
    field: 'customStartAct',
    editType: 'datePicker'
  },
  {
    field: 'vrCheckAct',
    editType: 'datePicker'
  },
  {
    field: 'vrCheckActLt',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'priceConsultingDate',
    editType: 'datePicker'
  },
  {
    field: 'customActLt',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'arivalPort',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['CL', 'HP', 'SPCT', 'Cát lái']
  },
  {
    field: 'portEtd',
    editType: 'datePicker'
  },
  {
    field: 'portEta',
    editType: 'datePicker'
  },
  {
    field: 'actDepartDate',
    editType: 'datePicker'
  },
  {
    field: 'interPortDispatchPlan',
    editType: 'datePicker'
  },
  {
    field: 'interPortDispatchDate',
    editType: 'datePicker'
  },
  {
    field: 'interDesArrivalDelay',
    editType: 'datePicker'
  },
  {
    field: 'interPortAssignDate',
    editType: 'datePicker'
  },
  {
    field: 'originDocPlan',
    editType: 'datePicker'
  },
  {
    field: 'interAssignDesId',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['TMV', 'TSC', 'ST', 'HLVY', 'DLR', 'NALV', 'HLVY', '']
  },
  {
    field: 'arivalPortId',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['CL', 'HP', 'SPCT', 'Cát Lái']
  },
  {
    field: 'swapAssignDesId',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['TMV', 'TSC', 'Other']
  },
  {
    field: 'portTransportWay',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['1C', '2C']
  },
  {
    field: 'interTransRouteId',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['',
      'CL->TMV', 'HP->TMV', 'SPCT->TMV',
      'CL->TSC', 'HP->TSC', 'SPCT->TSC',
      'CL->ST', 'HP->ST', 'SPCT->ST',
      'CL->DLR', 'HP->DLR', 'SPCT->DLR',
      'CATLAI->TMV', 'CATLAI->TSC', 'CATLAI->ST',
      'CATLAI->DLR', 'CL->HLVY', 'HP->HLVY',
      'SPCT->HLVY', 'CATLAI->HLVY', 'SPCT->NALV'
    ]
  },
  {
    field: 'interLog',
    fieldSubmit: 'interLogId',
    editType: 'select',
    apiCall: 'getLogisticCompanyAvailable',
    displayField: 'code'
  },
  {
    field: 'interDesArrivalPlan',
    editType: 'datePicker'
  },
  {
    field: 'interDesArrivalDate',
    editType: 'datePicker'
  },
  {
    field: 'interPortDispatchDelay',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'interTransCost',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'stockDay',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'stockFeeExport',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'interMeanTrans',
    fieldSubmit: 'interMeanTransId',
    editType: 'select',
    apiCall: 'getTransportTypeAvailable',
    displayField: 'name'
  },
  {
    field: 'interTruct',
    fieldSubmit: 'interTructId',
    editType: 'list',
    apiCall: 'getTrucksAvailable',
    gridField: [
      {field: 'registerNo'},
      {field: 'driverName'},
      {headerName: 'phone', field: 'driverPhone'},
      {headerName: 'Pro Year', field: 'productionYear'},
      {field: 'description'}
    ],
    displayField: 'registerNo'
  },
  {
    field: 'swappingDispatchPlan',
    editType: 'datePicker'
  },
  {
    field: 'swappingDispatchDate',
    editType: 'datePicker'
  },
  {
    field: 'swappingDesArrivalPlan',
    editType: 'datePicker'
  },
  {
    field: 'swapDesArrivalDate',
    editType: 'datePicker'
  },
  {
    field: 'swapAssignDate',
    editType: 'datePicker'
  },
  {
    field: 'swapAssignDes',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['TMV', 'TSC', 'OTHER']
  },
  {
    field: 'swapRouteId',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['',
      'TMV->TMV', 'TMV->TSC', 'TMV->OTHER',
      'TSC->TMV', 'TSC->TSC', 'TSC->OTHER',
      'ST->TMV', 'ST->TSC', 'ST->OTHER',
      'DLR->TMV', 'DLR->TSC', 'DLR->OTHER',
      'HLVY->TMV', 'HLVY->TSC', 'HLVY->OTHER']
  },
  {
    field: 'swapLog',
    fieldSubmit: 'swapLogId',
    editType: 'select',
    apiCall: 'getLogisticCompanyAvailable',
    displayField: 'code'
  },
  {
    field: 'swapTructType',
    fieldSubmit: 'swapTructTypeId',
    editType: 'select',
    apiCall: 'getTransportTypeAvailable',
    displayField: 'name'
  },
  {
    field: 'swapTruct',
    fieldSubmit: 'swapTructId',
    editType: 'list',
    apiCall: 'getTrucksAvailable',
    gridField: [
      {field: 'registerNo'},
      {field: 'driverName'},
      {headerName: 'phone', field: 'driverPhone'},
      {headerName: 'Pro Year', field: 'productionYear'},
      {field: 'description'}
    ],
    displayField: 'registerNo'
  },
  {
    field: 'swapTransportCost',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'swappingArrivalDelay',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'docSendingVendor',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['Viettel', 'Netco']
  },
  {
    field: 'dlrPaymentPlan',
    editType: 'datePicker'
  },
  {
    field: 'dlrDispatchPlan',
    editType: 'datePicker'
  },
  {
    field: 'dlrDispatchPlanTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'mlArrivalPlanTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'documentDeliveryTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'interDesArrivalTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'deferPayment',
    editType: 'datePicker'
  },
  {
    field: 'dlrTransRouteId',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['',
      'TMV->DLR', 'TSC->DLR', 'ST->DLR',
      'CL->DLR', 'SPCT->DLR', 'HP->DLR',
      'CATLAI->DLR', 'HLVY->DLR', 'NALV->DLR'
    ]
  },
  {
    field: 'dlrPlanArrivalDate',
    editType: 'datePicker'
  },
  {
    field: 'dlrArrivalDate',
    editType: 'datePicker'
  },
  {
    field: 'originalArrivalPlan',
    editType: 'datePicker'
  },
  {
    field: 'dlrActualArrivalDate',
    editType: 'datePicker'
  },
  {
    field: 'tempLicenseDate',
    editType: 'datePicker'
  },
  {
    field: 'invoiceRequestDate',
    editType: 'datePicker'
  },
  {
    field: 'mlMovingYardDate',
    editType: 'datePicker'
  },
  {
    field: 'payDelay',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'payVnAmount',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'payUsdAmount',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'dlrTransportWay',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['1C', '2C']
  },
  {
    field: 'dlrDeliveryAtId',
    fieldSubmit: 'dlrDeliveryAtId',
    editType: 'select',
    apiCall: 'getDlrDeliverAt',
    displayField: 'address'
  },
  {
    field: 'lineOffDate',
    editType: 'datePicker'
  },
  {
    field: 'originalLoPlanTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'latestLoPlanDate',
    editType: 'datePicker'
  },
  {
    field: 'audio',
    fieldSubmit: 'audioId',
    editType: 'select',
    apiCall: 'getAudiosAvailable',
    displayField: 'name'
  },
  {
    field: 'qcLoshift',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['Y', 'R']
  },
  {
    field: 'painInDate',
    editType: 'datePicker'
  },
  {
    field: 'dlrDispatchTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'dealerColorDeadlineTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'dealerColorDeadline',
    editType: 'datePicker'
  },
  {
    field: 'rFPaymentDate',
    editType: 'datePicker'
  },
  {
    field: 'assRFPaymentDate',
    editType: 'datePicker'
  },
  {
    field: 'payActualInvoiceDate',
    editType: 'datePicker'
  },
  {
    field: 'fleetPrice',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'fleetCustomer',
    fieldSubmit: 'fleetCustomer',
    editType: 'list',
    apiCall: 'getFleetCustomer',
    gridField: [
      {field: 'code'},
      {field: 'name'},
      {field: 'address'},
      {field: 'phone'},
      {field: 'email'}
    ],
    displayField: 'name'
  },
  {
    field: 'documentDeliveryDate',
    editType: 'datePicker'
  },
  {
    field: 'mlOtherDlr',
    fieldSubmit: 'mlOtherDlr',
    editType: 'select',
    apiCall: 'getDealersAvailable',
    displayField: 'abbreviation'
  },
  {
    field: 'assChangeFrom',
    fieldSubmit: 'assChangeFrom',
    editType: 'select',
    apiCall: 'getDealersAvailable',
    displayField: 'abbreviation'
  },
  {
    field: 'dealerRequestColorId',
    fieldSubmit: 'dealerRequestColorId',
    editType: 'list',
    // apiCall: 'getColorsAvailable',
    apiCall: 'getColorsForCbuCkd',
    gridField: [
      {field: 'code'},
      {headerName: 'Vietnamese Name', field: 'vnName'},
      {headerName: 'English Name', field: 'enName'},
      {field: 'description'}
    ],
    displayField: 'code'
  },
  {
    field: 'intColor',
    fieldSubmit: 'interiorColorId',
    editType: 'list',
    apiCall: 'getColorsForCkdCbu',
    gridField: [
      {field: 'code'},
      {headerName: 'Vietnamese Name', field: 'vnName'},
      {headerName: 'English Name', field: 'enName'},
      {field: 'description'}
    ],
    displayField: 'code'
  },
  {
    field: 'assAlloMonth',
    editType: 'monthPicker',
    // dataFormatType: 'formatMonth'
    dataFormatType: 'formatAlloMonth'
  },
  {
    field: 'documentArrivalTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'transportRoute',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['',
      'ML->DLR', 'ML->TSC->DLR',
      'TSC->DLR', 'TSC->ML->DLR',
      'ST->DLR', 'ST->ML->DLR',
      'CL->DLR', 'CL->ML->DLR']
  },
  {
    field: 'pdiTransportRoute',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['TSC -> DLR', 'TSC -> TMV']
  },
  {
    field: 'tfsApprove',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['Approve', 'Reject']
  },
  {
    field: 'paymentBy',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['Trả thẳng', 'Ngân hàng', 'Thuê mua']
  },
  {
    field: 'mlPlanDeliveryDate',
    editType: 'datePicker'
  },
  {
    field: 'mlPlanDeliveryTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'pdiPlanDeliveryTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'dlrPlanArrivalTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'pdiPlanArrivalTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'dlrArrivalTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'mlLogisticCompanyId',
    fieldSubmit: 'mlLogisticCompanyId',
    editType: 'select',
    apiCall: 'getLogisticCompanyAvailable',
    displayField: 'code'
  },
  {
    field: 'mlTruckType',
    fieldSubmit: 'mlTruckTypeId',
    editType: 'select',
    apiCall: 'getTransportTypeAvailable',
    displayField: 'name'
  },
  {
    field: 'clTruckType',
    fieldSubmit: 'clTruckTypeId',
    editType: 'select',
    apiCall: 'getTransportTypeAvailable',
    displayField: 'name'
  },
  {
    field: 'spctTruckType',
    fieldSubmit: 'spctTruckTypeId',
    editType: 'select',
    apiCall: 'getTransportTypeAvailable',
    displayField: 'name'
  },
  {
    field: 'dlrLog',
    fieldSubmit: 'dlrLogId',
    editType: 'select',
    apiCall: 'getLogisticCompanyAvailable',
    displayField: 'code'
  },
  {
    field: 'dlrTruckType',
    fieldSubmit: 'dlrTruckTypeId',
    editType: 'select',
    apiCall: 'getTransportTypeAvailable',
    displayField: 'name'
  },
  {
    field: 'dlrTruck',
    fieldSubmit: 'dlrTruckId',
    editType: 'list',
    apiCall: 'getTrucksAvailable',
    gridField: [
      {field: 'registerNo'},
      {field: 'driverName'},
      {headerName: 'phone', field: 'driverPhone'},
      {headerName: 'Pro Year', field: 'productionYear'},
      {field: 'description'}
    ],
    displayField: 'registerNo'
  },
  {
    field: 'hpLogisticCompany',
    fieldSubmit: 'hpLogisticCompanyId',
    editType: 'select',
    apiCall: 'getLogisticCompanyAvailable',
    displayField: 'code'
  },
  {
    field: 'hpTruckType',
    fieldSubmit: 'hpTruckTypeId',
    editType: 'select',
    apiCall: 'getTransportTypeAvailable',
    displayField: 'name'
  },
  {
    field: 'mlTruck',
    fieldSubmit: 'mlTruckId',
    editType: 'list',
    apiCall: 'getTrucksAvailable',
    gridField: [
      {field: 'registerNo'},
      {field: 'driverName'},
      {headerName: 'phone', field: 'driverPhone'},
      {headerName: 'Pro Year', field: 'productionYear'},
      {field: 'description'}
    ],
    displayField: 'registerNo'
  },
  {
    field: 'pdiTruckType',
    fieldSubmit: 'pdiTruckTypeId',
    editType: 'select',
    apiCall: 'getTransportTypeAvailable',
    displayField: 'name'
  },
  {
    field: 'pdiPlanDeliveryDate',
    editType: 'datePicker'
  },
  {
    field: 'pdiLogisticCompany',
    fieldSubmit: 'pdiLogisticCompanyId',
    editType: 'select',
    apiCall: 'getLogisticCompanyAvailable',
    displayField: 'code'
  },
  {
    field: 'pdiTructType',
    fieldSubmit: 'pdiTructTypeId',
    editType: 'select',
    apiCall: 'getTransportTypeAvailable',
    displayField: 'name'
  },
  {
    field: 'pdiTransCost',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'dlrTransCost',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'dlrGasoline',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'diesel',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'dlrdelay',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    field: 'pdiDeliveryDate',
    editType: 'datePicker'
  },
  {
    field: 'mlDeliveryDate',
    editType: 'datePicker'
  },
  {
    field: 'mlDeliveryTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'pdiDeliveryTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'mlYardArea',
    fieldSubmit: 'mlYardAreaId',
    editType: 'list',
    apiCall: 'getYardRegionVP',
    gridField: [
      {field: 'name'},
      {field: 'yardCode'}
    ],
    displayField: 'name'
  },
  {
    field: 'mlMovingYardTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'pdiArrivalDate',
    editType: 'datePicker'
  },
  {
    field: 'mlArrivalActualDate',
    editType: 'datePicker'
  },
  {
    field: 'ccrAIn',
    editType: 'datePicker'
  },
  {
    field: 'ccrAOut',
    editType: 'datePicker'
  },
  {
    field: 'mlArrivalActualTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'pdiArrivalTime',
    editType: 'timePicker',
    dataFormatType: 'formatHoursSecond'
  },
  {
    field: 'selfDrivingTripRequest',
    // editType: 'number',
    // dataFormatType: 'text',
    editType: 'listOption',
    dataFormatType: 'text',
    defaultValue: ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
      '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']
  },
  {
    // CKD: TSC Location: lấy yard location của ybd
    // Đây là cbu
    field: 'pdiLocId',
    fieldSubmit: 'pdiLocId',
    editType: 'list',
    apiCall: 'getYardLocationParkingNotNo',
    gridField: [
      {field: 'code'},
      {headerName: 'Row', field: 'locationRow'},
      {headerName: 'Area Code', field: 'areaCode'},
      {field: 'description'}
    ],
    displayField: 'code'
  },
  {
    field: 'mlArrivalTransCost',
    editType: 'number',
    dataFormatType: 'text'
  },
  {
    // CKD: TSC Yard Area lấy yard location của YBD
    // Đây là CBU
    field: 'pdiYardArea',
    fieldSubmit: 'pdiYardArea',
    editType: 'select',
    apiCall: 'getYardNo',
    displayField: 'name'
  },

  {
    field: 'dlrColRq',
    fieldSubmit: 'dlrColRqId',
    editType: 'list',
    apiCall: 'getColorsAvailable',
    gridField: [
      {field: 'code'},
      {headerName: 'Vietnamese Name', field: 'vnName'},
      {headerName: 'English Name', field: 'enName'},
      {field: 'description'}
    ],
    displayField: 'code'
  },
  {
    field: 'dlrColDeadline',
    editType: 'datePicker'
  },

  {
    field: 'mlLogistic',
    fieldSubmit: 'mlLogisticId',
    editType: 'select',
    apiCall: 'getLogisticCompanyAvailable',
    displayField: 'code'
  },
  {
    field: 'pdiLogistic',
    fieldSubmit: 'pdiLogisticId',
    editType: 'select',
    apiCall: 'getLogisticCompanyAvailable',
    displayField: 'code'
  },
  {
    field: 'mlYardLoc',
    fieldSubmit: 'mlYardLocId',
    editType: 'list',
    apiCall: 'getYardLocationAvailable',
    gridField: [
      {field: 'code'},
      {headerName: 'Row', field: 'locationRow'},
      {headerName: 'Column', field: 'locationColumn'},
      {field: 'area'},
      {field: 'yardCode'},
      {field: 'description'}
    ],
    displayField: 'code'
  },
  {
    field: 'damageType',
    editType: 'listOption',
    dataFormatType: ['convertIdToValue'],
    defaultValue: [
      {id: null, value: ''},
      {id: 1, value: 'Can sell as new car'},
      {id: 2, value: 'Can not sell as new car (Used car)'}
    ]
  }
  // {
  //   field: 'dealerId',
  //   fieldSubmit: 'dealerId',
  //   editType: 'select',
  //   // apiCall: 'getDealersAvailable',
  //   displayField: 'abbreviation'
  // }
];
