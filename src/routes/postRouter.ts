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
import {
  createComment,
  getComments,
  deleteComment,
  reportComment,
  getCommentCount,
} from '../controller/comment.controller';

const router = Router();

// ── Post CRUD ─────────────────────────────────────────────────
router.post('/create', AuthMiddleware, createPost);
router.put('/edit/:id', AuthMiddleware, editPost);
router.get('/all', getAllPosts);
router.get('/get/:id', AuthMiddleware, getPostById);
router.delete('/delete/:id', AuthMiddleware, deletePost);

// ── Votes ─────────────────────────────────────────────────────
router.post('/upvote/:id', AuthMiddleware, toggleUpvotePost);
router.post('/downvote/:id', AuthMiddleware, toggleDownvotePost);
router.get('/getUpvotes/:id', AuthMiddleware, getPostUpvotes);
router.get('/getDownvotes/:id', AuthMiddleware, getPostDownvotes);

// ── Comments ──────────────────────────────────────────────────
// GET  /post/:postId/comments          - list top-level comments + nested replies
// GET  /post/:postId/comments/count    - lightweight count for post cards
// POST /post/:postId/comments          - add a comment (or reply via parentId in body)
// DELETE /post/comments/:commentId     - soft-delete own comment
// POST /post/comments/:commentId/report - report an abusive comment
router.get('/:postId/comments/count', getCommentCount);
router.get('/:postId/comments', getComments);
router.post('/:postId/comments', AuthMiddleware, createComment);
router.delete('/comments/:commentId', AuthMiddleware, deleteComment);
router.post('/comments/:commentId/report', AuthMiddleware, reportComment);

export const postRouter = router;
