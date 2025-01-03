import "./App.css";
//import Ecommerce from "./routes/Ecommerce";
import Ruta from "./routes/Ruta";

function App() {
  return (    
    // <div className="App">
    //   <BrowserRouter>
    //     <Routes>
    //       <Route path="/*" element= {<h1 className="not-found">Error 401 Not Found</h1>}/>
    //       <Route path="/fakeapi/*" element= {<Ruta/>}/>
    //       <Route path="/ecommerce/*" element= {<Ecommerce/>}/>
    //       <Route path="/" element= {<Inicio/>} />
    //     </Routes>
    //   </BrowserRouter>

    // </div>
    <>
      {/* <Ecommerce /> */}
      <Ruta />
    </>
  );
}

export default App;
