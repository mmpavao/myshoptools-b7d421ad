import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { wrapFetch } from './utils/errorReporting';

// Wrap fetch before rendering the app
wrapFetch();

ReactDOM.createRoot(document.getElementById("root")).render(
    <App />
);