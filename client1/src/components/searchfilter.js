import React, { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';

const SearchFilter = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/tasks/searchusername', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ searchQuery })
      });
      const data = await response.json();
      console.log(data);
      setSuggestions(data.filter(user => !selectedUsers.has(user._id)));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = debounce(fetchSuggestions, 300);

  useEffect(() => {
    if (query.trim() === '') {
      setSuggestions([]);
      return;
    }
    debouncedFetch(query);
    return () => debouncedFetch.cancel();
  }, [query, selectedUsers]);

  const handleUserSelect = (user) => {
    const newSelectedUsers = new Set(selectedUsers);
    newSelectedUsers.add(user._id);
    setSelectedUsers(newSelectedUsers);
    console.log([...newSelectedUsers]);
    onSelect([...newSelectedUsers]);
  };

  const handleUserDeselect = (userId) => {
    const newSelectedUsers = new Set(selectedUsers);
    newSelectedUsers.delete(userId);
    setSelectedUsers(newSelectedUsers);
    onSelect([...newSelectedUsers]);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search usernames..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading && <p>Loading...</p>}
      <div>
        {Array.from(selectedUsers).map((userId) => (
          <div key={userId} className="selected-user">
            <span>{userId}</span>
            <button onClick={() => handleUserDeselect(userId)}>Remove</button>
          </div>
        ))}
      </div>
      <ul>
        {suggestions.map((user) => (
          <li key={user._id} onClick={() => handleUserSelect(user)}>
            {user.username}
          </li>
        ))}
      </ul>

 
    </div>

  );
};

export default SearchFilter;
