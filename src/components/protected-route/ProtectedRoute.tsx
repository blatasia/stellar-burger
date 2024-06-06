import React from 'react';
import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';

import { selectIsAuth, selectUser } from '../../services/slices/userSlice';
import { Preloader } from '../ui/preloader';

type ProtectedRouteProps = {
  children: React.ReactElement;
  onlyIsAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyIsAuth
}: ProtectedRouteProps) => {
  const isAuth = useSelector(selectIsAuth);
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!isAuth) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (!onlyIsAuth && !user) {
    return <Preloader />;
  }

  if (isAuth && onlyIsAuth) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} replace />;
  }

  return children;
};
