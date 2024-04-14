export function useCountryCodes(): CountryCode {
  return [
    {
      name: "United States Dollar",
      code: "USD",
    },
    {
      name: "Euro",
      code: "EUR",
    },
    {
      name: "British Pound",
      code: "GBP",
    },
    {
      name: "Japanese Yen",
      code: "JPY",
    },
    {
      name: "Australian Dollar",
      code: "AUD",
    },
    {
      name: "Canadian Dollar",
      code: "CAD",
    },
    {
      name: "Swiss Franc",
      code: "CHF",
    },
    {
      name: "Chinese Yuan Renminbi",
      code: "CNY",
    },
    {
      name: "Russian Ruble",
      code: "RUB",
    },
    {
      name: "Indian Rupee",
      code: "INR",
    },
    {
      name: "Brazilian Real",
      code: "BRL",
    },
    {
      name: "Mexican Peso",
      code: "MXN",
    },
    {
      name: "South African Rand",
      code: "ZAR",
    },
    {
      name: "Nigerian Naira",
      code: "NGN",
    },
    {
      name: "New Zealand Dollar",
      code: "NZD",
    },
    {
      name: "Ukrainian Hryvnia",
      code: "UAH",
    },
    {
      name: "Iranian Rial",
      code: "IRR",
    },
    {
      name: "Ethiopian Birr",
      code: "ETB",
    },
    {
      name: "Kenyan Shilling",
      code: "KES",
    },
    {
      name: "Tanzanian Shilling",
      code: "TZS",
    },
    {
      name: "Turkish Lira",
      code: "TRY",
    },
    {
      name: "Philippine Peso",
      code: "PHP",
    },
    {
      name: "Korean Won",
      code: "KRW",
    },
    {
      name: "Venezuelan Bolivar",
      code: "VEF",
    },
    {
      name: "Pakistani Rupee",
      code: "PKR",
    },
    {
      name: "Malaysian Ringgit",
      code: "MYR",
    },
    {
      name: "Sri Lankan Rupee",
      code: "LKR",
    },
    {
      name: "Peruvian Sol",
      code: "PEN",
    },
    // Continue adding until all currency codes are reached
    // ...
    {
      name: "Namibian Dollar",
      code: "NAD",
    },
    {
      name: "Colombian Peso",
      code: "COP",
    },
    {
      name: "Costa Rican Colón",
      code: "CRC",
    },
    {
      name: "Czech Koruna",
      code: "CZK",
    },
    {
      name: "Djiboutian Franc",
      code: "DJF",
    },
    {
      name: "Dominican Peso",
      code: "DOP",
    },
    {
      name: "Egyptian Pound",
      code: "EGP",
    },
    {
      name: "Eritrean Nakfa",
      code: "ERN",
    },
    {
      name: "Gambian Dalasi",
      code: "GMD",
    },
    {
      name: "Ghanaian Cedi",
      code: "GHS",
    },
  ];
}

// declare type for useCountryCodes
export type CountryCode = {
  name: string;
  code: string;
}[];
