// страница для отображения результатов поиска
import Container from '../components/Container';
import Navigation from '../components/Navigation';
import ListSerials from '../components/ListSerials';
import Table from 'react-bootstrap/Table';


export const Search = () => {

  return (
    <Container>
      <h1>Результаты поиска</h1>

    </Container>
  );
};

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Container from '../components/Container';
import ListSerials from '../components/ListSerials';

import { getSearchSerials, selectSearchSerials } from '../store/search.slice';
import { selectAuth } from '../store/auth.slice';

export const Search = () => {

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getSearchSerials());
    }, [dispatch]);

    const { searchSerials, loading, hasErrors } = useSelector(selectSearchSerials);
    const { isLoggedIn } = useSelector(selectAuth);

    return (
        <Container>
            {hasErrors
                ? <p>Произошла ошибка...</p>
                : <ListSerials
                    title={'Результаты поиска'}
                    serials={searchSerials}
                    loading={loading}
                    isAuth={isLoggedIn}
                />
            }
        </Container>
    );
};
