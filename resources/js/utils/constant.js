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


export default {
    Validate,
    PermissionAdmin,
    Gender,
    FileType,
    ActiveStatus,
    ACTIVE,
    IN_ACTIVE,
    DayOffStatus,
    imageExtensions
};
