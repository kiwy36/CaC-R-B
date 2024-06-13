import Footer from "../Footer/Footer"
import Navbar from "../Navbar/Navbar"
import './Contacto.css'
const Contacto = () => {
  const handleSubmit = (event) => {
    event.preventDefault();

    const nombre = event.target.nombre.value.trim();
    const apellido = event.target.apellido.value.trim();
    const email = event.target.email.value.trim();
    const telefono = event.target.telefono.value.trim();
    const mensaje = event.target.mensaje.value.trim();
    const suscripcion = event.target.suscripcion.checked;

    if (!nombre || !apellido || !email || !telefono || !mensaje || !suscripcion) {
      alert('Todos los campos son obligatorios y deben ser completados.');
      return;
    }

    alert('Formulario enviado correctamente.');
    event.target.reset();
  };
  return (
    <div>
        <Navbar/>
        <section className="sectionFormulario container">
          <div className="row">
            <div className="col-md-6">
              <div className="contenido-izquierda">
                <h1>¡Nos encantaría que nos escribas!</h1>
                <p>
                  Utiliza el formulario para ponerte en contacto con nosotros. Estamos aquí para responder tus preguntas y ayudarte en lo que necesites.
                </p>
                <img id="img-contacto" src="https://i.ibb.co/xjKLRY6/img-cont.png" alt="formulario" />
              </div>
            </div>
            <div className="col-md-6">
              <form id="contactoForm" onSubmit={handleSubmit}>
                <h2>Formulario de contacto</h2>
                <div className="form-group">
                  <label htmlFor="nombre">Nombre:</label>
                  <input type="text" id="nombre" name="nombre" required />
                </div>
                <div className="form-group">
                  <label htmlFor="apellido">Apellido:</label>
                  <input type="text" id="apellido" name="apellido" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input type="email" id="email" name="email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="telefono">Teléfono:</label>
                  <input type="tel" id="telefono" name="telefono" required />
                </div>
                <div className="form-group">
                  <label htmlFor="mensaje">Mensaje:</label>
                  <textarea id="mensaje" name="mensaje" required></textarea>
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input type="checkbox" id="suscripcion" name="suscripcion" required />
                    Acepto suscribirme
                  </label>
                  <button type="submit" className="btn submit-btn">Enviar</button>
                </div>
              </form>
            </div>
          </div>
        </section>
        <Footer/>
    </div>
  )
}

export default Contacto
