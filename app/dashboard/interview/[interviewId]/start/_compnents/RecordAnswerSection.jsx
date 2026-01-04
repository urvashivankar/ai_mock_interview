"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, StopCircle } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModel";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";

function RecordAnswerSection({ activeQuestionIndex, mockInterViewQuestion, interviewData }) {
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false)
  // const {user}=useUser()
  const user = { primaryEmailAddress: { emailAddress: 'demo@example.com' } };

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });
  if (error) {
    toast(error);
    return;
  }

  useEffect(() => {
    results.map((result) => {
      setUserAnswer((prevAns) => prevAns + result?.transcript);
    });
  }, [results]);

  const StartStopRecording = async () => {

    if (isRecording) {


      stopSpeechToText();




    } else {
      startSpeechToText();
    }
  };

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      UpdateUserAnswer();
    }
    // if (userAnswer?.length < 10) {
    //   setLoading(false)
    //   toast("Error while saving your answer, Please record again");
    //   return;
    // }

  }, [userAnswer])

  const UpdateUserAnswer = async () => {
    try {
      setLoading(true);
      const feedbackPrompt = `Job Position: ${interviewData?.jobPosition}, Job Description: ${interviewData?.jobDesc}, Interview Question: ${mockInterViewQuestion[activeQuestionIndex]?.question}, User Answer: ${userAnswer}. Based on the question and answer, please provide a rating and feedback (area of improvement) in 3-5 lines. Return the response in JSON format with 'rating' and 'feedback' fields.`;

      let mockJsonResp;
      try {
        const result = await chatSession.sendMessage(feedbackPrompt);
        const rawText = result.response.text();
        mockJsonResp = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        console.log("Cleaned Feedback Response:", mockJsonResp);
      } catch (aiError) {
        console.warn("AI Feedback Failed, switching to Simulation Mode:", aiError);
        // Simulation Fallback Feedback
        const simulationFeedback = {
          rating: "7",
          feedback: "Good answer! To improve, try to provide more specific examples from your past projects. Focus on detailing your individual contribution to the technical solutions mentioned."
        };
        mockJsonResp = JSON.stringify(simulationFeedback);
      }

      const JsonFeedbackResp = JSON.parse(mockJsonResp);

      const resp = await db.insert(UserAnswer)
        .values({
          mockIdRef: interviewData?.mockId,
          question: mockInterViewQuestion[activeQuestionIndex]?.question,
          correctAns: mockInterViewQuestion[activeQuestionIndex]?.answer,
          userAns: userAnswer,
          feedback: JsonFeedbackResp?.feedback,
          rating: JsonFeedbackResp?.rating,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format('DD-MM-yyyy')
        });

      if (resp) {
        toast.success('Answer recorded successfully!');
        setUserAnswer('');
        setResults([]);
      }
    } catch (error) {
      console.error("Error updating user answer:", error);
      toast.error("Failed to record answer. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5">
        <Image
          src={"/webcam.png"}
          width={200}
          height={200}
          className="absolute"
        />
        <Webcam
          mirrored={true}
          style={{
            height: "50vh",
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>
      <Button disabled={loading} variant="outline" onClick={StartStopRecording} className="my-10">
        {isRecording ? (
          <h2 className="flex items-center justify-center text-red-600 gap-2">
            <StopCircle />
            Recording...
          </h2>
        ) : (
          <h2 className="flex items-center justify-center gap-2">
            <Mic />
            Start Recording
          </h2>
        )}
      </Button>
    </div>
  );
}

export default RecordAnswerSection;
