import React from 'react';

function DownloadButton(props) {
  const handleDownload = () => {
    // Use require to dynamically load the file path
    const fileUrl = require(`../../pdfs/${props.file_name}`);

    // Create an anchor element to trigger the download
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', props.file_name);
    document.body.appendChild(link);
    link.click();

    // Clean up the DOM by removing the anchor element
    document.body.removeChild(link);
  };

  return (
    <>
      <button onClick={handleDownload} className='text-red-600 font-semibold text-xl mt-2 underline'>
        {props.content}
      </button>
    </>
  );
}

export default DownloadButton;
