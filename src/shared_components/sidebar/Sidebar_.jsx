import React from "react";
import Styles from "./Sidebar_.module.css";
import { Icon, Transition, Button } from "semantic-ui-react";

const getClass = (userWindow) =>
  userWindow ? Styles.sidebarClicked : Styles.sidebar;

export default function Sidebar_({
  onExpand,
  logOutRoom,
  removeAllMessage,
  userWindow,
  children,
  owner,
}) {
  return (
    <div className={getClass(userWindow)}>
      <div className={Styles.arrow} onClick={onExpand}>
        <Icon link name="sidebar" color="gray" />
      </div>
      <Transition visible={userWindow} duration={{ hide: 0, show: 500 }}>
        <div style={{ overflowY: "auto" }}>{children}</div>
      </Transition>
      <Transition visible={!userWindow} duration={{ hide: 0, show: 500 }}>
        <label className={Styles.placeHolderClose}>Active Users</label>
      </Transition>
      {sessionStorage.getItem("userName") === owner && (
        <div
          className={Styles.arrow}
          onClick={removeAllMessage}
          style={{ marginTop: "auto" }}
        >
          <Icon link name="mail" color="red" />
        </div>
      )}
      <div
        className={Styles.arrow}
        onClick={logOutRoom}
        style={
          sessionStorage.getItem("userName") === owner
            ? {}
            : {
                marginTop: "auto",
              }
        }
      >
        <Icon link name="log out" color="green" />
      </div>
    </div>
  );
}
