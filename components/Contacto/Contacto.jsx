import { useRef } from 'react';
import emailjs from '@emailjs/browser'; // Importamos emailjs-com en lugar de @emailjs/browser
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import './Contacto.css';

const Contacto = () => {
  const form = useRef();// Referencia al formulario
  // Función para enviar el correo electrónico
  const sendEmail = (e) => {
    e.preventDefault();// Evita el comportamiento por defecto del formulario (recargar la página)

    emailjs
      .sendForm('service_indumentaria_msn', 'template_87p2pjx', form.current, {
        publicKey: 'KQwcBmV5effjIrqix',
      })
      .then(
        () => {
          console.log('Se mando el mail!');
          alert('¡Mensaje enviado correctamente!'); // Alerta de éxito al usuario
          form.current.reset(); // Reinicia el formulario después del envío exitoso
        },
        (error) => {
          console.log('FAILED...', error.text);
          alert('Hubo un error al enviar el mensaje. Por favor, inténtalo nuevamente más tarde.'); // Alerta de error al usuario
        },
      );
  };

  return (
    <div>
      <Navbar />
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
            <form id="contactoForm" ref={form} onSubmit={sendEmail}>
              <h2>Formulario de contacto</h2>
              <div className="form-group">
                <label htmlFor="nombre">Nombre y Apellido:</label>
                <input type="text" id="nombre" name="user_name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="user_email" required />
              </div>
              <div className="form-group">
                <label htmlFor="mensaje">Mensaje:</label>
                <textarea id="mensaje" name="message" required></textarea>
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input type="checkbox" id="suscripcion" name="suscripcion" required />
                  Acepto suscribirme
                </label>
                <button type="submit"value="Send" className="btn submit-btn">Enviar</button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contacto;
