import React from "react";
import About1 from "@/public/images/About1.jpg";
import about2 from "@/public/images/about2.jpg";
import Image from "next/image";

const About = () => {
  return (
    <section className="pt-[2px] pb-[2px] bg-[#f3f4fe] flex text-center justify-center rounded-[20px]">
      <div className="container">
        <div className="bg-white wow fadeInUp rounded-xl" data-wow-delay=".2s">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4">
              <div
                className="
                  lg:flex
                  items-center
                  justify-evenly
                  border
                  overflow-hidden
                "
              >
                <div
                  className="
                    lg:max-w-[565px]
                    xl:max-w-[640px]
                    w-full
                    py-12
                    px-7
                    sm:px-12
                    md:p-16
                    lg:py-9 lg:px-16
                  "
                >
                  <h1
                    className="
                    text-[1rem]
                      font-medium
                      py-2
                      px-5
                      bg-primary
                      inline-block
                      mb-5
                    "
                  >
                    About Us
                  </h1>
                  <p className="text-[1rem] text-left text-body-color mb-9 leading-relaxed">
                    Our project is based on the implementation of a crowdfunding
                    platform that addresses the main issues associated with
                    traditional crowdfunding.
                  </p>
                  <p className="text-[1rem] text-left text-body-color mb-9 leading-relaxed">
                    Our project is based on the implementation of a crowdfunding
                    platform that addresses the main issues associated with
                    traditional crowdfunding. We believe in the importance of
                    providing access to funding for social projects and
                    fostering community participation in decision-making.
                  </p>
                  <p className="text-[1rem] text-left text-body-color mb-9 leading-relaxed">
                    In our approach, we strive to overcome geographical barriers
                    that limit project reach by allowing initiatives to reach a
                    global audience. We want to provide social projects with the
                    opportunity to obtain funds internationally and maximize
                    their fundraising potential.
                  </p>
                  <p className="text-[1rem] text-left text-body-color mb-9 leading-relaxed">
                    Transparency is a fundamental value for us. Through the use
                    of smart contracts and integration with Chainlink
                    technology, we aim to provide a high level of transparency
                    and traceability in the fundraising process. We want donors
                    to easily verify how funds are being utilized and if
                    campaign objectives are being met.
                  </p>
                  <p className="text-[1rem] text-left text-body-color mb-9 leading-relaxed">
                    Furthermore, we believe in active community participation.
                    We want to give donors a voice and a vote in decisions
                    related to funded projects. We aim to foster community
                    connection and involvement to build a platform that reflects
                    the needs and desires of its users.
                  </p>
                  <p className="text-[1rem] text-left text-body-color mb-9 leading-relaxed">
                    Protection against scams and fraudulent projects is a
                    priority for us. We will implement robust security and
                    verification measures to ensure the authenticity of projects
                    presented on our platform. We want to give donors the
                    confidence that their contributions will be used
                    appropriately and for the intended purposes.
                  </p>
                  <p className="text-[1rem] text-left text-body-color mb-9 leading-relaxed">
                    In summary, as a team of this crowdfunding project, we are
                    committed to overcoming the challenges associated with
                    traditional crowdfunding and providing a more accessible,
                    transparent, and participatory platform. We are excited to
                    utilize smart contracts and innovative technologies to drive
                    efficient fundraising and support social projects that seek
                    to generate a positive impact on society.
                  </p>
                </div>
                <div className="text-center">
                  <div className="relative inline-block z-10 p-4">
                    <Image
                      src={About1}
                      alt="image"
                      className="mx-auto lg:ml-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full px-4">
              <div
                className="
                  lg:flex
                  items-center
                  justify-evenly
                  border
                  overflow-hidden
                "
              >
                <div
                  className="
                    lg:max-w-[565px]
                    xl:max-w-[640px]
                    w-full
                    py-12
                    px-7
                    sm:px-12
                    md:p-16
                    lg:py-9 lg:px-16
                    xl:p-[70px]
                  "
                >
                  <h2
                    className="
                    text-[1rem]
                      font-medium
                      py-2
                      px-5
                      bg-primary
                      inline-block
                      mb-5
                    "
                  >
                    Mission
                  </h2>
                  <p className="text-[1rem] text-left text-body-color mb-9 leading-relaxed">
                    Our mission is to provide a transparent, secure, and
                    efficient platform that connects social projects with
                    committed donors. We strive to overcome the geographical and
                    financial barriers that limit access to funding, allowing
                    projects to reach a global audience and obtain the necessary
                    resources for their success. We seek to promote
                    transparency, community participation, and accountability in
                    the use of raised funds, thereby contributing to the
                    development of innovative and sustainable solutions to
                    social challenges.
                  </p>
                  <h2
                    className="
                    text-[1rem]
                      font-medium
                      py-2
                      px-5
                      bg-primary
                      inline-block
                      mb-5
                    "
                  >
                    Vision
                  </h2>
                  <p className="text-[1rem] text-left text-body-color mb-9 leading-relaxed">
                    Our vision is to create a global crowdfunding ecosystem that
                    drives the realization of social projects and generates a
                    positive impact on society. We aim to be recognized as the
                    leading platform for fundraising for social projects,
                    providing equitable access to financing and promoting active
                    community participation.
                  </p>
                </div>
                <div className="text-center">
                  <div className="relative inline-block z-10 p-4">
                    <Image
                      src={about2}
                      alt="image"
                      className="mx-auto lg:ml-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
