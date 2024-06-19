import { useEffect, useState } from 'react';
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import './Carrito.css';
import { db } from '../../Firesbase'; // Importa la instancia de la base de datos Firestore
import { doc, updateDoc, getDoc, collection, addDoc } from 'firebase/firestore'; // Importa funciones Firestore para manejar documentos y colecciones

const Carrito = () => {
  // Estados para el carrito de compras y detalles del formulario
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const [totalPrice, setTotalPrice] = useState(0);
  const [formMessages, setFormMessages] = useState('');
  const [nombreApellido, setNombreApellido] = useState('');
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [mail, setMail] = useState('');
  const [numeroSeguridad, setNumeroSeguridad] = useState('');
  const [direccionEnvio, setDireccionEnvio] = useState('');
  // Efecto para calcular el precio total del carrito cuando cambia el carrito
  useEffect(() => {
    let total = 0;
    cart.forEach(product => {
      total += product.price * product.cantidad;
    });
    setTotalPrice(total);
  }, [cart]);
  // Función para limpiar el carrito localmente y en el estado
  const limpiarCarrito = () => {
    localStorage.removeItem('cart');
    setCart([]);
  };
  // Función asincrónica para actualizar el stock en Firestore
  const actualizarStockEnFirestore = async (productId, cantidadComprada) => {
    try {
      const productRef = doc(db, "indumentaria", productId); // Referencia al documento del producto en Firestore
      const productSnap = await getDoc(productRef); // Obtener el snapshot del documento

      if (productSnap.exists()) {// Verificar si el producto existe en Firestore
        const productData = productSnap.data();// Datos del producto
        const nuevoStock = productData.stock - cantidadComprada;// Calcular nuevo stock

        if (nuevoStock >= 0) {
          await updateDoc(productRef, { stock: nuevoStock });// Actualizar el documento con el nuevo stoc
          console.log(`Stock actualizado para ${productData.name}. Nuevo stock: ${nuevoStock}`);
        } else {
          setFormMessages(`Stock insuficiente para el producto ${productData.name}.`);
          return false;  // Stock insuficiente
        }
      } else {
        setFormMessages(`Producto con ID ${productId} no encontrado.`);
        return false;  // Producto no encontrado
      }
      return true;  // Retornar verdadero si el stock se actualizó correctamente
    } catch (error) {
      console.error("Error al actualizar stock en Firestore:", error);// Manejo de errores
      setFormMessages("Error al actualizar el stock en Firestore.");
      return false;
    }
  };
  // Función asincrónica para crear una orden de compra en Firestore
  const crearOrdenDeCompra = async () => {
    try {
      const fechaActual = new Date();
      const orderId = `${fechaActual.getTime()}-${nombreApellido}`;
      // Agregar un documento a la colección 'ordenDeCompra' en Firestore
      await addDoc(collection(db, "ordenDeCompra"), {
        id: orderId,
        nombreApellido: nombreApellido,
        emailDestinatario: mail,
        direccionEnvio: direccionEnvio,
        total: totalPrice,
        productos: cart.map(product => ({
          nombre: product.name,
          cantidad: product.cantidad,
          precioUnitario: product.price,
          precioTotal: product.price * product.cantidad
        })),
        fecha: fechaActual.toISOString()// Fecha de la orden en formato ISO string
      });

      console.log("Orden de compra creada correctamente.");

    } catch (error) {
      console.error("Error al crear la orden de compra:", error);
      setFormMessages("Error al crear la orden de compra.");
    }
  };
   // Función para manejar la finalización de la compra
  const terminarCompra = async () => {
    if (cart.length === 0) {
      setFormMessages('El carrito está vacío, no se puede realizar la compra.');
      return;
    }
    // Validación del formulario
    const formIsValid =
      nombreApellido.trim().match(/^[a-zA-Z\s]+$/) &&
      numeroTarjeta.trim().match(/^\d{16}$/) &&
      mail.trim() !== '' &&
      numeroSeguridad.trim().match(/^\d{3}$/) &&
      direccionEnvio.trim() !== '';

    if (!formIsValid) {
      setFormMessages('Por favor complete todos los campos correctamente.');
      return;
    }
    // Iterar sobre cada producto en el carrito y actualizar el stock en Firestore
    for (const product of cart) {
      const productId = product.docId;
      const success = await actualizarStockEnFirestore(productId, product.cantidad);
      if (!success) {
        return;  // Termina el proceso si hay un error en la actualización del stock
      }
    }
    // Crear la orden de compra en Firestore
    await crearOrdenDeCompra();
    // Mostrar mensaje de compra exitosa y limpiar el carrito y el formulario
    alert(`Compra terminada, usted gastó ${totalPrice} Kiwy Pesos.`);
    limpiarCarrito();
    setFormMessages('');
    setNombreApellido('');
    setNumeroTarjeta('');
    setMail('');
    setNumeroSeguridad('');
    setDireccionEnvio('');
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
                  <input type="text" className="form-control" id="nombreApellido" value={nombreApellido} onChange={(e) => setNombreApellido(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="numeroTarjeta" className="form-label">Número de la Tarjeta</label>
                  <input type="text" className="form-control" id="numeroTarjeta" value={numeroTarjeta} onChange={(e) => setNumeroTarjeta(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="mail" className="form-label">Email del Destinatario</label>
                  <input type="email" className="form-control" id="mail" value={mail} onChange={(e) => setMail(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="numeroSeguridad" className="form-label">Número de Seguridad</label>
                  <input type="text" className="form-control" id="numeroSeguridad" value={numeroSeguridad} onChange={(e) => setNumeroSeguridad(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="direccionEnvio" className="form-label">Dirección de Envío</label>
                  <input type="text" className="form-control" id="direccionEnvio" value={direccionEnvio} onChange={(e) => setDireccionEnvio(e.target.value)} />
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
