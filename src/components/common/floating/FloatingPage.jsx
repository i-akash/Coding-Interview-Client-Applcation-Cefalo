import React from "react";
import { Modal, Icon, Button, Header } from "semantic-ui-react";

export default function FloatingPage({
  open,
  header,
  icon,
  toggle,
  onClick,
  clickText,
  children,
}) {
  return (
    <Modal
      dimmer="blurring"
      open={open}
      closeIcon
      onClose={toggle}
      size="small"
    >
      <Header icon={icon} content={header} textAlign="center" />
      <Modal.Content>{children}</Modal.Content>
      <Modal.Actions>
        <Button
          color="green"
          size="mini"
          onClick={onClick}
          content={clickText}
        />
      </Modal.Actions>
    </Modal>
  );
}
