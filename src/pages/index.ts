import { LoginComponent } from './login/login.component'
import { ProfileComponent } from './profile/profile.component'
import HOME from './home'
import { EDIT_PROFILE } from './edit-profile'
const PAGES = [
  // Login Page
  LoginComponent,

  // profile
  ProfileComponent,

  // Edit profile
  EDIT_PROFILE,

  // Dashboard
  ...HOME
]

export default PAGES
