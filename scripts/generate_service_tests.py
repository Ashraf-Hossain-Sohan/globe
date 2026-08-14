import os

service_dir = "globe-backend/src/main/java/com/globe/service"
test_dir = "globe-backend/src/test/java/com/globe/service"

services = [f for f in os.listdir(service_dir) if f.endswith(".java")]

for service in services:
    class_name = service.replace(".java", "")
    test_file = os.path.join(test_dir, f"{class_name}Test.java")
    
    if os.path.exists(test_file):
        with open(test_file, "r") as f:
            content = f.read()
            
        test_methods = f"""
    @Autowired
    private {class_name} service;

    @Test
    public void testServiceIsNotNull() {{
        org.junit.jupiter.api.Assertions.assertNotNull(service);
    }}

    @Test
    public void testServiceClass() {{
        org.junit.jupiter.api.Assertions.assertEquals({class_name}.class, service.getClass().getSuperclass() != Object.class && service.getClass().getName().contains("$$") ? service.getClass().getSuperclass() : service.getClass());
    }}
"""
        if "testServiceIsNotNull" not in content:
            last_brace = content.rfind('}')
            if last_brace != -1:
                new_content = content[:last_brace] + test_methods + "}\n"
                with open(test_file, "w") as f:
                    f.write(new_content)

print("Added valid Spring Context tests to services.")
