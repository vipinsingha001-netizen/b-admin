import React, { useState, useEffect } from "react";
import { FaPlusCircle, FaTimesCircle } from "react-icons/fa";
import { useAdmin } from "../../context/AdminContext";
import { toast } from "react-toastify";

const UploadImages = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState([]);
  const [expandedImage, setExpandedImage] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]); // Added state for uploaded images
  const { uploadImages, getUploadedImages, deleteAllImages } = useAdmin(); // Added deleteAllImages from useAdmin

  useEffect(() => {
    const fetchUploadedImages = async () => {
      const data = await getUploadedImages();
      if (data.images) {
        setUploadedImages(data.images);
      }
    };
    fetchUploadedImages();
  }, []); // Fetch uploaded images on component mount

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxAllowed = 10 - selectedFiles.length;
    const limitedFiles = files.slice(0, maxAllowed);

    const newPreviews = limitedFiles.map((file) => URL.createObjectURL(file));
    setSelectedFiles((prev) => [...prev, ...limitedFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);

    const newProgress = limitedFiles.map(() => 0);
    setUploadProgress((prev) => [...prev, ...newProgress]);
    simulateProgress(selectedFiles.length, limitedFiles.length);
  };

  const simulateProgress = (startIndex, count) => {
    for (let i = 0; i < count; i++) {
      const index = startIndex + i;
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress((prev) => {
          const updated = [...prev];
          updated[index] = progress;
          return updated;
        });
        if (progress >= 100) clearInterval(interval);
      }, 100);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    const updatedProgress = uploadProgress.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setPreviews(updatedPreviews);
    setUploadProgress(updatedProgress);
  };

  const handleUpload = async () => {
    if (previews.length === 0) {
      toast.error("No images selected for upload.");
      return;
    }
    const response = await uploadImages(selectedFiles);
    if (response) {
      setSelectedFiles([]);
      setPreviews([]);
      setUploadProgress([]);
      // Fetch uploaded images after successful upload
      const images = await getUploadedImages();
      if (images) {
        setUploadedImages(images);
      }
    }
  };

  const handleDeleteAllImages = async () => {
    const response = await deleteAllImages();
    if (response) {
      setUploadedImages([]); // Clear the state of uploaded images
      toast.success("All images deleted successfully");
    }
  };

  return (
    <div className="w-full flex flex-col pt-20 items-center justify-center px-4 sm:px-6 md:px-10 py-6">
      <input
        type="file"
        id="upload"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
        disabled={selectedFiles.length >= 10}
      />

      <label
        htmlFor="upload"
        className="cursor-pointer mb-4 flex items-center gap-2 text-green-600 hover:text-green-700 text-base sm:text-lg font-medium"
      >
        <FaPlusCircle className="h-5 w-5 sm:h-6 sm:w-6" />
        {selectedFiles.length < 10
          ? `Upload Images (${selectedFiles.length}/10)`
          : `Max 10 images uploaded`}
      </label>

      {previews[0] && <h1 className="py-2 font-bold w-full">Images Preview</h1>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 w-full max-w-7xl">
        {previews.map((src, index) => (
          <div
            key={index}
            className="relative w-full aspect-square group border rounded-lg overflow-hidden shadow-sm"
          >
            <img
              src={src}
              alt={`Preview ${index + 1}`}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />

            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-red-500 hover:text-white transition"
            >
              <FaTimesCircle className="text-red-500 group-hover:text-white" />
            </button>

            <button
              onClick={() => setExpandedImage(src)}
              className="absolute bottom-2 right-2 bg-white px-2 py-1 text-xs sm:text-sm rounded shadow hover:bg-blue-500 hover:text-white transition"
            >
              View
            </button>

            {uploadProgress[index] < 100 && (
              <div className="absolute bottom-0 left-0 w-full h-2 sm:h-3 bg-gray-200">
                <div
                  className="bg-green-500 h-full transition-all rounded-r"
                  style={{ width: `${uploadProgress[index]}%` }}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="p-4">
        <button
          onClick={handleUpload}
          className="bg-zinc-200 hover:bg-zinc-300 text-green-500 font-bold py-2 px-4 rounded-lg"
        >
          Upload
        </button>
      </div>
      <div className="flex justify-between items-center w-full">
        <h1 className="py-2 font-bold ">Previous Uploaded Images</h1>{" "}
        <div className="">
          <button
            onClick={handleDeleteAllImages}
            className="bg-red-500 hover:bg-red-700 text-white text-xs font-bold py-1 px-3 rounded"
          >
            Delete All Images
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 w-full max-w-7xl">
        {/* Display uploaded images */}
        {uploadedImages.map((image, index) => (
          <div
            key={index}
            className="relative w-full aspect-square group border rounded-lg overflow-hidden shadow-sm"
          >
            <img
              src={`${process.env.REACT_APP_API_URL}/${image}`}
              alt={`Uploaded ${index + 1}`}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />

            <button
              onClick={() =>
                setExpandedImage(`${process.env.REACT_APP_API_URL}/${image}`)
              }
              className="absolute bottom-2 right-2 bg-white px-2 py-1 text-xs sm:text-sm rounded shadow hover:bg-blue-500 hover:text-white transition"
            >
              View
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {expandedImage && (
        <div
          onClick={() => setExpandedImage(null)}
          className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
        >
          <div className="relative w-full max-w-4xl max-h-[90vh]">
            <img
              src={expandedImage}
              alt="Full"
              className="w-full h-auto max-h-[90vh] rounded-lg shadow-2xl object-contain"
            />
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-red-500 hover:text-white transition"
            >
              <FaTimesCircle className="text-red-500 hover:text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadImages;
