import interviewReportModel from "../models/interviewReport.model.js";
import generateInterviewReport from "../services/ai.service.js";

import pdf from 'pdf-parse-new'



/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterviewReportController(req,res) {
    try {
      if (!req.file) return res.status(400).json({ message: "Resume file is required" });


        const resumeContent = await pdf(req.file.buffer);
        console.log(resumeContent.text); 
        const {selfDescription,jobDescription}=req.body;
      

        const interviewReportByai=await generateInterviewReport({
            resume:resumeContent.text,
            jobDescription,
            selfDescription
        })
        console.log("AI RESPONSE:--------", interviewReportByai)
        const interviewReport=await interviewReportModel.create({
            id:req.user.id,
            resume:resumeContent.text,
            jobDescription,
            selfDescription,
            ...interviewReportByai
        })

        return res.status(201).json({
            message:"Interview Report generated successfully",
            interviewReport

        })
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server error"});
    }
}



/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req,res) {
    try {
        const {interviewId}=req.params;

        const interviewReport=await interviewReportModel.findOne({_id:interviewId,user:req.user.id});

          if (!interviewReport) {
            return res.status(404).json({ message: "Report not found" }); // 404 is better than 400
        }

       return res.status(200).json({
        message:"Interview Report fetched succcessfuly",
        interviewReport
       })
    } catch (error) {
         console.error(error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
}



/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req,res) {
    try {
          const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")


        if (!interviewReports || interviewReports.length === 0) {
            return res.status(404).json({ message: "No interview reports exist" });
        }

        return res.status(200).json({
            message:"All interview Reports fetched successfully",
            interviewReports
        })

    } catch (error) {
         console.error(error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
}
export{
    generateInterviewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController
}