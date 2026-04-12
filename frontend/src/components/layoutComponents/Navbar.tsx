// frontend\src\components\layoutComponents\Navbar.tsx

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material'

import MenuIcon from '@mui/icons-material/Menu'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'

import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'

import { UserAuthContext } from '../../authLogin/context/UserAuthContext'
import { handleLogout } from '../../authLogin/authFunctions'

const Navbar = () => {
  const { user, setUser } = useContext(UserAuthContext)
  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget)

  const handleMenuClose = () => setAnchorEl(null)

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#fffdf7',
          color: '#4a3f35',
          borderBottom: '1px solid #e5e0d8',
        }}
      >
        <Toolbar>
          {/* LOGO */}
          <Box
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Astro App
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* DESKTOP */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
            {user?.roles?.includes('ADMIN') && (
              <Tooltip title="Admin">
                <IconButton
                  component={NavLink}
                  to="/admin"
                  sx={{ color: 'inherit' }}
                >
                  <AdminPanelSettingsIcon />
                </IconButton>
              </Tooltip>
            )}

            {user ? (
              <>
                <Tooltip title="Profile">
                  <IconButton
                    component={NavLink}
                    to="/user"
                    sx={{ color: 'inherit' }}
                  >
                    <AccountCircleIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Logout">
                  <IconButton
                    onClick={() => handleLogout(setUser, navigate)}
                    sx={{ color: 'inherit' }}
                  >
                    <LogoutIcon />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <Tooltip title="Login">
                <IconButton
                  component={Link}
                  to="/login"
                  sx={{ color: 'inherit' }}
                >
                  <LoginIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          {/* MOBILE */}
          <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
            <IconButton onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {user?.roles?.includes('ADMIN') && (
                <MenuItem
                  component={NavLink}
                  to="/admin"
                  onClick={handleMenuClose}
                >
                  Admin
                </MenuItem>
              )}

              {user && (
                <MenuItem
                  component={NavLink}
                  to="/user"
                  onClick={handleMenuClose}
                >
                  Profile
                </MenuItem>
              )}

              {user ? (
                <MenuItem
                  onClick={() => {
                    handleMenuClose()
                    handleLogout(setUser, navigate)
                  }}
                >
                  Logout
                </MenuItem>
              ) : (
                <MenuItem
                  component={Link}
                  to="/login"
                  onClick={handleMenuClose}
                >
                  Login
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* offset */}
      <Toolbar />
    </>
  )
}

export default Navbar