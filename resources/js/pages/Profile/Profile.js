import { Link, Outlet, nav } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

export const Profile = () => {
  return (
    <div>
      <h2 className='my-3'>Профиль пользователя {JSON.parse(localStorage.getItem('user')).username}</h2>
      <nav className="nav">
        <Link className="nav-link" to={ROUTES.WATCHLIST}>Список просмотра</Link>{' '}
        <Link className="nav-link" to={ROUTES.FAVOURITES}>Избранное</Link>{' '}
        <Link className="nav-link" to={ROUTES.SETTINGS}>Настройки</Link>

      </nav>
      <Outlet />
    </div>
  );
};
