import { useState } from 'react';
import '../EditModal.css';

function EditModal({ item, onClose, onSave }) {
    const [editedItem, setEditedItem] = useState(item);

    const handleChange = (field, value) => {
        setEditedItem(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(editedItem);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Editar Registro</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Cantidad Pedida:</label>
                        <input
                            type="number"
                            value={editedItem.cantidadPedida}
                            onChange={(e) => handleChange('cantidadPedida', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Cantidad Verificada:</label>
                        <input
                            type="number"
                            value={editedItem.cantidadVerificada}
                            onChange={(e) => handleChange('cantidadVerificada', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Existencia:</label>
                        <input
                            type="number"
                            value={editedItem.existencia}
                            onChange={(e) => handleChange('existencia', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Localización:</label>
                        <input
                            type="text"
                            value={editedItem.localizacion}
                            onChange={(e) => handleChange('localizacion', e.target.value)}
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="submit" className="save-button">Guardar</button>
                        <button type="button" onClick={onClose} className="cancel-button">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditModal;