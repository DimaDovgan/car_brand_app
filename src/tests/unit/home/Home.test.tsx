import { render, screen } from '@testing-library/react';
import Home from '../../../app/page';
import { useBrands } from '../../../app/customHooks/useBrands';
import { renderWithClient } from '../../utils/renderWithClient';

// Мокаємо хук useBrands
jest.mock('../../../app/customHooks/useBrands');

describe('Home Component', () => {
  it('should display loading skeleton when data is loading', () => {
   (useBrands as jest.Mock).mockReturnValue({
    data: null,
    isLoading: true,
    isError: false,
  });

  renderWithClient(<Home />);
  
  // Перевіряємо наявність елемента з класом skeletonGrid
expect(screen.getByTestId('skeleton-loader')).toHaveClass('skeletonGrid');
  // Або перевірити кількість скелетонів
  expect(screen.getAllByTestId('skeleton-item')).toHaveLength(30);
  });
});



// import { screen } from "@testing-library/react";
// import { renderWithClient } from "../../utils/renderWithClient"; // оновити шлях відповідно до твоєї структури
// import Home from "../../../app/page";
// // const queryClient = new QueryClient();
// queryClient.setQueryData(["searchQuery"], "");

// // МОКАЄМО useBrands
// jest.mock("../../../app/customHooks/useBrands.ts", () => ({
//   useBrands: () => ({
//     isLoading: false,
//     data: [
//       { id: 91, name: "Abarth", image: "https://www.auto-data.net/img/logos/Abarth.png" },
//       { id: 92, name: "AC", image: "https://www.auto-data.net/img/logos/AC.png" },
//       { id: 125, name: "BAW", image: "https://www.auto-data.net/img/logos/BAW.png" },
//       { id: 126, name: "Bee Bee", image: "https://www.auto-data.net/img/logos/Bee_Bee.png" },
//       { id: 146, name: "Cadillac", image: "https://www.auto-data.net/img/logos/Cadillac.png" },
//       { id: 147, name: "Callaway", image: "https://www.auto-data.net/img/logos/Callaway.png" },
//     ],
//     error: null,
//     isError: false,
//   }),
// }));

// describe("Home component", () => {
//   it("відображає кнопки літер після завантаження", async () => {
//     const view = renderWithClient(<Home />);
//     // renderWithClient(<Home />);
//     view.debug();
//     const abarth = await screen.findByText("Abarth");
// expect(abarth).toBeInTheDocument();

//     // кнопки мають відображати перші літери брендів
//     // expect(await screen.findByRole("button", { name: "A" })).toBeInTheDocument();
//     // expect(screen.getByRole("button", { name: "B" })).toBeInTheDocument();
//     // expect(screen.getByRole("button", { name: "C" })).toBeInTheDocument();
//   });
// });

// import React from "react";
// import { render, screen } from "@testing-library/react";

// function Dummy() {
//   return (
//     <div>
//       <button>A</button>
//       <button>B</button>
//       <button>C</button>
//     </div>
//   );
// }

// describe("Sanity test", () => {
//   it("має знайти кнопки A, B, C", () => {
//     render(<Dummy />);
//     expect(screen.getByText("A")).toBeInTheDocument();
//     expect(screen.getByText("B")).toBeInTheDocument();
//     expect(screen.getByText("C")).toBeInTheDocument();
//   });
// });

// "use client";
// import React from "react";
// import { useBrands } from "../../../app/customHooks/useBrands";
// import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";

// export function HomeSimple() {
//   const { data, isLoading, isError } = useBrands();
//   const queryClient = useQueryClient();

//   React.useEffect(() => {
//     queryClient.setQueryData(["searchQuery"], "");
//   }, [queryClient]);

//   if (isLoading) return <div>Loading...</div>;
//   if (isError) return <div>Error</div>;

//   const letters = Array.from(new Set(data?.map((b) => b.name[0].toUpperCase())));

//   return (
//     <div>
//       {letters.map((l) => (
//         <button key={l}>{l}</button>
//       ))}
//     </div>
//   );
// }






// import React from "react";
// import { render, screen } from "@testing-library/react";
// // import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// jest.mock("../../../app/customHooks/useBrands", () => ({
//   useBrands: () => ({
//     isLoading: false,
//     isError: false,
//     error: null,
//     data: [
//       { id: 1, name: "Audi", image: "audi.png" },
//       { id: 2, name: "BMW", image: "bmw.png" },
//       { id: 3, name: "Cadillac", image: "cadillac.png" },
//     ],
//   }),
// }));

// // import { HomeSimple } from "./HomeSimple";

// function renderWithQueryClient(ui: React.ReactElement) {
//   const queryClient = new QueryClient();
//   queryClient.setQueryData(["searchQuery"], "");
//   return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
// }

// describe("HomeSimple", () => {
//   it("має відобразити кнопки A, B, C", async () => {
//     renderWithQueryClient(<HomeSimple />);
//     expect(await screen.findByRole("button", { name: "A" })).toBeInTheDocument();
//     expect(await screen.findByRole("button", { name: "B" })).toBeInTheDocument();
//     expect(await screen.findByRole("button", { name: "C" })).toBeInTheDocument();
//   });
// });






// // import React from "react";
// // import { render, screen } from "@testing-library/react";
// // import Home from "../../../app/page";  // вказуй правильний шлях до твого компонента
// // jest.mock("../../../../__mocks__/next/image.tsx", () => (props) => {
// //   // Простий мок next/image, який просто рендерить звичайний <img>
// //   // важливо щоб тест не валився через next/image
// //   // eslint-disable-next-line jsx-a11y/alt-text
// //   return <img {...props} />;
// // });

// // // Мок хука useBrands (щоб не робити запити)
// // jest.mock("../../../app/customHooks/useBrands", () => ({
// //   useBrands: () => ({
// //     data: null,
// //     isLoading: false,
// //     isError: false,
// //   }),
// // }));

// // jest.mock("@tanstack/react-query", () => ({
// //   useQueryClient: () => ({
// //     getQueryData: () => "",
// //     getQueryCache: () => ({ subscribe: () => () => {} }),
// //   }),
// // }));

// // describe("Home component basic test", () => {
// //   it("renders without crashing", () => {
// //     render(<Home />);
// //     expect(screen.getByText("Brands")).toBeInTheDocument();
// //   });
// // });

// import { render, screen } from "@testing-library/react";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import Home from "../../../app/page";
// const queryClient = new QueryClient();

// test("відображає кнопки літер після завантаження", async () => {
//   renderWithClient(<Home />);

//   // очікуємо, поки зʼявиться кнопка "A"
//   const buttonA = await screen.findByRole("button", { name: "A" });
//   const buttonB = await screen.findByRole("button", { name: "B" });

//   expect(buttonA).toBeInTheDocument();
//   expect(buttonB).toBeInTheDocument();
// });


// // function renderWithClient(ui: React.ReactElement) {
// //   return render(
// //     <QueryClientProvider client={queryClient}>
// //       {ui}
// //     </QueryClientProvider>
// //   );
// // }

// // describe("Home component", () => {
// //   // it("показує скелетон під час завантаження", () => {
// //   //   renderWithClient(<Home />);
    
// //   //   // Припустимо, що є якийсь скелетон із текстом 'Loading...'
// //   //   // Підкоригуй селектор під свій код
// //   //   const skeleton = screen.getByText(/loading/i);
// //   //   expect(skeleton).toBeInTheDocument();
// //   // });

// //   it("відображає кнопки літер", () => {

    
// //     renderWithClient(<Home />);
    
// //     const buttonA = screen.getByRole("button", { name: "A" });
// //     const buttonB = screen.getByRole("button", { name: "B" });

// //     expect(buttonA).toBeInTheDocument();
// //     expect(buttonB).toBeInTheDocument();
// //   });
// // });