// src/components/Galery/Galery.jsx
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Firesbase';
import './Galery.css';

const Galery = () => {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      const querySnapshot = await getDocs(collection(db, 'indumentaria'));
      const productosData = querySnapshot.docs.map(doc => doc.data());
      setProductos(productosData);
    };

    fetchProductos();
  }, []);

  const addToCart = (index, cantidadSeleccionada) => {
    const producto = productos[index];
    const cantidad = parseInt(cantidadSeleccionada);

    const existingProductIndex = cart.findIndex(item => item.name === producto.name);

    if (existingProductIndex !== -1) {
      const newCart = [...cart];
      newCart[existingProductIndex].cantidad += cantidad;
      setCart(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
    } else {
      const newProduct = {
        ...producto,
        cantidad
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
          <div key={index} className="image" data-category={producto.category}>
            <img src={producto.img} alt={producto.name} />
            <div className="caption">{producto.name}</div>
            <div className="details">
              <p>Precio: {producto.price} Kiwy Pesos</p>
              <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" id={`cantidadDropdown${index}`} data-bs-toggle="dropdown" aria-expanded="false">
                  Cantidad
                </button>
                <ul className="dropdown-menu" aria-labelledby={`cantidadDropdown${index}`}>
                  {Array.from({ length: 10 }, (_, i) => (
                    <li key={i}>
                      <a className="dropdown-item" onClick={() => document.getElementById(`cantidadSeleccionada${index}`).textContent = i + 1}>{i + 1}</a>
                    </li>
                  ))}
                </ul>
                <p>Seleccionados: <span id={`cantidadSeleccionada${index}`}>0</span></p>
                <button className="btn btn-primary" onClick={() => addToCart(index, document.getElementById(`cantidadSeleccionada${index}`).textContent)}>Agregar al carrito</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Galery;
