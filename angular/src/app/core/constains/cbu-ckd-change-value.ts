export const ChangeDataValue = {
  interAssignDesId: [
    {
      field: 'interPortAssignDate',
      callFunc: 'getMaintPlanDate',
      requestData: ['interAssignDesId', 0]
    },
    {
      field: 'interTransRouteId',
      callFunc: 'getTransRoute',
      requestData: ''
    },
    {
      field: 'swapRouteId',
      callFunc: 'getTransRoute',
      requestData: ''
    },
    {
      field: 'dlrTransRouteId',
      callFunc: 'getTransRoute',
      requestData: ''
    }
  ],
  pdiDate: [
    {
      field: 'firstTimeMaintPlan',
      callFunc: 'getMaintPlanDate',
      requestData: ['pdiDate', 1]
    },
    {
      field: 'secondTimeMaintPlan',
      callFunc: 'getMaintPlanDate',
      requestData: ['pdiDate', 2]
    },
    {
      field: 'thirdTimeMaintPlan',
      callFunc: 'getMaintPlanDate',
      requestData: ['pdiDate', 3]
    },
    {
      field: 'forthTimeMaintPlan',
      callFunc: 'getMaintPlanDate',
      requestData: ['pdiDate', 4]
    },
    {
      field: 'fifthTimeMaintPlan',
      callFunc: 'getMaintPlanDate',
      requestData: ['pdiDate', 5]
    },
    {
      field: 'sixthTimeMaintPlan',
      callFunc: 'getMaintPlanDate',
      requestData: ['pdiDate', 6]
    },
    {
      field: 'maintenanceStockDay',
      callFunc: 'getAffectedData',
      requestData: ['dlrDispatchDate', 'pdiDate']
    },
    {
      field: 'maintenanceStockDay',
      callFunc: 'getAffectedData',
      requestData: ['mlDeliveryDate', 'pdiDate']
    }
  ],
  dlrDispatchDate: [
    {
      field: 'maintenanceStockDay',
      callFunc: 'getAffectedData',
      requestData: ['dlrDispatchDate', 'pdiDate']
    }
  ],
  mlDeliveryDate: [
    {
      field: 'maintenanceStockDay',
      callFunc: 'getAffectedData',
      requestData: ['mlDeliveryDate', 'pdiDate']
    },
    {
      field: 'mlDelayDispatch',
      callFunc: 'getAffectedData',
      requestData: ['mlDeliveryDate', 'mlPlanDeliveryDate']
    }
  ],
  mlPlanDeliveryDate: [
    {
      field: 'mlDelayDispatch',
      callFunc: 'getAffectedData',
      requestData: ['mlDeliveryDate', 'mlPlanDeliveryDate']
    }
  ],
  dealer: [
    {
      field: 'dlrDeliveryAt',
      callFunc: 'setDlrDeliveryAt',
      requestData: ''
    },
    {
      field: 'dlrDeliveryAtId',
      callFunc: 'setDlrDeliveryAtId',
      requestData: ''
    },
    {
      field: 'dlrTransRouteId',
      callFunc: 'getTransRoute',
      requestData: ''
    }
  ],
  assDealerChangeFromName: [
    {
      field: 'dlrDeliveryAt',
      callFunc: 'setDlrDeliveryAt',
      requestData: ''
    },
    {
      field: 'dlrDeliveryAtId',
      callFunc: 'setDlrDeliveryAtId',
      requestData: ''
    },
    {
      field: 'dlrTransRouteId',
      callFunc: 'getTransRoute',
      requestData: ''
    }
  ],
  swapAssignDesId: [
    {
      field: 'dlrTransRouteId',
      callFunc: 'getTransRoute',
      requestData: ''
    },
    {
      field: 'swapRouteId',
      callFunc: 'getTransRoute',
      requestData: ''
    }
  ],
  arivalPortId: [
    {
      field: 'interTransRouteId',
      callFunc: 'getTransRoute',
      requestData: ''
    },
    {
      field: 'dlrTransRouteId',
      callFunc: 'getTransRoute',
      requestData: ''
    }
  ],
  mlOtherDlrName: [
    {
      field: 'dlrDeliveryAt',
      callFunc: 'setDlrDeliveryAt',
      requestData: ''
    },
    {
      field: 'dlrDeliveryAtId',
      callFunc: 'setDlrDeliveryAtId',
      requestData: ''
    }
  ],

  // field = field 1 - field 2
  interPortDispatchDate: [
    {
      field: 'interPortDispatchDelay',
      callFunc: 'getAffectedData',
      requestData: ['interPortDispatchDate', 'interPortDispatchPlan']
    },
    {
      field: 'stockDay',
      callFunc: 'getAffectedData',
      requestData: ['interPortDispatchDate', 'interDesArrivalDate']
    }
  ],
  interPortDispatchPlan: [
    {
      field: 'interPortDispatchDelay',
      callFunc: 'getAffectedData',
      requestData: ['interPortDispatchDate', 'interPortDispatchPlan']
    }
  ],
  interDesArrivalDate: [
    {
      field: 'interDesArrivalDelay',
      callFunc: 'getAffectedData',
      requestData: ['interDesArrivalDate', 'interDesArrivalPlan']
    },
    {
      field: 'stockDay',
      callFunc: 'getAffectedData',
      requestData: ['interPortDispatchDate', 'interDesArrivalDate']
    }
  ],
  interDesArrivalPlan: [
    {
      field: 'interDesArrivalDelay',
      callFunc: 'getAffectedData',
      requestData: ['interDesArrivalDate', 'interDesArrivalPlan']
    },
    {
      field: 'stockDay',
      callFunc: 'getAffectedData',
      requestData: ['interDesArrivalPlan', 'interDesArrivalDate']
    }
  ],
  dlrArrivalDate: [
    {
      field: 'dlrDelay',
      callFunc: 'getAffectedData',
      requestData: ['dlrArrivalDate', 'dlrPlanArrivalDate']
    }
  ],
  dlrPlanArrivalDate: [
    {
      field: 'dlrDelay',
      callFunc: 'getAffectedData',
      requestData: ['dlrArrivalDate', 'dlrPlanArrivalDate']
    }
  ],
  payActualInvoiceDate: [
    {
      field: 'payDelay',
      callFunc: 'getAffectedData',
      requestData: ['payActualInvoiceDate', 'dlrPaymentPlan']
    }
  ],
  dlrPaymentPlan: [
    {
      field: 'payDelay',
      callFunc: 'getAffectedData',
      requestData: ['payActualInvoiceDate', 'dlrPaymentPlan']
    }
  ],
  swapDesArrivalDate: [
    {
      field: 'swappingArrivalDelay',
      callFunc: 'getAffectedData',
      requestData: ['swapDesArrivalDate', 'swappingDesArrivalPlan']
    }
  ],
  swappingDesArrivalPlan: [
    {
      field: 'swappingArrivalDelay',
      callFunc: 'getAffectedData',
      requestData: ['swapDesArrivalDate', 'swappingDesArrivalPlan']
    }
  ],
  interTransRouteId: [
    {
      callFunc: 'getRoute'
    }
  ],
  swapRouteId: [
    {
      callFunc: 'getRoute'
    }
  ],
  dlrTransRouteId: [
    {
      callFunc: 'getRoute'
    }
  ]
};
