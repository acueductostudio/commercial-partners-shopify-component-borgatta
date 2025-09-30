import React, { useState, useEffect } from 'react';
import { useComments } from '../../hooks/useQuotation.js';
import { SETTINGS } from '../../config/settings.js';
import Swal from 'sweetalert2';

/**
 * Componente CommentsBox para manejo de comentarios
 * Basado en Comentario2.jsx del proyecto original
 * @param {object} props - Propiedades del componente
 * @returns {JSX.Element} Componente CommentsBox
 */
const CommentsBox = ({
  comments = [],
  onCommentsChange,
  skuOptions = ['Todo el pedido'],
  className = ''
}) => {
  const {
    comments: currentComments,
    editingIndex,
    addComment,
    editComment,
    deleteComment,
    cancelEdit,
    getComment
  } = useComments(comments);

  // Estados locales
  const [isOpenComponent, setIsOpenComponent] = useState(false);
  const [isOpenSelectTextArea, setIsOpenSelectTextArea] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [nuevoComentario, setNuevoComentario] = useState(false);
  const [selectedSKU, setSelectedSKU] = useState('Todo el pedido');
  const [comment, setComment] = useState('');
  const [disabledSKUs, setDisabledSKUs] = useState([]);

  // Opciones finales (incluyendo SKUs de productos)
  const [finalOptions, setFinalOptions] = useState(['Todo el pedido']);

  // Actualizar opciones cuando cambien los SKUs
  useEffect(() => {
    if (skuOptions && skuOptions.length > 0) {
      setFinalOptions(['Todo el pedido', ...skuOptions]);
    } else {
      setFinalOptions(['Todo el pedido']);
    }
  }, [skuOptions]);

  // Notificar cambios a componente padre
  useEffect(() => {
    if (onCommentsChange) {
      onCommentsChange(currentComments);
    }
  }, [currentComments]);

  // Manejar selección de SKU
  const handleSKUSelect = (option) => {
    setSelectedSKU(option);
    setIsOpen(false);
  };

  // Manejar cambio de comentario
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  // Guardar comentario
  const handleSave = () => {
    if (selectedSKU && comment.trim()) {
      const newComment = {
        sku: selectedSKU,
        comment: comment.trim()
      };

      addComment(newComment);
      
      // Limpiar formulario
      setSelectedSKU('Todo el pedido');
      setComment('');
      
      // Actualizar SKUs deshabilitados
      if (editingIndex === null) {
        setDisabledSKUs(prev => [...prev, selectedSKU]);
      }
      
      // Cerrar formulario
      setIsOpenSelectTextArea(false);
      setNuevoComentario(true);
    } else {
      alert('Por favor selecciona un SKU y agrega un comentario.');
    }
  };

  // Editar comentario
  const handleEdit = (index) => {
    const commentToEdit = getComment(index);
    if (commentToEdit) {
      setSelectedSKU(commentToEdit.sku);
      setComment(commentToEdit.comment);
      editComment(index);
      setIsOpenSelectTextArea(true);
      setNuevoComentario(false);
    }
  };

  // Confirmar eliminación
  const confirmDelete = () => {
    Swal.fire(SETTINGS.SWEET_ALERT.DELETE_CONFIRM).then((result) => {
      if (result.isConfirmed) {
        handleDelete();
      }
    });
  };

  // Eliminar comentario
  const handleDelete = () => {
    const commentToDelete = getComment(editingIndex);
    
    deleteComment(editingIndex);
    
    // Rehabilitar SKU eliminado
    if (commentToDelete) {
      setDisabledSKUs(prev => prev.filter(sku => sku !== commentToDelete.sku));
    }
    
    // Limpiar formulario
    setSelectedSKU('Todo el pedido');
    setComment('');
    
    // Cerrar formulario
    setIsOpenSelectTextArea(false);
    setNuevoComentario(true);
  };

  // Agregar nuevo comentario
  const handleNewComment = () => {
    setIsOpenSelectTextArea(true);
    setNuevoComentario(false);
    cancelEdit();
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setSelectedSKU('Todo el pedido');
    setComment('');
    cancelEdit();
    setIsOpenSelectTextArea(false);
    setNuevoComentario(true);
  };

  return (
    <div className={`cardComponent-coments ${className}`}>
      {/* Header */}
      <div 
        className="wrapp-tile-narrow" 
        onClick={() => setIsOpenComponent(!isOpenComponent)}
      >
        <h3 className="title-card_component">Agregar comentarios</h3>
        <div
          style={{
            transform: isOpenComponent ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
            marginLeft: '10px',
            marginBottom: '0px',
          }}
        >
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L7 7L13 1" stroke="#9E9E9E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Contenido */}
      {isOpenComponent && (
        <div>
          {/* Lista de comentarios existentes */}
          <div style={{ marginBottom: '20px' }}>
            {currentComments.length > 0 ? (
              currentComments.map((entry, index) => (
                <div key={index} className="cardComentAdded">
                  <p style={{ flex: 1 }}>
                    <span>{entry.sku}</span>: {entry.comment}
                  </p>
                  <div>
                    <button
                      onClick={() => handleEdit(index)}
                      style={{
                        padding: '0',
                        marginLeft: '10px',
                        cursor: 'pointer',
                        border: 'none',
                        background: 'transparent',
                        marginRight: '5px',
                      }}
                    >
                      <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.5 3H2.66667C2.22464 3 1.80072 3.17559 1.48816 3.48816C1.17559 3.80072 1 4.22464 1 4.66667V16.3333C1 16.7754 1.17559 17.1993 1.48816 17.5118C1.80072 17.8244 2.22464 18 2.66667 18H14.3333C14.7754 18 15.1993 17.8244 15.5118 17.5118C15.8244 17.1993 16 16.7754 16 16.3333V10.5" stroke="#1C83E3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14.9227 1.52798C15.2607 1.18992 15.7193 1 16.1973 1C16.6754 1 17.134 1.18992 17.472 1.52798C17.8101 1.86605 18 2.32456 18 2.80265C18 3.28075 17.8101 3.73926 17.472 4.07732L9.39912 12.1502L6 13L6.84978 9.60088L14.9227 1.52798Z" stroke="#1C83E3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="nonInfo"></p>
            )}
          </div>

          {/* Formulario de comentario */}
          {isOpenSelectTextArea && (
            <div className="wrapp-select-textArea">
              <div className="wrapp-select-sku">
                <p className="title-card_component">El comentario refiere a</p>
                <p className="nonInfo">Selecciona un SKU para vincularlo.</p>
              </div>

              {/* Selector de SKU */}
              <div className="wrapp-all-component-select">
                <div
                  onClick={() => setIsOpen(!isOpen)}
                  className="wrapp-select"
                >
                  {selectedSKU || 'Selecciona una opción'}
                  <div
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                      marginLeft: '10px',
                      marginBottom: '0px',
                    }}
                  >
                    <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L7 7L13 1" stroke="#9E9E9E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>

                {isOpen && (
                  <ul className="options-select">
                    {finalOptions.map((option, index) => (
                      <li
                        key={index}
                        onClick={() => handleSKUSelect(option)}
                        style={{
                          backgroundColor: selectedSKU === option ? '#F5F5F5' : 'transparent',
                          opacity: disabledSKUs.includes(option) && editingIndex === null ? 0.5 : 1,
                          cursor: disabledSKUs.includes(option) && editingIndex === null ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Textarea para comentario */}
              <textarea
                value={comment}
                onChange={handleCommentChange}
                placeholder="Escribe tu comentario"
                className="text-area-input"
                rows="4"
              />

              {/* Botones */}
              <div className="wrapp-btns-comentas">
                <button onClick={handleSave} className="guardarComentsBtn">
                  {editingIndex !== null ? 'Guardar cambios' : 'Guardar'}
                </button>
                
                {editingIndex !== null && (
                  <button
                    onClick={confirmDelete}
                    style={{
                      padding: '8px 16px',
                      cursor: 'pointer',
                      backgroundColor: 'transparent',
                      color: '#1C83E3',
                      border: 'none',
                      borderRadius: '4px',
                      fontFamily: 'Neue Montreal',
                      fontSize: '16px',
                      fontWeight: '500',
                    }}
                  >
                    Eliminar
                  </button>
                )}

                {editingIndex !== null && (
                  <button
                    onClick={handleCancelEdit}
                    style={{
                      padding: '8px 16px',
                      cursor: 'pointer',
                      backgroundColor: 'transparent',
                      color: '#6b7280',
                      border: 'none',
                      borderRadius: '4px',
                      fontFamily: 'Neue Montreal',
                      fontSize: '16px',
                      fontWeight: '500',
                    }}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Botón para agregar nuevo comentario */}
          {nuevoComentario && (
            <button
              onClick={handleNewComment}
              style={{
                padding: '8px 16px',
                cursor: 'pointer',
                backgroundColor: 'transparent',
                color: '#1C83E3',
                border: 'none',
                borderRadius: '4px',
                fontFamily: 'Neue Montreal',
                fontSize: '16px',
                fontWeight: '500',
              }}
            >
              Agregar comentario
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentsBox;
