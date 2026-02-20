import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setUsers, setLoading, addUser, updateUser, deleteUser } from '../store/usersSlice';
import AddUserForm from './AddUserForm';
import './UserList.css';

const UserList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading } = useSelector((state) => state.users);
  const formRef = useRef(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // scroll to form when editing
  useEffect(() => {
    if (showAddForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showAddForm, editingUser]);

  const fetchUsers = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      dispatch(setUsers(response.data));
      // setUsers already sets loading to false, so no need to call setLoading(false) here
    } catch (error) {
      console.error('Error fetching users:', error);
      dispatch(setLoading(false));
      // could add error message here but keeping it simple for now
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleAddUser = (newUser) => {
    // create new user object with id
    const userToAdd = {
      ...newUser,
      id: Date.now(), // simple way to generate unique id
      company: { name: newUser.company || 'N/A' },
    };
    dispatch(addUser(userToAdd));
    setShowAddForm(false);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowAddForm(true);
  };

  const handleUpdateUser = (updatedUser) => {
    dispatch(updateUser(updatedUser));
    setEditingUser(null);
    setShowAddForm(false);
  };

  const handleDelete = (userId) => {
    // confirm before deleting
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(userId));
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/user/${userId}`);
  };

  // filter users based on search
  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue, bValue;
    
    if (sortBy === 'name') {
      aValue = a.name.toLowerCase();
      bValue = b.name.toLowerCase();
    } else if (sortBy === 'email') {
      aValue = a.email.toLowerCase();
      bValue = b.email.toLowerCase();
    } else if (sortBy === 'company') {
      aValue = a.company?.name?.toLowerCase() || '';
      bValue = b.company?.name?.toLowerCase() || '';
    }

    if (sortOrder === 'asc') {
      if (aValue > bValue) return 1;
      if (aValue < bValue) return -1;
      return 0;
    } else {
      if (aValue < bValue) return 1;
      if (aValue > bValue) return -1;
      return 0;
    }
  });

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h2>Users</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            setEditingUser(null);
            setShowAddForm(!showAddForm);
          }}
        >
          {showAddForm ? 'Cancel' : 'Add New User'}
        </button>
      </div>

      {showAddForm && (
        <div ref={formRef}>
          <AddUserForm
            onAdd={handleAddUser}
            onUpdate={handleUpdateUser}
            editingUser={editingUser}
          />
        </div>
      )}

      <div className="search-sort-container">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
        <div className="user-count">
          {searchTerm
            ? `Showing ${sortedUsers.length} of ${users.length} users`
            : `Showing ${users.length} users`}
        </div>
        
        <div className="sort-controls">
          <span>Sort by: </span>
          <button
            type="button"
            className={sortBy === 'name' ? 'sort-btn active' : 'sort-btn'}
            onClick={() => handleSort('name')}
          >
            Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            type="button"
            className={sortBy === 'email' ? 'sort-btn active' : 'sort-btn'}
            onClick={() => handleSort('email')}
          >
            Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            type="button"
            className={sortBy === 'company' ? 'sort-btn active' : 'sort-btn'}
            onClick={() => handleSort('company')}
          >
            Company {sortBy === 'company' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-results">No users found</td>
              </tr>
            ) : (
              sortedUsers.map((user) => (
                <tr key={user.id} className="user-row">
                  <td 
                    className={`user-name-cell ${sortBy === 'name' ? 'active-sort-cell' : ''}`}
                    onClick={() => handleUserClick(user.id)}
                  >
                    {user.name}
                  </td>
                  <td className={sortBy === 'email' ? 'active-sort-cell' : ''}>
                    {user.email}
                  </td>
                  <td className={sortBy === 'company' ? 'active-sort-cell' : ''}>
                    {user.company?.name || 'N/A'}
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
