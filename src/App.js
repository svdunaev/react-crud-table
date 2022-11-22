import React, { useCallback, useState, useEffect } from "react";
import "./index.css";
import { COLUMNS, API_URL, NEW_USER_ID } from './constants';
import TableRow from './components/table-row';

const App = () => {
  const [isUserCreating, setIsUserCreating] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [userIdEditing, setUserIdEditing] = useState(null);

  const fetchUsersData = useCallback(async () => {
		await fetch(API_URL)
			.then(res => res.json())
			.then(usersData => setUsersData(usersData))
	}, []);

	useEffect(() => {
		fetchUsersData();
	}, [fetchUsersData]);


  const fetchNewUsers = useCallback(async (data) => {
  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  }).catch(() => {
      console.error('oh no')
    })
}, []);

  const fetchUserEdit = useCallback(async (data) => {
    await fetch(`${API_URL}/${data.id}`, {
      method: "PUT",
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
        
      await fetchNewUsers(userData);

      await fetchUsersData()
      setIsUserCreating(false);
    } else {

      const editedUser = {
        id: userId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        age: userData.age,
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
          {usersData.map(({ id: userId, ...userData }) => (
            <TableRow
              key={userId}
              isActionsDisabled={isUserCreating}
              isEditing={userId === userIdEditing}
              onUserDelete={handleUserDelete}
              onUserEditCancel={handleUserEditCancel}
              onUserEditStart={handleUserEditStart}
              onUserEditSubmit={handleUserEditSubmit}
              userData={userData}
              userId={userId}
            />
          ))}
        </tbody>
      </table>
    </>
  );
};

export default App;
