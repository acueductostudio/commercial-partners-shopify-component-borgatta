import React, { useState, useEffect } from 'react';
import { AutoComplete } from 'antd';
import { SETTINGS } from '../../config/settings.js';
import Loader from '../common/Loader.js';
import Alert from '../common/Alert.js';

/**
 * Componente AddressSelector para selección de direcciones
 * Basado en el componente Sedes original
 * @param {object} props - Propiedades del componente
 * @returns {JSX.Element} Componente AddressSelector
 */
const AddressSelector = ({
  addresses = [],
  loading = false,
  error = null,
  onAddressSelect,
  selectedAddress = null,
  className = '',
  title = 'Seleccionar dirección'
}) => {
  // Log para debugging
  console.log('🏠 AddressSelector render - addresses:', addresses);
  console.log('🏠 AddressSelector render - selectedAddress:', selectedAddress);

  return (
    <div className={`cardComponent ${className}`}>
      <h3 className="title-card_component">{title}</h3>
      
      {/* Estado de carga */}
      {loading && (
        <Loader text="Cargando direcciones..." />
      )}

      {/* Error */}
      {error && (
        <Alert
          type="error"
          message={error}
        />
      )}

      {/* Lista de direcciones */}
      {!loading && !error && (
        <div>
          {addresses.length > 0 ? (
            <div className="address-list">
              <ul>
                {addresses.map((address, index) => (
                  <AddressItem
                    key={index}
                    address={address}
                    selectedAddress={selectedAddress}
                    onAddressSelect={onAddressSelect}
                  />
                ))}
              </ul>
            </div>
          ) : (
            <p className="nonInfo">
              {SETTINGS.UI.DEFAULT_MESSAGES.NO_ADDRESSES}
            </p>
          )}
        </div>
      )}

      {/* Dirección seleccionada */}
      {selectedAddress && (
        <div style={{ marginTop: '15px' }}>
          <Alert
            type="success"
            title="Dirección seleccionada"
            message={selectedAddress}
          />
        </div>
      )}
    </div>
  );
};

/**
 * Componente AddressItem para cada dirección individual
 * Basado en el componente Sedes original
 * @param {object} props - Propiedades del componente
 * @returns {JSX.Element} Componente AddressItem
 */
const AddressItem = ({
  address,
  selectedAddress = null,
  onAddressSelect
}) => {
  const isSelected = selectedAddress === address;

  const handleClick = (event) => {
    console.log('🏠 AddressItem.handleClick:', event.target.value);
    if (onAddressSelect) {
      onAddressSelect(event.target.value);
    }
  };

  return (
    <li>
      <label htmlFor={address} className="WrappSedeSelect">
        <input
          type="radio"
          id={address}
          value={address}
          name="sedes"
          checked={isSelected}
          onChange={handleClick}
        />
        <span className="TextSelect">
          {address}
        </span>
      </label>
    </li>
  );
};

/**
 * Componente AddressSelector para asesores (con selector de depósito)
 * @param {object} props - Propiedades del componente
 * @returns {JSX.Element} Componente AdvisorAddressSelector
 */
export const AdvisorAddressSelector = ({
  deposits = [],
  addresses = [],
  loading = false,
  error = null,
  onDepositSelect,
  onAddressSelect,
  selectedDeposit = null,
  selectedAddress = null,
  className = ''
}) => {
  const [inputValue, setInputValue] = useState(selectedDeposit || '');

  // Sincronizar estado local con prop
  useEffect(() => {
    setInputValue(selectedDeposit || '');
  }, [selectedDeposit]);

  // Log para debugging
  console.log('🏢 AdvisorAddressSelector render - deposits:', deposits);
  console.log('🏢 AdvisorAddressSelector render - deposits.length:', deposits.length);

  // Manejar cambio de texto (escribir)
  const handleInputChange = (value) => {
    console.log('🏢 AdvisorAddressSelector.handleInputChange:', value);
    setInputValue(value);
  };

  // Manejar selección de depósito
  const handleDepositSelect = (selectedValue) => {
    console.log('🏢 AdvisorAddressSelector.handleDepositSelect:', selectedValue);
    setInputValue(selectedValue);
    if (onDepositSelect) {
      onDepositSelect(selectedValue);
    }
  };

  return (
    <div className={`cardComponent ${className}`}>
      {/* Selector de depósito - Input simple */}
      <div className="Component-input">
        
        <h3 className="title-card_component">ID de cliente</h3>
        <AutoComplete
          className="inputSearch"
          options={deposits}
          placeholder="Introduce ID"
          filterOption={true}
          value={inputValue}
          onChange={handleInputChange}
          onSelect={handleDepositSelect}
          allowClear
        />
        <div className="divider"></div>
      </div>

      {/* Lista de direcciones */}
      <AddressSelector
        addresses={addresses}
        loading={loading}
        error={error}
        onAddressSelect={onAddressSelect}
        selectedAddress={selectedAddress}
        title="Dirección de depósito"
      />
    </div>
  );
};

/**
 * Componente DepositSelector para selección de depósitos
 * @param {object} props - Propiedades del componente
 * @returns {JSX.Element} Componente DepositSelector
 */
const DepositSelector = ({
  deposits = [],
  onSelect,
  selectedDeposit = null
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Log para debugging
  console.log('🏢 DepositSelector render - deposits:', deposits);
  console.log('🏢 DepositSelector render - deposits.length:', deposits.length);

  // Filtrar depósitos según búsqueda
  const filteredDeposits = deposits.filter(deposit => {
    const label = deposit.label || '';
    const search = searchValue || '';
    return label.toLowerCase().includes(search.toLowerCase());
  });
  
  console.log('🏢 DepositSelector - filteredDeposits:', filteredDeposits);

  // Manejar selección
  const handleSelect = (deposit) => {
    onSelect(deposit.id);
    setSearchValue(deposit.label);
    setIsOpen(false);
  };

  return (
    <div className="wrapp-all-component-select">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="wrapp-select"
      >
        {selectedDeposit || 'Selecciona un depósito'}
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
          {filteredDeposits.map((deposit, index) => (
            <li>
              <label htmlFor={deposit.label} className='WrappSedeSelect'>
                <input
                  type="radio"
                  id={deposit.label}
                  value={deposit.label}
                  name="sedes"
                  checked={selectedDeposit === deposit.id}
                  onChange={() => handleSelect(deposit)}
                  style={{ display: 'none' }}
                />
                <span
                  className='TextSelect'
                  style={{
                    backgroundColor: selectedDeposit === deposit.id ? '#F5F5F5' : 'transparent',
                    display: 'block',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {deposit.label}
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressSelector;
