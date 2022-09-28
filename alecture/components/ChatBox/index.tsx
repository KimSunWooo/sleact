import { ChatArea, Form, MentionsTextarea, SendButton, Toolbox, EachMention } from '@components/ChatBox/styles';
import { IUser } from '@typings/db';
import autosize from 'autosize';
import gravatar from 'gravatar';
import React, { FC, useCallback, useEffect, useRef, VFC } from 'react';

interface Props {
  chat?: string;
  onSubmitForm: (e: any) => void;
  onChangeChat: (e: any) => void;
}

const ChatBox: FC<Props> = ({ chat, onSubmitForm, onChangeChat }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      autosize(textareaRef.current);
    }
  });

  const onKeyDownChat = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSubmitForm(e);
      }
    },
    [onSubmitForm],
  );
  return (
    <ChatArea>
      <Form>
        <MentionsTextarea>
          <textarea value={chat} onChange={onChangeChat} onKeyDown={onKeyDownChat} ref={textareaRef} />
        </MentionsTextarea>
        <Toolbox>
          <SendButton
            className={
              'c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send' +
              (chat?.trim() ? '' : ' c-texty_input__button--disabled')
            }
            data-qa="texty_send_button"
            aria-label="Send message"
            data-sk="tooltip_parent"
            type="submit"
            disabled={!chat?.trim()}
          >
            <i className="c-icon c-icon--paperplane-filled" aria-hidden="true" />
            전송
          </SendButton>
        </Toolbox>
      </Form>
    </ChatArea>
  );
};

export default ChatBox;
