import React from "react";
import { FormControl, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

type OptionValue = string | number;

type Option<T extends OptionValue> = {
  value: T;
  label: string;
};

type Props<T extends OptionValue> = {
  label: string;
  value: Option<T> | null;
  onChange: (value: Option<T> | null) => void;
  options: Option<T>[];
};

const Select = <T extends OptionValue>({
  label,
  value,
  onChange,
  options
}: Props<T>) => {
  return (
    <FormControl fullWidth>
      <Autocomplete
        value={value}
        onChange={(_event: object, newValue: Option<T> | null) => {
          onChange(newValue);
        }}
        options={options}
        getOptionLabel={option => option.label}
        renderInput={params => (
          <TextField {...params} variant="standard" fullWidth label={label} />
        )}
      />
    </FormControl>
  );
};

export default Select;
