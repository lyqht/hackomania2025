export interface EventbriteCost {
  display: string;
  currency: string;
  value: number;
  major_value: string;
}

export interface EventbriteBarcode {
  status: string;
  barcode: string;
  created: string;
  changed: string;
  checkin_type: number;
  is_printed: boolean;
}

export interface EventbriteAnswer {
  answer?: string;
  question: string;
  type: string;
  question_id: string;
}

export interface EventbriteAttendee {
  costs: {
    base_price: EventbriteCost;
    eventbrite_fee: EventbriteCost;
    gross: EventbriteCost;
    payment_fee: EventbriteCost;
    tax: EventbriteCost;
  };
  resource_uri: string;
  id: string;
  changed: string;
  created: string;
  quantity: number;
  variant_id: string | null;
  profile: {
    first_name: string;
    last_name: string;
    addresses: Record<string, unknown>;
    gender?: string;
    cell_phone?: string;
    email: string;
    name: string;
  };
  barcodes: EventbriteBarcode[];
  answers: EventbriteAnswer[];
  checked_in: boolean;
  cancelled: boolean;
  refunded: boolean;
  affiliate: string;
  guestlist_id: string | null;
  invited_by: string | null;
  status: string;
  ticket_class_name: string;
  delivery_method: string;
  event_id: string;
  order_id: string;
  ticket_class_id: string;
}

export interface EventbriteResponse {
  attendees: EventbriteAttendee[];
  pagination: {
    has_more_items: boolean;
    continuation?: string;
    object_count: number;
    [key: string]: unknown;
  };
}

export type AttendeeMainInfo =
  & Pick<EventbriteAttendee, "checked_in">
  & Omit<EventbriteAttendee["profile"], "addresses">
  & {
    answers: EventbriteAttendee["answers"];
  };
