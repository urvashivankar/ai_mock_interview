"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModel";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment/moment";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [loading, setLoading] = useState(false);
  const [JsonResponse, setJsonResponse] = useState([]);
  // const { user } = useUser();
  const user = { primaryEmailAddress: { emailAddress: 'demo@example.com' } };
  const route = useRouter()
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const questionCount = process.env.NEXT_PUBLIC_INTERVIEW_QUESTION || 5;
      const InputPromt = `Generate ${questionCount} interview questions and answers in JSON format based on: Job Position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}. Return a JSON array of objects where each object has 'question' and 'answer' fields.`;

      let MockJsonResp;
      try {
        const result = await chatSession.sendMessage(InputPromt);
        const rawText = result.response.text();
        MockJsonResp = rawText
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
        console.log("Cleaned AI Response:", MockJsonResp);
      } catch (aiError) {
        console.warn("AI Generation Failed, switching to Simulation Mode:", aiError);
        toast.info("AI is busy. Entering Simulation Mode...");

        // Simulation Fallback Questions
        const simulationQuestions = [
          { question: `What are your core responsibilities as a ${jobPosition}?`, answer: "I handle end-to-end development, architecture, and team collaboration." },
          { question: `Explain a challenging project you worked on using ${jobDesc}.`, answer: "I worked on a high-traffic e-commerce platform where performance was key." },
          { question: `How do you stay updated with the latest trends in ${jobPosition}?`, answer: "I follow industry blogs, participate in open-source, and attend webinars." },
          { question: "Where do you see yourself in 5 years?", answer: "I aim to be a senior architect leading major technical initiatives." },
          { question: "Why should we hire you for this role?", answer: "My experience and passion for problem-solving make me an ideal fit." }
        ];
        MockJsonResp = JSON.stringify(simulationQuestions);
      }

      let parsedResp;
      try {
        parsedResp = JSON.parse(MockJsonResp);
      } catch (parseError) {
        console.error("JSON Parsing Error:", parseError);
        throw new Error("Invalid response format");
      }

      setJsonResponse(parsedResp);

      if (parsedResp) {
        const resp = await db.insert(MockInterview).values({
          mockId: uuidv4(),
          jsonMockResp: MockJsonResp,
          jobPosition: jobPosition,
          jobDesc: jobDesc,
          jobExperience: jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-yyyy"),
        }).returning({ mockId: MockInterview.mockId });

        if (resp && resp[0]?.mockId) {
          setOpenDialog(false);
          toast.success("Simulation/Interview generated successfully!");
          route.push('/dashboard/interview/' + resp[0].mockId);
        } else {
          throw new Error("Database insertion failed");
        }
      }
    } catch (error) {
      console.error("Critical Generation Error:", error);
      toast.error(`Error: ${error.message || "Something went wrong. Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all delay-100"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center">+ Add new</h2>
      </div>
      <Dialog open={openDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job interviewing
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  {/* <h2>Tell us more about your job interviewing</h2> */}
                  <h2>
                    Add Details about your job position/role, Job description
                    and years of experience
                  </h2>

                  <div className="mt-7 my-3">
                    <label>Job Role/Job Position</label>
                    <Input
                      onChange={(event) => setJobPosition(event.target.value)}
                      placeholder="Ex. Full Stack Developer"
                      required
                    />
                  </div>
                  <div className="mt-7 my-3">
                    <label>Job Description/Tech Stack (In Short)</label>
                    <Textarea
                      onChange={(event) => setJobDesc(event.target.value)}
                      placeholder="Ex. React, Angular, NodeJs, NextJs etc."
                      required
                    />
                  </div>
                  <div className="mt-7 my-3">
                    <label>Years of experience</label>
                    <Input
                      onChange={(event) => setJobExperience(event.target.value)}
                      placeholder="Ex. 5"
                      type="number"
                      max="50"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-5 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button disabled={loading} type="submit">
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin" /> Generating
                        from AI
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
