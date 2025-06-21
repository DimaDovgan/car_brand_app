import { render, screen, fireEvent } from "@testing-library/react";
import SpecificationsPage from "../../../app/ui/advancedSearchList";
// import { carModelsResponseMock } from "__mocks__/carModelsResponseMock";

import { CarModelsResponse } from "../../../app/lib/types";



const mockData: CarModelsResponse = {
  page: 1,
  pageSize: 1,
  total: 2,
  data: [
    {
      id: 1,
      name: "BMW X5",
      years: "2020 -",
      image: "/bmw.jpg",
      value:
        "Maximum speed: 250 km/h | 155.3 mph\n0-100 km/h: 5.3 sec, 0-60 mph: 5.0 sec\nFuel consumption: 8.5 L/100km",
    },
  ],
};

describe("SpecificationsPage", () => {
  it("renders car specifications correctly", () => {
    render(
      <SpecificationsPage
        carModelsResponse={mockData}
        onPageChange={jest.fn()}
      />
    );

    expect(screen.getByText("Specifications")).toBeInTheDocument();
    expect(screen.getByText("BMW X5")).toBeInTheDocument();
    expect(screen.getByText("2020 -")).toBeInTheDocument();
    expect(
      screen.getByText("Max speed: 250 km/h | 155.3 mph")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /0-100 km\/h — 5\.3 sec, 0-60 mph — 5\.0 sec/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("Fuel Cons.: 8.5 L/100km")
    ).toBeInTheDocument();

    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
    expect(screen.getByText("Previous")).toBeDisabled();
  });

  it("calls onPageChange when next button is clicked", () => {
    const onPageChangeMock = jest.fn();

    render(
      <SpecificationsPage
        carModelsResponse={mockData}
        onPageChange={onPageChangeMock}
      />
    );

    fireEvent.click(screen.getByText("Next"));
    expect(onPageChangeMock).toHaveBeenCalledWith(2);
  });
});






