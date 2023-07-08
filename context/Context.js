import React from 'react';

const Context = React.createContext(null);

export const withContext = Component => props =>
  (
    <Context.Consumer>
      {value => <Component {...props} value={value} />}
    </Context.Consumer>
  );

export default Context;
