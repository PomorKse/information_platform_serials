﻿//страница сериала
import Loader from '../../utilities/Loader';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getSerial, selectSerial } from '../../store/serial.slice';
import {
  Row,
  Col,
  Button,
  Badge,
  Dropdown,
  ButtonGroup,
  Form,
} from 'react-bootstrap';
import { StatusFilters } from '../../store/filters.slice';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import { labels } from '../../constants/labels';
import { useWatchlist } from '../../hooks/useWatchlist';
import authAxios from '../../services/authAxios';
import { selectAuth } from '../../store/auth.slice';
import AuthService from '../../services/AuthService';

export const SingleSerial = () => {
  const dispatch = useDispatch();
  const { serialId } = useParams();
  const { serial, loading, hasErrors } = useSelector(selectSerial);
  const {
    watchlistItem,
    addToWatchlist,
    removeFromWatchlist,
    setRating,
    setStatus,
  } = useWatchlist(serialId);
  const { isLoggedIn } = useSelector(selectAuth);

  const user = AuthService.getCurrentUser();
  let userId = 0;
  if (user) {
    userId = user.user_id;
  }

  useEffect(() => {
    dispatch(getSerial(serialId));
  }, [dispatch, serialId]);

  const [hover, setHover] = useState(-1);

  const [inFavourites, setinFavourites] = useState(false);
  const [evaluation, setEvaluation] = useState(0);

  useEffect(() => {
    if (serial.favorite) {
      const findId = serial.favorite.find(item => item.user_id === userId)
      if (findId) {
        setinFavourites(true);
        if (findId.eval) {
          setEvaluation(findId.eval);
        } else {
          setEvaluation(0);
        }
      } else {
        setinFavourites(false);
        setEvaluation(0);
      }
    } else {
      setinFavourites(false);
      setEvaluation(0);
    };
  }, [serial.favorite]);

  const addInFavourites = () => {
    try {
      const token = localStorage.getItem('token');
      const response = authAxios.put('/favorites/' + serialId,
        { serial_id: serialId },
        {
          headers: { Authorization: `Bearer ${token}` }
        });
      setinFavourites(!inFavourites);
    } catch (e) {
      console.log(`Axios request failed: ${e}`);
    }
  };

  const usersEvaluation = (event) => {
    event.preventDefault();
    const newValue = event.target.value;
    if (newValue) {
      try {
        const token = localStorage.getItem('token');
        const response = authAxios.put('/favorites/' + serialId + '/eval/' + newValue,
          { serial_id: serialId },
          {
            headers: { Authorization: `Bearer ${token}` }
          });
        setEvaluation(10);
      } catch (e) {
        console.log(`Axios request failed: ${e}`);
      }
    }
  };

  const onRatingChange = (e, newValue) => {
    setRating({ id: serial.id, rating: newValue });
  };
  const onChangeActive = (e, newHover) => {
    setHover(newHover);
  };

  const onAddToWatchlist = (status) => {
    if (!watchlistItem) {
      const storeSerial = {
        id: serial.id,
        title: serial.title,
        status: status,
        rating: null,
      };
      addToWatchlist(storeSerial);
    } else {
      setStatus({ id: serial.id, status: status });
    }
  };

  const renderRating = () => {
    const { rating: userRating } = watchlistItem
      ? watchlistItem
      : { rating: 0 };

    return (
      watchlistItem && (
        <>
          <div className='text-center'>
            <h6 className='mt-3 mb-2'>Оценка: </h6>
            <Rating
              value={userRating}
              max={10}
              onChange={onRatingChange}
              onChangeActive={onChangeActive}
            />
            <Box>{labels[hover !== -1 ? hover : userRating]}</Box>
          </div>
        </>
      )
    );
  };

  const genres = (serial.genres || ['Без категории']).map((genre) => (
    <span key={genre.toString()}>
      <Badge className='mx-1' bg='secondary'>{genre}</Badge>{' '}
    </span>
  ));

  const seasonList = (serial.seasons || ['']).map((season) => (
    <div key={(season.season_number + 1).toString()}>
      <Row style={{ fontSize: 12 }}>
        <Col xs={1}>{season.season_number}</Col>
        <Col xs={7}>{season.season_name}</Col>
        <Col xs={3}>{season.air_date}</Col>
        <Col xs={1}>{season.episode_count}</Col>
      </Row>
    </div>
  ));

  if (loading) return <Loader />;
  if (hasErrors) return <div>Ошибка при загрузке.</div>;

  return (
    <>
      <Row p={1}>
        <Col sm={1} mw={100}></Col>
        <Col lg={10} px={0}>
          <h1 className='mt-4'>
            {serial.title} ({serial.year})
          </h1>
        </Col>
        <Col sm={1}></Col>
      </Row>
      <Row className='py-3 px-0'>
        <Col sm={1}></Col>
        <Col lg={3} px={0}>
          <img
            src={serial.poster}
            className='card-img-top'
            alt={serial.title}
          />
          {isLoggedIn
            ? <>
              <Button className='w-100 mt-4' onClick={addInFavourites}>
                {!inFavourites
                  ? `Добавить в Избранное`
                  : `Удалить из Избранного`
                }
              </Button>
              {inFavourites
                ?
                <Form.Select aria-label="select" size="sm" onChange={usersEvaluation}>
                  <option>Оценка {evaluation}</option>
                  <option value='1'>1 - Фуууу</option>
                  <option value='2'>2 - Потеря времени</option>
                  <option value='3'>3 - Ни о чем</option>
                  <option value='4'>4 - Так себе</option>
                  <option value='5'>5 - Середнячок</option>
                  <option value='6'>6 - Уже лучше</option>
                  <option value='7'>7 - Хорошо</option>
                  <option value='8'>8 - Очень хорошо</option>
                  <option value='9'>9 - Отлично</option>
                  <option value='10'>10 - Супер!</option>
                </Form.Select>
                : <></>
              }
            </>
            : <></>
          }
          {renderRating()}
        </Col>
        <Col lg={7} pl={4}>
          <Row>
            <h4 className="col-lg-8 mb-3">Информация</h4>
            <h6 className="col-lg-4 px-2 py-0 m-0 text-center"> IMDb рейтинг: {serial.rate}/10</h6>
          </Row>
          <div className='h5 mb-4 d-flex align-items-center'>
            Жанры:&nbsp;
            {genres}
          </div>
          <div className='h5 mb-3'>Сюжет</div>
          <p className='text-left mb-4'>{serial.description}</p>
          <div className='h5 mb-4 d-none d-sm-block'>Сезоны</div>
          <Row className='d-none d-sm-block'>
            <Col xs={10}>
              <Row style={{ fontSize: 12 }}>
                <Col xs={1}><b>#</b></Col>
                <Col xs={7}><b>Название</b></Col>
                <Col xs={3}><b>Дата выхода</b></Col>
                <Col xs={1}><b>Эпизодов</b></Col>
              </Row>
              {seasonList}
            </Col>
          </Row>
        </Col>
      </Row>
    </>

  );
};
