import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Form, {Text} from './index';

const ClientApp = () => (
  <MuiThemeProvider>
  <div>
  <h1>Personal Library</h1>
  <Form>
    <Text name="title" placeholder="Search for title" label="Title" />
  </Form>
  </div>
  </MuiThemeProvider>
);

ReactDOM.render(
  <ClientApp />,
  document.getElementById('root')
);
