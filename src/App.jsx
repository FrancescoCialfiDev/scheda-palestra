import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { SheetDetail } from "./pages/SheetDetail";
import { DefaultLayout } from "./layout/DefaultLayout";

function App() {
  return (
    <>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/sheet/:id" element={<SheetDetail />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
