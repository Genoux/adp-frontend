import Image from 'next/image';

const HeroImage = ({ type, heroId, altText }: { type: string; heroId: string; altText: string }) => {
  const imageSrc = `/images/champions/${type}/${heroId.toLowerCase().replace(/\s+/g, '').replace(/[\W_]+/g, '')}.webp`;

  return (
    <Image
      alt={altText}
      src={imageSrc}
      layout="fill"
      objectFit="cover"
      priority
      quality={100}
    />
  );
};

export default HeroImage;
