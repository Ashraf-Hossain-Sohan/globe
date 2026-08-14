import os
import re

controller_dir = "globe-backend/src/main/java/com/globe/controller"
test_dir = "globe-backend/src/test/java/com/globe/controller"

controllers = [f for f in os.listdir(controller_dir) if f.endswith(".java")]

for controller in controllers:
    class_name = controller.replace(".java", "")
    with open(os.path.join(controller_dir, controller), "r") as f:
        content = f.read()
    
    # Extract class RequestMapping
    base_path_match = re.search(r'@RequestMapping\("([^"]+)"\)', content)
    base_path = base_path_match.group(1) if base_path_match else ""
    
    # Extract method mappings
    mappings = re.findall(r'@(Get|Post|Put|Delete)Mapping\((?:value\s*=\s*)?((?:\{)?"[^"]+"(?:,.*)?(?:})?)?\)', content)
    
    test_methods = ""
    for idx, (method, path_raw) in enumerate(mappings):
        if not path_raw:
            path = ""
        else:
            path = re.search(r'"([^"]+)"', path_raw).group(1) if '"' in path_raw else ""
            
        full_path = base_path + path
        # Replace path variables with dummy values
        full_path = re.sub(r'\{[^}]+\}', '1', full_path)
        
        http_method = method.lower()
        test_methods += f"""
    @Test
    public void test{method}Mapping{idx}() throws Exception {{
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.{http_method}("{full_path}"))
               .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().is(401));
    }}
"""
    
    test_file = os.path.join(test_dir, f"{class_name}Test.java")
    if os.path.exists(test_file):
        with open(test_file, "r") as f:
            test_content = f.read()
            
        # Replace if we generated tests
        if test_methods:
            # Check if tests already exist to avoid duplicates
            if "testGetMapping" not in test_content:
                last_brace_index = test_content.rfind('}')
                if last_brace_index != -1:
                    new_test_content = test_content[:last_brace_index] + test_methods + "}\n"
                    with open(test_file, "w") as f:
                        f.write(new_test_content)

print(f"Added valid MockMvc tests to controllers.")
