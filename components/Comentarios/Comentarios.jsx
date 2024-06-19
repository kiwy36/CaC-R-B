import { useState, useEffect } from "react";
import Formulario from "./Formulario";
import Tarjetas from "./Tarjetas";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../Firesbase';
import './Comentarios.css';

const Comentarios = () => {
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Posteos'));
        const comentariosData = querySnapshot.docs.map(doc => doc.data());
        setComentarios(comentariosData);
      } catch (error) {
        console.error('Error al obtener los comentarios:', error);
      }
    };

    fetchComentarios();
  }, []);

  const agregarComentario = async (nuevoComentario) => {
    try {
      // Agregar el nuevo comentario a Firestore
      await addDoc(collection(db, 'Posteos'), nuevoComentario);

      // Actualizar el estado localmente
      setComentarios([...comentarios, nuevoComentario]);
    } catch (error) {
      console.error('Error al agregar el comentario:', error);
    }
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

export default Comentarios;
