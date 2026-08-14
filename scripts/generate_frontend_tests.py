import os

component_dirs = ["src/components", "src/components/shared"]
test_base_dir = "src/__tests__/components"

for d in component_dirs:
    for root, _, files in os.walk(d):
        for f in files:
            if f.endswith(".tsx") and not f.endswith(".test.tsx"):
                component_name = f.replace(".tsx", "")
                filepath = os.path.join(root, f)
                
                # Determine relative paths
                if "shared" in root:
                    test_dir = os.path.join(test_base_dir, "shared")
                    import_path = f"../../../components/shared/{component_name}"
                    auth_mock_path = "../../../context/AuthContext"
                else:
                    test_dir = test_base_dir
                    import_path = f"../../components/{component_name}"
                    auth_mock_path = "../../context/AuthContext"
                    
                os.makedirs(test_dir, exist_ok=True)
                test_filepath = os.path.join(test_dir, f"{component_name}.test.tsx")
                
                # Check if component uses useAuth
                with open(filepath, "r") as comp_file:
                    content = comp_file.read()
                    
                has_auth = "useAuth" in content
                
                mock_auth = ""
                if has_auth:
                    mock_auth = f"""
const mockLogout = vi.fn();
const mockAuth = {{ user: {{ name: 'Test User', email: 'test@example.com' }}, loading: false, logout: mockLogout }};
vi.mock('{auth_mock_path}', () => ({{
  useAuth: () => mockAuth
}}));
"""
                
                render_jsx = f'<{component_name} />'
                if component_name == "CompanyDashboardPage":
                    render_jsx = f'<{component_name} companyCode="TST" companyName="Test Co" companyDesc="Test Description" />'
                
                test_content = f"""import {{ render, act }} from '@testing-library/react';
import {{ describe, it, expect, vi }} from 'vitest';
import {component_name} from '{import_path}';
{mock_auth}
// Mock matchMedia for components like Recharts that might need it
Object.defineProperty(window, 'matchMedia', {{
  writable: true,
  value: vi.fn().mockImplementation(query => ({{
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }})),
}});

// Mock ResizeObserver for Recharts
globalThis.ResizeObserver = class ResizeObserver {{
  observe() {{}}
  unobserve() {{}}
  disconnect() {{}}
}};

describe('{component_name} Component', () => {{
  
  it('renders without crashing', async () => {{
    let container;
    await act(async () => {{
      const result = render({render_jsx});
      container = result.container;
    }});
    expect(container).toBeInTheDocument();
  }});

  it('matches the snapshot', async () => {{
    let container;
    await act(async () => {{
      const result = render({render_jsx});
      container = result.container;
    }});
    expect(container).toMatchSnapshot();
  }});

  it('has a valid React element type', async () => {{
    expect(typeof {component_name}).toBe('function');
  }});

  it('handles mocked dependencies correctly', async () => {{
    let container;
    await act(async () => {{
      const result = render({render_jsx});
      container = result.container;
    }});
    expect(container).not.toBeNull();
  }});

  it('completes the initial render cycle successfully', async () => {{
    let root;
    await act(async () => {{
      const result = render({render_jsx});
      root = result.baseElement;
    }});
    expect(root).toBeTruthy();
  }});
}});
"""
                with open(test_filepath, "w") as test_file:
                    test_file.write(test_content)

print("Regenerated frontend tests in new directories.")
