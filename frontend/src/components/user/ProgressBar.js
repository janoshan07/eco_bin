import React from 'react';
import '../styles/ProgressBar.css'; // Include the CSS for styling

const ProgressBar = ({ activeStep }) => {
  const steps = [
    { number: 1, label: 'Select Items' },
    { number: 2, label: 'Calculate Fee' },
    { number: 3, label: 'Schedule Pickup' },
    { number: 4, label: 'Finished' }
  ];

  return (
    <div className="progress-container-modern">
      <div className="hub-welcome">
        <h2>Recycle Management Unit</h2>
        <p>Track your recycling transactions, log recyclable garbage items, and review earnings.</p>
      </div>

      <div className="progress-timeline">
        <div className="progress-line-background">
          <div 
            className="progress-line-fill" 
            style={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
        
        {steps.map((step) => {
          const isCompleted = activeStep > step.number;
          const isActive = activeStep === step.number;
          
          return (
            <div 
              key={step.number} 
              className={`progress-step-node ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
            >
              <div className="step-circle-3d">
                {isCompleted ? (
                  <i className="bx bx-check"></i>
                ) : (
                  <span>{step.number}</span>
                )}
                <div className="step-glow"></div>
              </div>
              <span className="step-label">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;

