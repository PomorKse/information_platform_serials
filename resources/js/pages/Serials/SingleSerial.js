
//страница сериала
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
} from 'react-bootstrap';
import { StatusFilters } from '../../store/filters.slice';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import { labels } from '../../constants/labels';
import { useWatchlist } from '../../hooks/useWatchlist';
import axios from 'axios';
import { API_FAVORITES } from '../../constants/api';

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

  useEffect(() => {
    dispatch(getSerial(serialId));
  }, [dispatch, serialId]);

  const [hover, setHover] = useState(-1);

  const [inFavourites, setinFavourites] = useState(false);

  const addInFavourites = () => {
    try {
      const token = localStorage.getItem('token');
      const response = axios.put(API_FAVORITES + '/' + serialId,
        { serial_id: serialId },
        {
          headers: { Authorization: `Bearer ${token}` }
        });
      //     console.log('Returned data:', response);
      setinFavourites(!inFavourites);
    } catch (e) {
      console.log(`Axios request failed: ${e}`);
    }
  };
  console.log(serial)

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

  // if (loading) return <div>Loading...</div>;
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
          <Button className='w-100 mt-4' onClick={addInFavourites}>
            {!inFavourites
              ? `Добавить в Избранное`
              : `Удалить из Избранного`
            }
          </Button>

          <Dropdown as={ButtonGroup} className='w-100 mt-4'>
            <Button
              disabled={!!watchlistItem}
              onClick={() => onAddToWatchlist(StatusFilters.Active)}
            >
              Добавить в список
            </Button>
            <Dropdown.Toggle split />
            <Dropdown.Menu align='end'>
              <Dropdown.Item
                onClick={() => onAddToWatchlist(StatusFilters.Active)}
              >
                Смотрю
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => onAddToWatchlist(StatusFilters.Completed)}
              >
                Просмотрено
              </Dropdown.Item>
              <Dropdown.Item onClick={() => removeFromWatchlist(serial.id)}>
                Удалить из списка
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
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



