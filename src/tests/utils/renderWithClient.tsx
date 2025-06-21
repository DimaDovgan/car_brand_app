import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import React from "react";



export function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient();
  queryClient.setQueryData(["searchQuery"], ""); // << додай це

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}