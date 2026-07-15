import { Router } from 'express';
import multer from 'multer';
import { uploadPhoto, getPhotos, getPhoto } from '../controllers/photoController.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/', upload.single('foto'), uploadPhoto);
router.get('/', getPhotos);
router.get('/:id', getPhoto);

export default router;
