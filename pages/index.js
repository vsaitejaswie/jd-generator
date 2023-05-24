import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [companyTypeInput, setcompanyTypeInput] = useState("");
  const [jobTitleInput, setJobTitle] = useState("");
  const [aboutInput, setAboutInput] = useState("");
  const [result, setResult] = useState(['','','']);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ companyType: companyTypeInput, jobName: jobTitleInput, aboutCompany: aboutInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setcompanyTypeInput("");
      setJobTitle("");
      setAboutInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Fill the form to generate Job Description</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="companyType"
            placeholder="Enter the company type"  //(Ex: Startup, MNC, Not-for-profit, etc.)
            value={companyTypeInput}
            onChange={(e) => setcompanyTypeInput(e.target.value)}
          />
          <input
            type="text"
            name="jobName"
            placeholder="Enter the Job Title"
            value={jobTitleInput}
            onChange={(e) => setJobTitle(e.target.value)}
          />
          <input
            type="text"
            name="aboutCompany"
            placeholder="Enter info about your company"
            value={aboutInput}
            onChange={(e) => setAboutInput(e.target.value)}
          />
          <input type="submit" value="Generate Job Description" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
