import { useState } from "react";
import Formulario from "./Formulario";
import Tarjetas from "./Tarjetas";
import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"
import Posteos from "./Posteos";
import './Comentarios.css'
const Comentarios = () => {
    const [comentarios, setComentarios] = useState(Posteos);
  
    const agregarComentario = (nuevoComentario) => {
      const nuevosComentarios = [...comentarios, nuevoComentario];
      setComentarios(nuevosComentarios);
      // Aquí actualizaríamos el archivo Posteos.js
      // Pero para la simplicidad, solo actualizamos el estado local.
    };
  
    return (
      <section>
        <Navbar />
        <section id="comentarios">
        <h2>Comentarios</h2>
        <div className="comentarios-container">
          <Formulario onSubmit={agregarComentario} />
          <Tarjetas comentarios={comentarios} />
        </div>
        </section>
        <Footer />
      </section>
    );
  };

export default Comentarios