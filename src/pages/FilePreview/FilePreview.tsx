import React, { useState, useEffect, useMemo } from "react";
import Loader from "../../common/Loader";

function FilePreview({ file }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFileContent = async () => {
      try {
        setLoading(true);
        // Convert the base64 data directly to a Blob and memoize it
        const blob = new Blob([base64ToArrayBuffer(file.base64data)], { type: file.type });
        setContent(blob);
        setLoading(false);
      } catch (error) {
        console.error("Error loading file content:", error);
        setLoading(false);
      }
    };

    loadFileContent();
  }, [file]);

  const base64ToArrayBuffer = (base64) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    return new Uint8Array(byteNumbers);
  };

  // Memoize the data URLs for image and PDF files, solved the rendering issue using useEffect
  const dataURL = useMemo(() => content && URL.createObjectURL(content), [content]);
  
  if (loading) {
    return <Loader />;
  }

  if (content && file.type === "application/pdf") {
    return (
      <>
        <embed
          src={dataURL}
          type={file.type}
          style={{ width: "100%", height: "500px" }}
          download={file.name}
        />
      </>
    );
  } else if (content && file.type.startsWith("image/")) {
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
}

export default FilePreview;