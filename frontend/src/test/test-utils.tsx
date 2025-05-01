import { ReactElement, ReactNode } from "react";
import { render } from "@testing-library/react";
import { AuthProvider } from "../contexts/auth-context";
import { ThemeProvider } from "../contexts/theme-context";
import { MemoryRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

const AllTheProviders = ({
  children,
  route = "/",
}: {
  children: ReactNode;
  route?: string;
}) => {
  return (
    <MemoryRouter initialEntries={[route]}>
      <GoogleOAuthProvider clientId="mock-client-id">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </MemoryRouter>
  );
};

interface RenderOptions {
  route?: string;
}

const customRender = (ui: ReactElement, options: RenderOptions = {}) => {
  const { route = "/" } = options;

  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders route={route}>{children}</AllTheProviders>
    ),
  });
};

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
