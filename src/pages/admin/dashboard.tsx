import { useEffect, useState } from "react";
import {
  fetchParticipants,
  fetchUserFiles,
  deleteUserAllFiles,
  downloadAllFiles,
  sendRound,
} from "../../api/adminApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmDialog from "../../components/confirm-dialog";
import XdetexLogo from "../../../public/images/xdetex-logo.png";

type Participant = {
  id: number;
  email: string;
  file_status: boolean;
  send_mail_01: boolean;
  send_mail_02: boolean;
  date_uploaded?: string | null;
};

export default function AdminDashboard() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmailFiles, setSelectedEmailFiles] = useState<
    Record<string, string[]>
  >({});
  const [loadingRound1, setLoadingRound1] = useState(false);
  const [loadingRound2, setLoadingRound2] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortByStatus, setSortByStatus] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    loadParticipants();
  }, [page, sortByStatus]);

  async function loadParticipants() {
    setLoading(true);
    try {
      const res = await fetchParticipants(page, pageSize, sortByStatus);
      console.log("Participant Data :", res);
      setParticipants(res.participants || []);
      setTotal(res.total || 0);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load participants");
    } finally {
      setLoading(false);
    }
  }

  async function handleViewFiles(email: string) {
    try {
      toast.info(`Loading files for ${email}...`, { autoClose: 1200 });
      const res = await fetchUserFiles(email);
      setSelectedEmailFiles((s) => ({
        ...s,
        [email]: res.uploaded_files || [],
      }));
    } catch (e) {
      console.error(e);
      toast.error("Could not load user files");
    }
  }

  function confirmDelete(email: string) {
    setToDelete(email);
    setConfirmOpen(true);
  }

  async function doDelete() {
    if (!toDelete) return;
    setConfirmOpen(false);
    try {
      await deleteUserAllFiles(toDelete);
      toast.success(`Deleted all files for ${toDelete}`);
      // remove cached list + reload participants
      setSelectedEmailFiles((s) => {
        const copy = { ...s };
        delete copy[toDelete];
        return copy;
      });
      loadParticipants();
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete user files");
    } finally {
      setToDelete(null);
    }
  }

  async function handleSend(round: 1 | 2 | "all") {
    console.log("Round : ", round);
    if (round === 1) setLoadingRound1(true);
    if (round === 2) setLoadingRound2(true);
    if (round === "all") setLoadingAll(true);

    try {
      const res = await sendRound(round);
      toast.success(res.message || "Emails started sending");
      setTimeout(loadParticipants, 2000);
    } catch {
      toast.error("Failed to send emails");
    } finally {
      setLoadingRound1(false);
      setLoadingRound2(false);
      setLoadingAll(false);
    }
  }

  async function handleDownloadAll() {
    setDownloading(true);
    try {
      const blob = await downloadAllFiles();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "all_user_uploads.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Download started");
    } catch (e) {
      console.error(e);
      toast.error("Failed to create zip");
    } finally {
      setDownloading(false);
    }
  }

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-screen p-6 md:p-10 bg-white">
      <div>
        <img
          src={XdetexLogo}
          alt="XDetex Logo"
          className="w-4/5 md:w-1/6 max-w-1/4 mx-auto mb-10"
        />
      </div>
      <ToastContainer />
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-primary-blue">
          Admin Dashboard
        </h1>

        <div className="flex gap-3 items-center flex-wrap">
          <button
            onClick={() => handleSend(1)}
            disabled={loadingRound1}
            className="px-4 py-2 rounded-full text-sm bg-primary-blue text-white hover:opacity-90 disabled:opacity-60"
          >
            {loadingRound1 ? "Sending..." : "Send Round 1"}
          </button>

          <button
            onClick={() => handleSend(2)}
            disabled={loadingRound2}
            className="px-4 py-2 rounded-full text-sm bg-[#486370] text-white hover:opacity-90 disabled:opacity-60"
          >
            {loadingRound2 ? "Sending..." : "Send Round 2"}
          </button>

          <button
            onClick={() => handleSend("all")}
            disabled={loadingAll}
            className="px-4 py-2 rounded-full text-sm bg-white border-primary-blue border-1 text-primary-blue hover:opacity-90 disabled:opacity-60"
          >
            {loadingAll ? "Sending..." : "Send All"}
          </button>

          <button
            onClick={handleDownloadAll}
            disabled={downloading}
            className="px-3 py-2 text-sm rounded-md border hover:bg-gray-50"
          >
            {downloading ? "Preparing..." : "Download All Uploads"}
          </button>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-4 overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-sm text-gray-600">
              <th className="py-2 px-3">#</th>
              <th className="py-2 px-3">Email</th>
              <th className="py-2 px-3">Files Uploaded</th>
              <th className="py-2 px-3">File Status</th>
              <th className="py-2 px-3">Send Mail 01</th>
              <th className="py-2 px-3">Send Mail 02</th>
              <th className="py-2 px-3">Date Uploaded</th>
              <th className="py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  Loading participants...
                </td>
              </tr>
            ) : participants.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  No participants found.
                </td>
              </tr>
            ) : (
              participants.map((p, idx) => {
                const email = p.email;
                const files = selectedEmailFiles[email] || [];
                return (
                  <tr key={p.id} className="border-t">
                    <td className="py-3 px-3 text-sm">{idx + 1}</td>
                    <td className="py-3 px-3 text-sm break-words max-w-[200px]">
                      <div className="truncate" title={email}>
                        {email}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-sm">
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={() => handleViewFiles(email)}
                          className="text-sm text-primary-blue underline"
                        >
                          View files
                        </button>
                        <span className="text-xs text-gray-500">
                          {files.length > 0 ? `${files.length} file(s)` : "—"}
                        </span>
                      </div>

                      {files.length > 0 && (
                        <ul className="mt-2 text-xs text-gray-700">
                          {files.map((fn) => (
                            <li key={fn} className="truncate" title={fn}>
                              {fn}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>

                    <td className="py-3 px-3 text-sm">
                      {p.file_status ? (
                        <span className="text-green-600 font-medium">
                          Uploaded
                        </span>
                      ) : (
                        <span className="text-red-600">Missing</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-sm">
                      {p.send_mail_01 ? "Yes" : "No"}
                    </td>
                    <td className="py-3 px-3 text-sm">
                      {p.send_mail_02 ? "Yes" : "No"}
                    </td>
                    <td className="py-3 px-3 text-sm">
                      {p.date_uploaded || "—"}
                    </td>

                    <td className="py-3 px-3 text-sm">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleViewFiles(email)}
                          className="px-1 py-1 text-xs rounded-md border border-primary-blue"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 29 29"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M14.5952 2.71876C8.80248 2.71876 4.04165 7.14489 3.57765 12.7878H2.41644C2.23678 12.7877 2.06114 12.841 1.91185 12.941C1.76255 13.0409 1.64633 13.183 1.57796 13.3492C1.50958 13.5153 1.49214 13.698 1.52783 13.8741C1.56353 14.0502 1.65076 14.2117 1.77844 14.3381L3.80844 16.3512C3.97816 16.5194 4.20747 16.6138 4.44644 16.6138C4.68542 16.6138 4.91472 16.5194 5.08444 16.3512L7.11444 14.3381C7.24212 14.2117 7.32935 14.0502 7.36505 13.8741C7.40075 13.698 7.3833 13.5153 7.31493 13.3492C7.24655 13.183 7.13033 13.0409 6.98104 12.941C6.83174 12.841 6.65611 12.7877 6.47644 12.7878H5.3974C5.85657 8.15868 9.79332 4.53126 14.5952 4.53126C16.1784 4.52821 17.7359 4.93129 19.1188 5.70198C20.5017 6.47267 21.6639 7.5852 22.4941 8.93322C22.5549 9.03782 22.6359 9.12921 22.7325 9.20198C22.8292 9.27476 22.9394 9.32746 23.0567 9.35697C23.174 9.38648 23.296 9.39221 23.4156 9.37382C23.5351 9.35543 23.6498 9.31329 23.7528 9.24988C23.8558 9.18647 23.9451 9.10309 24.0154 9.00463C24.0857 8.90618 24.1355 8.79466 24.162 8.67663C24.1885 8.5586 24.1911 8.43647 24.1697 8.31742C24.1482 8.19838 24.1032 8.08483 24.0371 7.98347C23.0449 6.37205 21.656 5.04197 20.0032 4.12027C18.3504 3.19857 16.4877 2.71603 14.5952 2.71876ZM25.1826 12.6476C25.013 12.4801 24.7842 12.3862 24.5459 12.3862C24.3075 12.3862 24.0787 12.4801 23.9091 12.6476L21.8706 14.6607C21.7426 14.787 21.655 14.9485 21.619 15.1247C21.5831 15.3008 21.6003 15.4837 21.6686 15.6501C21.7368 15.8164 21.8531 15.9587 22.0024 16.0588C22.1518 16.1589 22.3276 16.2123 22.5074 16.2122H23.5937C23.1321 20.8401 19.1821 24.4688 14.3572 24.4688C12.7691 24.4729 11.2063 24.0704 9.81776 23.2996C8.4292 22.5289 7.26103 21.4155 6.42448 20.0656C6.36196 19.9643 6.2801 19.8763 6.18357 19.8066C6.08703 19.7369 5.97772 19.6869 5.86187 19.6595C5.74602 19.6321 5.6259 19.6277 5.50837 19.6467C5.39084 19.6657 5.2782 19.7076 5.17688 19.7702C4.97226 19.8964 4.82618 20.0988 4.77077 20.3328C4.71537 20.5667 4.75518 20.8131 4.88144 21.0178C5.88044 22.6308 7.27567 23.9614 8.93432 24.8827C10.593 25.804 12.4598 26.2855 14.3572 26.2813C20.1669 26.2813 24.9482 21.8588 25.4134 16.2122H26.5831C26.7629 16.2123 26.9387 16.1589 27.0881 16.0588C27.2374 15.9587 27.3537 15.8164 27.4219 15.6501C27.4902 15.4837 27.5074 15.3008 27.4715 15.1247C27.4355 14.9485 27.3479 14.787 27.2199 14.6607L25.1826 12.6476Z"
                              fill="#005179"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => confirmDelete(email)}
                          className="px-1 py-1 text-xs rounded-md border text-red-500 border-red-500 hover:bg-red-50"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 26 26"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10.8332 5.41667H15.1665C15.1665 4.84203 14.9382 4.29093 14.5319 3.8846C14.1256 3.47827 13.5745 3.25 12.9998 3.25C12.4252 3.25 11.8741 3.47827 11.4678 3.8846C11.0614 4.29093 10.8332 4.84203 10.8332 5.41667ZM9.20817 5.41667C9.20817 4.91874 9.30624 4.42568 9.49679 3.96566C9.68734 3.50563 9.96664 3.08764 10.3187 2.73555C10.6708 2.38346 11.0888 2.10417 11.5488 1.91362C12.0089 1.72307 12.5019 1.625 12.9998 1.625C13.4978 1.625 13.9908 1.72307 14.4508 1.91362C14.9109 2.10417 15.3289 2.38346 15.681 2.73555C16.033 3.08764 16.3123 3.50563 16.5029 3.96566C16.6934 4.42568 16.7915 4.91874 16.7915 5.41667H23.0207C23.2362 5.41667 23.4428 5.50227 23.5952 5.65464C23.7476 5.80702 23.8332 6.01368 23.8332 6.22917C23.8332 6.44465 23.7476 6.65132 23.5952 6.80369C23.4428 6.95606 23.2362 7.04167 23.0207 7.04167H21.5907L20.3232 20.1619C20.2259 21.1672 19.7577 22.1003 19.0098 22.7791C18.2619 23.4579 17.288 23.8337 16.278 23.8333H9.72167C8.71186 23.8334 7.7382 23.4575 6.99053 22.7787C6.24287 22.0999 5.7748 21.167 5.67759 20.1619L4.409 7.04167H2.979C2.76352 7.04167 2.55685 6.95606 2.40448 6.80369C2.25211 6.65132 2.1665 6.44465 2.1665 6.22917C2.1665 6.01368 2.25211 5.80702 2.40448 5.65464C2.55685 5.50227 2.76352 5.41667 2.979 5.41667H9.20817ZM11.3748 10.5625C11.3748 10.347 11.2892 10.1403 11.1369 9.98798C10.9845 9.8356 10.7778 9.75 10.5623 9.75C10.3468 9.75 10.1402 9.8356 9.98781 9.98798C9.83544 10.1403 9.74984 10.347 9.74984 10.5625V18.6875C9.74984 18.903 9.83544 19.1097 9.98781 19.262C10.1402 19.4144 10.3468 19.5 10.5623 19.5C10.7778 19.5 10.9845 19.4144 11.1369 19.262C11.2892 19.1097 11.3748 18.903 11.3748 18.6875V10.5625ZM15.4373 9.75C15.6528 9.75 15.8595 9.8356 16.0119 9.98798C16.1642 10.1403 16.2498 10.347 16.2498 10.5625V18.6875C16.2498 18.903 16.1642 19.1097 16.0119 19.262C15.8595 19.4144 15.6528 19.5 15.4373 19.5C15.2218 19.5 15.0152 19.4144 14.8628 19.262C14.7104 19.1097 14.6248 18.903 14.6248 18.6875V10.5625C14.6248 10.347 14.7104 10.1403 14.8628 9.98798C15.0152 9.8356 15.2218 9.75 15.4373 9.75ZM7.295 20.0059C7.35344 20.6089 7.63435 21.1686 8.08299 21.5758C8.53162 21.983 9.11581 22.2085 9.72167 22.2083H16.278C16.8839 22.2085 17.4681 21.983 17.9167 21.5758C18.3653 21.1686 18.6462 20.6089 18.7047 20.0059L19.9592 7.04167H6.0405L7.295 20.0059Z"
                              fill="#E10000"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6 flex-wrap gap-3">
        <button
          onClick={() => setSortByStatus((s) => !s)}
          className="px-2 py-1 text-sm border rounded-full "
        >
          {sortByStatus ? "Clear Sorting" : "Sort by File Status"}
        </button>
        <div className="flex gap-3">
          <div className="text-xs flex justify-center items-center text-gray-600">
            Page {page} of {totalPages || 1}
          </div>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-2 py-1 text-xs border rounded-full disabled:opacity-30"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-2 py-1 text-xs border rounded-full disabled:opacity-30"
          >
            Next
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete All Files"
        message={`Are you sure you want to delete all uploaded files for ${toDelete}?`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={doDelete}
        confirmLabel="Delete"
      />
    </div>
  );
}
