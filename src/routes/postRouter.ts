import { Router } from 'express';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import {
  createPost,
  editPost,
  getAllPosts,
  getPostById,
  deletePost
} from '../controller/post.controller';

const router = Router();

router.post('/create', AuthMiddleware, createPost);
router.put('/edit/:id', AuthMiddleware, editPost);
router.get('/all', getAllPosts);
router.get('/get/:id', AuthMiddleware, getPostById);
router.delete('/delete/:id', AuthMiddleware, deletePost);

export const postRouter = router;
