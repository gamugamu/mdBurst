import cloudinary
import cloudinary.uploader
import cloudinary.api

cloudinary.config(
  cloud_name    = "dqwxhaku0",
  api_key       = "256136413469276",
  api_secret    = "rOCXAVpd_xLFL3kOhQlA0QvjLgw"
)

def upload_image(path, succeed_callback):
    try:
        cloudinary.uploader.upload(path)
    except Exception as e:
        print e
        succeed_callback(False)

    succeed_callback(True)
    print "uploaded"
