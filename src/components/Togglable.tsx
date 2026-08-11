import {
  useState,
  forwardRef,
  useImperativeHandle,
  type ReactNode,
} from "react";

interface TogglableProps {
  buttonLabel: string;
  children?: ReactNode;
}

export interface TogglableHandle {
  toggleVisibility: () => void;
}

const Togglable = forwardRef<TogglableHandle, TogglableProps>((props, refs) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  );
});

export default Togglable;
