import { Toaster } from "react-hot-toast";
import { AppRoutes } from "./router/AppRoutes.jsx";

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: "inherit",
            fontWeight: 600,
            fontSize: "1rem",
            borderRadius: "8px",
            background: "#4A3728",
            color: "#FDF8F3",
          }
        }}
      />

      <AppRoutes />
    </>
  );
}

export default App;