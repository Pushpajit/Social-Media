import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children,  isAuthenticated}) => {


  let location = useLocation();

  if (!isAuthenticated) {
    // Redirect to the signin page if the user is not authenticated
    console.log("Not Auth!!");
    return <Navigate to="/signin" state={{ from: location}} replace />
  }
  
  return children;

  // Render the protected content if the user is authenticated
};

export default ProtectedRoute;
