import { locales } from '@/i18n';
import { Option, Select } from '@mui/joy';
import { GlobeIcon } from 'lucide-react';
import type { FC } from 'react';

interface Props {
  value: Locale;
  className?: string;
  onChange: (locale: Locale) => void;
}

const LocaleSelect: FC<Props> = (props: Props) => {
  const { onChange, value, className } = props;

  const handleSelectChange = async (locale: Locale) => {
    onChange(locale);
  };

  return (
    <Select
      className={`!min-w-[10rem] w-auto whitespace-nowrap ${className ?? ''}`}
      startDecorator={<GlobeIcon className="h-auto w-4" />}
      value={value}
      onChange={(_, value) => handleSelectChange(value as Locale)}
    >
      {locales.map((locale) => {
        try {
          const languageName = new Intl.DisplayNames([locale], {
            type: 'language',
          }).of(locale);
          if (languageName) {
            return (
              <Option key={locale} value={locale}>
                {languageName.charAt(0).toUpperCase() + languageName.slice(1)}
              </Option>
            );
          }
        } catch (_error) {
          // do nth
        }

        return (
          <Option key={locale} value={locale}>
            {locale}
          </Option>
        );
      })}
    </Select>
  );
};

export default LocaleSelect;
