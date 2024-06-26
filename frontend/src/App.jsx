import { useContext } from "react";
import AudioVideoScreen from "./components/AudioVideoScreen";
import CodeEditor from "./components/CodeEditor";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Notepad from "./components/Notepad";
import Homepage from "./pages/Homepage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DataContext } from "./context/DataProvider";

function App() {
  const { user } = useContext(DataContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={user ? <Homepage /> : <Navigate to="/login" />}
        />
        <Route
          path="/room"
          element={user ? <AudioVideoScreen /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
