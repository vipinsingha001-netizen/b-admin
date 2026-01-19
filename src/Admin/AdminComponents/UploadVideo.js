import React, { useState, useEffect } from "react";
import { FaPlusCircle, FaTimesCircle } from "react-icons/fa";
import { useAdmin } from "../../context/AdminContext";
import { toast } from "react-toastify";

const UploadVideo = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoText, setVideoText] = useState("");
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [expandedVideo, setExpandedVideo] = useState(null);
  const [expandedVideoText, setExpandedVideoText] = useState("");

  const { uploadVideo, getUploadedVideos, deleteAllVideos } = useAdmin();

  useEffect(() => {
    const fetchUploadedVideos = async () => {
      const data = await getUploadedVideos();
      if (data.videos) setUploadedVideos(data.videos);
    };
    fetchUploadedVideos();
  }, []);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedVideo) return toast.error("Please select a video");
    if (!videoText.trim()) return toast.error("Please enter a description");

    const response = await uploadVideo(selectedVideo, videoText);
    if (response) {
      setSelectedVideo(null);
      setVideoPreview(null);
      setVideoText("");
      const videos = await getUploadedVideos();
      if (videos) setUploadedVideos(videos.videos);
      toast.success("Video uploaded successfully!");
    }
  };

  const handleDeleteAllVideos = async () => {
    const response = await deleteAllVideos();
    if (response) {
      setUploadedVideos([]);
      toast.success("All videos deleted successfully");
    }
  };

  return (
    <div className="w-full flex flex-col pt-20 items-center px-6">
      <input
        type="file"
        id="upload-video"
        accept="video/*"
        className="hidden"
        onChange={handleVideoChange}
      />

      <label
        htmlFor="upload-video"
        className="cursor-pointer mb-4 flex items-center gap-2 text-green-600 hover:text-green-700 text-lg font-medium"
      >
        <FaPlusCircle /> Upload 1 Video
      </label>

      {videoPreview && (
        <div className="w-full max-w-md">
          <video
            src={videoPreview}
            controls
            className="w-full rounded-lg mb-4"
          />
          <textarea
            value={videoText}
            onChange={(e) => setVideoText(e.target.value)}
            placeholder="Enter description..."
            className="w-full border rounded-lg p-2 mb-3"
          />
          <button
            onClick={handleUpload}
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            Upload
          </button>
        </div>
      )}

      {/* Previous Uploaded */}
      <div className="flex justify-between w-full mt-6">
        <h1 className="font-bold">Previous Uploaded Videos</h1>
        <button
          onClick={handleDeleteAllVideos}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm"
        >
          Delete All
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4 w-full">
        {uploadedVideos.map((video, idx) => (
          <div
            key={idx}
            className="relative w-full aspect-square border rounded-lg overflow-y-auto overflow-x-hidden shadow"
          >
            <video
              src={`${process.env.REACT_APP_API_URL}/${video.path}`}
              controls
              className="object-cover w-full h-[80%]"
            />
            <p className="text-sm p-2 text-black h-[10%]">{video.text}</p>
            <button
              onClick={() => {
                setExpandedVideo(
                  `${process.env.REACT_APP_API_URL}/${video.path}`
                );
                setExpandedVideoText(video.text);
              }}
              className="absolute bottom-2 right-2 bg-white px-2 py-1 text-xs rounded shadow"
            >
              View
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {expandedVideo && (
        <div
          onClick={() => setExpandedVideo(null)}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        >
          <div className="relative max-w-3xl w-full p-4">
            <video
              src={expandedVideo}
              controls
              className="w-full  rounded-lg"
            />
            <p className="text-white pl-4 py-1">{expandedVideoText}</p>
            <button
              onClick={() => setExpandedVideo(null)}
              className="absolute top-2 right-2 bg-white p-2 rounded-full"
            >
              <FaTimesCircle className="text-red-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadVideo;
