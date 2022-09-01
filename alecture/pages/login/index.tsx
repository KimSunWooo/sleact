import useInput from '@hooks/useinputs';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import * as S from './style';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';

const LogIn = () => {
  const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher, { dedupingInterval: 100000 });
  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const onClickSubmit = useCallback(
    (e) => {
      e.preventDefault();
      console.log(email, password);
      setLogInError(false);
      axios
        .post(
          'http://localhost:3095/api/users/login',
          { email, password },
          {
            withCredentials: true,
          },
        )
        .then(() => {
          mutate();
        })
        .catch((error) => {
          setLogInError(error.response?.data?.code === 401);
        });
    },
    [email, password],
  );

  if (data) {
    return <Redirect to="/workspace/channel" />;
  }
  return (
    <div id="container">
      <S.Header>Sleact</S.Header>
      <S.Form onSubmit={onClickSubmit}>
        <S.Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <S.Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </S.Label>
        <S.Label id="password-label">
          <span>비밀번호</span>
          <div>
            <S.Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {logInError && <S.Error>이메일과 비밀번호 조합이 일치하지 않습니다.</S.Error>}
        </S.Label>
        <S.Button type="submit">로그인</S.Button>
      </S.Form>
      <S.LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </S.LinkContainer>
    </div>
  );
};

export default LogIn;
