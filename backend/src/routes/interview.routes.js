import express from 'express';
import authUser from '../middlewares/auth.middleware.js';
import {generateInterviewReportController,getAllInterviewReportsController,getInterviewReportByIdController} from '../controllers/interview.controller.js'
import upload from '../middlewares/file.middleware.js';


const router=express.Router();

/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description,resume pdf and job description.
 * @access private
 */
router.post("/", authUser, upload.single("resume"),generateInterviewReportController);


/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId.
 * @access private
 */
router.get('/report/:interviewId',authUser,getInterviewReportByIdController)


/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
router.get('/',authUser,getAllInterviewReportsController)


export default router;