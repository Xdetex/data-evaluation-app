import React, { useState, useEffect } from "react";
import JSZip from "jszip";
import { FaCloudUploadAlt, FaFile } from "react-icons/fa";

const REQUIRED_FILES = [
  "time_spent_on_facebook.json",
  "your_comment_active_days.json",
  "facebook_reels_usage_information.json",
  "your_notifications_tab_activity.json",
  "your_facebook_watch_activity_in_the_last_28_days.json",
];

interface FileUploadSectionProps {
  email: string;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({ email }) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [missingFiles, setMissingFiles] = useState<string[]>([]);
  const [extraFiles, setExtraFiles] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [progressMessage, setProgressMessage] = useState<string>("");
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [showAllExtras, setShowAllExtras] = useState(false);
  const [alreadyUploaded, setAlreadyUploaded] = useState<boolean>(false);
  const [lastUploadDate, setLastUploadDate] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  // Check if user has uploaded before
  useEffect(() => {
    const checkPreviousUploads = async () => {
      try {
        const response = await fetch(`${baseUrl}/admin/check-upload/${email}`);
        if (!response.ok) throw new Error("Failed to check upload status");
        const data = await response.json();
        if (data.uploaded) {
          setAlreadyUploaded(true);
          setLastUploadDate(data.last_uploaded_date);
        }
      } catch (err) {
        console.error("Error checking upload status:", err);
      }
    };
    if (email) checkPreviousUploads();
  }, [email, baseUrl]);

  const computeValidationFromUploaded = (fileList: File[]) => {
    const uploadedNames = fileList.map((f) => f.name);
    const missing = REQUIRED_FILES.filter((r) => !uploadedNames.includes(r));
    const extras = uploadedNames.filter((n) => !REQUIRED_FILES.includes(n));
    return {
      missing,
      extras,
      foundCount: REQUIRED_FILES.length - missing.length,
    };
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setHasInteracted(true);
    setLoading(true);
    setStatusMessage("");
    setProgressMessage("");
    setMissingFiles([]);
    setExtraFiles([]);

    const allFiles = Array.from(files);
    const zips = allFiles.filter((f) => f.name.toLowerCase().endsWith(".zip"));
    const jsons = allFiles.filter((f) =>
      f.name.toLowerCase().endsWith(".json")
    );

    if (jsons.length > 0) {
      const existingNames = new Set(uploadedFiles.map((f) => f.name));
      const newJsonFiles = jsons.filter((f) => !existingNames.has(f.name));
      const merged = [...uploadedFiles, ...newJsonFiles];
      setUploadedFiles(merged);

      const { missing, extras, foundCount } =
        computeValidationFromUploaded(merged);
      setMissingFiles(missing);
      setExtraFiles(extras);
      setProgressMessage(
        `${foundCount}/${REQUIRED_FILES.length} files uploaded`
      );

      if (foundCount === REQUIRED_FILES.length) {
        setStatusMessage("All required files selected — ready to submit.");
      } else if (newJsonFiles.length === 0 && jsons.length > 0) {
        setStatusMessage(
          "Selected files were already uploaded. No new files added."
        );
      } else {
        setStatusMessage(
          `${foundCount}/${REQUIRED_FILES.length} required files uploaded. Some files are still missing.`
        );
      }
    }

    if (zips.length > 0) {
      const zipFile = zips[0];
      try {
        const zip = await JSZip.loadAsync(zipFile);
        // Normalize entries and keep mapping to JSZip file objects
        const entries = Object.entries(zip.files).map(([path, entry]) => ({
          path: path.replace(/\\/g, "/"),
          entry,
        }));

        // Find required files that exist in the zip (by checking path end)
        const foundRequiredNames: string[] = [];
        for (const reqName of REQUIRED_FILES) {
          const match = entries.find(({ path }) => path.endsWith(reqName));
          if (match) foundRequiredNames.push(reqName);
        }

        // Prepare list of extras (non-required files inside the zip)
        const extrasInZip = entries
          .map(({ path }) => path)
          .filter((p) => !REQUIRED_FILES.some((r) => p.endsWith(r)));

        // Extract only the required files (as blobs) and create real File objects
        const filesFromZip: File[] = [];
        for (const reqName of foundRequiredNames) {
          const match = entries.find(({ path }) => path.endsWith(reqName));
          if (!match) continue;
          // read content as blob (preserves true content)
          const blobData = await match.entry.async("blob");
          const fileName = reqName; // keep only file name (not full path)
          filesFromZip.push(
            new File([blobData], fileName, { type: "application/json" })
          );
        }

        // Merge these extracted files with any previously selected JSON files (avoid duplicates by name)
        const existingNames = new Set(uploadedFiles.map((f) => f.name));
        const newFiles = filesFromZip.filter((f) => !existingNames.has(f.name));
        const merged = [...uploadedFiles, ...newFiles];
        setUploadedFiles(merged);

        // Recompute validation using merged list
        const { missing, extras, foundCount } =
          computeValidationFromUploaded(merged);

        // Combine extras from merged (files user explicitly selected) with zip extras (paths).
        // For extras show either filename or path; keep unique.
        const combinedExtras = [
          ...new Set([
            ...extras, // extras from JSON uploads (filenames not in REQUIRED_FILES)
            ...extrasInZip.map((p) => {
              // show only file name for nicer UI
              const parts = p.split("/");
              return parts[parts.length - 1] || p;
            }),
          ]),
        ];

        setMissingFiles(missing);
        setExtraFiles(combinedExtras);

        setProgressMessage(
          `${foundCount}/${REQUIRED_FILES.length} files found (including ZIP contents)`
        );

        if (missing.length === 0) {
          setStatusMessage(
            "All required files found inside ZIP — ready to submit."
          );
        } else {
          setStatusMessage(
            `${foundCount}/${REQUIRED_FILES.length} required files found inside ZIP. Some files are missing.`
          );
        }
      } catch (err) {
        console.error("ZIP read error:", err);
        setStatusMessage(
          "Unable to read ZIP file. Please upload a valid ZIP file."
        );
      }
    }

    setLoading(false);
  };

  const handleRemoveFile = (filename: string) => {
    const remaining = uploadedFiles.filter((f) => f.name !== filename);
    setUploadedFiles(remaining);
    const { missing, extras, foundCount } =
      computeValidationFromUploaded(remaining);
    setMissingFiles(missing);
    setExtraFiles(extras);
    setProgressMessage(`${foundCount}/${REQUIRED_FILES.length} files uploaded`);
    setHasInteracted(true);
    if (foundCount === REQUIRED_FILES.length) {
      setStatusMessage("All required files selected — ready to submit.");
    } else {
      setStatusMessage(
        `${foundCount}/${REQUIRED_FILES.length} required files uploaded. Some files are still missing.`
      );
    }
  };

  const handleSubmit = async () => {
    setHasInteracted(true);
    const { missing, foundCount } =
      computeValidationFromUploaded(uploadedFiles);
    if (missing.length > 0) {
      setMissingFiles(missing);
      setStatusMessage(
        `Cannot submit — ${foundCount}/${REQUIRED_FILES.length} files uploaded. Please upload the missing files.`
      );
      return;
    }

    setStatusMessage("All required files are ready. Uploading to server...");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      uploadedFiles.forEach((file) => formData.append("files", file));

      const response = await fetch(`${baseUrl}/upload/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      console.log("Upload result:", data);
      setStatusMessage(" Upload Successful!");
      setUploadSuccess(true);
    } catch (err) {
      console.error("Upload error:", err);
      setStatusMessage(" Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* If user has already uploaded */}
      {alreadyUploaded ? (
        <div className="text-center bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm mt-8">
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            You have already uploaded your files.
          </h3>
          <p className="text-gray-600 text-sm mb-3">
            Uploaded on:{" "}
            <span className="font-semibold text-primary-blue">
              {new Date(lastUploadDate || "").toLocaleDateString("en-US", {
                timeZone: "Asia/Colombo",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </p>
          <p className="text-gray-500 text-sm">
            If you want to delete or re-upload, please contact the XDetex admin.
          </p>
          <p className="text-gray-500 text-sm font-light italic">
            yashedthisara2001@gmail.com
          </p>
        </div>
      ) : (
        <>
          <div className="text-center mb-6">
            <h2 className="text-xl font-medium mb-2 text-gray-700">
              Upload your data files
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              You can upload multiple JSON files at once or upload a ZIP file
              that contains the required JSON files.
            </p>
          </div>

          {/* Upload Input */}
          <label
            htmlFor="file-input"
            className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition text-center cursor-pointer
    ${
      uploadSuccess
        ? "border-gray-300 bg-gray-100 cursor-not-allowed opacity-60"
        : "border-gray-300 hover:border-primary-blue"
    }
  `}
            onClick={(e) => uploadSuccess && e.preventDefault()} // Disable click
          >
            {loading ? (
              <div className="flex flex-col items-center space-y-3">
                <div className="w-8 h-8 border-4 border-primary-blue border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 text-sm">Checking files...</p>
              </div>
            ) : uploadSuccess ? (
              <>
                <FaCloudUploadAlt className="text-4xl text-gray-400 mb-2" />
                <p className="text-gray-500 font-medium">
                  Files uploaded successfully
                </p>
                <p className="text-gray-400 text-xs">Upload disabled</p>
              </>
            ) : (
              <>
                <FaCloudUploadAlt className="text-4xl text-primary-blue mb-2" />
                <p className="text-primary-blue font-medium mb-1">
                  Click here or drag & drop files to upload
                </p>
                <p className="text-gray-500 text-xs sm:text-sm mb-1">
                  You may select multiple JSON files at once
                </p>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Supported: .json or .zip
                </p>
              </>
            )}
            <input
              id="file-input"
              type="file"
              accept=".json,.zip"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploadSuccess}
            />
          </label>

          {/* Selected Files */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6 bg-gray-50 rounded-xl p-4 shadow-sm">
              <h3 className="text-lg font-medium text-gray-700 mb-3">
                Selected files
              </h3>
              <ul>
                {uploadedFiles.map((f) => (
                  <li
                    key={f.name}
                    className="flex justify-between items-center py-2 border-b border-gray-200"
                  >
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <FaFile className="text-primary-blue flex-shrink-0" />
                      <span
                        className="text-gray-700 text-sm sm:text-base truncate max-w-[180px] sm:max-w-[300px] md:max-w-[400px]"
                        title={f.name}
                      >
                        {f.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(f.name)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Missing or Extra */}
          {hasInteracted &&
            (missingFiles.length > 0 || extraFiles.length > 0) && (
              <div className="mt-6 bg-white rounded-xl p-4 border border-gray-200">
                {missingFiles.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-red-600 font-medium mb-1">
                      Missing files ({missingFiles.length})
                    </h4>
                    <ul className="text-sm text-gray-700 list-disc ml-6">
                      {missingFiles.map((m) => (
                        <li key={m}>{m}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {extraFiles.length > 0 && (
                  <div>
                    <h4 className="text-yellow-600 font-medium mb-1">
                      Extra or unexpected files ({extraFiles.length})
                    </h4>
                    <ul className="text-sm text-gray-700 list-disc ml-6">
                      {(showAllExtras
                        ? extraFiles
                        : extraFiles.slice(0, 5)
                      ).map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                    {extraFiles.length > 5 && (
                      <button
                        onClick={() => setShowAllExtras(!showAllExtras)}
                        className="mt-2 hover:text-gray-700 text-primary-blue italic text-xs font-medium transition"
                      >
                        {showAllExtras
                          ? "Show less"
                          : `Show more (${extraFiles.length - 5} more)`}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

          {/* Status */}
          {(progressMessage || statusMessage) && (
            <div className="mt-4 text-center">
              {progressMessage && (
                <p className="text-sm text-gray-600">{progressMessage}</p>
              )}
              {statusMessage && (
                <p
                  className={`mt-2 font-medium ${
                    statusMessage.toLowerCase().includes("missing")
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {statusMessage}
                </p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleSubmit}
              disabled={loading || uploadSuccess}
              className={`py-3 px-8 rounded-full font-medium transition disabled:opacity-60 
              ${
                uploadSuccess
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary-blue text-white hover:bg-white hover:text-primary-blue hover:border-2"
              }`}
            >
              {uploadSuccess ? "Files Submitted" : "Submit Files"}
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default FileUploadSection;
