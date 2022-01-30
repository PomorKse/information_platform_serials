import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import {
  Layout,
  Admin,
  Users,
  SerialsAdmin,
  Example,
  Profile,
  ProfileSettings,
  WatchList,
  Favourites,
  Home,
  Serials,
  SingleSerial,
  FilmInfo,
  Search,
  SignIn,
  SignUp,
  NotFound,
} from '../pages';
import * as ROUTES from '../constants/routes';
import { useSelector } from 'react-redux';
import { selectAuth } from '../store/auth.slice';

const PrivateOutlet = () => {
  const { isLoggedIn } = useSelector(selectAuth);

  return isLoggedIn ? <Outlet /> : <Navigate to='/signin' />;
};

export const Routing = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path={ROUTES.SERIALS} element={<Serials />} />
        <Route
          path={`${ROUTES.SERIALS}/:${ROUTES.SERIAL_ID}`}
          element={<SingleSerial />}
        />
        <Route path={`${ROUTES.SERIALS}/filminfo`} element={<FilmInfo />} />
        <Route path={ROUTES.SIGN_IN} element={<SignIn />} />
        <Route path={ROUTES.SIGN_UP} element={<SignUp />} />
        <Route path={ROUTES.PROFILE} element={<Profile />}>
          <Route path={ROUTES.WATCHLIST} element={<WatchList />} />
          <Route path={ROUTES.FAVOURITES} element={<Favourites />} />
          <Route element={<PrivateOutlet />}>
            <Route path={ROUTES.SETTINGS} element={<ProfileSettings />} />
          </Route>
        </Route>
      </Route>
      <Route path={ROUTES.ADMIN} element={<Admin />}>
        <Route path={ROUTES.USERS} element={<Users />} />
        <Route path={ROUTES.ADMIN_SERIALS} element={<SerialsAdmin />} />
      </Route>
      <Route path='example' element={<Example />} />
      <Route path='search' element={<Search />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
};
