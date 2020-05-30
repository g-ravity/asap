import styled from "@emotion/styled";
import React, { useEffect, useRef, useState } from "react";
import colors from "../theme/colors";
import { Button } from "./widgets";

/**
 * Types
 */
export interface ListType {
  name: string;
  tasks: string[];
}
export interface ListProps extends ListType {
  deleteList: (name: string) => void;
  // updateList: (name: string) => void;
}

/**
 * Component
 */
const List: React.FC<ListProps> = props => {
  const { name, tasks, deleteList } = props;
  const [listName, setListName] = useState(name);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = (): void => {
    textRef.current!.style.height = "0";
    textRef.current!.style.height = `${textRef.current?.scrollHeight}px`;
  };

  useEffect(() => {
    autoResize();
    textRef.current?.addEventListener("input", autoResize);
    // textRef.current?.addEventListener("blur", () => updateList(listName));
  }, []);

  return (
    <ListContainer className="mr-3">
      <ListHeader className="py-1 px-2 m-0 d-flex align-items-center justify-content-between">
        <textarea
          ref={textRef}
          className="p-2 mr-2 mr-md-0"
          value={listName}
          onChange={(e): void => {
            setListName(e.target.value);
          }}
          onKeyDown={(e): void => {
            if (e.keyCode === 13) textRef.current?.blur();
          }}
          spellCheck={false}
        />

        <i
          className="far fa-trash-alt"
          onClick={(): void => {
            deleteList(listName);
          }}
        />
      </ListHeader>
      <div className="p-3">
        {tasks.map(task => (
          <div key={task} className="mb-3 p-2" style={{ backgroundColor: "white" }}>
            {task}
          </div>
        ))}
        <Button title="Add New Task" bgColor={colors.primary} />
      </div>
    </ListContainer>
  );
};

/**
 * Styled Components
 */
const ListHeader = styled.h5`
  background-color: ${colors.grey.tertiary};
  color: ${colors.background};

  textarea {
    resize: none;
    overflow: hidden;
    max-height: 100px;
  }

  textarea:focus {
    background-color: ${colors.background};
  }

  i {
    font-size: 16px;
    color: ${colors.background};
  }
`;

const ListContainer = styled.div`
  background-color: ${colors.grey.primary};
  width: 300px;
`;

export default List;
