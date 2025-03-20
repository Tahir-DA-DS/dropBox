import React, { useState } from "react";
import { Amplify } from "aws-amplify";
import { Storage, Auth } from "aws-amplify";
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
        const response = await fetch(`https://YOUR_API_GATEWAY_URL?fileName=${file.name}`);
        const { uploadURL } = await response.json();

        await fetch(uploadURL, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type },
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
