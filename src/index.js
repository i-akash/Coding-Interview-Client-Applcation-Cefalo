import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from './App';
import * as serviceWorker from "./serviceWorker";

// css
import "semantic-ui-css/semantic.min.css";

//redux
import { createStore } from "redux";
import { Provider } from "react-redux";
import RootReducer from "./redux/reducers/RootReducer";
import { devToolsEnhancer } from "redux-devtools-extension";

const store = createStore(RootReducer, devToolsEnhancer());

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
