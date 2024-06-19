import { useState } from 'react';
import PropTypes from 'prop-types';
import { collection, addDoc } from 'firebase/firestore';  // Importar función addDoc de Firestore
import { db } from '../../Firesbase';  // Importar la instancia de Firestore desde el archivo Firebase

const Formulario = ({ onSubmit }) => {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [tema, setTema] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crear objeto con los datos del comentario
    const nuevoComentario = {
      nombre,
      edad: parseInt(edad, 10), // Convertir edad a número entero
      tema,
      mensaje,
    };

    // Enviar el comentario a Firestore
    try {
      const docRef = await addDoc(collection(db, 'Posteos'), nuevoComentario);  // Agregar documento a la colección 'Posteos'
      console.log('Comentario enviado con ID: ', docRef.id);  // Mostrar ID del documento creado en la consola

      // Llamar a la función onSubmit pasando el nuevo comentario
      onSubmit(nuevoComentario);

      // Limpiar los campos del formulario después de enviar
      setNombre('');
      setEdad('');
      setTema('');
      setMensaje('');
    } catch (error) {
      console.error('Error al enviar el comentario: ', error);
      // Manejo de errores (puedes establecer un estado de error o mostrar un mensaje al usuario)
    }
  };

  return (
    <form className="formulario" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Edad"
        value={edad}
        onChange={(e) => setEdad(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Tema"
        value={tema}
        onChange={(e) => setTema(e.target.value)}
        required
      />
      <textarea
        placeholder="Mensaje"
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        required
      />
      <button type="submit">Enviar</button>
    </form>
  );
};

Formulario.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default Formulario;
