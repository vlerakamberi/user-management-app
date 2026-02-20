# User Management App

A React application for managing users with features like listing, searching, adding, editing, and deleting users.

## Features

- **List Users**: Fetch and display users from JSONPlaceholder API
- **Search**: Client-side search by name or email
- **User Details**: View detailed information about each user
- **Add User**: Add new users locally with form validation
- **Edit User**: Update existing user information
- **Delete User**: Remove users from the list
- **Sorting**: Sort users by name, email, or company
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

- React 18
- React Router DOM
- Redux Toolkit
- Axios
- CSS3

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
  ├── components/
  │   ├── UserList.js
  │   ├── UserDetails.js
  │   └── AddUserForm.js
  ├── store/
  │   ├── store.js
  │   └── usersSlice.js
  ├── App.js
  ├── App.css
  ├── index.js
  └── index.css
```
