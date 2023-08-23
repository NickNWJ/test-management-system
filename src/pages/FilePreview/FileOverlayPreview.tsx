import React, { useState, useEffect, useRef, useMemo } from "react";
import Loader from "../../common/Loader";
import PropTypes from "prop-types";

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(3, 3, 3, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 99999,
};

const overlayContentStyle = {
  width: "60%",
  height: "90%",
  position: "relative",
  backgroundColor: "#fff",
  borderRadius: "8px",
};

const pdfEmbedStyle = {
  width: "100%",
  height: "100%",
  border: "none",
};

const imagePreviewStyle = {
  maxWidth: "100%",
  maxHeight: "100%",
};

const closeButtonStyle = {
  position: "fixed",
  top: "10px",
  right: "10px",
  padding: "8px 12px",
  backgroundColor: "red",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const overlayHeaderStyle = {
  position: "fixed",
  top: "10px",
  paddingTop: "4px",
  paddingBottom: "4px",
  color: "#fff",
  fontSize: "16px",
  width: "100%",
}

function FileOverlayPreview({ file, onClose }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  const modalRef = useRef();

  useEffect(() => {
    const loadFileContent = async () => {
      try {
        setLoading(true);
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

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (file) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [onClose]);

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
      return null;
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div style={{ ...overlayStyle, display: content ? "flex" : "none" }}>
      
      <div style={overlayContentStyle}>
        {content && (
          <span ref={modalRef}>
            {file.type === "application/pdf" ? (
              <embed
                src={URL.createObjectURL(content)}
                type={file.type}
                style={pdfEmbedStyle}
                download={file.name}
              />
            ) : file.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(content)}
                alt={file.name}
                style={imagePreviewStyle}
                download={file.name}
              />
            ) : (
              <span>Invalid File</span>
            )}
            <span style={overlayHeaderStyle}>{file.name}</span>
            <button style={closeButtonStyle} onClick={onClose}>
              Close
            </button>
          </span>
        )}
      </div>
    </div>
  );
}

FileOverlayPreview.propTypes = {
  file: PropTypes.shape({
    url: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default React.memo(FileOverlayPreview);