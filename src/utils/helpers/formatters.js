export const formatName = (first, last) => [first, last].filter(Boolean).join(" ");
export const toCurrency = value => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value || 0));
export const titleCase = text => text?.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
