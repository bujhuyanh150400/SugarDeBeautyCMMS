import {QRCodeCanvas} from 'qrcode.react';
const QRCode = ({url , size}) => {
    return (
        <QRCodeCanvas
            value={url ?? ''}
            size={size ?? 256}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"L"}
            includeMargin={true}
        />
    )
}
export default QRCode;
