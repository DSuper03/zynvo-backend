import { Router } from 'express';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import {
  createPost,
  editPost,
  getAllPosts,
  getPostById,
  deletePost,
  toggleUpvotePost,
  toggleDownvotePost,
  getPostUpvotes,
  getPostDownvotes
} from '../controller/post.controller';

const router = Router();

router.post('/create', AuthMiddleware, createPost);
router.put('/edit/:id', AuthMiddleware,editPost);
router.get('/all', getAllPosts);
router.get('/get/:id', AuthMiddleware, getPostById);
router.delete('/delete/:id', AuthMiddleware,  deletePost);
router.post('/upvote/:id', AuthMiddleware, toggleUpvotePost);
router.post('/downvote/:id', AuthMiddleware, toggleDownvotePost);
router.get('/getUpvotes/:id', AuthMiddleware, getPostUpvotes);
router.get('/getDownvotes/:id', AuthMiddleware, getPostDownvotes);

export const postRouter = router;
