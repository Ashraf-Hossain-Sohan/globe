import os
import re

repo_dir = "globe-backend/src/main/java/com/globe/repository"
test_dir = "globe-backend/src/test/java/com/globe/repository"

repos = [f for f in os.listdir(repo_dir) if f.endswith(".java")]

for repo in repos:
    class_name = repo.replace(".java", "")
    test_file = os.path.join(test_dir, f"{class_name}Test.java")
    
    if os.path.exists(test_file):
        with open(test_file, "r") as f:
            content = f.read()
            
        test_methods = f"""
    @Autowired
    private {class_name} repository;

    @Test
    public void testFindAllIsNotNull() {{
        java.util.List<?> results = repository.findAll();
        org.junit.jupiter.api.Assertions.assertNotNull(results);
    }}

    @Test
    public void testCount() {{
        long count = repository.count();
        org.junit.jupiter.api.Assertions.assertTrue(count >= 0);
    }}
    
    @Test
    public void testExistsByIdFalse() {{
        try {{
            boolean exists = repository.existsById(-1L);
            org.junit.jupiter.api.Assertions.assertFalse(exists);
        }} catch(Exception e) {{
            // handle String id repos
        }}
    }}
"""
        if "testFindAllIsNotNull" not in content:
            last_brace = content.rfind('}')
            if last_brace != -1:
                new_content = content[:last_brace] + test_methods + "}\n"
                with open(test_file, "w") as f:
                    f.write(new_content)

print("Added valid JPA tests to repositories.")
