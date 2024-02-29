import React from "react";
import styles from "./CommentCreateModal.module.css";

const CommentCreateModal = (props) => {
  return (
    <div
      className={`${styles.modal_formatting} ${styles.backdrop}`}
      onClick={props.onClick}
      onMouseOver={props.onMouseOver}
      onMouseLeave={props.onMouseLeave}
      onBlur={props.onBlur}
    >
      <div className={`${styles.outer}`}>
        <div className={`${styles.modal} ${styles.card}`}>{props.children}</div>
      </div>
    </div>
  );
};

export default CommentCreateModal;