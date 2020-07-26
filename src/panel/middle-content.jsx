import React, { useState } from "react";
import { Tag, Button, message } from 'antd';
import PickedFile from "./components/picked-file";
import style from './middle-content.module.less';
import { ProjectStore } from '@/store/preject';
import { insertCode } from '@/services/project';

export default () => {
  const [loading, setLoading] = useState(false);
  const [project, setProject] = ProjectStore.useContainer();

  return (
    <div>
      <PickedFile />
      <div
        className={style.box}
      >
        {
          project.selectedCps.map((item, index) => {
            return <Tag
              key={item.id}
              closable
              onClose={() => {
                const newList = [...project.selectedCps];
                newList.splice(index, 1);
                setProject({
                  selectedCps: newList,
                });
              }}
            >{item.cName}</Tag>
          })
        }
      </div>
      <div className={style.bottomOperator}>
        <Button
          loading={loading}
          type="primary"
          onClick={async () => {
            const { selectedFiles, selectedCps } = project;
            if (selectedFiles.length === 0) {
              return message.error('请选择文件');
            }
            if (selectedCps.length === 0) {
              return message.error('请选择要合并的组件');
            }
            try {
              setLoading(true);
              await insertCode({
                sourceFile: selectedFiles.join(),
                components: selectedCps,
              });
              setLoading(false);
              message.success('代码插入成功');
              setProject({
                selectedCps: [],
              });
            } catch(e) {
              setLoading(false);
              console.warn(e);
            }
          }}
        >确定</Button>
        <Button
          onClick={() => {
            setProject({
              selectedCps: [],
            });
            message.success('已清空');
          }}
        >清空</Button>
      </div>
    </div>
  );
};
