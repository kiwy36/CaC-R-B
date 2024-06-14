import { Routes, Route } from 'react-router-dom';
import Root from '../routes/Root';
import Contacto from '../components/Contacto/Contacto';
import Carrito from '../components/Carrito/Carrito';
import Comentarios from '../components/Comentarios/Comentarios';

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Root/>}/>
                <Route path="/Contacto" element={<Contacto/>} />
                <Route path="/Carrito" element={<Carrito/>} />
                <Route path="/Comentarios" element={<Comentarios/>} />
            </Routes>
        </>
    );
}


export default App