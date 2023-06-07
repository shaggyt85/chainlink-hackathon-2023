"use client";
import React, { useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { data } from "./dummy";

const Slider = () => {
  const [domLoaded, setDomLoaded] = React.useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);
  return (
    <>
      {domLoaded && (
        <Carousel
          showArrows={true}
          infiniteLoop={true}
          showStatus={false}
          showIndicators={false}
          showThumbs={false}
          autoPlay={true}
          interval={2500}
          transitionTime={500}
          className="w-full"
        >
          {data.map((item, index) => (
            <div key={index} className="w-full">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full h-[500px] "></div>
              <div className="absolute bottom-0 left-0 w-full h-[500px] flex flex-col justify-center items-center">
                <h1 className="text-white text-4xl font-bold mb-4">
                  {item.title}
                </h1>
                <p className="text-white text-2xl font-bold mb-4">
                  Esto es una Prueba
                </p>
              </div>
            </div>
          ))}
        </Carousel>
      )}
    </>
  );
};
export default Slider;
