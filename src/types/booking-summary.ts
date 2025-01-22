/**
 * Booking summary data type
 */
export interface BookingSummaryData {
  serviceTitle: string;
  servicePrice: number;
  serviceDuration: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    floorUnit: string;
    blockStreet: string;
    postalCode: string;
    condoName?: string;
    lobbyTower?: string;
    specialInstructions?: string;
  };
  scheduledDatetime: Date;
  scheduledTimeslot: string;
  totalAmount: number;
  tipAmount: number;
}

/**
 * Database booking summary data type
 * Used for API responses that use snake_case
 */
export interface DBBookingSummaryData {
  service_title: string;
  service_price: number;
  service_duration: string;
  customer_info: {
    first_name: string;
    last_name: string;
    email: string;
    mobile: string;
    floor_unit: string;
    block_street: string;
    postal_code: string;
    condo_name?: string;
    lobby_tower?: string;
    special_instructions?: string;
  };
  scheduled_datetime: Date;
  scheduled_timeslot: string;
  total_amount: number;
  tip_amount: number;
}

/**
 * Mapping functions
 */
export function mapToDBBookingSummary(data: BookingSummaryData): DBBookingSummaryData {
  return {
    service_title: data.serviceTitle,
    service_price: data.servicePrice,
    service_duration: data.serviceDuration,
    customer_info: {
      first_name: data.customerInfo.firstName,
      last_name: data.customerInfo.lastName,
      email: data.customerInfo.email,
      mobile: data.customerInfo.mobile,
      floor_unit: data.customerInfo.floorUnit,
      block_street: data.customerInfo.blockStreet,
      postal_code: data.customerInfo.postalCode,
      condo_name: data.customerInfo.condoName,
      lobby_tower: data.customerInfo.lobbyTower,
      special_instructions: data.customerInfo.specialInstructions
    },
    scheduled_datetime: data.scheduledDatetime,
    scheduled_timeslot: data.scheduledTimeslot,
    total_amount: data.totalAmount,
    tip_amount: data.tipAmount
  };
}

export function mapFromDBBookingSummary(data: DBBookingSummaryData): BookingSummaryData {
  return {
    serviceTitle: data.service_title,
    servicePrice: data.service_price,
    serviceDuration: data.service_duration,
    customerInfo: {
      firstName: data.customer_info.first_name,
      lastName: data.customer_info.last_name,
      email: data.customer_info.email,
      mobile: data.customer_info.mobile,
      floorUnit: data.customer_info.floor_unit,
      blockStreet: data.customer_info.block_street,
      postalCode: data.customer_info.postal_code,
      condoName: data.customer_info.condo_name,
      lobbyTower: data.customer_info.lobby_tower,
      specialInstructions: data.customer_info.special_instructions
    },
    scheduledDatetime: data.scheduled_datetime,
    scheduledTimeslot: data.scheduled_timeslot,
    totalAmount: data.total_amount,
    tipAmount: data.tip_amount
  };
}