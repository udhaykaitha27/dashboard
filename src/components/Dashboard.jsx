

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get('https://staging.multipliersolutions.com/data_upload/api.php', {
          params: {
            action: 'get_files',
            user_id: 1
          }
        });

        if (response.data.files) {
          setFiles(response.data.files);
          localStorage.setItem('files', JSON.stringify(response.data.files));
        }
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    // Retrieve files from local storage if available
    const storedFiles = localStorage.getItem('files');
    if (storedFiles) {
      setFiles(JSON.parse(storedFiles));
    } else {
      fetchFiles();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', '1'); // Assuming a static user_id

    try {
      const response = await axios.post('https://staging.multipliersolutions.com/data_upload/api.php?action=upload', formData);
      
      if (response.data.status === 'success') {
        const newFile = {
          name: file.name,
          type: file.type,
          path: response.data.file_path
        };
        
        setFiles([...files, newFile]);
        localStorage.setItem('files', JSON.stringify([...files, newFile]));
        event.target.value = ''; // Clear the input after upload
      } else {
        alert('File upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

  const getFileNameFromPath = (filePath) => {
    return filePath.split('/').pop();
  };

  return (
    <div className="dashboard-container">
            <img height='100' src='https://pbs.twimg.com/profile_images/1675827151252373506/ifUZhYyy_400x400.jpg'/>
      <button onClick={handleLogout}>Logout</button>
      <input type="file" onChange={handleFileUpload} />
      <table>
        <thead>
          <tr>
            <th>File Name</th>
            <th>Type</th>
            <th>Download</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {files.length === 0 ? (
            <tr>
              <td colSpan="3">No files available</td>
            </tr>
          ) : (
            files.map((file, index) => (
              <tr key={index}>
                <td>{file.name}</td>
                <td>{file.type}</td>
                <td>
                  <a href={`https://staging.multipliersolutions.com/data_upload/${file.path}`} target="_blank" rel="noopener noreferrer">
                    Download
                  </a>
                </td>
                <td><button >Delete</button></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;

