import React, { useState, useEffect, useMemo } from "react";
import Loader from "../../common/Loader";

function FilePreview({ file }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFileContent = async () => {
      try {
        setLoading(true);
        const blob = new Blob([base64ToArrayBuffer(file.base64data)], { type: file.type });
        setContent(blob);
        setLoading(false);
        console.log("yupp" + blob);
      } catch (error) {
        console.error("Error loading file content:", error);
        setLoading(false);
      }
    };  

    loadFileContent();
  }, [file]);

  const base64ToArrayBuffer = (base64) => {
    try {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      return new Uint8Array(byteNumbers);
    } catch (error) {
      console.error("Error converting base64 to array buffer:", error);
      return null; // Return a fallback value or handle the error as needed
    }
  };

  // Memoize the data URLs for image and PDF files, solved the rendering issue using useEffect
  const dataURL = useMemo(() => content && URL.createObjectURL(content), [content]);
    
  if (loading) {
    return <Loader />;
  }

  if (content) {
    if (file.type === "application/pdf") {
      return (
        <embed
          src={dataURL}
          type={file.type}
          style={{ width:"100%", maxWidth: "100%", maxHeight: "100%" }}
          download={file.name}
        />
      );
    } else if (file.type.startsWith("image/")) {
      return (
        <img
          src={dataURL}
          alt={file.name}
          style={{ maxWidth: "100%", maxHeight: "100%" }}
          download={file.name}
        />
      );
    } else {
      return <span>Invalid File</span>;
    }
  } else {
    return <Loader />;
  }
}

export default React.memo(FilePreview);;