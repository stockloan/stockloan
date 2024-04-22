// form
import { ChangeEvent } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import tw from 'tailwind-styled-components';

import clsxm from '@/lib/clsxm';

// ----------------------------------------------------------------------

type IProps = {
  inputName: string;
  labelName: string;
  inputValue: boolean;
  handleChange?: (value: ChangeEvent<HTMLInputElement>) => void;
};

type Props = IProps;

export default function CheckBox({
  inputName,
  labelName,
  inputValue,
  handleChange,
  ...other
}: Props) {
  const { control } = useFormContext();
  return (
    <Controller
      name={inputName}
      control={control}
      render={({ fieldState: { error } }) => {
        return (
          <div>
            <input
              id={inputName}
              name={inputName}
              style={{ display: 'none' }}
              type='checkbox'
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                if (handleChange) handleChange(event);
              }}
              checked={inputValue}
              {...other}
            />
            <CheckBoxLabel
              htmlFor={inputName}
              className={clsxm(
                {
                  'font-bold': inputName === 'allAgree',
                },
                {
                  'text-[#666]': labelName === '전화' || labelName === 'SMS',
                },
                {
                  "before:bg-[url('/images/consulting/chk_on_ico.png')]":
                    inputValue,
                },
                {
                  "before:bg-[url('/images/consulting/chk_off_ico.png')]":
                    !inputValue,
                }
              )}
            >
              {labelName}
            </CheckBoxLabel>
            {!!error && (
              <div style={{ color: 'red', position: 'absolute', left: '20px' }}>
                {error?.message}
              </div>
            )}
          </div>
        );
      }}
    />
  );
}
// style
const CheckBoxLabel = tw.label`
inline-block font-normal text-[#222] text-[12px] md:text-[15px] leading-[22px] mr-[5px]
before:inline-block before:content-[''] before:w-[22px] before:h-[22px] before:mr-[8px]
before:bg-cover before:align-top
whitespace-nowrap
`;
