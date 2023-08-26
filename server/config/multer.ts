import multer from "multer"
import crypto from "crypto"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const fileExtension = file.originalname.split('.')[file.originalname.split('.').length-1]

        const newFileName = crypto.randomBytes(64).toString('hex')

        cb(null, `${newFileName}.${fileExtension}`)
    }
})

export = multer({ storage })