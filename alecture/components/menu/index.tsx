import React, { CSSProperties, FC, useCallback } from 'react';
import { idText } from 'typescript';
import * as S from './style';

interface MenuProps {
  show: boolean;
  onCloseModal: (e: React.MouseEvent) => void;
  style: CSSProperties;
  closeButton?: boolean;
}

const Menu: FC<MenuProps> = ({ children, style, show, onCloseModal, closeButton }) => {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (!show) return null;

  return (
    <S.CreateMenu onClick={onCloseModal}>
      <div onClick={stopPropagation} style={style}>
        {closeButton && <S.CloseModalButton onClick={onCloseModal}>&times;</S.CloseModalButton>}
        {children}
      </div>
    </S.CreateMenu>
  );
};
Menu.defaultProps = {
  closeButton: true,
};

export default Menu;
