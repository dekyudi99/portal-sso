import { Outlet } from 'react-router-dom'
import { AuthProvider as OidcAuthProvider } from 'react-oidc-context'
import { oidcConfig } from '../config/oidc'
import AuthProvider from '../context/AuthProvider'
import { ThemeProvider } from '../context/ThemeContext'
import { LanguageProvider } from '../context/LanguageContext'

const AuthRoot = () => (
  <OidcAuthProvider {...oidcConfig}>
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <Outlet />
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  </OidcAuthProvider>
)

export default AuthRoot
