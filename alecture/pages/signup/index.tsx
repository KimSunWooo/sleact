import useInput from '@hooks/useinputs';
import React, { useCallback, useState } from 'react';
import * as S from './style';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';

const SignUp = () => {
  const { data } = useSWR('http://localhost:3095/api/users', fetcher);

  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [mismatchError, setMismatchError] = useState(false);

  const onChangePassword = useCallback(
    (e: React.ChangeEvent) => {
      setPassword((e.target as HTMLInputElement).value);
      setMismatchError(passwordCheck !== (e.target as HTMLInputElement).value);
    },
    [passwordCheck],
  );

  const onChangePasswordCheck = useCallback(
    (e: React.ChangeEvent) => {
      setPasswordCheck((e.target as HTMLInputElement).value);
      setMismatchError(password !== (e.target as HTMLInputElement).value);
    },
    [password],
  );

  const onClickSubmit = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (!mismatchError && nickname) {
        console.log(email, nickname, password, passwordCheck);
        setSignUpSuccess(false);
        axios
          .post('http://localhost:3095/api/users', { email, nickname, password })
          .then((res: AxiosResponse) => {
            setSignUpSuccess(true);
          })
          .catch((error: AxiosError) => {
            setSignUpError(error.response?.data);
          })
          .finally(() => {});
      }
    },
    [email, nickname, password, passwordCheck],
  );

  if (data === undefined) {
    return <div>로딩중</div>;
  }

  if (data) {
    return <Redirect to="/workspace/channel" />;
  }

  return (
    <div id="container">
      <S.Header>Sleact</S.Header>
      <S.Form>
        <S.Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <S.Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </S.Label>
        <S.Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <S.Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </S.Label>
        <S.Label id="password-label">
          <span>비밀번호</span>
          <div>
            <S.Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </S.Label>
        <S.Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <S.Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {mismatchError && <S.Error>비밀번호가 일치하지 않습니다.</S.Error>}
          {!nickname && <S.Error>닉네임을 입력해주세요.</S.Error>}
          {signUpError && <S.Error>이미 가입된 이메일입니다.</S.Error>}
          {signUpSuccess && <S.Success>회원가입되었습니다! 로그인해주세요.</S.Success>}
        </S.Label>
        <S.Button type="submit" onClick={onClickSubmit}>
          회원가입
        </S.Button>
      </S.Form>
      <S.LinkContainer>
        이미 회원이신가요?&nbsp;
        <Link to="/login">로그인 하러가기</Link>
      </S.LinkContainer>
    </div>
  );
};

export default SignUp;
