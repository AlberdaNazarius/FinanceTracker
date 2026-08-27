export const MONEY_LOCATION_SELECT = `
  id,
  name,
  icon,
  color,
  is_default,
  archived,
  sort_order,
  currency:currency_id (*)
`;

export const TRANSFER_SELECT = `
  id,
  from_amount,
  to_amount,
  fee_amount,
  description,
  transfer_date,
  created_at,
  from_location:from_location_id (${MONEY_LOCATION_SELECT}),
  to_location:to_location_id (${MONEY_LOCATION_SELECT})
`;

export const TRANSACTION_SELECT = `
  *,
  category:category_id (*),
  currency:currency_id (*),
  location:location_id (${MONEY_LOCATION_SELECT})
`;
