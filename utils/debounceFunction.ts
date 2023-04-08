import React from 'react';
import _ from 'lodash';

interface paramsDebounce {
  fn: React.Dispatch<React.SetStateAction<any>>;
  hidden: boolean;
}

export const debounceFunction = ({ fn, hidden }: paramsDebounce) => {
  _.debounce((hidden) => {
    console.log(fn);
    fn(!hidden);
  }, 300);
};
