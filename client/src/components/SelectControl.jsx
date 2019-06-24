//@flow
import React from 'react';
import clsx from 'clsx';
import Select from 'react-select';
import Creatable from 'react-select/creatable';

import { emphasize, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles(theme => ({
  input: {
    display: 'flex',
    padding: 0,
    height: 'auto',
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
    textTransform: 'capitalize',
  },
  chip: {
    margin: theme.spacing(0.5, 0.25),
    textTransform: 'capitalize',
  },
  chipFocused: {
    backgroundColor: emphasize(theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700], 0.08),
  },
  noOptionsMessage: {
    padding: theme.spacing(1, 2),
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    bottom: 6,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing(2),
  },
}));

function NoOptionsMessage(props) {
  return (
    <Typography color="textSecondary" className={props.selectProps.classes.noOptionsMessage} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  const {
    children,
    innerProps,
    innerRef,
    selectProps: { classes, TextFieldProps },
  } = props;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: classes.input,
          ref: innerRef,
          children,
          ...innerProps,
        },
      }}
      {...TextFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      ref={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
        textTransform: 'capitalize',
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography color="textSecondary" className={props.selectProps.classes.placeholder} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={clsx(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

function Menu(props) {
  return (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

type SelectedValue = string | Array<string>;
function IntegrationReactSelect({
  placeholder,
  label,
  isMulty,
  options,
  value,
  onSelect,
  isCreatable,
}: {
  placeholder: string,
  label: string,
  isMulty?: boolean,
  isCreatable?: boolean,
  options: Array<string>,
  value: SelectedValue,
  onSelect: SelectedValue => void,
}) {
  const classes = useStyles();

  const selectStyles = {
    input: base => ({
      ...base,
      '& input': {
        font: 'inherit',
      },
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    clearIndicator: () => ({
      cursor: 'pointer',
    }),
  };
  const Control = isCreatable ? Creatable : Select;
  return (
    <NoSsr>
      {isMulty ? (
        <Select
          classes={classes}
          styles={selectStyles}
          inputId="react-select-multiple"
          formatCreateLabel={val => `Add "${val}"`}
          TextFieldProps={{
            label: label,
            InputLabelProps: {
              htmlFor: 'react-select-multiple',
              shrink: true,
            },
          }}
          placeholder={placeholder}
          options={options.map(item => ({
            value: item,
            label: item,
          }))}
          components={components}
          value={
            Array.isArray(value)
              ? value.map(item => ({
                  value: item,
                  label: item,
                }))
              : null
          }
          onChange={selected => onSelect(selected ? selected.map(i => i.label) : [])}
          isMulti
        />
      ) : (
        <Select
          placeholder={placeholder}
          classes={classes}
          styles={selectStyles}
          inputId="react-select-single"
          TextFieldProps={{
            label,
            InputLabelProps: {
              htmlFor: 'react-select-single',
              shrink: true,
            },
          }}
          options={options.map(item => ({
            value: item,
            label: item,
          }))}
          components={components}
          value={{ value, label: value }}
          onChange={selected => onSelect(selected.value)}
        />
      )}
    </NoSsr>
  );
}

export default IntegrationReactSelect;
