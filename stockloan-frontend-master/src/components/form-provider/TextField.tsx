// form
import { Controller, useFormContext } from 'react-hook-form';
import tw from 'tailwind-styled-components';

// ----------------------------------------------------------------------

type IProps = {
  inputName: string;
  labelName: string;
  placeHolder?: string;
};

type Props = IProps;

export default function TextField({
  inputName,
  labelName,
  placeHolder,
  ...other
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={inputName}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextFieldContainer>
          <TextFieldLabel htmlFor={inputName}>{labelName}</TextFieldLabel>
          <TextFieldInput {...field} {...other} placeholder={placeHolder} />
          {!!error && <div style={{ color: 'red' }}>{error?.message}</div>}
        </TextFieldContainer>
      )}
    />
  );
}

// style
const TextFieldContainer = tw.div`
flex flex-col mt-[30px]
`;
const TextFieldLabel = tw.label`
block pb-[9px] text-[#26499D]
`;
const TextFieldInput = tw.input`
w-full h-[44px] px-[15px] bg-white border border-[#e8e8e8] rounded placeholder:text-[13px] placeholder:text-[#BBBBBB]
`;
