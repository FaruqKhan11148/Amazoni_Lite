const authService = require('../services/authService');

const signup = (req, res) => {
  const { email, password } = req.body || {};

  authService.signup(email, password, (err) => {
    if (err) return res.status(500).json({ message: 'Server Error' });
    res.status(201).json({ message: 'User Created' });
  });
};

const login = (req, res) => {
  const { email, password } = req.body || {};

  authService.login(email, password, (err, token) => {
    if (err) return res.status(500).json({ message: 'Server Error' });
    if (!token) return res.status(400).json({ message: 'Invalid Credentials' });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // true only on https
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ message: 'Login success' });
  });
};

// GET /api/users/me
const getMe = (req, res) => {
  authService.getProfile(req.user.id, (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  });
};

// PUT /api/users/me
const updateMe = (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email required' });
  }

  authService.updateProfile(req.user.id, name, email, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Update failed' });
    }

    res.json({ message: 'Profile updated successfully' });
  });
};

// change password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Both passwords required' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({
      message: 'New password must be at least 8 characters',
    });
  }

  authService.changePassword(
    req.user.id,
    currentPassword,
    newPassword,
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }

      if (result === 'INVALID_CURRENT_PASSWORD') {
        return res
          .status(400)
          .json({ message: 'Current password is incorrect' });
      }

      res.json({ message: 'Password changed successfully' });
    },
  );
};

const logout = (req, res) => {
  const token = req.token;
  const decoded = req.user;

  authService.logout(token, decoded, (err, success) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Logout failed' });
    }

    res.json({ message: 'Logged out successfully' });
  });
};

module.exports = { signup, login, getMe, updateMe, changePassword, logout };
