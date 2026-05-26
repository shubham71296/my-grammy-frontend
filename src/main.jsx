import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { Toaster } from "react-hot-toast";
import { NavProgressProvider } from "./context/NavProgressContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <NavProgressProvider>
          <App />
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              style: {
                borderRadius: "12px",
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 500,
              },
            }}
          />
        </NavProgressProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
