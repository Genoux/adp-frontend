import ExtendedImage from '@/app/components/common/ExtendedImage';

const HeroImage = ({ type, heroId, altText }: { type: string; heroId: string; altText: string }) => {

  return (
    <ExtendedImage
      alt={altText}
      variant={type}
      type={type}
      src={heroId}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      style={{ objectPosition: 'center', objectFit: 'cover' }}
      fill
    />
  );
};

export default HeroImage;
