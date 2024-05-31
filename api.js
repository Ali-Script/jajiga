/**
 * @swagger
 * /:
 *   get:
 *     summary: home page | start
 *     description: check user validation 
 *     responses:
 *       200:
 *          description: succ
 *       440:
 *          description: no cookie found please login
 *       404:
 *          description: no user found please sign In
 *       403:
 *          description: this user has banned from website
 *       500: 
 *          description: server error
 * @swagger
 * /auth/sendEmail:
 *    post:
 *     summary: home page | start
 *     description: check user validation
 *     responses:
 *       200:
 *          description: succ
 *       440:
 *          description: no cookie found please login
 *       404:
 *          description: no user found please sign In
 *       403:
 *          description: this user has banned from website
 *       500:
 *          description: server error
 */