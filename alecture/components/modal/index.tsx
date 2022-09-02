import React, { CSSProperties, FC, PropsWithChildren, useCallback } from 'react';
import * as S from './style';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  closeButton?: boolean;
}

const Modal: FC<PropsWithChildren<Props>> = ({ show, children, onCloseModal }) => {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (!show) {
    return null;
  }
  return (
    <S.CreateModal onClick={onCloseModal}>
      <div onClick={stopPropagation}>
        <S.CloseModalButton onClick={onCloseModal}>&times;</S.CloseModalButton>
        {children}
      </div>
    </S.CreateModal>
  );
};
Modal.defaultProps = {
  closeButton: true,
};

export default Modal;
