import React, { useState, useEffect } from 'react';
import './ImageCarousel.css'; // Asegúrate de tener un archivo de estilos para el carrusel

interface ImageCarouselProps {
  images: string[]; // Array de URLs de imágenes
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cambiar la imagen cada 3 segundos (3000 ms)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Cambia el tiempo aquí si quieres más rápido o más lento

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="carousel-container">
      <img
        src={images[currentIndex]}
        alt={`Imagen ${currentIndex + 1}`}
        className="carousel-image"
      />
      <div className="carousel-indicators">
        {images.map((_, index) => (
          <span
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
