import React from "react";
import { Row, Col } from "antd";
import { ProjectStore } from '@/store/preject';

export default function PickedFile() {
  const [project] = ProjectStore.useContainer();
  const { selectedFiles } = project;
  let name = selectedFiles.length > 0 ? selectedFiles.join() : null;
  if (name) {
    let arr = name.split("/");
    name = arr[arr.length - 1];
  }
  return (
    <Row align="middle">
      <Col>选中的文件：</Col>
      <Col>{name}</Col>
    </Row>
  );
};
