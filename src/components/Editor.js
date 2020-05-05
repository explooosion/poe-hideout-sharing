import React from 'react';
import CKEditor from './plugins/CKEditor';

function Editor(props) {

  const onChange = evt => {
    const newContent = evt.editor.getData();
    props.onChange(newContent);
    // Save to cookie
  }

  const onBlur = evt => {
    // console.log("onBlur event called with event info: ", evt);
  }

  const afterPaste = evt => {
    // console.log("afterPaste event called with event info: ", evt);
  }

  return (
    <CKEditor
      content={props.value}
      events={{
        "blur": onBlur,
        "afterPaste": afterPaste,
        "change": onChange,
      }}
      config={{ extraPlugins: 'youtube', height: 400 }}
      style={{ width: '100%' }}
    />
  );
}

export default Editor;
