import { createClient } from "redis";
import fs from "fs/promises"
const subscriber = createClient();
subscriber.connect();
import path from "path";
const publisher = createClient();
import { fileURLToPath } from "url";
publisher.connect();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUBMISSION_DIR = path.join(__dirname, "submissions");
const OUTPUT_DIR = path.join(__dirname, "outputs");
const sleep=async(time=50000)=>{
   return new Promise(resolve => setTimeout(resolve, time));
}
async function main() {
  try {
    while (true) {
      const res = await subscriber.brPop("submit-queue", 0);
      const job = JSON.parse(res.element);
      console.log(job);
      const id = job.id
      const containerName = "judge-python";
    
      const submitPath = `${SUBMISSION_DIR}/submit-${id}.json`;
      const outputPath = `${OUTPUT_DIR}/output-${id}.json`;

      
      // Write submit.json to disk
      await fs.writeFile(submitPath, JSON.stringify(job, null, 2));
      console.log(`📦 Wrote ${submitPath}`);
      await sleep()
   
      try {
        const result = await fs.readFile(outputPath, "utf8");
        await publisher.sendCommand(["RPUSH", "result_queue", JSON.stringify({ id, result })]);
        console.log(`✅ Result pushed for ${id}`);
      } catch (e) {
        console.error(`❌ Failed to read result for ${id}:`, e.message);
      }

    }
  } catch (e) {
    console.error(e);
  }
}
main();





/*
     docker run -d --name judge-python `
   -v ${PWD}/submissions:/app/submissions `
   -v ${PWD}/outputs:/app/outputs `
   judge-runner   
        
*/