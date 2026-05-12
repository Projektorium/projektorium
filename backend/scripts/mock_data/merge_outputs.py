import os
import json
import glob
from .common import *


def combine_json_files(output_dir, output_file):
    json_files = glob.glob(os.path.join(output_dir, "*.json"))

    combined_data = {
        "users": [],
        "projects": [],
        "user_project_links": []
    }

    max_user_id = 0
    max_project_id = 0

    used_emails = set()

    for file_path in json_files:
        user_ids_maps = {}
        project_ids_maps = {}

        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        user_id_offset = max_user_id
        for user in data.get("users", []):
            user_id, user_email = user["id"], user["email"]

            new_id = user_id_offset + user_id
            max_user_id = new_id

            user_ids_maps[user_id] = new_id

            email_offset = 0
            while user_email in used_emails:
                email_offset += 1
                parts = user_email.split("@")
                parts[0] += str(email_offset)
                user_email = "@".join(parts)
            
            user["id"] = new_id
            user["email"] = user_email
            combined_data["users"].append(user)

            used_emails.add(user_email)

        project_id_offset = max_project_id
        for project in data.get("projects", []):
            project_id = project["id"]

            new_id = project_id_offset + project_id
            max_project_id = new_id
            project_ids_maps[project_id] = new_id

            project["id"] = new_id
            combined_data["projects"].append(project)

        # Update link mappings with new IDs
        for link in data.get("user_project_links", []):
            # Find the new user ID and project ID that correspond to the old ones
            old_user_id = link["user_id"]

            if "project_id" not in link and "project_ids" not in link:
                raise RuntimeError(f"In {file_path} no `project_id` and `project_ids")

            # Sometimes it generates `project_ids`` and not `project_id`
            projects = [link["project_id"]] if "project_id" in link else link["project_ids"]

            for pr_id in projects:
                combined_data["user_project_links"].append({
                    "user_id": user_ids_maps[old_user_id],
                    "project_id": project_ids_maps[pr_id]
                })



    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(combined_data, f, ensure_ascii=False, indent=2)

    print(f"Combined {len(json_files)} JSON files into {output_file}")
    print(f"Total users: {len(combined_data['users'])}")
    print(f"Total projects: {len(combined_data['projects'])}")
    print(f"Total links: {len(combined_data['user_project_links'])}")


if __name__ == "__main__":
    combine_json_files(OUTPUTS_DIR, OUTPUT_FILE)