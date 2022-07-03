import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import axios, { AxiosResponse } from 'axios';

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(3, 0, 3),
  },
}));

type CSVFileImportProps = {
  url: string,
  title: string
};

export default function CSVFileImport({url, title}: CSVFileImportProps) {
  const classes = useStyles();
  const [file, setFile] = useState<any>();

  useEffect(() => {
    console.log(process.env.REACT_APP_USERNAME)
    console.log(process.env.REACT_APP_PASSWORD)
    localStorage.setItem('authorization_token', Buffer.from(`${process.env.REACT_APP_USERNAME}:${process.env.REACT_APP_PASSWORD}`).toString('base64'));
  }, []);

  const onFileChange = (e: any) => {
    console.log(e);
    let files = e.target.files || e.dataTransfer.files
    if (!files.length) return
    setFile(files.item(0));
  };

  const removeFile = () => {
    setFile('');
  };

  const uploadFile = async (e: any) => {
      // Get the presigned URL
      try {
        const response = await axios({
          method: 'GET',
          url,
          headers: {
            Authorization: `Basic ${localStorage.getItem('authorization_token')}`,
          },
          params: {
            name: encodeURIComponent(file.name)
          }
        })
        console.log('File to upload: ', file.name)
        console.log('Uploading to: ', response.data.signedUrl)
        const result = await fetch(response.data.signedUrl, {
          method: 'PUT',
          body: file
        })
        console.log('Result: ', result)
        setFile('');
      } catch (err) {
        console.log(`Error code: ${(err as AxiosResponse).status}`);
        console.log((err as AxiosResponse).data.message);
      }
    }
  ;

  return (
    <div className={classes.content}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
          <input type="file" onChange={onFileChange}/>
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </div>
  );
}
