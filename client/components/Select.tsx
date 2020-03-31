import React from "react";
import { FormControl, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

type OptionValue = string | null;

type Option = {
  value: OptionValue;
  label: string;
};

type Props = {
  name?: string;
  label: string;
  value: OptionValue;
  onChange: (value: OptionValue) => void;
  options: Option[];
};

const Select = ({ label, value, onChange, options }: Props) => {
  const optionValue = React.useMemo(
    () => options.filter((option) => value === option.value)[0] || null,
    [options, value]
  );
  return (
    <FormControl fullWidth>
      <Autocomplete
        value={optionValue}
        onChange={(_event: object, newValue: Option | null) => {
          onChange(newValue?.value || null);
        }}
        options={options}
        getOptionLabel={(option) => option.label}
        renderInput={(params) => (
          <TextField {...params} variant="standard" fullWidth label={label} />
        )}
      />
    </FormControl>
  );
};

export default Select;
