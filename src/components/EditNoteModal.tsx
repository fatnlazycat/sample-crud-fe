import { Button, Input, Modal } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { Note } from "~/entity/note";
import { EditNoteModalContent } from "./editNoteModalStyles";

type Props = {
  visible: boolean;
  note: Note;
  onSubmit: (note: Note) => void;
}

export const EditNoteModal = ({ visible, note, onSubmit }: Props): JSX.Element => {
  const [text, setText] = useState('');
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    const newText = note.text;
    newText && setText(newText);
  }, [note]);
  
  const onTextChanged = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    !changed && setChanged(true);
    setText(event.target.value)
  }, [changed]);

  const submit = useCallback(() => {
    if (changed) {
      const updatedNote = { ...note, text };
      onSubmit(updatedNote);
    }
  }, [changed, note, onSubmit, text])

  return (<Modal visible={visible}>
    <EditNoteModalContent>
      <Input
        value={text}
        onChange={onTextChanged}
      />
    </EditNoteModalContent>
    <Button onClick={submit}>Submit</Button>
  </Modal>);
};