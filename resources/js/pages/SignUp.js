// страница регистрации
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { useDispatch, useSelector } from 'react-redux';
import { showAlert } from '../utilities/showAlert';
import { selectAuth, register, clearErrors, logout } from '../store/auth.slice';

export const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { errors } = useSelector(selectAuth);
  const { isLoggedIn } = useSelector(selectAuth);

  const logOut = () => {
    dispatch(logout());
  };

  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  const [registerInput, setRegister] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setRegister({ ...registerInput, [name]: value });
  };

  const registerSubmit = (e) => {
    e.preventDefault();

    dispatch(register(registerInput)).then((data) => {
      if (data) {
        showAlert('Регистрация успешна.', 'success');
        logOut();
        navigate('/signin');
      }
    });
  };

  return (
    <>
      <h2 className='my-3 text-center'>Регистрация</h2>
      <Row className='mb-3 justify-content-md-center'>
        <Col xs md='4'>
          <Card className='shadow'>
            <Card.Body>
              <Form onSubmit={registerSubmit}>
                <Form.Group className='mb-3'>
                  <Form.Label>Имя</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter your name'
                    name='name'
                    onChange={handleInput}
                    value={registerInput.name}
                  />
                  <span style={{ fontSize: 10 }} className='text-danger'>{errors?.name}</span>
                </Form.Group>

                <Form.Group className='mb-3' controlId='formBasicEmail'>
                  <Form.Label>Email адрес</Form.Label>
                  <Form.Control
                    type='email'
                    placeholder='Enter email'
                    name='email'
                    onChange={handleInput}
                    value={registerInput.email}
                  />
                  <span style={{ fontSize: 10 }} className='text-danger'>{errors?.email}</span>
                </Form.Group>

                <Form.Group className='mb-3' controlId='formBasicPassword'>
                  <Form.Label>Пароль</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Password'
                    name='password'
                    onChange={handleInput}
                    value={registerInput.password}
                  />
                  <span style={{ fontSize: 10 }} className='text-danger'>{errors?.password}</span>
                </Form.Group>

                <Form.Group className='mb-3' controlId='formBasicPassword2'>
                  <Form.Label>Подтверждение пароля</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Password confirmation'
                    name='password_confirmation'
                    onChange={handleInput}
                    value={registerInput.password_confirmation}
                  />
                  <span style={{ fontSize: 10 }} className='text-danger'>
                    {errors?.password_confirmation}
                  </span>
                </Form.Group>

                <Button type='submit' style={{ width: '100%' }}>
                  Отправить
                </Button>
                <hr />
                <p>
                  Уже есть аккаунт? <Link to='/signin'>Вход</Link>
                </p>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};
