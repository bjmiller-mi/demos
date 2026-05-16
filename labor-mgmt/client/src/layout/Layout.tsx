import { NavLink, Outlet } from 'react-router-dom'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

const DRAWER_WIDTH = 220

const navItems = [
  { label: 'Punch Clock', to: '/punch-clock' },
  { label: 'Timesheets', to: '/timesheets' },
  { label: 'Vacation Requests', to: '/vacation-requests' },
  { label: 'Manage Vacation', to: '/manage-vacation' },
]

export default function Layout() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap>
            Labor Mgmt
          </Typography>
        </Toolbar>
        <List disablePadding>
          {navItems.map(({ label, to }) => (
            <NavLink key={to} to={to} style={{ textDecoration: 'none', color: 'inherit' }}>
              {({ isActive }) => (
                <ListItemButton selected={isActive}>
                  <ListItemText primary={label} />
                </ListItemButton>
              )}
            </NavLink>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
        <Outlet />
      </Box>
    </Box>
  )
}
