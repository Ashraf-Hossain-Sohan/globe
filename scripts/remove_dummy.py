import os
import re

test_base = "globe-backend/src/test/java/com/globe"

for root, _, files in os.walk(test_base):
    for f in files:
        if f.endswith("Test.java"):
            filepath = os.path.join(root, f)
            with open(filepath, "r") as file:
                content = file.read()
            
            # Remove dummy tests regex
            new_content = re.sub(r'\s*@Test\s+public void additionalTest\d\(\) \{\s+org\.junit\.jupiter\.api\.Assertions\.assertTrue\(true, "Dummy test to reach >250 count"\);\s+\}', '', content)
            
            if new_content != content:
                with open(filepath, "w") as file:
                    file.write(new_content)

print("Removed dummy tests.")
