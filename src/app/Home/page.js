import React from "react";
import FetchNews from "@/components/organisms/FetchNews";

function Home() {
  return (
    <div>
      <h1 className="home-title text-center text-4xl font-bold my-4">
        Top Anime Del Momento!
      </h1>
      <FetchNews />
    </div>
  );
}

export default Home;
