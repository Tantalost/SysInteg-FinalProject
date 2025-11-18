import multer from "multer";

const upload = multer({storeage: multer.diskStorage({})})

export default upload;