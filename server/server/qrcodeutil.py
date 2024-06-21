import qrcode
import cv2
import pyotp


def generate_qrcode(data, filename):
    # generate qr code
    img = qrcode.make(data)
    # save img to a file
    img.save(filename)


def read_qrcode_string(filename):
    # read the QRCODE image
    img = cv2.imread(filename)
    # initialize the cv2 QRCode detector
    detector = cv2.QRCodeDetector()
    # detect and decode
    data, bbox, straight_qrcode = detector.detectAndDecode(img)
    return data if bbox is not None else None


def test_qr_code():
    filename = 'qrcode.png'

    # generate_qrcode(
    #     'otpauth://totp/Secure%20App:alice%40google.com?secret=JBSWY3DPEHPK3PXP&issuer=Secure%20App',
    #     filename)

    data = read_qrcode_string(filename)
    # if there is a QR code
    if data is not None:
        print(f"QRCode data:\n{data}")

    otp_obj = pyotp.parse_uri(data)
    print(otp_obj.name)
    print(otp_obj.now())


test_qr_code()
