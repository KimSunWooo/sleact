import Modal from '@components/modal';
import useInput from '@hooks/useinputs';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { Dispatch, FC, SetStateAction, useCallback } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import * as S from './style';

interface createChannelProps {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: Dispatch<SetStateAction<boolean>>;
}

const CreateChannelModal: FC<createChannelProps> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
  const { workspace } = useParams<{ workspace: string; channel: string }>();
  const [newChannel, onChangeNewChannel] = useInput('');
  const { data: userData } = useSWR<IUser | false>('/api/users', fetcher);
  const { mutate: revalidateChannel } = useSWR<IChannel[]>(
    userData ? `/api/workspaces/${workspace}/channels` : null,
    fetcher,
  );

  const onClickCreateChannel = useCallback(
    (e) => {
      e.preventDefault();
      axios
        .post(`/api/workspaces/${workspace}/channels`, { name: newChannel }, { withCredentials: true })
        .then(() => {
          revalidateChannel();
          onCloseModal();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    [newChannel],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onClickCreateChannel}>
        <S.Label>
          <span>채널</span>
          <S.Input id="channel" value={newChannel} onChange={onChangeNewChannel}></S.Input>
        </S.Label>
        <S.Button type="submit">생성하기</S.Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
