import { Routes, Route } from 'react-router-dom';
import Root from '../routes/Root';
import Contacto from '../components/Contacto/Contacto';
import Carrito from '../components/Carrito/Carrito';

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Root/>}/>
                <Route path="/Contacto" element={<Contacto/>} />
                <Route path="/Carrito" element={<Carrito/>} />
            </Routes>
        </>
    );
}


export default App