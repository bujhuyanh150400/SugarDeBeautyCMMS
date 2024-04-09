import React from 'react';
import Icon from '@ant-design/icons';
import * as AntIcons from '@ant-design/icons';
const DynamicIcon = ({ icon }) => {
    // Cách này chưa tối ưu hiệu năng lắm
    const IconComponent = AntIcons[icon];
    if (!IconComponent) {
        console.error(`Icon ${icon} Không tìm thấy`);
        return null;
    }
    return <Icon component={IconComponent} />;
};
export default DynamicIcon;
