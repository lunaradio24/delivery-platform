import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

class ImageController {
  imageUpload = async (req, res, next) => {
    try {
      const imageUrl = req.file.location;

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.IMAGES.UPLOAD.SUCCEED,
        data: imageUrl,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default ImageController;
