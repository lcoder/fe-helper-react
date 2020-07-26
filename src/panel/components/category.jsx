import React from 'react';
import CateItem from './cate-item';
import style from './category.module.less';

export default (props) => {
  const { title, list } = props;
  return (
    <div
      className={style.category}
    >
      <div className={style.title}>{title}</div>
      <div className={style.catebox}>
        {
          list.map(item => {
            return <CateItem
              key={item.infoPath}
              item={item}
            />
          })
        }
      </div>
    </div>
  );
}