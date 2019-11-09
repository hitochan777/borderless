import * as React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MaterialUISelect from "@material-ui/core/Select";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; displayString: string }[];
}

const Select: React.FunctionComponent<Props> = ({
  label,
  value,
  onChange,
  options
}) => {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <MaterialUISelect
        value={value}
        onChange={e => {
          onChange(e.target.value as string);
        }}
      >
        {options.map(({ value, displayString }) => (
          <MenuItem key={value} value={value}>
            {displayString}
          </MenuItem>
        ))}
      </MaterialUISelect>
    </FormControl>
  );
};

export default Select;
