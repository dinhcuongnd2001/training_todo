import React from 'react';
import _ from 'lodash';

interface paramsDebounce {
  location: string;
  fn: React.Dispatch<React.SetStateAction<boolean>>;
}

export const debounceFunction = ({ location, fn }: paramsDebounce) => {
  console.log('called in debound');
  console.log(fn);
  _.debounce(() => {
    if (location == 'out') {
      fn(true);
    } else {
      fn(false);
    }
  }, 1000);
};
