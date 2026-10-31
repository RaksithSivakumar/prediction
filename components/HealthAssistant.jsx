import React from 'react';

const HealthAssistant = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🧬 Symptom Checker</h2>
      <iframe
        src="https://tasmaymalla-disease-prediction.hf.space" 
        width="100%"
        height="600px"
        style={styles.iframe}
        title="Disease Prediction Space"
        allow="clipboard-write"
      ></iframe>
    </div>
  );
};

const styles = {
  container: {
    padding: '1rem',
    maxWidth: '1000px',
    margin: 'auto',
  },
  heading: {
    textAlign: 'center',
    fontSize: '24px',
    marginBottom: '1rem',
  },
  iframe: {
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
  },
};

export default HealthAssistant; 