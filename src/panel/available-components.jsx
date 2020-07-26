import React, { useEffect, useState } from 'react'
import { fetchComponents } from '@/services/project';
import groupBy from 'lodash/groupBy';
import Category from './components/category';

export default () => {
  const [cate, setCategory] = useState({});

  useEffect(() => {
    fetchComponents()
      .then(data => {
        const result = groupBy(data.components, 'type');
        setCategory(result);
      })
  }, []);
  
  return <div
    style={{width: 250}}
  >
    {
      Object.keys(cate).map(category => {
        const list = cate[category];
        return (
          <Category
            key={category}
            title={category}
            list={list}
          />
        );
      })
    }
  </div>
}

