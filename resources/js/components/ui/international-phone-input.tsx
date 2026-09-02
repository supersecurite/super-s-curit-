import { PhoneInput } from 'react-international-phone';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import 'react-international-phone/style.css';

type InternationalPhoneInputProps = {
    id?: string;
    name?: string;
    value?: string;
    defaultValue?: string | null;
    onChange?: (phone: string) => void;
    defaultCountry?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    inputClassName?: string;
    autoComplete?: string;
    'aria-invalid'?: boolean;
};

/**
 * Saisie téléphone internationale (drapeaux + indicatifs).
 * Soumet la valeur E.164 via un champ caché quand `name` est fourni.
 */
export default function InternationalPhoneInput({
    id,
    name,
    value,
    defaultValue = '',
    onChange,
    defaultCountry = 'gn',
    disabled = false,
    required = false,
    className,
    inputClassName,
    autoComplete = 'tel',
    'aria-invalid': ariaInvalid,
}: InternationalPhoneInputProps) {
    const isControlled = value !== undefined;
    const [internalPhone, setInternalPhone] = useState(defaultValue ?? '');
    const phone = isControlled ? value : internalPhone;

    const handleChange = (nextPhone: string) => {
        if (!isControlled) {
            setInternalPhone(nextPhone);
        }

        onChange?.(nextPhone);
    };

    return (
        <div className={cn('international-phone w-full', className)}>
            {name ? <input type="hidden" name={name} value={phone} /> : null}
            <PhoneInput
                defaultCountry={defaultCountry}
                value={phone}
                onChange={handleChange}
                disabled={disabled}
                required={required}
                preferredCountries={['gn', 'fr', 'sn', 'ci', 'ml', 'us', 'gb']}
                className="w-full"
                inputClassName={cn(inputClassName)}
                inputProps={{
                    id,
                    autoComplete,
                    'aria-invalid': ariaInvalid ? true : undefined,
                }}
            />
        </div>
    );
}
