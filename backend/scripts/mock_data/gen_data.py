import os
import openai
import json
from .common import * 
from pathlib import Path
from dotenv import load_dotenv
from prompts import prompts
import time

load_dotenv(dotenv_path=ENV_PATH)

client = openai.OpenAI(api_key=os.environ['OPENAI_API_KEY'])

# Create outputs directory if it doesn't exist
OUTPUTS_DIR.mkdir(exist_ok=True)

def generate_and_save_data(iteration):
    prompt = prompts[iteration % len(prompts)]

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a creative data generator focused on producing varied, interesting content in valid JSON format."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )

        data = response.choices[0].message.content
        # Parse the JSON to verify it's valid
        structured = json.loads(data)

        output_file = OUTPUTS_DIR / f"output_{iteration}.json"
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(structured, f, ensure_ascii=False, indent=2)

        print(f"✅ Successfully generated and saved data to {output_file}")
        return True

    except Exception as e:
        print(f"❌ Error in iteration {iteration}: {str(e)}")
        return False


num_iterations = 90
start_offset = 10
start_time = time.time()

for i in range(start_offset, start_offset + num_iterations + 1):
    success = generate_and_save_data(i)
    if success and i < start_offset + num_iterations:
        time.sleep(1.5)

end_time = time.time()
total_time = end_time - start_time

print("\n" + "="*50)
print(f"✨ Generation Complete!")
print(f"⏱️ Total time for {num_iterations} iterations: {total_time:.2f} seconds")
print(f"⏱️ Average time per iteration: {total_time/num_iterations:.2f} seconds")
print("="*50)