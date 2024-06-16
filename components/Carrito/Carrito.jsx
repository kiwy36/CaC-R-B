// src/components/Carrito/Carrito.jsx
import { useEffect, useState } from 'react';
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import './Carrito.css';
import { db } from './../../Firesbase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';


const Carrito = () => {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const [totalPrice, setTotalPrice] = useState(0);
  const [formMessages, setFormMessages] = useState('');

  useEffect(() => {
    let total = 0;
    cart.forEach(product => {
      total += product.price * product.cantidad;
    });
    setTotalPrice(total);
  }, [cart]);

  const limpiarCarrito = () => {
    localStorage.removeItem('cart');
    setCart([]);
  };

  const actualizarStockEnFirestore = async (productId, cantidadComprada) => {
    try {
      const productRef = doc(db, "indumentaria", productId);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        const productData = productSnap.data();
        const nuevoStock = productData.stock - cantidadComprada;

        if (nuevoStock >= 0) {
          await updateDoc(productRef, { stock: nuevoStock });
          console.log(`Stock actualizado para ${productData.name}. Nuevo stock: ${nuevoStock}`);
        } else {
          setFormMessages(`Stock insuficiente para el producto ${productData.name}.`);
          return false;  // Stock insuficiente
        }
      } else {
        setFormMessages(`Producto con ID ${productId} no encontrado.`);
        return false;  // Producto no encontrado
      }
      return true;  // Stock actualizado
    } catch (error) {
      console.error("Error al actualizar stock en Firestore:", error);
      setFormMessages("Error al actualizar el stock en Firestore.");
      return false;
    }
  };

  const terminarCompra = async () => {
    console.log("Iniciando la compra");
    if (cart.length === 0) {
      setFormMessages('El carrito está vacío, no se puede realizar la compra.');
      console.log("Carrito vacío");
      return;
    }

    const nombreApellido = document.getElementById('nombreApellido').value.trim();
    const numeroTarjeta = document.getElementById('numeroTarjeta').value.trim();
    const mail = document.getElementById('mail').value.trim();
    const numeroSeguridad = document.getElementById('numeroSeguridad').value.trim();
    const direccionEnvio = document.getElementById('direccionEnvio').value.trim();
    let formIsValid = true;
    let errorMessage = '';

    if (!nombreApellido.match(/^[a-zA-Z\s]+$/)) {
      errorMessage += 'Nombre y Apellido debe contener solo letras y espacios.\n';
      formIsValid = false;
    }

    if (!numeroTarjeta.match(/^\d{16}$/)) {
      errorMessage += 'Número de la Tarjeta debe contener 16 dígitos.\n';
      formIsValid = false;
    }

    if (!mail) {
      errorMessage += 'Email del Destinatario es obligatorio.\n';
      formIsValid = false;
    }

    if (!numeroSeguridad.match(/^\d{3}$/)) {
      errorMessage += 'Número de Seguridad debe contener 3 dígitos.\n';
      formIsValid = false;
    }

    if (!direccionEnvio) {
      errorMessage += 'Dirección de Envío es obligatoria.\n';
      formIsValid = false;
    }

    if (!formIsValid) {
      setFormMessages(errorMessage);
      console.log("Formulario no válido");
      return;
    }

    for (const product of cart) {
      // Asegúrate de tener el campo correcto para el ID del documento en Firestore
      const productId = product.docId; // Asumiendo que tu campo es docId
      const success = await actualizarStockEnFirestore(productId, product.cantidad);
      if (!success) {
        console.log(`Error al actualizar el stock del producto ${productId}`);
        return;  // Termina el proceso si hay un error en la actualización del stock
      }
    }

    alert(`Compra terminada, usted gastó ${totalPrice} Kiwy Pesos.`);
    limpiarCarrito();
    setFormMessages('');
    console.log("Compra terminada con éxito");
  };

  return (
    <>
      <Navbar />
      <section>
        <div>
          <h1 id="title-carrito">Carrito de Compras</h1>
          <div className="container">
            <div id="carrito-items">
              <div id="cart-items">
                {cart.map((product, index) => (
                  <div key={index} className="cart-item">
                    <img src={product.img} alt={product.name} />
                    <div className="details">
                      <p>Nombre: {product.name}</p>
                      <p>Cantidad: {product.cantidad}</p>
                      <p>Precio: {product.price * product.cantidad} Kiwy Pesos</p>
                    </div>
                  </div>
                ))}
              </div>
              <div id="total-price">Precio Total: {totalPrice} Kiwy Pesos</div>
              <button id="limpiar-carrito" className="btn btn-danger mt-3" onClick={limpiarCarrito}>Limpiar Carrito</button>
            </div>
            <div id="formulario-items">
              <form id="checkout-form">
                <div className="mb-3">
                  <label htmlFor="nombreApellido" className="form-label">Nombre y Apellido</label>
                  <input type="text" className="form-control" id="nombreApellido" />
                </div>
                <div className="mb-3">
                  <label htmlFor="numeroTarjeta" className="form-label">Número de la Tarjeta</label>
                  <input type="text" className="form-control" id="numeroTarjeta" />
                </div>
                <div className="mb-3">
                  <label htmlFor="mail" className="form-label">Email del Destinatario</label>
                  <input type="email" className="form-control" id="mail" />
                </div>
                <div className="mb-3">
                  <label htmlFor="numeroSeguridad" className="form-label">Número de Seguridad</label>
                  <input type="text" className="form-control" id="numeroSeguridad" />
                </div>
                <div className="mb-3">
                  <label htmlFor="direccionEnvio" className="form-label">Dirección de Envío</label>
                  <input type="text" className="form-control" id="direccionEnvio" />
                </div>
                <button type="button" id="terminar-compra" className="btn btn-success" onClick={terminarCompra}>Terminar Compra</button>
              </form>
              <div id="form-messages">{formMessages}</div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};


export default Carrito;
