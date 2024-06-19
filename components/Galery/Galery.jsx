// src/components/Galery/Galery.jsx
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';// Importación de funciones de Firestore para colecciones y documentos
import { db } from '../../Firesbase';// Importación de la instancia de Firestore
import './Galery.css';

const Galery = () => {
  // Estados para el carrito, categoría seleccionada y productos
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [productos, setProductos] = useState([]);

  // Efecto para obtener productos desde Firestore al cargar el componente
  useEffect(() => {
    const fetchProductos = async () => {
      const querySnapshot = await getDocs(collection(db, 'indumentaria')); // Consulta a la colección 'indumentaria' en Firestore
      const productosData = querySnapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));// Mapeo de los documentos a objetos con datos y docId
      setProductos(productosData);// Actualización del estado de productos con los datos obtenidos
    };

    fetchProductos();// Llamada a la función asincrónica para obtener los productos
  }, []);// Dependencia vacía para ejecutar el efecto solo una vez al montar el componente
  // Función para agregar productos al carrito de compras
  const addToCart = (index, cantidadSeleccionada) => {
    const producto = productos[index];
    const cantidad = parseInt(cantidadSeleccionada);
    const existingProductIndex = cart.findIndex(item => item.name === producto.name);

    if (cantidad > producto.stock) {
      alert(`No se puede agregar más de ${producto.stock} unidades de ${producto.name} al carrito.`);
      return;
    }

    if (existingProductIndex !== -1) {
      const currentQuantity = cart[existingProductIndex].cantidad;
      const newQuantity = currentQuantity + cantidad;

      if (newQuantity > producto.stock) {
        alert(`No se puede agregar más de ${producto.stock} unidades de ${producto.name} al carrito. Ha seleccionado ${cantidadSeleccionada} unidades.`);
        return;
      }

      const newCart = [...cart];
      newCart[existingProductIndex].cantidad = newQuantity;
      setCart(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
    } else {
      const newProduct = {
        ...producto,
        cantidad,
        docId: producto.docId
      };
      const newCart = [...cart, newProduct];
      setCart(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
    }

    alert('Producto agregado al carrito');
  };

  const filterImages = (category) => {
    setSelectedCategory(category);
  };
  return (
    <div>
      <section>
        <h1 className="titlePage">All SPORT STORE</h1>
      </section>
      <div className="filter-dropdown">
        <button className="filter-button">Categorías</button>
        <div className="filter-dropdown-content">
          <button onClick={() => filterImages('todas')}>Todas</button>
          <button onClick={() => filterImages('remeras')}>Remeras</button>
          <button onClick={() => filterImages('gorras')}>Gorras</button>
          <button onClick={() => filterImages('pantalones')}>Pantalones</button>
          <button onClick={() => filterImages('medias')}>Medias</button>
          <button onClick={() => filterImages('acce')}>Accesorios</button>
          <button onClick={() => filterImages('zapatillas')}>Zapatillas</button>
          <button onClick={() => filterImages('mochila')}>Mochilas</button>
        </div>
      </div>
      <div className="gallery">
        {productos.filter(producto => selectedCategory === 'todas' || producto.category === selectedCategory).map((producto, index) => (
          producto.stock > 0 && (
            <div key={index} className="image" data-category={producto.category}>
              <img src={producto.img} alt={producto.name} />
              <div className="caption">{producto.name}</div>
              <div className="details">
                <p>Precio: {producto.price} Kiwy Pesos</p>
                <p>Stock disponible: {producto.stock}</p>
                <div>
                  <input
                    type="number"
                    min="1"
                    max={producto.stock}
                    defaultValue="1"
                    id={`cantidadSeleccionada${index}`}
                    className="form-control"
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => addToCart(index, document.getElementById(`cantidadSeleccionada${index}`).value)}
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};


export default Galery;
