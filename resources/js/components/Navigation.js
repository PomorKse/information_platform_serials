import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Navbar,
  Nav,
  NavDropdown,
  Container,
  FormControl,
  Button,
} from 'react-bootstrap';
import * as ROUTES from '../constants/routes';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuth, logout } from '../store/auth.slice';
import authAxios from '../services/authAxios';

export default function Navigation() {
  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector(selectAuth);

  const logOut = () => {
    dispatch(logout());
  };
  
  const [searchSerials, setSearchSerials] = useState([]);
  let navigate = useNavigate();

  const searchSerial = (key) => {
    console.warn(key);
    
    const result = authAxios.get(`search/${key}`).then( res => {
      console.log(res.data);
      setSearchSerials(res.data);
      navigate('/search', searchSerials);
    });

  };

  return (
    <Navbar
      collapseOnSelect
      expand='lg'
      bg='dark'
      variant='dark'
      className='py-3 mb-4 shadow-lg'
    >
      <Container fluid='sm'>
        <Navbar.Brand as={NavLink} to='/'>
          <svg width="26" height="26" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M488 64h-8v20c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12V64H96v20c0 6.6-5.4 12-12 12H44c-6.6 0-12-5.4-12-12V64h-8C10.7 64 0 74.7 0 88v336c0 13.3 10.7 24 24 24h8v-20c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v20h320v-20c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v20h8c13.3 0 24-10.7 24-24V88c0-13.3-10.7-24-24-24zM96 372c0 6.6-5.4 12-12 12H44c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40zm0-96c0 6.6-5.4 12-12 12H44c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40zm0-96c0 6.6-5.4 12-12 12H44c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40zm272 208c0 6.6-5.4 12-12 12H156c-6.6 0-12-5.4-12-12v-96c0-6.6 5.4-12 12-12h200c6.6 0 12 5.4 12 12v96zm0-168c0 6.6-5.4 12-12 12H156c-6.6 0-12-5.4-12-12v-96c0-6.6 5.4-12 12-12h200c6.6 0 12 5.4 12 12v96zm112 152c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40zm0-96c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40zm0-96c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40z" fill="#6f42c1" />
          </svg>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse>
          <Nav className='mr-auto'>
            <NavDropdown className='me-2' title='Меню'>
              <NavDropdown.Item as={NavLink} to={ROUTES.SERIALS}>
                Каталог сериалов
              </NavDropdown.Item>
              <NavDropdown.Item
                as={NavLink}
                to={`${ROUTES.PROFILE}/${ROUTES.WATCHLIST}`}
              >
                Список просмотра
              </NavDropdown.Item>
              <NavDropdown.Item
                as={NavLink}
                to={`${ROUTES.PROFILE}/${ROUTES.FAVOURITES}`}
              >
                Избранное
              </NavDropdown.Item>
              {/* <NavDropdown.Divider />
               <NavDropdown.Item as={NavLink} to='/example'>
                Пример компонентов
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to={ROUTES.ADMIN}>
                Админка
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to='test'>
                Тест
              </NavDropdown.Item> */}
            </NavDropdown>
          </Nav>
          <FormControl
            className='me-2'
            type='search'
            placeholder='Поиск'
            aria-label='Search'
            onChange={(e)=>{if(e.target.value) searchSerial(e.target.value)}}
          />
          {isLoggedIn ? <LoggedInView logOut={logOut} /> : <LoggedOutView />}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

const LoggedInView = ({ logOut }) => (
  <Nav>
    <NavDropdown className='me-2' title='Профиль'>
      <NavDropdown.Item as={NavLink} to={ROUTES.PROFILE}>
        Профиль
      </NavDropdown.Item>
      <NavDropdown.Item as={Button} onClick={logOut}>
        Выход
      </NavDropdown.Item>
    </NavDropdown>
  </Nav>
);

const LoggedOutView = () => (
  <Nav>
    <Nav.Link as={NavLink} to={ROUTES.SIGN_IN}>
      Вход
    </Nav.Link>
    <Button as={NavLink} to={ROUTES.SIGN_UP}>
      Регистрация
    </Button>
  </Nav>
);