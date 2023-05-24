import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const companyName = "Company Name";

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const companyType = req.body.companyType || '';
  if (companyType.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid companyType",
      }
    });
    return;
  }

  const jobTitle = req.body.jobName || '';
  if (jobTitle.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid Job Title",
      }
    });
    return;
  }

  const aboutCompany = req.body.aboutCompany || '';
  // if (aboutCompany.trim().length === 0) {
  //   res.status(400).json({
  //     error: {
  //       message: "Please enter a valid Job Title",
  //     }
  //   });
  //   return;
  // }

  try {
    // const completion = await openai.createCompletion({
    //   model: "text-davinci-003",
    //   prompt: generatePrompt(companyType, jobTitle),
    //   temperature: 0,
    //   max_tokens: 3800,
    //   temperature:0.9,
    //   top_p:1,
    //   frequency_penalty:0.0,
    //   presence_penalty:0.6
    // });
    const completion_00 = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt_00(companyType, jobTitle, aboutCompany),
      temperature: 0,
      max_tokens: 3800,
      temperature:0.0,
      top_p:1,
      frequency_penalty:0.0,
      presence_penalty:0.6
    });
    const completion_01 = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: completion_00.data.choices[0].text + generatePrompt_01(companyType, jobTitle, aboutCompany),
      temperature: 0,
      max_tokens: 3500,
      temperature:0.0,
      top_p:1,
      frequency_penalty:0.0,
      presence_penalty:0.6
    });
    const completion_02 = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: completion_00.data.choices[0].text + generatePrompt_02(companyType, jobTitle, aboutCompany),
      temperature: 0,
      max_tokens: 3500,
      temperature:0.0,
      top_p:1,
      frequency_penalty:0.0,
      presence_penalty:0.6
    });

    res.status(200).json({ result: [completion_00.data.choices[0].text, completion_01.data.choices[0].text, completion_02.data.choices[0].text] });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(companyType, jobTitle, aboutCompany) {
  const capitalizedcompanyType =
    companyType[0].toUpperCase() + companyType.slice(1).toLowerCase();
    const capitalizedJobTitle =
    jobTitle[0].toUpperCase() + jobTitle.slice(1).toLowerCase();
  return `Generate a job description for a ${capitalizedcompanyType} that is looking to hire for the role of ${capitalizedJobTitle}. 
  Personalise it based on following information: For companies looking to hire qualified and diverse early talent, 
  Skilbi connects companies to candidates based on previously hard to measure attributes like willigness to learn, interest in the role.`;
}

function generatePrompt_00(companyType, jobTitle, aboutCompany) {
  const capitalizedcompanyType =
    companyType[0].toUpperCase() + companyType.slice(1).toLowerCase();
    const capitalizedJobTitle =
    jobTitle[0].toUpperCase() + jobTitle.slice(1).toLowerCase();
  return `Generate a detailed overview when the company is called ${companyName} and the company is a ${capitalizedcompanyType} given that the company is looking for talent for the role of ${capitalizedJobTitle} and the details about the company is ${aboutCompany} without generating requirements, responsibilities and benefits.`;
}

function generatePrompt_01(companyType, jobTitle, aboutCompany) {
  const capitalizedcompanyType =
    companyType[0].toUpperCase() + companyType.slice(1).toLowerCase();
    const capitalizedJobTitle =
    jobTitle[0].toUpperCase() + jobTitle.slice(1).toLowerCase();
  return `Now generate responsibilities and candidate requirements specific to the company and job as bullet points.`;
}

function generatePrompt_02(companyType, jobTitle, aboutCompany) {
  const capitalizedcompanyType =
    companyType[0].toUpperCase() + companyType.slice(1).toLowerCase();
    const capitalizedJobTitle =
    jobTitle[0].toUpperCase() + jobTitle.slice(1).toLowerCase();
  return `Now provide a closing of this job and highlight the opportunity and impact candidates will have on this role.`;
}

// return `Suggest three names for an companyType that is a superhero.

// companyType: Cat
// Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
// companyType: Dog
// Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
// companyType: ${capitalizedcompanyType}
// Names:`;