import os
import re

test_base = "globe-backend/src/test/java/com/globe"

for root, _, files in os.walk(test_base):
    for f in files:
        if f.endswith("Test.java"):
            filepath = os.path.join(root, f)
            with open(filepath, "r") as file:
                content = file.read()
            
            # Find duplicated @Autowired private XXX service; or repository;
            # We'll just remove the second occurrence or replace it.
            
            # Removing duplicate @Autowired private <Class> repository;
            class_name = f.replace("Test.java", "")
            
            # For repository
            repo_field = f"@Autowired\n    private {class_name} repository;"
            if content.count(repo_field) > 1:
                # Replace all but first
                parts = content.split(repo_field)
                new_content = parts[0] + repo_field + "".join(parts[1:])
                with open(filepath, "w") as file:
                    file.write(new_content)
                    
            # For service
            service_field = f"@Autowired\n    private {class_name} service;"
            if content.count(service_field) > 1:
                parts = content.split(service_field)
                new_content = parts[0] + service_field + "".join(parts[1:])
                with open(filepath, "w") as file:
                    file.write(new_content)

print("Fixed duplicates.")
