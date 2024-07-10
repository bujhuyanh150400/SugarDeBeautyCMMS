const Validate = Object.freeze({
    EMAIL_REGEX: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
});
const PermissionAdmin = Object.freeze({
    ADMIN: 16,
    MANAGER: 18,
    EMPLOYEE: 20,
});

const Gender = [
    {label: 'Lựa chọn', value: null},
    {label: 'Nam', value: 1},
    {label: 'Nữ', value: 2},
];

const ACTIVE = 1;
const IN_ACTIVE = 2;

const ActiveStatus = [
    {label: 'Lựa chọn', value: null},
    {label: 'Hoạt động', value: 1},
    {label: 'Không hoạt động', value: 2},
];

const FileType = Object.freeze({
    FILE_TYPE_AVATAR: 15,
    FILE_TYPE_UPLOAD: 16
})

const DayOffStatus = Object.freeze({
    ACTIVE: 15,
    DENIED: 20,
    WAIT:25,
})
const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp'];

const TYPE_CHECKBOX = 15;
const TYPE_RADIO = 20;
const MONTHS_VIETNAMESE = {
    1: { text: 'Tháng Một', value: 1 },
    2: { text: 'Tháng Hai', value: 2 },
    3: { text: 'Tháng Ba', value: 3 },
    4: { text: 'Tháng Tư', value: 4 },
    5: { text: 'Tháng Năm', value: 5 },
    6: { text: 'Tháng Sáu', value: 6 },
    7: { text: 'Tháng Bảy', value: 7 },
    8: { text: 'Tháng Tám', value: 8 },
    9: { text: 'Tháng Chín', value: 9 },
    10: { text: 'Tháng Mười', value: 10 },
    11: { text: 'Tháng Mười Một', value: 11 },
    12: { text: 'Tháng Mười Hai', value: 12 }
};
export default {
    Validate,
    PermissionAdmin,
    Gender,
    FileType,
    MONTHS_VIETNAMESE,
    ActiveStatus,
    ACTIVE,
    IN_ACTIVE,
    DayOffStatus,
    imageExtensions,
    TYPE_CHECKBOX,
    TYPE_RADIO,
};
