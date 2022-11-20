import React, { memo, useCallback, useMemo, useState, useEffect } from "react";
import "./index.css";

const COLUMNS = [
  {
    accessor: "name",
    caption: "Name",
    inputType: "text"
  },
  {
    accessor: "address",
    caption: "Address",
    inputType: "text"
  },
  {
    accessor: "phone",
    caption: "Phone number",
    inputType: "tel"
  },
  {
    accessor: "postal",
    caption: "Postal",
    inputType: "text"
  }
];

const NEW_USER_ID = "new";
const API_URL = 'http://178.128.196.163:3000/api/records';

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

const App = () => {
  const [isUserCreating, setIsUserCreating] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [userIdEditing, setUserIdEditing] = useState(null);

  const fetchUsersData = useCallback(async () => {
		await fetch(API_URL)
			.then(res => res.json())
			.then(dataSet => dataSet.filter(dataInstance => dataInstance.hasOwnProperty('data')))
			.then(usersData => setUsersData(usersData))
	}, []);

	useEffect(() => {
		fetchUsersData();
	}, [fetchUsersData]);


  const fetchNewUsers = useCallback(async (data) => {
  await fetch(API_URL, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  }).catch(() => {
      console.error('oh no')
    })
}, []);

  const fetchUserEdit = useCallback(async (data) => {
    await fetch(`${API_URL}/${data._id}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }, []);

  const fetchUserDelete = useCallback(async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    })
  }, [])

  const handleUserCreateStart = useCallback(() => {
    setIsUserCreating(true);
  }, []);

  const handleUserDelete = useCallback(async (userId) => {
    await fetchUserDelete(userId);
    await fetchUsersData();
  }, [fetchUserDelete, fetchUsersData]);

  const handleUserEditCancel = useCallback((userId, isNewUser) => {
    if (isNewUser) {
      setIsUserCreating(false);
    } else {
      setUserIdEditing(null);
    }
  }, []);

  const handleUserEditStart = useCallback(
    (userId) => setUserIdEditing(userId),
    []
  );

  const handleUserEditSubmit = useCallback(async (userId, userData, isNewUser) => {
    if (isNewUser) {
      const newUser = {
        data: {
          name: userData.name,
          address: userData.address,
          phone: userData.phone,
          postal: userData.postal,
        },
      };
  
      await fetchNewUsers(newUser);

      await fetchUsersData()
      setIsUserCreating(false);
    } else {
      console.log(userData.name)

      const editedUser = {
        _id: userId,
        data: {
          name: userData.name,
          address: userData.address,
          phone: userData.phone,
          postal: userData.postal,
        },
      };

      await fetchUserEdit(editedUser);
      await fetchUsersData();

      setUserIdEditing(null);
    }
  }, [fetchNewUsers, fetchUsersData, fetchUserEdit]);

  return (
    <>
      <button
        disabled={isUserCreating || userIdEditing}
        onClick={handleUserCreateStart}
      >
        Add new user
      </button>
      <table>
        <thead>
          <tr>
            {COLUMNS.map(({ accessor, caption }) => (
              <th key={accessor}>{caption}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isUserCreating && (
            <TableRow
              isEditing={true}
              onUserEditCancel={handleUserEditCancel}
              onUserEditSubmit={handleUserEditSubmit}
              userId={NEW_USER_ID}
            />
          )}
          {usersData.map(({ _id: userId, ...userData }) => (
            <TableRow
              key={userId}
              isActionsDisabled={isUserCreating}
              isEditing={userId === userIdEditing}
              onUserDelete={handleUserDelete}
              onUserEditCancel={handleUserEditCancel}
              onUserEditStart={handleUserEditStart}
              onUserEditSubmit={handleUserEditSubmit}
              userData={userData.data}
              userId={userId}
            />
          ))}
        </tbody>
      </table>
    </>
  );
};

export default App;
