/* eslint-disable no-undef */
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ClothingCard from "../components/clothingCard";


describe("ClothingCard", () => {
  it("renders a ClothingCard", () => {
    render(
      <ClothingCard 
        item={{ 
          id: 1, 
          name: "hola", 
          price: { currency: "USD", value: { current: 1, original: 1 } }, 
          link: "http://google.com", 
          brand: "nike", 
          image: "https://static.zara.net/assets/public/bc92/27fe/4306496ebf80/ccae433fc050/00706648724-p/00706648724-p.jpg?ts=1730278782370&w=1334" 
        }} 
      />
    );

    const clothingCard = screen.getByText('hola');

    expect(clothingCard).toBeInTheDocument();

  });
});