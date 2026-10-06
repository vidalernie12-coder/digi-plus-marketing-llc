// Date formatting
export const formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

export const getFormattedDate = (date: Date): string => (date ? formatter.format(date) : '');

// String trimming utility
export const trim = (str = '', ch?: string) => {
  let start = 0;
  let end = str.length || 0;
  while (start < end && str[start] === ch) ++start;
  while (end > start && str[end - 1] === ch) --end;
  return start > 0 || end < str.length ? str.substring(start, end) : str;
};

// Format numbers in K, M, B format
export const toUiAmount = (amount: number) => {
  if (!amount) return 0;
  
  let value: string;
  
  if (amount >= 1000000000) {
    const formattedNumber = (amount / 1000000000).toFixed(1);
    value = Number(formattedNumber) === parseInt(formattedNumber) 
      ? parseInt(formattedNumber) + 'B' 
      : formattedNumber + 'B';
  } else if (amount >= 1000000) {
    const formattedNumber = (amount / 1000000).toFixed(1);
    value = Number(formattedNumber) === parseInt(formattedNumber) 
      ? parseInt(formattedNumber) + 'M' 
      : formattedNumber + 'M';
  } else if (amount >= 1000) {
    const formattedNumber = (amount / 1000).toFixed(1);
    value = Number(formattedNumber) === parseInt(formattedNumber) 
      ? parseInt(formattedNumber) + 'K' 
      : formattedNumber + 'K';
  } else {
    value = Number(amount).toFixed(0);
  }
  
  return value;
};
