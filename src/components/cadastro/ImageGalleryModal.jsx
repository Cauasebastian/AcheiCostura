// components/ImageGalleryModal.jsx
import React from 'react';
import './ImageGalleryModal.css';

function ImageGalleryModal({ 
  isOpen, 
  onClose, 
  images, 
  selectedIndex, 
  onSelectImage,
  onRemoveImage 
}) {
  if (!isOpen) return null;

  const handlePrev = (e) => {
    e.stopPropagation();
    const newIndex = (selectedIndex - 1 + images.length) % images.length;
    onSelectImage(newIndex);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    const newIndex = (selectedIndex + 1) % images.length;
    onSelectImage(newIndex);
  };

  const handleRemove = (e, index) => {
    e.stopPropagation();
    if (window.confirm('Remover esta imagem?')) {
      onRemoveImage(index);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Botão fechar */}
        <button className="modal-close" onClick={onClose}>✕</button>

        {/* Imagem principal */}
        <div className="modal-main-image-container">
          <img 
            src={images[selectedIndex]?.preview || images[selectedIndex]} 
            alt="Ampliada" 
            className="modal-main-image"
          />
          
          {/* Navegação */}
          <button className="modal-nav modal-prev" onClick={handlePrev}>‹</button>
          <button className="modal-nav modal-next" onClick={handleNext}>›</button>
        </div>

        {/* Miniaturas */}
        <div className="modal-thumbnails">
          {images.map((image, index) => (
            <div 
              key={index} 
              className={`modal-thumbnail ${index === selectedIndex ? 'active' : ''}`}
              onClick={() => onSelectImage(index)}
            >
              <img 
                src={image.preview || image} 
                alt={`Miniatura ${index + 1}`} 
              />
              <button 
                className="modal-remove-btn"
                onClick={(e) => handleRemove(e, index)}
                title="Remover imagem"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ImageGalleryModal;