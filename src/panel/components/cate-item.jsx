import React from 'react';
import style from './category.module.less';
import { ProjectStore } from '@/store/preject';

export default function CateItem(props) {
  const { item } = props;
  const [project, setProject] = ProjectStore.useContainer();

  return <div
    className={style.cateItem}
    onClick={() => {
      setProject({
        selectedCps: project.selectedCps.concat({
          id: Date.now(),
          ...item,
        }),
      });
    }}
  >
    <div className={style.previewImg}>
      <img
        src={`/preview?infoPath=${item.infoPath}`}
        alt="预览图片"
      />
    </div>
    <div className={style.cName}>{item.cName}</div>
  </div>
}