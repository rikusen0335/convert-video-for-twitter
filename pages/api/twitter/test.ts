import formidable from 'formidable';
import fs from "fs/promises"

export const config = {
  api: {
    bodyParser: false,
  },
};

const test = async (req, res) => {
  const fields = {}

  const form = formidable({ filename: _ => 'video.mp4', uploadDir: "./" });
  form
    .on('field', (field, value) => {
      console.log(field, value);
      fields[field] = value;
    })
    .on('file', async function (_name, oldFile) {
      console.log('Uploaded ' + oldFile.newFilename);

      const buffer = await fs.readFile(oldFile.filepath)
      // console.log(buffer)
      console.log(fields)

      return res.status(200).json({
        status: 'Ok',
      })
    })
  form.parse(req)
};


export default test;
