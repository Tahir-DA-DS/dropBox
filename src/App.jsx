import React, { useState } from "react";
import { Amplify } from "aws-amplify";
import { Storage } from "@aws-amplify/storage";
import awsExports from "./aws-exports";
import { withAuthenticator } from "@aws-amplify/ui-react";

Amplify.configure(awsExports);

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      await Storage.put(file.name, file, {
        contentType: file.type,  // Ensure correct file type
        level: "private",        // "public" for global access
      });

      setMessage("File uploaded successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Upload failed.");
    }
  };

  return (
    <div>
      <h1>My Serverless Dropbox</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <p>{message}</p>
    </div>
  );
}

export default withAuthenticator(App);