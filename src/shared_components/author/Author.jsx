import React from "react";
import Styles from "./Author.module.css";
import { formatDate } from "../../utils/DateFormater";

export default function Author({ userName, date }) {
  return (
    <div className={Styles.storyMetaData}>
      By <label className={Styles.storyBoldMetaData}>{userName}</label> on{" "}
      <label className={Styles.storyBoldMetaData}>{formatDate(date)}</label>
    </div>
  );
}
