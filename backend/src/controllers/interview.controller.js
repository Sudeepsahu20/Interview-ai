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
      

        // const interviewReportByai=await generateInterviewReport({
        //     resume:resumeContent.text,
        //     jobDescription,
        //    // selfDescription
        // })

        const interviewReportByai = { aiSummary: "Dummy AI summary" };

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

export{
    generateInterviewReportController,
}