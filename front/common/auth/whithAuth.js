import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/authContext.js';

const withAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // Si ya terminó de cargar Y no está autenticado, redirigir
      if (!loading && !isAuthenticated) {
        router.push('/auth/login');
      }
    }, [isAuthenticated, loading, router]);

    if (loading || !isAuthenticated) {
      return <div>Verificando autenticación...</div>;
    }

    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${getDisplayName(WrappedComponent)})`;
  return AuthenticatedComponent;
};

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withAuth;