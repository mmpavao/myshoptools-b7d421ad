export const countries = [
  { code: 'BR', flag: '🇧🇷', ddi: '+55' },
  { code: 'US', flag: '🇺🇸', ddi: '+1' },
  { code: 'CN', flag: '🇨🇳', ddi: '+86' },
  { code: 'MX', flag: '🇲🇽', ddi: '+52' },
  { code: 'CO', flag: '🇨🇴', ddi: '+57' },
  { code: 'CA', flag: '🇨🇦', ddi: '+1' },
  { code: 'AU', flag: '🇦🇺', ddi: '+61' },
  { code: 'ID', flag: '🇮🇩', ddi: '+62' },
];

export const formatPhoneNumber = (phoneNumber, country) => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  if (country.code === 'US') {
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `${country.ddi} (${match[1]}) ${match[2]}-${match[3]}`;
    }
  }
  return `${country.ddi} ${cleaned}`;
};

export const getPhoneInputValue = (phone, country) => {
  if (country.code === 'US') {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      const parts = [match[1], match[2], match[3]].filter(Boolean);
      if (parts.length === 0) return '';
      return `(${parts[0]})${parts[1] ? ' ' + parts[1] : ''}${parts[2] ? '-' + parts[2] : ''}`;
    }
  }
  return phone;
};