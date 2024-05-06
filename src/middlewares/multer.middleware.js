import multer from 'multer'

// using diskStorage, not memory storage.

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './public/temp')
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
        // originalname - uploaded by user
        // override problem.
        // operation for tiny account on server.
        // little time on server, upload on cloudinary, delete(unlink)
    }
})

export const upload = multer(
    { 
        storage,
    }
)

