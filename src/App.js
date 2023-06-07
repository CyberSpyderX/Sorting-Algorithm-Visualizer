import React from 'react';
import store from './redux/store';
import { Provider } from 'react-redux';
import './App.css';
import SortingVisualizer from './SortingVisualizer';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <SortingVisualizer />
      </div>
    </Provider>
  );
}

export default App;