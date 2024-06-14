// src/components/Comentarios/Formulario.js
import { useState } from 'react';

import PropTypes from 'prop-types';

const Formulario = ({ onSubmit }) => {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [tema, setTema] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevoComentario = { 
      nombre, 
      edad: parseInt(edad, 10), // Convertir a número
      tema, 
      mensaje 
    };
    onSubmit(nuevoComentario);
    setNombre('');
    setEdad('');
    setTema('');
    setMensaje('');
  };

  return (
    <form  className="formulario"  onSubmit={handleSubmit}>
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
