const NEW_ORDER = {code: 100}; //- new order - user
const ORDER_CANCEL = 101; // - order cancel by user
const PAYMENT_MAKE = 200; // - payment done - user
const PAYMENT_REJECT = 201; // - payment reject by user
const ORDER_ACCEPT = 300; // - order accepted - restaurant
const ORDER_REJECT = 301; // - order reject - restaurant
const COMPLETE_PAYMENT = 400; // - make payment - system
const PAYMNET_FAIL = 401; // - payment failed
const COMPLETED_ORDER = 500; // - deliver  - restaurant to the user
const COMPLETED_FAIL = 501; // - deliver failed

module.exports = { 
    NEW_ORDER,
    ORDER_CANCEL,
    PAYMENT_MAKE,
    PAYMENT_REJECT,
    ORDER_ACCEPT,
    ORDER_REJECT,
    COMPLETE_PAYMENT,
    PAYMNET_FAIL,
    COMPLETED_ORDER,
    COMPLETED_FAIL
}