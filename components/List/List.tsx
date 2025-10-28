import { ListProps } from "@/types/Kanban.types";
import { Input } from "../UI/Input";
import styles from "./List.module.scss";
import { useList } from "@/hooks/useList";

export const List: React.FC<ListProps> = ({ list }) => {
  const { title, setTitle, handleTitleKeyDown, handleSaveTitle } =
    useList(list);
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
    </div>
  );
};
