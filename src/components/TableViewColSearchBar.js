import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { InputAdornment, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import { columnSearchBarStyles as getStyles } from './styles';

export default function TableViewColSearchBar({ handleSearchBarChange, handleClearSearchBar }) {
  const classes = getStyles();
  const [value, setValue] = useState('');

  const onSearchBarUpdate = (e = '') => {
    handleSearchBarChange(e.target.value, value);
    setValue(e.target.value);
  };

  const onClearSearchBar = () => {
    handleClearSearchBar();
    setValue('');
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
                onClick={onClearSearchBar}
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
  handleSearchBarChange: PropTypes.func,
  handleClearSearchBar: PropTypes.func,
};