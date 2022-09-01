import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import useSWR from 'swr';
import * as S from './styles';
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import Menu from '@components/menu';

const DirectMessage = loadable(() => import('@pages/dm'));
const Channel = loadable(() => import('@pages/channel'));

const WorkSpace: FC = ({ children }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher);
  const logOut = useCallback(() => {
    axios.post('http://localhost:3095/api/users/logout', null, { withCredentials: true }).then(() => {
      mutate(false);
    });
  }, []);

  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  if (!data) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <S.Header>
        <S.RightMenu>
          <span onClick={onClickUserProfile}>
            <S.ProfileImg src={gravatar.url(data.email, { s: '28px', d: 'retro' })} alt={data.nickname} />
          </span>
          {showUserMenu && (
            <Menu style={{ right: 0, top: 40 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
              <S.ProfileModal>
                <img src={gravatar.url(data.email, { s: '36px', d: 'retro' })} alt={data.nickname} />
                <div>
                  <span id="profile-name">{data.email}</span>
                  <span id="profile-active">Active</span>
                </div>
              </S.ProfileModal>
              <S.LogOutButton onClick={logOut}>로그아웃</S.LogOutButton>
            </Menu>
          )}
        </S.RightMenu>
      </S.Header>

      <S.WorkspaceWrapper>
        <S.Workspaces>WorkSpaceList</S.Workspaces>
        <S.Channels>
          <S.WorkspaceName>WorkSpacesName</S.WorkspaceName>
          <S.MenuScroll>
            <div>Menu.data</div>
          </S.MenuScroll>
        </S.Channels>
        <S.Chats>
          <Switch>
            <Route path="/workspace/channel" component={Channel} />
            <Route path="/workspace/dm" component={DirectMessage} />
          </Switch>
        </S.Chats>
      </S.WorkspaceWrapper>
    </div>
  );
};

export default WorkSpace;
