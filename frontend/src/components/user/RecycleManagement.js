import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RecycleManagement.css';
import ProgressBar from './ProgressBar';

import cardboardImg from '../../photos/cartboard.jpg';
import newspaperImg from '../../photos/newspaper.jpg';
import plasticCansImg from '../../photos/bottle.jpg';
import metalsImg from '../../photos/metal.jpg';

const RecycleManagement = ({ items, setItems }) => {
  const navigate = useNavigate();

  // Handle weight increment
  const handleIncrement = (itemName) => {
    const newWeight = items[itemName].weight + 0.1;
    const newTotal = newWeight * items[itemName].pricePerKg;
    setItems({
      ...items,
      [itemName]: { ...items[itemName], weight: newWeight, total: newTotal }
    });
  };

  // Handle weight decrement
  const handleDecrement = (itemName) => {
    const newWeight = Math.max(0.1, items[itemName].weight - 0.1);
    const newTotal = newWeight * items[itemName].pricePerKg;
    setItems({
      ...items,
      [itemName]: { ...items[itemName], weight: newWeight, total: newTotal }
    });
  };

  // Calculate total weight and total price
  const selectedItems = Object.values(items).filter((item) => item.selected);
  const totalWeight = selectedItems.reduce((acc, item) => acc + item.weight, 0);
  const totalPrice = selectedItems.reduce((acc, item) => acc + item.total, 0);

  // Handle navigation to summary page
  const handleNext = () => {
    navigate('/summary', {
      state: { items, totalWeight, totalPrice }
    });
  };

  return (
    <div className="recycle-workspace">
      <ProgressBar activeStep={1} />
      
      <div className="recycle-card-container">
        <div className="recycle-card-header">
          <h3>Select Items</h3>
          <p className="recycle-card-subtitle">Choose the materials you wish to recycle and adjust their weights.</p>
        </div>

        <div className="materials-grid-selection">
          {Object.entries(items).map(([itemName, itemData]) => (
            <div
              key={itemName}
              className={`item-card ${itemData.selected ? 'selected' : ''}`}
            >
              <img src={getImageSrc(itemName)} alt={itemName} className="item-image" />
              <div className="item-details">
                <h4>{capitalize(itemName)}</h4>
                <p>Rs. {itemData.pricePerKg}/kg</p>
              </div>
              
              {!itemData.selected ? (
                <button
                  className="add-button1"
                  onClick={() =>
                    setItems({ ...items, [itemName]: { ...itemData, selected: true } })
                  }
                >
                  Add Item
                </button>
              ) : (
                <div className="weight-control">
                  <button onClick={() => handleDecrement(itemName)} className="weight-btn">
                    <i className="bx bx-minus"></i>
                  </button>
                  <span className="weight-val">
                    {itemData.weight.toFixed(1)} <span className="weight-unit">kg</span>
                  </span>
                  <button onClick={() => handleIncrement(itemName)} className="weight-btn">
                    <i className="bx bx-plus"></i>
                  </button>
                  
                  <span className='total-for-each'>Rs.{itemData.total.toFixed(2)}</span>
                  
                  <button
                    className="cancel-btn-icon"
                    onClick={() =>
                      setItems({
                        ...items,
                        [itemName]: { ...itemData, selected: false, weight: 1.0, total: itemData.pricePerKg }
                      })
                    }
                    aria-label="Remove item"
                  >
                    <i className="bx bx-trash"></i>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="next-button-container">
          <button className="wizard-back-btn" onClick={() => navigate('/recyclehome')}>
            <i className="bx bx-left-arrow-alt"></i>
            <span>Cancel</span>
          </button>
          <button className="next-button" onClick={handleNext}>
            <span>Next</span>
            <i className="bx bx-right-arrow-alt"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to get image source based on item name
const getImageSrc = (itemName) => {
  switch (itemName) {
    case 'cardboard':
      return cardboardImg;
    case 'newspaper':
      return newspaperImg;
    case 'plasticCans':
      return plasticCansImg;
    case 'metals':
      return metalsImg;
    default:
      return '';
  }
};

// Helper function to capitalize item names
const capitalize = (name) => name.charAt(0).toUpperCase() + name.slice(1);

export default RecycleManagement;
