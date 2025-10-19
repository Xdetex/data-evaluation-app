// src/pages/WelcomeBack.tsx
import React, { useState } from "react";
import { FaCloudUploadAlt, FaFile, FaTimes } from "react-icons/fa";
import XdetexLogo from "/images/xdetex-logo.png";
import StepsCard from "../../components/steps-card";

const Welcome: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<string>("");

  const [showVideo, setShowVideo] = useState(false);
  const [showPdf, setShowPdf] = useState(false);

  // ---- Video & PDF Handling ----
  const handleVideoClick = () => {
    setShowVideo(true);
  };

  const handlePdfClick = () => {
    setShowPdf(true);
  };

  const closeModals = () => {
    setShowVideo(false);
    setShowPdf(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === "application/zip") {
        setSelectedFile(file);
        setSubmissionStatus("");
      } else {
        alert("Please upload a ZIP file.");
        setSelectedFile(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/zip") {
        setSelectedFile(file);
        setSubmissionStatus("");
      } else {
        alert("Please upload a ZIP file.");
        setSelectedFile(null);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = () => {
    if (selectedFile) {
      // Simulate file submission (replace with actual upload logic)
      console.log("Submitting file:", selectedFile);
      setSubmissionStatus("Thank you for the support!");
      setSelectedFile(null); // Reset selected file to null to revert to initial state
    } else {
      alert("Please select a ZIP file to submit.");
    }
  };
  const stepsData = [
    {
      title: "Step 1 – Go to Facebook Data Settings",
      steps: [
        "Open Settings & Privacy in your Facebook account.",
        "Search and open 'Download your information'.",
        "Choose 'Export your information' option.",
      ],
    },
    {
      title: "Step 2 – Create and Customize Export",
      steps: [
        "Click 'Create Export' and choose your Facebook profile.",
        "Select 'Export to device'.",
        "Pick required Custom information categories.",
        "Set Date Range: Last Year, Format: JSON, Quality: High.",
        "Start export and confirm with your password.",
      ],
    },
    {
      title: "Step 3 – Download and Upload Files",
      steps: [
        "Wait for the export to be ready and download the ZIP file.",
        "Extract the ZIP and open the folders.",
        "Upload only the required JSON files to the website.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 md:p-10 lg:p-20">
      <img
        src={XdetexLogo}
        alt="XDetex Logo"
        className="w-1/4 sm:w-1/6 md:w-1/8 max-w-full mx-auto mb-4 sm:mb-6 md:mb-15"
      />
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
        <div className="text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-2 text-primary-blue">
            Welcome Back
          </h1>
          <p className="text-gray-600 mb-4 sm:mb-6 md:mb-10 text-sm">
            Yet bed any for travelling assistance indulgence unpleasing.
            <br />
            Not thoughts all exercise blessing.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 mt-4 md:mt-0">
          <span className="font-Poppins text-sm sm:text-base">Guide</span>
          <div className="flex mb-5 sm:mb-4 md:mb-10 space-x-2 sm:space-x-4">
            <button
              onClick={handleVideoClick}
              className="bg-gray-200 text-gray-700 rounded-full p-2 sm:p-3 md:p-4 flex items-center justify-center hover:bg-gray-300 transition"
            >
              <svg
                width="24"
                height="24"
                sm:w-28
                sm:h-28
                md:w-32
                md:h-32
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.3463 2.66663H20.653C20.9623 2.66663 21.1996 2.66663 21.4076 2.68663C22.885 2.83196 24.0943 3.71996 24.6076 4.91596H7.39164C7.90498 3.71996 9.11431 2.83196 10.5916 2.68663C10.797 2.66663 11.0343 2.66663 11.3463 2.66663ZM8.41298 6.29729C6.55964 6.29729 5.03964 7.41729 4.53298 8.90263L4.50098 8.99596C5.03164 8.83596 5.58498 8.72929 6.14364 8.65863C7.58364 8.47329 9.40498 8.47329 11.5196 8.47329H20.709C22.8236 8.47329 24.6436 8.47329 26.085 8.65863C26.645 8.73063 27.197 8.83463 27.7276 8.99596L27.697 8.90263C27.1903 7.41729 25.6703 6.29729 23.8156 6.29729H8.41298Z"
                  fill="black"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M20.4371 10.056H11.5625C7.06379 10.056 4.81312 10.056 3.54912 11.372C2.28512 12.688 2.58245 14.72 3.17845 18.7854L3.74112 22.6414C4.20779 25.8294 4.44112 27.424 5.63712 28.3787C6.83445 29.3334 8.59712 29.3334 12.1265 29.3334H19.8731C23.4011 29.3334 25.1665 29.3334 26.3625 28.3787C27.5585 27.424 27.7918 25.8294 28.2585 22.6414L28.8211 18.7867C29.4171 14.72 29.7145 12.688 28.4505 11.372C27.1865 10.056 24.9358 10.056 20.4371 10.056ZM19.4411 21.0587C20.1865 20.5974 20.1865 19.4027 19.4411 18.9414L14.9465 16.1547C14.2225 15.7054 13.3331 16.2894 13.3331 17.2134V22.7867C13.3331 23.7107 14.2225 24.2934 14.9465 23.8454L19.4411 21.0587Z"
                  fill="black"
                />
              </svg>
            </button>
            <button
              onClick={handlePdfClick}
              className="bg-gray-200 text-gray-700 rounded-full p-2 sm:p-3 md:p-4 flex items-center justify-center hover:bg-gray-300 transition"
            >
              <svg
                width="20"
                height="20"
                sm:w-24
                sm:h-24
                md:w-30
                md:h-30
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.55556 0C1.59444 0 0 1.56953 0 3.5V24.5C0 26.4305 1.59444 28 3.55556 28H8V21.875C8 19.9445 9.59444 18.375 11.5556 18.375H21.3333V9.32422C21.3333 8.39453 20.9611 7.50312 20.2944 6.84687L14.3722 1.02266C13.7056 0.366406 12.8056 0 11.8611 0H3.55556ZM18.0833 9.625H12.8889C12.15 9.625 11.5556 9.03984 11.5556 8.3125V3.19922L18.0833 9.625ZM11.5556 20.7812C10.9444 20.7812 10.4444 21.2734 10.4444 21.875V28.875C10.4444 29.4766 10.9444 29.9688 11.5556 29.9688C12.1667 29.9688 12.6667 29.4766 12.6667 28.875V27.3438H13.3333C15.1722 27.3438 16.6667 25.8727 16.6667 24.0625C16.6667 22.2523 15.1722 20.7812 13.3333 20.7812H11.5556ZM13.3333 25.1562H12.6667V22.9688H13.3333C13.9444 22.9688 14.4444 23.4609 14.4444 24.0625C14.4444 24.6641 13.9444 25.1562 13.3333 25.1562ZM18.6667 20.7812C18.0556 20.7812 17.5556 21.2734 17.5556 21.875V28.875C17.5556 29.4766 18.0556 29.9688 18.6667 29.9688H20.4444C22.0389 29.9688 23.3333 28.6945 23.3333 27.125V23.625C23.3333 22.0555 22.0389 20.7812 20.4444 20.7812H18.6667ZM19.7778 27.7812V22.9688H20.4444C20.8111 22.9688 21.1111 23.2641 21.1111 23.625V27.125C21.1111 27.4859 20.8111 27.7812 20.4444 27.7812H19.7778ZM24.6667 21.875V28.875C24.6667 29.4766 25.1667 29.9688 25.7778 29.9688C26.3889 29.9688 26.8889 29.4766 26.8889 28.875V26.4688H28.4444C29.0556 26.4688 29.5556 25.9766 29.5556 25.375C29.5556 24.7734 29.0556 24.2812 28.4444 24.2812H26.8889V22.9688H28.4444C29.0556 22.9688 29.5556 22.4766 29.5556 21.875C29.5556 21.2734 29.0556 20.7812 28.4444 20.7812H25.7778C25.1667 20.7812 24.6667 21.2734 24.6667 21.875Z"
                  fill="black"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <h2 className="text-lg sm:text-xl font-medium mb-4 sm:mb-6 text-gray-600 text-center md:text-left">
        Steps
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 sm:justify-center lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-10">
        {stepsData.map((step, index) => (
          <StepsCard
            key={index}
            index={index}
            title={step.title}
            steps={step.steps}
          />
        ))}
      </div>
      <h2 className="text-lg sm:text-xl font-medium mb-4 sm:mb-6 text-gray-600 text-center md:text-left">
        Upload your file here
      </h2>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() =>
          !selectedFile &&
          !submissionStatus &&
          document.getElementById("file-upload")?.click()
        }
        className="border-2 border-dashed border-gray-300 rounded-xl sm:rounded-2xl p-10 sm:p-15 md:p-20 flex flex-col items-center justify-center cursor-pointer hover:border-primary-blue transition"
      >
        {selectedFile ? (
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <FaFile className="text-xl sm:text-2xl md:text-2xl text-primary-blue" />
            <span className="text-primary-blue py-2 sm:py-4 font-medium text-center sm:text-left">
              {selectedFile.name}
            </span>
            <button
              onClick={handleSubmit}
              className="py-1 sm:py-2 px-3 sm:px-4 bg-primary-blue text-white rounded-full font-medium hover:bg-white hover:text-primary-blue hover:border-2 transition w-full sm:w-auto"
            >
              Submit
            </button>
          </div>
        ) : submissionStatus ? (
          <>
            <FaCloudUploadAlt className="text-3xl sm:text-4xl md:text-5xl text-primary-blue mb-2" />
            <p className="text-primary-blue font-medium mb-1 text-center">
              Drag & drop files or Browse
            </p>
            <p className="text-gray-500 text-xs sm:text-sm">
              Supported formats: ZIP
            </p>
          </>
        ) : (
          <>
            <FaCloudUploadAlt className="text-3xl sm:text-4xl md:text-5xl text-primary-blue mb-2" />
            <p className="text-primary-blue font-medium mb-1 text-center">
              Drag & drop files or Browse
            </p>
            <p className="text-gray-500 text-xs sm:text-sm">
              Supported formats: ZIP
            </p>
          </>
        )}
        {submissionStatus && (
          <p className="text-green-600 text-center mt-2 sm:mt-4">
            {submissionStatus}
          </p>
        )}
        <input
          id="file-upload"
          type="file"
          accept=".zip"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
      {/* --- Video Modal --- */}
      {showVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 w-11/12 sm:w-3/4 md:w-2/3 relative">
            <button
              onClick={closeModals}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
            >
              <FaTimes size={15} />
            </button>
            <video
              controls
              className="w-full rounded-lg shadow-lg"
              src="/guide/facebook-guide.mp4"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}

      {/* --- PDF Modal --- */}
      {showPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 w-11/12 sm:w-3/4 md:w-2/3 h-[90vh] relative">
            <button
              onClick={closeModals}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
            >
              <FaTimes size={15} />
            </button>
            <iframe
              src="/guide/facebook-guide.pdf"
              className="w-full h-full rounded-lg"
              title="PDF Guide"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Welcome;
