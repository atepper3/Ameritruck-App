export const fieldGroups = [
  {
    title: "Truck Identification",
    fields: [
      { name: "stockNumber", label: "Stock Number", type: "text" },
      { name: "year", label: "Year", type: "text" },
      { name: "make", label: "Make", type: "text" },
      { name: "model", label: "Model", type: "text" },
      { name: "vinSerial", label: "VIN", type: "text" },
      { name: "classification", label: "Classification", type: "text" },
      {
        name: "saleType",
        label: "Sale Type",
        type: "select",
        options: ["Retail", "NationsTruck", "Consignment", "Trade-In"],
      },
    ],
  },
  {
    title: "Purchase",
    fields: [
      { name: "fleetNumber", label: "Fleet Number", type: "text" },
      { name: "purchaseDate", label: "Purchase Date", type: "date" },
      { name: "purchasedFrom", label: "Purchased From", type: "text" },
      { name: "purchasePrice", label: "Purchase Price", type: "number" },
      { name: "buyer", label: "Buyer", type: "text" },
      { name: "location", label: "Location", type: "text" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["Active", "Future", "Pending", "Sold"],
      },
    ],
  },
  {
    title: "Sale Information",
    fields: [
      { name: "customer", label: "Customer", type: "text" },
      { name: "saleDate", label: "Sale Date", type: "date" },
      { name: "soldPrice", label: "Sold Price", type: "number" },
      { name: "salesman", label: "Salesman", type: "text" },
      { name: "closeType", label: "Close Type", type: "text" },
      { name: "fundedDate", label: "Funded Date", type: "date" },
      {
        name: "fundingType",
        label: "Funding Type",
        type: "select",
        options: ["Wire", "Cash", "Our Finance Company", "Outside Finance"],
      },
    ],
  },
  {
    title: "Additional Info",
    fields: [
      {
        name: "truckHere",
        label: "Truck Here?",
        type: "select",
        options: ["Yes", "No"],
      },
      {
        name: "titleIn",
        label: "Title In",
        type: "select",
        options: ["Yes", "No"],
      },
      {
        name: "titleOut",
        label: "Title Out",
        type: "select",
        options: ["Yes", "No"],
      },
      { name: "titleNote", label: "Title Note", type: "textarea" },
      { name: "titleOutNote", label: "Title Out Note", type: "textarea" },
      { name: "comments", label: "Comments", type: "textarea" },
      { name: "referralSource", label: "Referral Source", type: "text" },
    ],
  },
];
