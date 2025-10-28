import { ListProps } from "@/types/Kanban.types";
import { Input } from "../UI/Input";
import styles from "./List.module.scss";
import { useList } from "@/hooks/useList";

export const List: React.FC<ListProps> = ({ list }) => {
  const {
    title,
    setTitle,
    handleTitleKeyDown,
    handleSaveTitle,
    onToggleActionsMenu,
  } = useList(list);
  return (
    <div className={styles.list}>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleSaveTitle}
        onKeyDown={handleTitleKeyDown}
        autoFocus
        className={styles.listTitleInput}
      />
      <button
        className={styles.listDeleteBtn}
        onClick={onToggleActionsMenu}
        title="Delete list"
        type="button"
      >
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="ellipsis-h"
          className="svg-inline--fa fa-ellipsis-h fa-w-16 fa-null fa-rotate-null fa-pull-null "
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            fill="currentColor"
            d="M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z"
          ></path>
        </svg>
      </button>

    </div>
  );
};
