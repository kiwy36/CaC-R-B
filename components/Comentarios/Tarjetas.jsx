import PropTypes from 'prop-types';
const Tarjetas = ({ comentarios }) => {
  return (
    <div className="tarjetas">
      {comentarios.map((comentario, index) => (
        <div key={index} className="card">
          <h3>{comentario.nombre}</h3>
          <p>Edad: {comentario.edad}</p>
          <p>Tema: {comentario.tema}</p>
          <p>{comentario.mensaje}</p>
        </div>
      ))}
    </div>
  );
};
Tarjetas.propTypes = {
    comentarios: PropTypes.arrayOf(
      PropTypes.shape({
        nombre: PropTypes.string.isRequired,
        edad: PropTypes.number.isRequired,
        tema: PropTypes.string.isRequired,
        mensaje: PropTypes.string.isRequired,
      })
    ).isRequired,
  };
export default Tarjetas;
