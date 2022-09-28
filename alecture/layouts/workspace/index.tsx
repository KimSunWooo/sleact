import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Redirect, Route, Switch, useParams } from 'react-router';
import useSWR from 'swr';
import * as S from './styles';
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import Menu from '@components/menu';
import { Link } from 'react-router-dom';
import { IChannel, IUser, IWorkspace } from '@typings/db';
import useInput from '@hooks/useinputs';
import Modal from '@components/modal';
import { toast } from 'react-toastify';
import CreateChannelModal from '@components/createChannelModal';
import InviteWorkspaceModal from '@components/inviteWorkspaceModal';
import InviteChannelModal from '@components/inviteChannelModal';
import ChannelList from '@components/ChannelList';
import DMList from '@components/DMList';

const DM = loadable(() => import('@pages/dm'));
const Channel = loadable(() => import('@pages/channel'));

const WorkSpace: FC = ({ children }) => {
  const { workspace } = useParams<{ workspace: string }>();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setCreateChannelModal] = useState(false);
  const [showWorkSpaceModal, setShowWorkSpaceModal] = useState(false);
  const [showInviteWorkSpaceModal, setShowInviteWorkSpaceModal] = useState(false);
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);

  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

  const { data: userData, error, mutate, isValidating } = useSWR<IUser | false>('/api/users', fetcher);

  const { data: channelData } = useSWR<IChannel[]>(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher);
  const { data: memeberData } = useSWR<IChannel[]>(userData ? `/api/workspaces/${workspace}/memebers` : null, fetcher);

  const logOut = useCallback(() => {
    axios.post('/api/users/logout', null, { withCredentials: true }).then(() => {
      mutate(false);
    });
  }, []);

  const onClickUserProfile = useCallback((e) => {
    // e.stopPropagation();
    setShowUserMenu((prev) => !prev);
  }, []);

  const onClickCreateWorkSpace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  const createWorkspace = useCallback(
    (e) => {
      e.preventDefault();

      if (!newWorkspace || !newWorkspace.trim()) return;
      if (!newUrl || !newUrl.trim()) return;
      axios
        .post(
          '/api/workspaces',
          {
            workspace: newWorkspace,
            url: newUrl,
          },
          { withCredentials: true },
        )
        .then(() => {
          mutate();
          setShowCreateWorkspaceModal(false);
          setNewUrl('');
        })
        .catch((error) => toast.error(error.response?.data, { position: 'bottom-center' }));
    },
    [newUrl, newWorkspace],
  );

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowWorkSpaceModal(false);
    setCreateChannelModal(false);
    setShowInviteWorkSpaceModal(false);
  }, []);

  const onClickWorkspaceModal = useCallback(() => {
    setShowWorkSpaceModal(true);
  }, []);

  const onClickShowCreateChannelModal = useCallback(() => {
    setCreateChannelModal(true);
  }, []);

  const onClickInviteWorkSpace = useCallback(() => {
    setShowInviteWorkSpaceModal(true);
  }, []);

  if (!userData) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <S.Header>
        <S.RightMenu>
          <span onClick={onClickUserProfile}>
            <S.ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
          </span>
          {showUserMenu && (
            <Menu style={{ right: 0, top: 40 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
              <S.ProfileModal>
                <img src={gravatar.url(userData.email, { s: '36px', d: 'retro' })} alt={userData.nickname} />
                <div>
                  <span id="profile-name">{userData.email}</span>
                  <span id="profile-active">Active</span>
                </div>
              </S.ProfileModal>
              <S.LogOutButton onClick={logOut}>로그아웃</S.LogOutButton>
            </Menu>
          )}
        </S.RightMenu>
      </S.Header>

      <S.WorkspaceWrapper>
        <S.Workspaces>
          {userData?.Workspaces?.map((el: IWorkspace) => {
            return (
              <Link key={el.id} to={`/workspace/${el.url}/channel/일반`}>
                <S.WorkspaceButton>{el.name.slice(0, 1).toUpperCase()}</S.WorkspaceButton>
              </Link>
            );
          })}
          <S.AddButton onClick={onClickCreateWorkSpace}>+</S.AddButton>
        </S.Workspaces>
        <S.Channels>
          <S.WorkspaceName onClick={onClickWorkspaceModal}>
            {userData?.Workspaces?.find((v: any) => v.url === workspace)?.name}
          </S.WorkspaceName>
          <S.MenuScroll>
            <Menu show={showWorkSpaceModal} onCloseModal={onCloseModal} style={{ top: 95, left: 80 }}>
              <S.WorkspaceModal>
                <button onClick={onClickShowCreateChannelModal}>채널 만들기</button>
                <button onClick={logOut}>로그아웃</button>
                <button onClick={onClickInviteWorkSpace}>워크스페이스로 사용자 초대</button>
              </S.WorkspaceModal>
            </Menu>
            <ChannelList />
            <DMList />
          </S.MenuScroll>
        </S.Channels>
        <S.Chats>
          <Switch>
            <Route path="/workspace/:workspace/channel/:channel" component={Channel} />
            <Route path="/workspace/:workspace/dm/:id" component={DM} />
          </Switch>
        </S.Chats>
      </S.WorkspaceWrapper>
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={createWorkspace}>
          <S.Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <S.Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
          </S.Label>
          <S.Label id="workspace-url-label">
            <span>워크스페이스 url</span>
            <S.Input id="workspace-url" value={newUrl} onChange={onChangeNewUrl} />
          </S.Label>
          <S.Button type="submit">생성하기</S.Button>
        </form>
      </Modal>
      <CreateChannelModal
        show={showCreateChannelModal}
        onCloseModal={onCloseModal}
        setShowCreateChannelModal={setShowCreateWorkspaceModal}
      />
      <InviteWorkspaceModal
        show={showInviteWorkSpaceModal}
        onCloseModal={onCloseModal}
        setShowInviteWorkspaceModal={setShowInviteWorkSpaceModal}
      />
      <InviteChannelModal
        show={showInviteWorkSpaceModal}
        onCloseModal={onCloseModal}
        setShowInviteWorkspaceModal={setShowInviteWorkSpaceModal}
      />
    </div>
  );
};

export default WorkSpace;
