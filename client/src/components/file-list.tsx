import React from 'react'
import { Input, Select } from 'antd'
import style from './file-list.module.less'

const { Option } = Select

export default () => {
    return <div className={ style.box }>
        <Select
            className={ style.projectName }
            placeholder="请选择项目"
        >
            <Option value="kuafu">夸父</Option>
            <Option value="noah">诺亚</Option>
        </Select>
        <Input placeholder="请输入文件名过滤" />
    </div>
}