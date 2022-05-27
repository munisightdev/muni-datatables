import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { InputAdornment, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import { columnSearchBarStyles as getStyles } from './styles';

export default function TableViewColSearchBar({ setSearchBarText }) {
  const classes = getStyles();
  const [value, setValue] = useState('');

  const onSearchBarUpdate = (e = '') => {
    setSearchBarText(e.target.value, value);
    setValue(e.target.value);
  };

  return (
    <TextField
      autoFocus
      onChange={onSearchBarUpdate}
      value={value}
      className={classes.searchBar}
      InputProps={{
        endAdornment:
          value === '' ? (
            <InputAdornment position="end">
              <SearchIcon className={classes.searchAdornment} aria-label="search bar icon" edge="end" />
            </InputAdornment>
          ) : (
            <InputAdornment position="end" className={classes.searchClearAdornment}>
              <ClearIcon
                className={classes.searchAdornment}
                onClick={() => onSearchBarUpdate()}
                aria-label="clear search bar icon"
                edge="end"
              />
            </InputAdornment>
          ),
      }}
      variant="outlined"
    />
  );
}

TableViewColSearchBar.propTypes = {
  setSearchBarText: PropTypes.func,
};
