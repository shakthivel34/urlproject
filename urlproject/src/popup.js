import React, { useState } from 'react';

const NameAssignmentModal = ({ onSave, onCancel }) => {
  const [name, setName] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSave = () => {
    onSave(name);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Assign a Name</h2>
        <label htmlFor="nameInput">Name:</label>
        <input
          type="text"
          id="nameInput"
          value={name}
          onChange={handleNameChange}
        />
        <div className="modal-buttons">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default NameAssignmentModal;
