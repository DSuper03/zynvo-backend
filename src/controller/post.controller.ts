import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { prisma } from '../db/db';
import { postSchema } from '../types/formtypes';
import { generateRequestId, sendErrorResponse } from '../utils/helper';

const postSelectBase = {
    id: true,
    title: true,
    description: true,
    collegeId: true,
    collegeName: true,
    clubName: true,
    authorId: true,
    image: true,
    published: true,
    createdAt: true,
    updatedAt: true,
} as const;


export const createPost = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();

    const { title, description, collegeName, clubName, image } = req.body;
    const userId = req.id;

    logger.info(`[${requestId}] POST /create - Starting post creation`, {
        userId,
        title,
        clubName
    });

    const parsedData = postSchema.safeParse(req.body);
    if (!parsedData.success) {
        logger.warn(`[${requestId}] Invalid post format`, {
            userId,
            errors: parsedData.error.errors
        });
        sendErrorResponse(res, requestId, 'wrong format for your posts', 500);
        return;
    }

    try {
        logger.info(`[${requestId}] Fetching user information`, { userId });

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                email: true,
                name: true,
                clubId: true,
            },
        });

        if (!user) {
            logger.warn(`[${requestId}] User not found`, { userId });
            sendErrorResponse(res, requestId, 'no such user found', 404);
            return;
        }

        if (!user.clubId) {
            logger.warn(`[${requestId}] User not associated with any club`, { userId });
            sendErrorResponse(res, requestId, 'no club found associated to you, either join a club or create one', 404);
            return;
        }

        logger.info(`[${requestId}] Fetching club information`, { clubId: user.clubId });

        const club = await prisma.clubs.findUnique({
            where: { id: user.clubId },
            select: {
                collegeId: true,
                name: true,
            },
        });

        if (!club) {
            logger.warn(`[${requestId}] Club not found`, { clubId: user.clubId });
            sendErrorResponse(res, requestId, 'no club found associated to you, either join a club or create one', 404);
            return;
        }

        logger.info(`[${requestId}] Creating post`, {
            userId,
            clubId: user.clubId,
            collegeId: club.collegeId
        });

        const post = await prisma.createPost.create({
            data: {
                title: parsedData.data.title,
                description: parsedData.data.description,
                collegeId: club.collegeId,
                collegeName: collegeName,
                clubName: clubName,
                authorId: userId,
                image: image,
                published: true,
            },
            select: { id: true }
        });

   

        logger.info(`[${requestId}] Post created successfully`, {
            postId: post.id,
            userId
        });

        res.status(200).json({
            msg: 'post created',
            id: post.id,
        });
        return;

    } catch (error: any) {
        logger.error(`[${requestId}] Error creating post`, {
            error: error.message,
            stack: error.stack,
            code: error.code,
            userId
        });
        sendErrorResponse(res, requestId, 'error creating post , some error occured.', 500);
    }
};

export const editPost = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const postId = req.params.id;

    logger.info(`[${requestId}] PUT /edit/:id - Starting post edit`, {
        postId,
        userId: req.id
    });

    const parsedData = postSchema.safeParse(req.body);
    if (!parsedData.success) {
        logger.warn(`[${requestId}] Invalid post format`, {
            postId,
            errors: parsedData.error.errors
        });
        sendErrorResponse(res, requestId, 'incorrect format', 400);
        return;
    }

    try {
        logger.info(`[${requestId}] Updating post`, { postId });

        const post = await prisma.createPost.update({
            where: { id: postId },
            data: {
                title: parsedData.data.title,
                description: parsedData.data.description,
            },
            select: { id: true }
        });

        logger.info(`[${requestId}] Post updated successfully`, { postId: post.id });

        res.status(200).json({
            msg: 'post updated, changes will reflect shortly',
        });

    } catch (error: any) {
        logger.error(`[${requestId}] Error editing post`, {
            error: error.message,
            stack: error.stack,
            postId
        });
        sendErrorResponse(res, requestId, 'error editing post', 500);
    }
};

export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();

    logger.info(`[${requestId}] GET /all - Starting request`, {
        query: req.query
    });

    try {
        const pages = parseInt(req.query.page as string) || 1;
        const limit = 30;
        const skip = (pages - 1) * limit;

        logger.info(`[${requestId}] Fetching posts with pagination`, {
            page: pages,
            limit,
            skip
        });

        const [posts, totalData] = await Promise.all([
            prisma.createPost.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    ...postSelectBase,
                    author: {
                        select: {
                            profileAvatar: true,
                            name: true,
                        }
                    }
                },
            }),
            prisma.createPost.count()
        ]);

        if (!posts || posts.length === 0) {
            logger.warn(`[${requestId}] No posts found`);
            res.json({
                msg: 'not enough posts to show',
            });
            return;
        }

        logger.info(`[${requestId}] Posts fetched successfully`, {
            postsCount: posts.length,
            totalData,
            totalPages: Math.ceil(totalData / limit)
        });

        res.status(200).json({
            msg: 'fetched',
            posts: posts,
            totalPages: Math.ceil(totalData / limit)
        });

    } catch (error: any) {
        logger.error(`[${requestId}] Error fetching posts`, {
            error: error.message,
            stack: error.stack
        });
        sendErrorResponse(res, requestId, 'error getting posts', 500);
    }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const postId = req.params.id;

    logger.info(`[${requestId}] GET /get/:id - Starting request`, {
        postId,
        userId: req.id
    });

    try {
        const post = await prisma.createPost.findUnique({
            where: { id: postId },
            select: postSelectBase,
        });

        if (!post) {
            logger.warn(`[${requestId}] Post not found`, { postId });
            res.json({
                msg: 'no such post found',
            });
            return;
        }

        logger.info(`[${requestId}] Post fetched successfully`, {
            postId: post.id,
            title: post.title
        });

        res.status(200).json({
            msg: 'post fetched',
            response: post,
        });

    } catch (error: any) {
        logger.error(`[${requestId}] Error fetching post`, {
            error: error.message,
            stack: error.stack,
            postId
        });
        sendErrorResponse(res, requestId, 'error getting post', 500);
    }
};


export const deletePost = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const postId = req.params.id;

    logger.info(`[${requestId}] DELETE /delete/:id - Starting request`, {
        postId,
        userId: req.id
    });

    try {
        const post = await prisma.createPost.delete({
            where: { id: postId },
            select: { id: true }
        });

     

        logger.info(`[${requestId}] Post deleted successfully`, { postId: post.id });

        res.status(200).json({
            msg: 'post deleted',
        });

    } catch (error: any) {
        logger.error(`[${requestId}] Error deleting post`, {
            error: error.message,
            stack: error.stack,
            postId
        });

        if (error.code === 'P2025') {
            sendErrorResponse(res, requestId, 'no such post found', 404);
        } else {
            sendErrorResponse(res, requestId, 'error deleting post', 500);
        }
    }
};

export const toggleUpvotePost = async (req: Request, res: Response): Promise<void> => 
 {
    try {
        const postId = req.params.id;
  const userId = req.id;
  const existing = await prisma.postUpvote.findUnique({
    where: {
      postId_userId: { postId, userId },
    },
  });

  if (existing) {

   const upvote =  await prisma.postUpvote.delete({
      where: {
        postId_userId: { postId, userId },
      },
    });

    if(!upvote) {
        res.status(400).json({
            msg : "unable to remove upvote"
        })
        return;
    }
   
    res.status(200).json({
        msg : "upvote removed"
    })
    return;
  }

  const upvote = await prisma.postUpvote.create({
    data: { postId, userId },
  });

  if(!upvote) {
        res.status(400).json({
            msg : "unable to upvote"
        })
        return;
    }

  res.status(200).json({
        msg : "upvote removed"
    })
    return;
    } catch (error) {
        console.log("error" , error)
        res.status(500).json({
            msg : "internal server error"
        })
    }
 
}

export const toggleDownvotePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const postId = req.params.id;
        const userId = req.id;

        const existing = await prisma.postDownvote.findUnique({
            where: {
                postId_userId: { postId, userId },
            },
        });

        if (existing) {
            const downvote = await prisma.postDownvote.delete({
                where: {
                    postId_userId: { postId, userId },
                },
            });

            if (!downvote) {
                res.status(400).json({
                    msg: "unable to remove downvote"
                });
                return;
            }

            res.status(200).json({
                msg: "downvote removed"
            });
            return;
        }

        const downvote = await prisma.postDownvote.create({
            data: { postId, userId },
        });

        if (!downvote) {
            res.status(400).json({
                msg: "unable to downvote"
            });
            return;
        }

        res.status(200).json({
            msg: "downvote added"
        });
        return;

    } catch (error) {
        console.log("error", error);
        res.status(500).json({
            msg: "internal server error"
        });
    }
};
