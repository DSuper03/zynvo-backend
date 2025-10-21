import { Router } from 'express';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { cache, purgeCache } from '../middleware/cachelayer';
import {
  createPost,
  editPost,
  getAllPosts,
  getPostById,
  deletePost
} from '../controller/post.controller';

const router = Router();

router.post('/create', AuthMiddleware, purgeCache(['posts']), createPost);
router.put('/edit/:id', AuthMiddleware, purgeCache(['posts']), editPost);
router.get('/all', cache({ key: 'all-posts', ttl: 600, tags: ['posts'] }), getAllPosts);
router.get('/get/:id', AuthMiddleware, getPostById);
router.delete('/delete/:id', AuthMiddleware, purgeCache(['posts']), deletePost);

export const postRouter = router;
