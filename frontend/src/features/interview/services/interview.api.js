import axios from "axios";
import Interview from "../pages/Interview";

const api = axios.create({
    baseURL: "https://interview-ai-4cjo.onrender.com",
    withCredentials: true,
})


export const generateInterviewReport=async({jobDescription, selfDescription, resumeFile })=>{
try {
     const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    formData.append("resume", resumeFile)

    const response = await api.post("/api/interview", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })

    return response.data
} catch (error) {
    console.log(error);
    return null;
}
    

}


/**
 * @description Service to get interview report by interviewId.
 */
export const getInterviewReportById=async(interviewId)=>{
     try {
        const response=await api.get(`/api/interview/report/${interviewId}`);
        return response.data;
     } catch (error) {
        console.error("Error fetching interview report:", error);
    return null;
     }
}


/**
 * @description Service to get all interview reports of logged in user.
 */
export const getAllInterviewReports=async()=>{
      try {
        const response=await api.get('/api/interview');

        return response.data;
      } catch (error) {
        console.error("Error fetching interview reports:", error);
    return null;
      }
}