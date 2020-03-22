import React from "react";
import styled from "styled-components";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

interface Props {
  id: string;
  value: any;
  onChange: (event: any) => void;
  options: { value: string; name: string }[];
  label: string;
  name: string;
}

const ChipWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const MultiSelect: React.StatelessComponent<Props> = ({
  id,
  value,
  onChange,
  options,
  label,
  name,
}) => {
  const idNameTable = options.reduce<{ [id: string]: string }>(
    (curIdNameTable, { value, name }) =>
      Object.assign({}, curIdNameTable, { [value]: name }),
    {}
  );
  return (
    <FormControl fullWidth>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Select
        multiple
        value={value}
        name={name}
        onChange={onChange}
        input={<Input id={id} />}
        renderValue={(selected: any) => (
          <ChipWrapper>
            {selected.map((id: string) => (
              <Chip key={id} label={idNameTable[id]} />
            ))}
          </ChipWrapper>
        )}
      >
        {options.map(({ value, name }) => (
          <MenuItem key={value} value={value}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
