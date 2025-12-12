import React from "react";

interface ContentSectionProps {
  title: string;
  content?: React.ReactNode;
}

export function ContentSection({ title, content }: ContentSectionProps) {
  const defaultContent = (
    <>
      <p>
        Morbi sed imperdiet in ipsum, adipiscing elit dui lectus. Tellus
        id scelerisque est ultricies ultricies. Duis est sit sed leo
        nisl, blandit elit sagittis. Quisque tristique consequat quam
        sed. Nisl at scelerisque amet nulla purus habitasse.
      </p>
      <p>
        Nunc sed faucibus bibendum feugiat sed interdum. Ipsum egestas
        condimentum mi massa. In tincidunt pharetra consectetur sed duis
        facilisis metus. Etiam egestas in nec sed et. Quis lobortis at
        sit dictum eget nibh tortor commodo cursus.
      </p>
      <p>
        Odio felis sagittis, morbi feugiat tortor vitae feugiat fusce
        aliquet. Nam elementum urna nisi aliquet erat dolor enim. Ornare
        id morbi eget ipsum. Aliquam senectus neque ut id eget
        consectetur dictum. Donec posuere pharetra odio consequat
        scelerisque et, nunc tortor. Nulla adipiscing erat a erat.
        Condimentum lorem posuere gravida enim posuere cursus diam.
      </p>
    </>
  );

  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <article className="mx-auto w-full max-w-lg">
          <h1 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            {title}
          </h1>
          <div className="prose md:prose-md lg:prose-lg">
            {content || defaultContent}
          </div>
        </article>
      </div>
    </section>
  );
}

