import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useinputs';
import React, { useCallback } from 'react';
import * as S from './styles';

const Channel = () => {
  const [chat, onChangeChat, setChat] = useInput('');
  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    console.log('submit');
    setChat('');
  }, []);

  return (
    <S.Container>
      <S.Header>Channel</S.Header>
      <ChatList />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </S.Container>
  );
};

export default Channel;
