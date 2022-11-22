import React, { useState, useCallback, useMemo, memo } from 'react';
import { COLUMNS, NEW_USER_ID } from '../constants';

const TableRow = memo((props) => {
  const {
    isActionsDisabled,
    isEditing,
    onUserDelete,
    onUserEditCancel,
    onUserEditStart,
    onUserEditSubmit,
    userData: initialData,
    userId
  } = props;

  const isNewUser = useMemo(() => userId === NEW_USER_ID, [userId]);

  const [dataValues, setDataValues] = useState(
    isNewUser
      ? COLUMNS.reduce((acc, column) => {
          acc[column.accessor] = "";
          return acc;
        }, {})
      : initialData
  );
  
  const handleDataValueChange = useCallback((evt) => {
    const { name, value } = evt.target;
    setDataValues((prevValues) => ({ ...prevValues, [name]: value }));
  }, []);

  const handleCancel = useCallback(() => {
    if (!isNewUser) {
      setDataValues(initialData);
    }
    onUserEditCancel(userId, isNewUser);
  }, [initialData, isNewUser, onUserEditCancel, userId]);

  const handleDelete = useCallback(() => {
    onUserDelete(userId);
  }, [onUserDelete, userId]);

  const handleEditStart = useCallback(() => {
    onUserEditStart(userId);
  }, [onUserEditStart, userId]);

  const handleSave = useCallback(() => {
    onUserEditSubmit(userId, dataValues, isNewUser);
  }, [dataValues, isNewUser, onUserEditSubmit, userId]);

  return (
    <tr>
      {COLUMNS.map(({ accessor, caption, inputType }) => (
        <td key={accessor}>
          <input
            disabled={!isEditing}
            name={accessor}
            onChange={handleDataValueChange}
            placeholder={caption}
            type={inputType}
            value={dataValues[accessor]}
          />
        </td>
      ))}
      <td className="row-buttons">
        {isEditing ? (
          <>
            <button disabled={isActionsDisabled} onClick={handleSave}>
              Save
            </button>
            <button disabled={isActionsDisabled} onClick={handleCancel}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button disabled={isActionsDisabled} onClick={handleEditStart}>
              Edit
            </button>
            <button disabled={isActionsDisabled} onClick={handleDelete}>
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  );
});

export default TableRow;