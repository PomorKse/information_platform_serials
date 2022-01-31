// страница Избранное
import { Row, Col, Button, Badge, Dropdown, ButtonGroup } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Container from '../../components/Container';
import ListSerials from '../../components/ListSerials';

import { getFavourites, selectFavourites } from '../../store/favourites.slice';
import { selectAuth } from '../../store/auth.slice';

export const Favourites = () => {

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getFavourites());
  }, [dispatch]);

  const { favourites, loading, hasErrors } = useSelector(selectFavourites);
  const { isLoggedIn } = useSelector(selectAuth);

  return (
    <Container>
      {hasErrors
        ? <p>Произошла ошибка...</p>
        : <ListSerials
          title={'Избранные сериалы'}
          serials={favourites}
          loading={loading}
          isAuth={isLoggedIn}
        />
      }
    </Container>
  );
};
