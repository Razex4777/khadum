import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Country data with phone codes
const countries = [
  { code: "SA", name: "السعودية", nameEn: "Saudi Arabia", dialCode: "+966", flag: "🇸🇦", format: "966xxxxxxxxx" },
  { code: "DZ", name: "الجزائر", nameEn: "Algeria", dialCode: "+213", flag: "🇩🇿", format: "213xxxxxxxxx" },
  { code: "AE", name: "الإمارات", nameEn: "UAE", dialCode: "+971", flag: "🇦🇪", format: "971xxxxxxxxx" },
  { code: "EG", name: "مصر", nameEn: "Egypt", dialCode: "+20", flag: "🇪🇬", format: "20xxxxxxxxxx" },
  { code: "MA", name: "المغرب", nameEn: "Morocco", dialCode: "+212", flag: "🇲🇦", format: "212xxxxxxxxx" },
  { code: "TN", name: "تونس", nameEn: "Tunisia", dialCode: "+216", flag: "🇹🇳", format: "216xxxxxxxx" },
  { code: "JO", name: "الأردن", nameEn: "Jordan", dialCode: "+962", flag: "🇯🇴", format: "962xxxxxxxxx" },
  { code: "LB", name: "لبنان", nameEn: "Lebanon", dialCode: "+961", flag: "🇱🇧", format: "961xxxxxxxx" },
  { code: "KW", name: "الكويت", nameEn: "Kuwait", dialCode: "+965", flag: "🇰🇼", format: "965xxxxxxxx" },
  { code: "QA", name: "قطر", nameEn: "Qatar", dialCode: "+974", flag: "🇶🇦", format: "974xxxxxxxx" },
  { code: "BH", name: "البحرين", nameEn: "Bahrain", dialCode: "+973", flag: "🇧🇭", format: "973xxxxxxxx" },
  { code: "OM", name: "عمان", nameEn: "Oman", dialCode: "+968", flag: "🇴🇲", format: "968xxxxxxxx" },
  { code: "IQ", name: "العراق", nameEn: "Iraq", dialCode: "+964", flag: "🇮🇶", format: "964xxxxxxxxx" },
  { code: "SY", name: "سوريا", nameEn: "Syria", dialCode: "+963", flag: "🇸🇾", format: "963xxxxxxxxx" },
  { code: "YE", name: "اليمن", nameEn: "Yemen", dialCode: "+967", flag: "🇾🇪", format: "967xxxxxxxxx" },
  { code: "LY", name: "ليبيا", nameEn: "Libya", dialCode: "+218", flag: "🇱🇾", format: "218xxxxxxxxx" },
  { code: "SD", name: "السودان", nameEn: "Sudan", dialCode: "+249", flag: "🇸🇩", format: "249xxxxxxxxx" },
];

export interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  countryCode?: string;
  onCountryChange?: (countryCode: string) => void;
  language?: 'ar' | 'en';
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value = '', onChange, countryCode = 'SA', onCountryChange, language = 'ar', ...props }, ref) => {
    const [selectedCountry, setSelectedCountry] = React.useState(
      countries.find(c => c.code === countryCode) || countries[0]
    );
    const [phoneNumber, setPhoneNumber] = React.useState('');

    // Update selected country when countryCode prop changes
    React.useEffect(() => {
      const country = countries.find(c => c.code === countryCode) || countries[0];
      setSelectedCountry(country);
    }, [countryCode]);

    // Parse initial value
    React.useEffect(() => {
      if (value) {
        // Try to extract country code and phone number from value
        const country = countries.find(c => value.startsWith(c.dialCode.substring(1)));
        if (country) {
          setSelectedCountry(country);
          setPhoneNumber(value.substring(country.dialCode.length - 1));
          onCountryChange?.(country.code);
        } else {
          setPhoneNumber(value);
        }
      }
    }, [value, onCountryChange]);

    const handleCountryChange = (countryCode: string) => {
      const country = countries.find(c => c.code === countryCode);
      if (country) {
        setSelectedCountry(country);
        onCountryChange?.(countryCode);
        
        // Update the full phone number
        const fullNumber = country.dialCode.substring(1) + phoneNumber;
        onChange?.(fullNumber);
      }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newPhone = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
      setPhoneNumber(newPhone);
      
      // Update the full phone number
      const fullNumber = selectedCountry.dialCode.substring(1) + newPhone;
      onChange?.(fullNumber);
    };

    const getPlaceholder = () => {
      const example = selectedCountry.format.substring(selectedCountry.dialCode.length - 1);
      return example.replace(/x/g, '0');
    };

    return (
      <div className="flex gap-2">
        {/* Country Selector */}
        <Select value={selectedCountry.code} onValueChange={handleCountryChange}>
          <SelectTrigger className="w-[140px] bg-slate-700/50 border-slate-600 text-white">
            <SelectValue>
              <div className="flex items-center gap-2">
                <span>{selectedCountry.flag}</span>
                <span className="text-xs">{selectedCountry.dialCode}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 max-h-[200px]">
            {countries.map((country) => (
              <SelectItem 
                key={country.code} 
                value={country.code}
                className="text-white hover:bg-slate-700 cursor-pointer"
              >
                <div className="flex items-center gap-3 w-full">
                  <span>{country.flag}</span>
                  <div className="flex flex-col">
                    <span className="text-sm">{language === 'ar' ? country.name : country.nameEn}</span>
                    <span className="text-xs text-slate-400">{country.dialCode}</span>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Phone Number Input */}
        <Input
          {...props}
          ref={ref}
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={getPlaceholder()}
          className={cn(
            "flex-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-500 focus:ring-green-500/20",
            className
          )}
        />
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput, countries };

// Utility function to format phone number for Algeria
export const formatAlgerianPhone = (phone: string): string => {
  // Remove any non-digits
  const cleaned = phone.replace(/[^0-9]/g, '');
  
  // If starts with 0, replace with 213
  if (cleaned.startsWith('0')) {
    return '213' + cleaned.substring(1);
  }
  
  // If doesn't start with 213, add it
  if (!cleaned.startsWith('213')) {
    return '213' + cleaned;
  }
  
  return cleaned;
};

// Utility function to validate phone number format
export const validatePhoneNumber = (phone: string, countryCode: string): boolean => {
  const country = countries.find(c => c.code === countryCode);
  if (!country) return false;
  
  const expectedPrefix = country.dialCode.substring(1);
  return phone.startsWith(expectedPrefix) && phone.length >= expectedPrefix.length + 7;
};










